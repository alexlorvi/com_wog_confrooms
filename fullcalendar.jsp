<!DOCTYPE html>
<html>
<head>
  <meta charset='utf-8' />
  <link href='css/calendar.css' rel='stylesheet' />
</head>
<body>
  <div id='calendar'></div>
  <div id='bottom'><p><input id="autorefresh" type="checkbox" checked /> Автоматичне <a onclick="location.reload();" href="javascript:void(0);">оновлення</a> сторінки через <span id='timer'>30</span> секунд</p></div>

  <script src='js/fullcalendar-6.1.5-core.min.js'></script>
  <script src='js/fullcalendar-6.1.5-core-uk.min.js'></script>
  <script src='js/fullcalendar-6.1.5-daygrid.min.js'></script>
  <script src='js/fullcalendar-6.1.5-timegrid.min.js'></script>
  <script src='js/ical-1.5.0.min.js'></script>
  <script src='js/fullcalendar-6.1.5-icalendar.min.js'></script>
  <script src='js/calendar.js'></script>
</body>
</html>
