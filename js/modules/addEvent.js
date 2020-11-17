import * as arcgis from './arcgis.js';

const urlTable = 'https://services.arcgis.com/2JyTvMWQSnM2Vi8q/arcgis/rest/services/VerSa/FeatureServer/7';

function eventToFeatures(info) {
 let event = info.draggedEl.childNodes[0];
 let details = JSON.parse(event.getAttribute('data-eventDetails'));
  return [{
   attributes: {
     GUID: details.globalId,
     Dato: moment(info.date).format('YYYY-MM-DDT12:00:00'),
     Tilgjengelighet: details.capacity
   }
 }];
}

export async function addEventToArcGIS(info) {
  let features = eventToFeatures(info);
  let success = await arcgis.add(urlTable, features, CREDENTIALS);
}