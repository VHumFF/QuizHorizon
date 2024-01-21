jQuery(document).ready(function ($) {
  $('#um_btn').click(function (e) {
    e.preventDefault();

    // Toggle the 'show' class for the sub-element
    $(this).next('.um-show').toggleClass('show');
  });
});