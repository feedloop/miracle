# Miracle

**Miracle** is a sample e-commerce style react web app designed to test and implement AIXP trackers.
Live Version: [Miracle](https://miracle-delta.vercel.app/)

## Installation

- Install dependencies using `$ npm install` or `$ yarn install` 
- Run the react app using the command `$ npm run dev` or `$ yarn dev`
> The app will automatically run on [http://localhost:3001/](http://localhost:3001/). You can configure the port in the `.env` file

## Tracker Configuration

Configure the tracker endpoint in the `rudderService.js` to the credentials based on your project and source. Make sure that this endpoint is directed to the right source that can be found in your [sources](https://feedloop_io.gitlab.io/aixp-docs/integration/sources) page.

All trackers are placed in the `store.js` file. Learn more about tracker installation in the [AIXP documentation](https://feedloop_io.gitlab.io/aixp-docs/integration/AIXP-SDKs/webapp-sdk/javascript-sdk).

> This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
> You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).
