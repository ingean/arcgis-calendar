import * as arcgis from './arcgis.js';
import { availSpaceUpdated } from './addEvent.js';

const urlFeatureView = 'https://services.arcgis.com/2JyTvMWQSnM2Vi8q/arcgis/rest/services/Ressurstilgjengelighet/FeatureServer/0';

function featuresToEvents(features) {
  let events = []
  for (var i = 0; i < features.length; i++) {   
    let f = features[i];
    let availability = (f.attributes.LedigePlasser / Number(f.attributes.SIGN))*100
    
    let event = {
      title: `${f.attributes.RESSURS} - ${f.attributes.LOKALITET_NAVN} (${availability}%)`,
      start: moment(f.attributes.Dato).format('YYYY-MM-DD'),
      backgroundColor: getEventColor(availability),
      borderColor: getEventColor(availability)
    }
    events.push(event);
  }
  
   return events;
 }

function setTitle(feature) {
  let title = document.getElementById('calendar-title');
  let text = `${feature.attributes.RESSURS} - ${feature.attributes.LOKALITET_NAVN}`;
  title.textContent = text;
}
 
 function getURLParam(key) {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const val = urlParams.get(key);
    return val
  } catch(error){
    return '';
  }
 }

function getDetails(feature) {
   return {
    globalId: feature.attributes.GlobalID,
    resource: feature.attributes.RESSURS,
    location: feature.attributes.LOKALITET_NAVN,
    capacity: Number(feature.attributes.SIGN)
  };
 }


 function hideAddEvent() {
  
 }

 async function getArcGISFeatures() {
  let params = ''; 
  let globalId = getURLParam('globalId');
  
  if(globalId) {
    params = {
      where: `GLOBALID='${globalId}'`
    }
  }
    
  return await arcgis.get(urlFeatureView, params, CREDENTIALS);
 }

 export function getEventColor(capacity) {
  if(capacity <= 25) return eventColor[25];
  if(capacity > 25 && capacity <= 50) return eventColor[50];
  if(capacity > 50 && capacity <= 75) return eventColor[75];
  if(capacity > 75) return eventColor[100];
  return eventColor[0];
}

 export async function getCalendarEvents() {
  let features = await getArcGISFeatures();
  
  return featuresToEvents(features);
 }

 export function refreshCalendar(calendar) {
  let interval = getURLParam('refreshInterval');
  
  if (interval) {
    interval = Number(interval);
    autoRefresh(calendar, interval);
  }
 }

function autoRefresh(calendar, interval) {  
  setInterval(async () => {
    calendar.refetchEvents();
  }, interval)
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
