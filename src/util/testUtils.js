import { data } from './tests/testData'

// This is used to deep clone the mock response objects
// because in the mock environment the object properties
// are reassigned and this affects future tests.
const deepClone = obj => {
  const newObj = JSON.stringify(obj)
  return JSON.parse(newObj)
}

export const sdk = {
  window: {
    startAutoResizer: () => {},
  },
  parameters: {
    invocation: {
      ids: {},
    },
  },
  space: {
    getEntry: jest.fn(entryId => {
      switch (entryId) {
        case '59MGATlEsP7tYFWokybSMY':
          return deepClone(data['59MGATlEsP7tYFWokybSMY'])
        case '5uW2L7MAIpudEi89kZkqk7':
          return deepClone(data['5uW2L7MAIpudEi89kZkqk7'])
        case 'AsY1gXJc8HMCz0eXdZLyO':
          return deepClone(data['AsY1gXJc8HMCz0eXdZLyO'])
        case '7yq0BLJBKVHH6dxaHOCHcD':
          return deepClone(data['7yq0BLJBKVHH6dxaHOCHcD'])
        case '621POT7HKjI7FErkbGMXYN':
          return deepClone(data['621POT7HKjI7FErkbGMXYN'])
        case 'Ar1wmSxNn56966Kgt4JAm':
          return deepClone(data['Ar1wmSxNn56966Kgt4JAm'])
        case '11111':
          return deepClone(data['11111'])
        default:
          return null
      }
    }),
    createEntry: jest.fn((modelId, data) => {
      // API docs for response: https://contentful.github.io/contentful-management.js/contentful-management/5.11.3/ContentfulSpaceAPI.html#.createEntry
      return new Promise((resolve, reject) => {
        if (!modelId || !data) reject({ error: 'modelId and data required.' })
        resolve({
          sys: {
            id: `new-entry-${modelId}`,
          },
          fields: data.fields,
        })
      })
    }),
  },
}
