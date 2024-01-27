jQuery(document).ready(function ($) {
  $('#um_btn').click(function (e) {
    $('#um-show').toggleClass('show');
  });
});

jQuery(document).ready(function ($) {
  $('#sm_btn').click(function (e) {
    $('#sm-show').toggleClass('show');
  });
});

jQuery(document).ready(function ($) {
  $('#mobile_um_btn').click(function (e) {
    $('#mobile_um-show').toggleClass('show');
  });
});

jQuery(document).ready(function ($) {
  $('#mobile_sm_btn').click(function (e) {
    $('#mobile_sm-show').toggleClass('show');
  });
});

jQuery(document).ready(function ($) {
  $('.hamburger').click(function (e) {
    $('.hamburger').toggleClass('is-active');
    $('.mobile-nav').toggleClass('is-active');
  });

});


