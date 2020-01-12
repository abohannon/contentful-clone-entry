class Contentful {
  constructor() {
    this.clonedEntries = []
  }

  getClonedEntries = () => this.clonedEntries

  setClonedEntries = entry => {
    const { sys, fields } = entry
    let name

    for (const field in fields) {
      if (name) break

      const value = fields[field]['en-US']

      if (typeof value === 'string') {
        if (value.length) {
          name = value
        } else {
          name = 'New Entry'
        }
      }
    }

    this.clonedEntries.push({
      id: sys.id,
      name,
      data: entry,
    })
  }

  cloneEntry = async (entryId, space, options = {}) => {
    try {
      const parentEntry = await space.getEntry(entryId)

      if (!parentEntry) {
        console.log(`No entry found for id ${entryId}. Skipping...`)
        return null
      }

      if (this.isLink(parentEntry.sys, options.entriesToClone)) {
        return parentEntry
      }

      const { fields } = parentEntry
      const newFields = { ...fields }

      for (const field in fields) {
        let fieldValue = fields[field]['en-US']

        if (typeof fieldValue === 'object') {
          if (Array.isArray(fieldValue)) {
            newFields[field]['en-US'] = await processArrayOfEntries.call(
              this,
              fieldValue,
              space,
              options,
            )
          }

          if (!this.isEntry(fieldValue)) continue

          const newEntry = { ...fieldValue }
          const validClonedEntry = await this.cloneEntry(
            newEntry.sys.id,
            space,
            options,
          )

          if (validClonedEntry) {
            newEntry.sys.id = validClonedEntry.sys.id
            newFields[field]['en-US'] = newEntry
          } else {
            delete newFields[field]
          }
        }
      }

      const clonedEntry = await space.createEntry(
        parentEntry.sys.contentType.sys.id,
        {
          fields: newFields,
        },
      )

      this.setClonedEntries(clonedEntry)

      return clonedEntry
    } catch (err) {
      console.log(`ERROR in cloneEntry: ${err.message}`)
      return {
        error: err,
      }
    }

    async function processArrayOfEntries(entries, space, options) {
      const validEntries = []

      for (const entry of entries) {
        if (!this.isEntry(entry)) {
          validEntries.push(entry)
          continue
        }

        const validClonedEntry = await this.cloneEntry(
          entry.sys.id,
          space,
          options,
        )

        if (!validClonedEntry) continue

        const newEntry = { ...entry }

        newEntry.sys.id = validClonedEntry.sys.id
        validEntries.push(newEntry)
      }

      return validEntries
    }
  }

  buildEntryTree = async (parentEntryId, space) => {
    if (!parentEntryId || typeof parentEntryId !== 'string') return []

    try {
      const tree = await fetchEntry.call(this, parentEntryId)
      return tree ? [tree] : []
    } catch (err) {
      console.log(`ERROR in buildEntryTree: ${err.message}`)
      return {
        error: err,
        data: [],
      }
    }

    async function fetchEntry(entryId, parentIds = []) {
      const entry = await space.getEntry(entryId)

      if (!entry) return

      const {
        sys: { id, contentType },
        fields,
      } = entry

      return {
        id,
        type: contentType.sys.id,
        name: setName(fields),
        parentIds,
        children: await createChildren.call(this, fields, [id, ...parentIds]),
      }
    }

    async function createChildren(fields, parentIds) {
      let childEntries = []

      for (const field in fields) {
        const fieldValue = fields[field]['en-US']

        if (typeof fieldValue === 'object') {
          if (this.isEntry(fieldValue)) {
            const entry = await fetchEntry.call(
              this,
              fieldValue.sys.id,
              parentIds,
            )
            if (!entry) continue
            childEntries.push(entry)
          }

          if (Array.isArray(fieldValue)) {
            for (const value of fieldValue) {
              if (this.isEntry(value)) {
                const entry = await fetchEntry.call(
                  this,
                  value.sys.id,
                  parentIds,
                )
                if (!entry) continue
                childEntries.push(entry)
              }
            }
          }
        }
      }

      return childEntries
    }

    function setName(fields) {
      let name = fields.name || fields.title

      if (!name) {
        const firstProperty = Object.keys(fields)[0]
        const value = fields[firstProperty]
        name = typeof value['en-US'] === 'string' ? value : 'Entry'
      }

      return name['en-US']
    }
  }

  deleteEntry = async (entry, space) => {
    try {
      await space.deleteEntry(entry)
      return {
        succes: true,
      }
    } catch (err) {
      return {
        error: err,
      }
    }
  }

  isLink = (entry, entriesToClone = {}) => {
    if (!Object.keys(entriesToClone).length) return false
    return !entriesToClone[entry.id]
  }

  isEntry = entry => {
    if (!entry || !entry.sys) return false
    return entry.sys.linkType !== 'Asset' ? true : false
  }
}

export default new Contentful()
