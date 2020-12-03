import * as arcgis from './arcgis.js';
import { getArcGISFeatures, getURLParam, getEventColor } from './getEvents.js';

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

function setTitle(feature) {
  let title = document.getElementById('calendar-title');
  let text = `${feature.attributes.RESSURS} - ${feature.attributes.LOKALITET_NAVN}`;
  title.textContent = text;
}

function getDetails(feature) {
  return {
   globalId: feature.attributes.GlobalID,
   resource: feature.attributes.RESSURS,
   location: feature.attributes.LOKALITET_NAVN,
   capacity: feature.attributes.KAPASITET
 };
}

function getAvailability(spaces) {
  let eventEl = document.getElementById('addEvent-btn');
  let details = JSON.parse(eventEl.getAttribute('data-eventDetails'));
  return (spaces/details.capacity)*100;
}

function updateEventColor(availability) {
  let bgColor = getEventColor(availability);
  let newEvent = document.querySelector('.newEvent');
  newEvent.style = `background-color:${bgColor};`;
}

function hideAddEvent() {
  let addEvent = document.getElementById('btn-show-settings');
  addEvent.disabled = true;
}

export async function updateAddEventDetails() {
  let features = await getArcGISFeatures();
  let globalId = getURLParam('globalId');

  if(globalId) { //Check if calendar only shows events for one resource
    setTitle(features[0]);
    let details = getDetails(features[0])
    let btn = document.getElementById('addEvent-btn');
    let input = document.getElementById('addEvent-spaces');
    input.setAttribute('max', details.capacity);
    btn.setAttribute("data-eventDetails", JSON.stringify(details));
    availSpaceUpdated();
  } else {
    hideAddEvent(); //Disable ability to add events while showing multiple resources in calendar
  }
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