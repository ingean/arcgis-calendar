import { getCalendarEvents, refreshCalendar, updateAddEventDetails, getEventColor } from './getEvents.js';
import { addEventToArcGIS, availSpaceUpdated } from './addEvent.js';

document.addEventListener('DOMContentLoaded', async function() {
  moment.locale('nb_NO');
  setActionBarStatus();

  let eventSource = {
    events: async function(info, success, fail) {
      return await getCalendarEvents()
    }
  }
 
  let addEventEl = document.getElementById('list-settings'); 
  let calendarEl = document.getElementById('calendar');

  let Draggable = FullCalendar.Draggable;
  new Draggable(addEventEl, {
    itemSelector: '.fc-event',
    eventData: function(eventEl) {
      let details = JSON.parse(eventEl.childNodes[1].getAttribute('data-eventDetails'));
      let spaces = document.getElementById('addEvent-spaces');
      let avail = (spaces.value/details.capacity)*100;
      return {
        title: `${details.resource} - ${details.location} (${avail})`,
        backgroundColor: getEventColor(avail)
      };
    }
  });
  
  var calendar = new FullCalendar.Calendar(calendarEl, {
    locale: 'nb',
    height: 'auto',
    editable: true,
    droppable: true,
    initialView: 'dayGridMonth',
    initialDate: moment().format('YYYY-MM-DD'),
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    eventSources: [eventSource],
    //events: events,
    drop: function(info) {
      addEventToArcGIS(info);
      }
  });
  calendar.render();

  updateAddEventDetails();
  refreshCalendar(calendar);
  document.getElementById('addEvent-spaces')
  .addEventListener('input', availSpaceUpdated)
});

function test() {
  alert('Got triggered');
}