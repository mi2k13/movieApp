function swipe(obj, nbItem) {
  var ctrnWidth    = $(obj)[0].clientWidth,
      IMG_WIDTH    = parseInt(ctrnWidth / nbItem, 10) * 4,
      currentImg   = 0,
      maxImages    = 4,
      speed        = 500,
      imgs,
      swipeOptions = {
        swipeStatus : swipeStatus,
        threshold:75
      };

  // swipe code from http://labs.rampinteractive.co.uk/touchSwipe/demos/
  $(function() {
    imgs = $(obj);
    imgs.swipe(swipeOptions);
  });

  function swipeStatus(event, phase, direction, distance) {
    if (phase == "move" && (direction == "left" || direction == "right")) {
      if (direction == "left") {
        scrollImages((IMG_WIDTH * currentImg) + distance, 0);
      } else if (direction == "right") {
        scrollImages((IMG_WIDTH * currentImg) - distance, 0);
      }
    }

    else if (phase == "cancel") {
      scrollImages(IMG_WIDTH * currentImg, speed);
    }

    else if (phase == "end") {
      if (direction == "right") {
        previousImage();
      }
      else if (direction == "left") {
        nextImage();
      }
    }
  }

  function previousImage() {
    currentImg = Math.max(currentImg - 1, 0);
    scrollImages(IMG_WIDTH * currentImg, speed);
  }

  function nextImage()  {
    currentImg = Math.min(currentImg + 1, maxImages - 1);
    scrollImages(IMG_WIDTH * currentImg, speed);
  }

  function scrollImages(distance, duration) {
    imgs.css("-webkit-transition-duration", (duration / 1000).toFixed(1) + "s");
    var value = (distance < 0 ? "" : "-") + Math.abs(distance).toString();
    imgs.css("-webkit-transform", "translate3d(" + value + "px, 0px, 0px)");
  }
}