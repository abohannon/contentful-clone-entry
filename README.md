# Contentful Clone Entry Extension

An extension that allows you to selectively clone entries and their children.

## Setup

Install the Contentful CLI

`https://github.com/contentful/contentful-cli`

Run `npm run login && npm run configure`

Enter your personal Contentful Management API (CMA) token. You can create personal access tokens using the Contentful web app ([https://app.contentful.com]). Open the space that you want to access (the top left corner lists all spaces), and navigate to the APIs area. Open the Content management tokens section and create a token.

## Development

Create a new branch `git checkout -b my-unique-branch-name`

Run `contentful space environment use` and select `development`

Then run `npm run start` to start the dev server at `localhost:1234`. Navigating to this page will show a blank page - this is intentional.

To see the extension and start developing:

1. Login to Contentful and open the 'Housecall Growth Site' space
2. Click the menu in the upper-left corner, select 'Housecall Growth Site' and then 'development'
3. Click on the 'Content' in the top nav and select an entry with Content Type of P0001 - Page
4. In the address bar, click the icon in the far right and click 'Load unsafe scripts' (or the equivalent)
5. Now the extension should be visible in the sidebar of the page editor

Your local changes will show immediately in Contentful. If they aren't, run `npm run clean` to clear the `.cache` folder and restart the dev server with `npm run start`.

When you're finished with your new feature or making changes, push your branch and submit a PR.

## Deploying

If you have the permissions, merge `master` into `production` and run the following:

`contentful space environment use` and select `master`

`npm run deploy`

This will build the extension and deploys it to Contentful.

### Resources

Documentation for Contentful Management API: https://contentful.github.io/contentful-management.js/contentful-management/5.11.3/index.html
