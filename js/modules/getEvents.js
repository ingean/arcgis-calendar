import { createEl } from './html.js';
import * as arcgis from './arcgis.js';

const urlFeatureView = 'https://services.arcgis.com/2JyTvMWQSnM2Vi8q/arcgis/rest/services/Ressurstilgjengelighet/FeatureServer/0';

function featuresToEvents(features, globalId) {
  let events = []
  
  for (var i = 0; i < features.length; i++) {   
    let f = features[i];
    if (globalId && i === 0) addExternalEvents(features[0]);
    if (!globalId) clearExternalEvents();
    
    let event = {
      title: `${f.attributes.RESSURS} - ${f.attributes.LOKALITET_NAVN} (${f.attributes.Tilgjengelighet}%)`,
      start: moment(f.attributes.Dato).format('YYYY-MM-DD'),
      backgroundColor: getEventColor(f.attributes.Tilgjengelighet),
      borderColor: getEventColor(f.attributes.Tilgjengelighet)
    }
    events.push(event);
  }
  
   return events;
 }

 function getEventColor(capacity) {
   if(capacity <= 25) return eventColor[25];
   if(capacity > 25 && capacity <= 50) return eventColor[50];
   if(capacity > 50 && capacity <= 75) return eventColor[75];
   if(capacity > 75) return eventColor[100];
   return eventColor[0];
 }
 
 function getGlobalIdFromURL() {
   try {
     const urlParams = new URLSearchParams(window.location.search);
     const globalId = urlParams.get('globalId');
     return globalId
   } catch(error){
     return '';
   }
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

 function addExternalEvents(f) {
  let caps = [25, 50, 75, 100];
  let title = `${f.attributes.RESSURS} - ${f.attributes.LOKALITET_NAVN}`;
  let header = createEl({type: 'strong', innerHTML: title});
  let p = createEl({type: 'p', child: header});
  let exEventsList = createEl({id: 'external-events', child: p});
  
  for (var i = 0; i < caps.length; i++) {
    let details = {
      globalId: f.attributes.GlobalID,
      resource: f.attributes.RESSURS,
      location: f.attributes.LOKALITET_NAVN,
      capacity: caps[i],
    };

    let a = [['data-eventDetails', JSON.stringify(details)]];
    let exEvent = createEl({innerHTML: `${caps[i]}% kapasitet`, attributes: a});
    let exEventCont =createEl({
      className: 'fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event', 
      child: exEvent,
      attributes: [
        ['style', 'background-color:' + eventColor[caps[i]] + ';border:0']
      ] 
    });
    exEventsList.appendChild(exEventCont);
  }
  let exEventsListCont = document.getElementById('external-events-container');
  exEventsListCont.appendChild(exEventsList);
 }

 function clearExternalEvents() {
  document.getElementById('external-events-container').innerHTML = ''
 }
 
 export async function getCalendarEvents() {
  let params = ''; 
  let globalId = getURLParam('globalId');
  
  if(globalId) {
    params = {
      where: `GLOBALID='${globalId}'`
    }
  }
    
  let features = await arcgis.get(urlFeatureView, params, CREDENTIALS);
  return featuresToEvents(features, globalId);
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
