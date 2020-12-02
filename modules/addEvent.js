import * as arcgis from './arcgis.js';
import { getEventColor } from './getEvents.js';

const urlTable = 'https://services.arcgis.com/2JyTvMWQSnM2Vi8q/arcgis/rest/services/VerSa/FeatureServer/7';

function eventToFeatures(info) {
 let event = info.draggedEl.childNodes[1];
 let details = JSON.parse(event.getAttribute('data-eventDetails'));
 let spaces = document.getElementById('addEvent-spaces');
  return [{
   attributes: {
     GUID: details.globalId,
     Dato: moment(info.date).format('YYYY-MM-DDT12:00:00'),
     LedigePlasser: spaces.value
   }
 }];
}

export function getAvailability(spaces) {
  let eventEl = document.getElementById('addEvent-btn');
  let details = JSON.parse(eventEl.getAttribute('data-eventDetails'));
  return (spaces/details.capacity)*100;
}

function updateEventColor(availability) {
  let bgColor = getEventColor(availability);
  let newEvent = document.querySelector('.newEvent');
  newEvent.style = `background-color:${bgColor};`;
}

export async function addEventToArcGIS(info) {
  let features = eventToFeatures(info);
  let success = await arcgis.add(urlTable, features, CREDENTIALS);
}

export function availSpaceUpdated() {

  let spaces = document.getElementById('addEvent-spaces');
  let avail = getAvailability(spaces.value);
  updateEventColor(avail);
}