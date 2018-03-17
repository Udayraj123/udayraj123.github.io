$(function() {
  // set the last one to be the first one
  var last = $('span.flash span:first');
  var z_high = 2;
  var z_low = 1;

  window.setInterval(function() {

    var el = last;
    var next = el.next();
    if(!next.length) {//cycle
      next = $('span.flash span:first');
    }
    last.css('z-index',z_low);
    next.css('z-index',z_high);
    last = next;
  },800);

  //open and close
  window.setTimeout(function() {
    $('span.flash').addClass('open');
    window.setTimeout(function() {
      $('span.flash').removeClass('open');
    },1000);
  }, 350); 
});