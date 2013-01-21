$(document).ready(function() {

  var theaters = 'C0159,C0053';
  loadData('theaters='+ theaters, 'theaters');

  var d = new Date();
  var minutes;

  if (parseInt(d.getMinutes(), 10) < 10)
    minutes = '0' + d.getMinutes();

  localStorage.setItem('hours', d.getHours() + ':' + minutes);
  localStorage.setItem('date', d.getFullYear() + '-' + d.getMonth()+1 + '-' + d.getDate());

});


function addFilm(cinema, movie, start, end) {
  localStorage["film"] = [cinema, movie, start, end];
  var insert = '<li>' + start + ' - ' + end + ' : <b>' + movie + '</b> <span class="small">(' + cinema + ')</span> ' + '</li>';
  $("#myMovies ul").append(insert);
  isSoon(end);
}

function isSoon(end) {
  var start;
  $('.time').each(function(){
    start = $(this).data('start');
    if(start > end) {
      var startSec = timeToSec(start);
      var endSec = timeToSec(end);
      
      if(startSec - endSec  <= 5 * 60)
        $(this).css('background-color','#F5001D');
      else if(startSec - endSec  <= 15 * 60)
        $(this).css('background-color','#FFA200');
      else if(startSec - endSec  <= 30 * 60)
        $(this).css('background-color','#34D0B6');
      else if(startSec - endSec  <= 60 * 60)
        $(this).css('background-color','#00A287');
      else
        $(this).css('background-color','#006957');

      $(this).find('.timeLeft').text('(' + secToMin(startSec - endSec) + 'min)');
    }
    else
      $(this).css('background-color','#eee');
  });
}

function timeToSec(time) {
  var t = time.split(':');
  return t[0]*3600 + t[1]*60;
}

function secToTime(secs) {
  var hours = Math.floor(secs / (60 * 60));
  var divisor_for_minutes = secs % (60 * 60);
  var minutes = Math.floor(divisor_for_minutes / 60);

  if (minutes < 10)
    minutes = '0' + minutes;

  return hours + 'h' + minutes;
}

function secToMin(secs) {
  return secs / 60;
}



function sessionStart(start, pause) {
  var startA = start.split(':');

  var hours = parseInt(startA[0], 10);
  var minutes = parseInt(startA[1], 10) + parseInt(pause, 10);
  if (minutes >= 60) {
    hours++;
    minutes -= 60;
  }
  if (minutes < 10)
    minutes = '0' + minutes;

  return hours + ':' + minutes;
}

function sessionEnd(start, duration) {
  var startA = start.split(':');
  var durationA = duration.split('h');

  var hours = parseInt(startA[0], 10) + parseInt(durationA[0], 10);
  var minutes = parseInt(startA[1], 10) + parseInt(durationA[1], 10);
  if (minutes > 60) {
    hours++;
    minutes -= 60;
  }
  if (minutes < 10)
    minutes = '0' + minutes;

  return hours + ':' + minutes;
}

function loadData(path, template) {
  $.ajax({
    url: 'http://api.allocine.fr/rest/v3/showtimelist?partner=YW5kcm9pZC12M3M&format=json&' + path,
    contentType: 'application/json',
    dataType: 'jsonp',
    cache: false,
    processData: false,
    type: 'GET',
    success: function(data, textStatus, jqXHR) {
        loadTemplate(template, data);
    }
  });
}

function loadTemplate(templateName, templateInput) {
  var source;
  var template;
  var path = templateName + '.html';
  $.ajax({
    url: path,
    cache: false,
    success: function (data) {
      source = data;
      template = Handlebars.compile(source);
      $('#' + templateName).html(template({
        tpl: templateInput.feed.theaterShowtimes
      }));
    }
  });
};


Handlebars.registerHelper('isToday', function(v1, options) {
  if(v1 == localStorage.getItem('date')) {
    return options.fn(this);
  }
  return options.inverse(this);
});

Handlebars.registerHelper('is3D', function(v1, options) {
  if(v1 == '3D') {
    return options.fn(this);
  }
  return options.inverse(this);
});

Handlebars.registerHelper('VF', function(v1, options) {
  if(v1 == 'false') {
    return options.fn(this);
  }
  return options.inverse(this);
});

Handlebars.registerHelper('toHours', function(secs) {
  return secToTime(secs);
});

Handlebars.registerHelper('start', function(start, pause) {
  return sessionStart(start, pause);
});