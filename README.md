# Contentful Clone Entry Extension

An extension that allows you to selectively clone entries and their children.

Feel free to fork and customize to your needs or submit a PR if you see something that needs to be fixed or could be improved. =)

## Setup

Install the Contentful CLI

`https://github.com/contentful/contentful-cli`

Run `npm run login && npm run configure`

Enter your personal Contentful Management API (CMA) token. You can create personal access tokens using the Contentful web app ([https://app.contentful.com]). Open the space that you want to access (the top left corner lists all spaces), and navigate to the APIs area. Open the Content management tokens section and create a token.

## Installation

Directions on how to install extensions from github can be found here([https://www.contentful.com/developers/docs/extensibility/ui-extensions/examples/]).

## Local Development

Run `contentful space environment use` and select `development`

Then run `npm run start` to start the dev server at `localhost:1234`. Navigating to this page will show a blank page - this is intentional.

To see the extension and start developing:

1. Login to Contentful and open the space
2. Click the menu in the upper-left corner, select the correct environment
3. Goto 'Content Model' and select the model you'd like the extension to be available one
4. Click 'Sidebar' -> 'Use custom sidebar' -> select the UI extension
5. If you don't see the extension here, goto 'Settings' -> 'Extensions' and make sure the extensions is shown (starting the dev server should install a dev extension)
6. Click on the 'Content' in the top nav and select an entry of the model you added the sidebar extension to
4. In the address bar, click the icon in the far right and click 'Load unsafe scripts' (or the equivalent)
5. Now the extension should be visible in the sidebar of the entry

Your local changes will show immediately in Contentful. If they aren't, run `npm run clean` to clear the `.cache` folder and restart the dev server with `npm run start`.

## Deploying

`contentful space environment use` and select the environment you'd like to deploy to.

`npm run deploy`

This will build the extension and deploy it to Contentful.

### Resources

Documentation for Contentful Management API: https://contentful.github.io/contentful-management.js/contentful-management/5.11.3/index.html
