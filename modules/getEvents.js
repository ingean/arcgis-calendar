import * as arcgis from './arcgis.js';

const urlFeatureView = 'https://services.arcgis.com/2JyTvMWQSnM2Vi8q/arcgis/rest/services/Ressurstilgjengelighet/FeatureServer/0';

function featuresToEvents(features) {
  return features.map(f => {
    let availability = (f.attributes.LedigePlasser / f.attributes.KAPASITET)*100
    
    return {
      title: `${f.attributes.RESSURS} - ${f.attributes.LOKALITET_NAVN} (${availability}%)`,
      start: moment(f.attributes.Dato).format('YYYY-MM-DD'),
      backgroundColor: getEventColor(availability),
      borderColor: getEventColor(availability)
    }
  });
}

function autoRefresh(calendar, interval) {  
  setInterval(async () => {
    calendar.refetchEvents();
  }, interval)
}

export function getURLParam(key) {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const val = urlParams.get(key);
    return val
  } catch(error){
    return '';
  }
}

export async function getArcGISFeatures() {
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