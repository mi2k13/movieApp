$(document).ready(function() {
  app.init();
});

var app = {
  init: function() {
    var theaters = 'C0159,C0053';
    $.getJSON("allocine.json", function(data) {
      app.loadTemplate('theaters', data, function() {
        app.initComponents();

        app.$showtimes
          .off('click', app.handleSelectShowtime)
          .on('click', app.handleSelectShowtime);

        $('.js-sortable').sortable({
          handle: '.js-handle'
        });
      });
    });

    swipe('#hours', 16);
  },

  initComponents() {
    app.$showtimes = $('.js-showtime');
    app.$waitings = $('.js-waiting');

    app.theater = $('.js-movies').attr('data-theater');
    app.selectedShowtimes = [];
  },


  handleSelectShowtime: function() {
    var $this = $(this);
    var $movie = $this.parents('li');
    var showtimeId = $this.attr('data-code');

    if (!app.selectedShowtimes.includes(showtimeId)) {
      var start = $this.data('start');
      var movie = $movie.data('movie');
      var duration = $movie.data('duration');
      var runtime = $movie.data('runtime') / 60;
      var end = showtimeEnd(start, duration);

      // add id to selectedShowtimes
      app.selectedShowtimes.push(showtimeId);

      // update showtime view
      $this.addClass('showtimes__item--selected');
      $this.find('.js-waiting').text('');

      // show other showtimes' time left
      app.handleWaiting(end);

      // add showtime to timeline
      app.addShowtimeToTimeline(start, runtime, movie, showtimeId);
    }
  },


  /**
   * Prints time left before next showtimes and add color to the closest's ones
   */
  handleWaiting: function(end) {
    var showtimesLength = app.$showtimes.length;
    var start;
    var waiting;

    for (var i = 0; i < showtimesLength - 1 ; ++i) {
      var $showtime = $(app.$showtimes[i]);
      var $waiting = $showtime.find('.js-waiting');

      start = $showtime.attr('data-start');
      waiting = timeToSec(start) - timeToSec(end);

      // reset waiting time
      $showtime.removeClass('showtimes__item--imminent showtimes__item--soon showtimes__item--later');

      // Over showtimes
      if (waiting <= 0) {
        if (!$showtime.hasClass('showtimes__item--over') && !$showtime.hasClass('showtimes__item--selected')) {
          $showtime.addClass('showtimes__item--over');
          $waiting.text('');
        }
      }
      // Upcoming showtimes
      else if (!$showtime.hasClass('showtimes__item--over')) {
        // less than 7min
        if (waiting <= 7 * 60) {
          $showtime.addClass('showtimes__item--imminent');
        }
        // less than 35min
        else if (waiting <= 35 * 60) {
          $showtime.addClass('showtimes__item--soon');
        }
        // less than an hour
        else if (waiting <= 60 * 60) {
          $showtime.addClass('showtimes__item--later');
        }

        // show time left
        if (waiting  <= 60 * 60) {
          $waiting.text('(' + secToMin(waiting) + 'mn)');
        }
      }
    }
  },


  addShowtimeToTimeline: function(start, duration, title, showtimeId) {
    var containerWidth = 800,
        itemWidth    = containerWidth / 15.5,
        marginLeft   = 9 * 60, // timeline starts at 9am
        realStart    = (timeToMin(start) - marginLeft) / 60 * itemWidth,
        realDuration = Number(duration) / 60 * itemWidth;

    $('#hours').append('<li class="timeline__show" data-code="' + showtimeId + '" style="width:' + realDuration + 'px; left: ' + realStart + 'px;">' + title + '</li>');
  },


  loadTemplate: function(templateName, templateInput, callback) {
    var source;
    var template;
    var path = 'tpl/' + templateName + '.html';

    $.ajax({
      url: path,
      cache: false,
      success: function (data) {
        source = data;
        template = Handlebars.compile(source);
        $('#' + templateName).html(template({
          tpl: templateInput.feed.theaterShowtimes
        }));

        if (callback) {
          callback();
        }
      }
    });
  }
}
