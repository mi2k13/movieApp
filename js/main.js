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


function addFilm(cinema, name, start, end) {
  localStorage["film"] = [cinema, name, start, end];
  isSoon(end);
}

function isSoon(end) {
  var time;
  $('.time').each(function(){
    time = $(this).data('time');
    if(time > end)
      $(this).css('background-color','orange');
    else
      $(this).css('background-color','#eee');
  });
}

function secToTime(secs) {
  var hours = Math.floor(secs / (60 * 60));
  var divisor_for_minutes = secs % (60 * 60);
  var minutes = Math.floor(divisor_for_minutes / 60);

  if (minutes < 10)
    minutes = '0' + minutes;

  return hours + 'h' + minutes;
}

function sessionEnd(start, duration) {
  var startA = start.split(':');
  var durationA = duration.split('h');

  var hours = parseInt(startA[0], 10) + parseInt(durationA[0], 10);
  var minutes = parseInt(startA[1], 10) + 15 + parseInt(durationA[1], 10);
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