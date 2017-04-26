var currentDate = '2013-05-01';

/**
 * TIME CONVERSTION
 */
function timeToSec(time) {
  var t = time.split(':');
  return t[0] * 3600 + t[1] * 60;
}

function timeToMin(time) {
  var t = time.split(':');
  return Number(t[0]) * 60 + Number(t[1]);
}

function secToTime(secs) {
  var hours   = Math.floor(secs / (60 * 60)),
      minutes = Math.floor(secs % (60 * 60) / 60);
  if (minutes < 10) minutes = '0' + minutes;
  return hours + 'h' + minutes;
}

function secToMin(secs) {
  return secs / 60;
}

/**
 * SHOWTIME
 */

function showtimeStart(start, pause) {
  var startA  = start.split(':'),
      hours   = Number(startA[0]),
      minutes = Number(startA[1]) + Number(pause);

  if (minutes >= 60) {
    hours++;
    minutes -= 60;
  } else if (minutes < 10) {
    minutes = '0' + minutes;
  }

  return hours + ':' + minutes;
}

function showtimeEnd(start, duration) {
  var startA    = start.split(':'),
      durationA = duration.split('h'),
      hours     = Number(startA[0]) + Number(durationA[0]),
      minutes   = Number(startA[1]) + Number(durationA[1]);

  if (minutes > 60) {
    hours++;
    minutes -= 60;
  } else if (minutes < 10) {
    minutes = '0' + minutes;
  }

  if (hours >= 24) {
    hours = 24 - hours;
  }

  return hours + ':' + minutes;
}


/**
 * HANDLEBARS HELPERS
 */
Handlebars.registerHelper('notPreview', function(status, options) {
  if (status == 'false') {
    return options.fn(this);
  }
  return options.inverse(this);
});

Handlebars.registerHelper('isToday', function(date, options) {
  if (date == currentDate) {
    return options.fn(this);
  }
  return options.inverse(this);
});

Handlebars.registerHelper('is3D', function(v1, options) {
  if (v1 == '3D') {
    return options.fn(this);
  }
  return options.inverse(this);
});

Handlebars.registerHelper('VF', function(v1, options) {
  if (v1 == 'false') {
    return options.fn(this);
  }
  return options.inverse(this);
});

Handlebars.registerHelper('toHours', function(secs) {
  return secToTime(secs);
});

Handlebars.registerHelper('start', function(start, pause) {
  return showtimeStart(start, pause);
});