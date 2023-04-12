

document.addEventListener('DOMContentLoaded', function() {
  var calendarEl = document.getElementById('calendar');

  function getVariables(filePath,clbk) {
    var xhr = new XMLHttpRequest();
    // Set up the request
    xhr.open('GET', filePath, false);
    // Define a callback function to handle the response
    xhr.onload = function() {
      // Parse the response as JSON
      var data = JSON.parse(xhr.responseText);
      // Do something with the variables
      if (clbk) clbk(data);
    };
    // Send the request
    xhr.send();
  }

  function sendSoapRequest(theUrl,bUser,bPass,callback) {
    var soapEnvelope =
        '<?xml version="1.0" ?>'+
        '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:zimbra" xmlns:urn1="urn:zimbraAccount">'+
        '<soapenv:Header>'+
        '<urn:context xmlns:urn="urn:zimbra"/>'+
        '</soapenv:Header>'+
        '<soapenv:Body>'+
        '<urn1:AuthRequest xmlns:urn1="urn:zimbraAccount">'+
        '<urn1:account by="name">'+bUser+'</urn1:account>'+
        '<urn1:password>'+bPass+'</urn1:password>'+
        '</urn1:AuthRequest>'+
        '</soapenv:Body>'+
        '</soapenv:Envelope>';

      // create XMLHttpRequest object
      var xhr = new XMLHttpRequest();
      // specify the SOAP endpoint URL and HTTP method
      xhr.open('POST', theUrl, false);
      // set SOAPAction header
      // xhr.setRequestHeader('SOAPAction', '');
      // set Content-Type header
      // xhr.setRequestHeader('Content-Type', 'text/xml;charset=UTF-8');
      // specify callback function to handle response
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
          // extract SOAP response from XML document
          parser = new DOMParser();
          xmlDoc = parser.parseFromString(xhr.responseText,"text/xml");
          soapResponse = xmlDoc.getElementsByTagName("authToken")[0].innerHTML;

          // resolve Promise with SOAP element
          // console.log("sendSoapRequest: "+soapResponse);
          if (callback) callback(soapResponse);
        }
      };
      // send SOAP request
      xhr.send(soapEnvelope);
  };

  var arCals;
  var checkboxContainer = '';
  var eventSource = new Array();
  getVariables('js/calendars.json',function(data){
    arCals = data;
    checkboxContainer = "<ul class='ds-event-categories'>";
    var style = document.createElement('style');
    document.head.appendChild(style);

    if (arCals.length>0) {
      for(let i = 0; i < arCals.length; i++) {
        let obj = arCals[i];
        style.sheet.insertRule('#li_'+obj.calParameters.id+' input[type="checkbox"]:checked {background: '+obj.calParameters.color+';}');
//        console.log(obj.calParameters.id);
        checkboxContainer += "<li id='li_"+obj.calParameters.id;
        checkboxContainer += "'><label><input id='"+obj.calParameters.id;
        checkboxContainer += "' type='checkbox' checked >"+obj.calDispName+"</label></li>";

       sendSoapRequest(window.location.origin + "/service/soap",obj.calParameters.username, obj.calParameters.userPass,function(soapResponseVar){
          var soapResponse = soapResponseVar;
        });

        eventSource[i] = {
          id: obj.calParameters.id,
          url:window.location.origin+"/home/"+obj.calParameters.username+"/calendar?auth=qp&zauthtoken="+soapResponse,
          color: obj.calParameters.color,
          format: 'ics',
          textColor: obj.calParameters.textColor
        }
      }
    }
    checkboxContainer += "</ul>";
  });

  var calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'timeGridWeek',
      locale: 'uk',
      headerToolbar: {
          left: 'prev,next today',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
          center: 'title',
      },
      contentHeight:'auto',
      timeZone: 'local',
      views: {
        timeGridWeek: {
          type: 'timeGrid',
          slotLabelInterval: '01:00',
          slotLabelFormat: {
            hour: 'numeric',
            minute: '2-digit', 
            meridiem: 'short'
          },
          slotMinTime: '08:00:00',
          slotMaxTime: '20:00:00',
          nowIndicator: true,
          scrollTime: '08:00:00',
        }
      },
      eventSources: [],
      eventContent: function(info) {
        console.log(info.event);
        let author=info.event.extendedProps.organizer;
        return {
          html: '<b>' + info.event.title + '</b><br><br>' + author.replace('mailto:', '')
        };
      }
  });
  for(let i = 0; i < eventSource.length; i++) {
    calendar.addEventSource(eventSource[i]);
  }
  calendar.render();


var toolbar = document.querySelector(".fc-toolbar");
var tempContainer = document.createElement("div");
tempContainer.innerHTML = checkboxContainer;
toolbar.insertAdjacentHTML("afterend", tempContainer.innerHTML);

if (arCals.length>0) {
  for(let i = 0; i < arCals.length; i++) {
    let obj = arCals[i];
    if (localStorage.hasOwnProperty(obj.calParameters.id)) {
      if (JSON.parse(localStorage.getItem(obj.calParameters.id))) {
        document.getElementById(obj.calParameters.id).checked = true;
      } else {
        calendar.getEventSourceById(obj.calParameters.id).remove();
        document.getElementById(obj.calParameters.id).checked = false;
      }
    } else {
      document.getElementById(obj.calParameters.id).checked = true;
      localStorage.setItem(obj.calParameters.id, true);
    }
  }
}

if (arCals.length>0) {
  for(let i = 0; i < arCals.length; i++) {
    let obj = arCals[i];
    var checkbox = document.getElementById(obj.calParameters.id)
    checkbox.addEventListener('change', (event) => {
      if (event.currentTarget.checked) {
        var iChk = 0;
        for(let i = 0; i < eventSource.length; i++) {
          if (eventSource[i].id == obj.calParameters.id) { iChk = i };
        }
        calendar.addEventSource(eventSource[iChk]);
      } else {
        calendar.getEventSourceById(obj.calParameters.id).remove();
      }
      localStorage.setItem(obj.calParameters.id, event.currentTarget.checked);
    })
  }
}

let Timer=30;
var refreshTimer;
const ar_checkbox = document.getElementById('autorefresh')

if (localStorage.hasOwnProperty('ar_checkbox')) {
  if (JSON.parse(localStorage.getItem('ar_checkbox'))) {
    document.getElementById('autorefresh').checked = true;
    startRefreshTimer();
  } else {
    document.getElementById('autorefresh').checked = false;
    stopRefreshTimer();
  }
} else {
  document.getElementById('autorefresh').checked = true;
  localStorage.setItem('ar_checkbox', true);
  startRefreshTimer()
}

function startRefreshTimer() {
  refreshTimer = setInterval(function() {
    document.getElementById('timer').innerText= Timer;
    Timer--;
    if(Timer < 1) {
     if (document.getElementById('autorefresh').checked) {
      location.reload();
     }
    }
  }, 1000);
}

function stopRefreshTimer() {
  clearInterval(refreshTimer);
}

ar_checkbox.addEventListener('change', (event) => {
  if (event.currentTarget.checked) {
    startRefreshTimer();
    localStorage.setItem('ar_checkbox', event.currentTarget.checked);
  } else {
    localStorage.setItem('ar_checkbox', event.currentTarget.checked);
    stopRefreshTimer();
  }
})

});
