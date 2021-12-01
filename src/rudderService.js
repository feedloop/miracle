
const rudderanalytics = require("aixp-js-sdk");
const planeUrl =
"https://aixp-rudder-api.digitallab.id/6405dcdc-0812-4eb0-83e7-eb79d81b6a1f/70093b87-5178-40a4-a6f1-9df5d9e5b7ab";
rudderanalytics.load("1lgCItJ0FN5qSusbvZVESHjEHLq", planeUrl, {
  configUrl: planeUrl
})

export default rudderanalytics
