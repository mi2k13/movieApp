$(document).ready(function() {

  var theaters = 'C0159,C0053';
  loadData('theaters='+ theaters, 'theaters');

  var d = new Date();
  var minutes, hours, month, day;

  if (Number(d.getMinutes()) < 10)  minutes = '0' + d.getMinutes();
  if (Number(d.getHours()) < 10)    hours =   '0' + d.getHours();
  if (Number(d.getDate()) < 10)     day =     '0' + d.getDate();
  if (Number(d.getMonth()+1) < 10)  month =   '0' + Number(d.getMonth()+1);

  localStorage.setItem('hours', hours + ':' + minutes);
  localStorage.setItem('date', d.getFullYear() + '-' + month + '-' + day);


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

    if(start < end) {
      $(this).css('background-color','#eee');
      return;
    }
    
    var waiting = timeToSec(start) - timeToSec(end);

    
    if(waiting < 0)
      $(this).css('color','#999');
    else if(waiting  <= 7 * 60)
      $(this).css('background-color','#FF7140');
    else if(waiting  <= 30 * 60)
      $(this).css('background-color','#FFBC00');
    else
      $(this).css('color','#999');

    $(this).find('.timeLeft').text('(' + secToMin(waiting) + 'min)');
    
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

  var hours = Number(startA[0]);
  var minutes = Number(startA[1]) + Number(pause);
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

  var hours = Number(startA[0]) + Number(durationA[0]);
  var minutes = Number(startA[1]) + Number(durationA[1]);
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
    cache: true,
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


Handlebars.registerHelper('isToday', function(date, options) {
  if(date == localStorage.getItem('date')) {
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