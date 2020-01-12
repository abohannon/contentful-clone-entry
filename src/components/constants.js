export const PENDING = 'pending'
export const RESOLVED = 'resolved'
export const REJECTED = 'rejected'

const CONTENTFUL_ENTRY_URL_DEV = '' // add your dev space's api url for entries here
const CONTENTFUL_ENTRY_URL_PROD = '' // add your prod space's api url for entries here

export const CONTENTFUL_ENTRY_URL =
  process.env.NODE_ENV === 'production'
    ? CONTENTFUL_ENTRY_URL_PROD
    : CONTENTFUL_ENTRY_URL_DEV
