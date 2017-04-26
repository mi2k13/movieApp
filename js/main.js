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
    app.theater = $('.js-movies').attr('data-theater');
  },


  handleSelectShowtime: function() {
    var $this = $(this);
    var $movie = $this.parents('li');

    if ($this.hasClass('showtimes__item--selected') || $this.hasClass('showtimes__item--over')) {
      $this.removeClass('showtimes__item--selected');
    } else {
      var start = $this.data('start');
      var movie = $movie.data('movie');
      var duration = $movie.data('duration');
      var runtime = $movie.data('runtime') / 60;
      var end = showtimeEnd(start, duration);

      $this.addClass('showtimes__item--selected');
      $this.find('.js-timeLeft').text('');

      app.addToTimeline(movie, start, end, runtime);
      app.handleTimeLeft(end);
    }
  },

  /**
   * Puts movie in timeline and schedule
   */
  addToTimeline: function(movie, start, end, runtime) {
    // add show to schedule
    var insert = '<li><div class="schedules">' + start + ' - ' + end + '</div><div><b>' + movie + '</b><div class="infos">' + app.theater + '</div></div></li>';
    $("#myMovies").append(insert);

    // draw show in timeline
    app.drawShow(start, runtime, movie);
  },

  /**
   * Prints time left before next showtimes and add color to the closest's ones
   */
  handleTimeLeft: function(end) {
    var showtimesLength = app.$showtimes.length;
    var start;
    var waiting;

    for (var i = 0; i < showtimesLength - 1 ; ++i) {
      var $showtime = $(app.$showtimes[i]);
      var $timeLeft = $showtime.find('.js-timeLeft');

      start = $showtime.attr('data-start');
      waiting = timeToSec(start) - timeToSec(end);

      // reset timeleft
      $showtime.removeClass('showtimes__item--imminent showtimes__item--soon showtimes__item--later');

      // Over showtimes
      if (waiting <= 0) {
        if (!$showtime.hasClass('showtimes__item--over') && !$showtime.hasClass('showtimes__item--selected')) {
          $showtime.addClass('showtimes__item--over');
          $timeLeft.text('');
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
        if (waiting  <= 80 * 60) {
          $timeLeft.text('(' + secToMin(waiting) + 'mn)');
        }
      }
    }
  },

  drawShow: function(start, duration, title) {
    var ctrnWidth    = 800,
        itemWidth    = ctrnWidth / 15.5,
        marginLeft   = 9 * 60,
        realStart    = (timeToMin(start) - marginLeft) / 60 * itemWidth, // timeline starts at 9am
        realDuration = Number(duration) / 60 * itemWidth;

    $('#hours').append('<li class="timeline__show" style="width:' + realDuration + 'px; left: ' + realStart + 'px;">' + title + '</li>');
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
