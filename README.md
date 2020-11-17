# arcgis-calendar

# Calendar for ArcGIS features
Requests features from ArcGIS Online and display them on a calendar. The features are managed in a feature service with a related table storing each event for a feature. A Feature Layer (Hosted View) is used to access feature attributes for each event. 

The webapp is published to [GitHub Pages](https://ingean.github.io/arcgis-calendar) 

The calendar is using [FullCalendar.io](https://fullcalendar.io/)

## URL parameters
The app supports url parameters to select a feature to show in calendar.
Example:
```
https://ingean.github.io/arcgis-calendar/index.html?globalId=a43aeca8-190e-4bb7-87be-4a3685b21cc4
```

## ArcGIS Online items
The webapp use the following AGOL-items:
>https://geodata.maps.arcgis.com/home/item.html?id=42fdf2d9568e473ab4e0ab8bb9393e0f
>https://geodata.maps.arcgis.com/home/item.html?id=9ba94cc2d7b947a9a9e83b9f87836851

### ArcGIS Authentication
The app request ArcGIS for a token using client_id and client_secret. The app is registered in ArcGIS Online:
>https://geodata.maps.arcgis.com/home/item.html?id=92dc30d683c34e85a663c3413a45454a
