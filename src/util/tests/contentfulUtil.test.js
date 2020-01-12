import { sdk } from '../testUtils'
import { UIState } from '../tests/testData'
import contentful from '../contentfulUtil'

describe('Contentful Utilities', () => {
  describe('Clone', () => {
    it('should only return valid entries when no entriesToClone is passed', async () => {
      const result = await contentful.cloneEntry(
        '59MGATlEsP7tYFWokybSMY',
        sdk.space,
      )

      expect(result.fields.url).not.toBe(undefined)
      expect(result.fields.isALandingPage).not.toBe(undefined)
      expect(result.fields.invalidEntry).toBe(undefined)
      expect(
        result.fields.sections['en-US'].some(
          entry => entry.sys.id === '0000000',
        ),
      ).toBe(false)

      expect(result.fields.sections['en-US'][0].sys.id).toBe('new-entry-hero')
      expect(result.fields.sections['en-US'][1].sys.id).toBe(
        'new-entry-c0002IntroductionWithMedia',
      )
      expect(result.fields.sections['en-US'][2].sys.id).toBe(
        'new-entry-c00212ColumnRichTextContentAndMedia',
      )
      expect(result.fields.sections['en-US'][3].sys.id).toBe(
        'new-entry-c0016FrequentlyAskedQuestions',
      )
    })

    it('should only return valid entries when entriesToClone is passed', async () => {
      const result = await contentful.cloneEntry(
        '59MGATlEsP7tYFWokybSMY',
        sdk.space,
        {
          entriesToClone: UIState,
        },
      )

      expect(result.fields.url).not.toBe(undefined)
      expect(result.fields.isALandingPage).not.toBe(undefined)
      expect(result.fields.invalidEntry).toBe(undefined)
      expect(
        result.fields.sections['en-US'].some(
          entry => entry.sys.id === '0000000',
        ),
      ).toBe(false)
      expect(result.fields.firstLevelEntry['en-US'].sys.id).toBe(
        'new-entry-c0027Card',
      )
      expect(result.fields.sections['en-US'][0].sys.id).toBe(
        '5uW2L7MAIpudEi89kZkqk7',
      )
      expect(result.fields.sections['en-US'][1].sys.id).toBe(
        'new-entry-c0002IntroductionWithMedia',
      )
      expect(result.fields.sections['en-US'][2].sys.id).toBe(
        '7yq0BLJBKVHH6dxaHOCHcD',
      )
      expect(result.fields.sections['en-US'][3].sys.id).toBe(
        'new-entry-c0016FrequentlyAskedQuestions',
      )
      expect(result.fields.sections['en-US'][4].sys.id).toBe('nestedAsset')
    })
  })

  describe('Build entry tree', () => {
    it('should be an array with a single object', async () => {
      const result = await contentful.buildEntryTree(
        '59MGATlEsP7tYFWokybSMY',
        sdk.space,
      )
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(1)
    })

    it('should return an empty array if a bad entryId is passed', async () => {
      const result = await contentful.buildEntryTree('badEntryId', sdk.space)

      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(0)
    })

    it('should return an empty array if a string is not passed as the entryId', async () => {
      const result = await contentful.buildEntryTree({}, sdk.space)
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(0)
    })
  })
})
