$(document).ready(function () {

  // Remove if navigation does not
  // have links to sections
  // Block section links
  var scrollLink = $('.navbar .nav-link');
  scrollLink.click(function (e) {
    if ($(this.hash).length) {
      e.preventDefault();
      $('body,html').animate({
        scrollTop: $(this.hash).offset().top
      }, 1000);
    }

  });
  // End block section links

  // Ajax contact form
  // Do not Remove this block
  // Is intended for ajax contact form
  $('[data-js=submit]').on('submit', function(e){
    e.preventDefault();
    console.log('submitted intent');
  });

  function showSuccess(button){
    button.prop('disabled', true);
    var alertSuccessMessage = $("[data-alert=success]");
    if (alertSuccessMessage.length){
      alertSuccessMessage.removeClass('d-none');
    }
  }

  function showError(){
    var alertErrorMessage = $("[data-alert=error]");
    if (alertErrorMessage.length){
      alertErrorMessage.removeClass('d-none');
    }
  }

  $('[data-js=contact-submit]').find('button[type=submit]').on('click', function(e){
    $this = $(this);
    e.preventDefault();
    var $form = $(this).closest('form');
    var submitUrl = $form.prop('action');
    if (submitUrl.length){
      $.ajax({
        url: submitUrl, 
        type: "POST",
        data: $form.serialize(),
        success: function(data){
          showSuccess($this);
        },
        error: function(){
          showError();
        }
      });
    }
  });
  // End ajax contact form

});

// Remove this block if you do not
// need to worry about Image lazy load
// Block Image lazy load 
$(window).on('load', function () {
  console.log('load');
  // Check window size to set new background images sizes
  // If over 992px images will have @2x like: image@2x.jpg
  var bigImage = '';
  if ($(window).width() > 992){
    bigImage = "@2x";
  } 
  // Lazy for background images [data-bg-style]
  $('[data-bg-style]').each(function (i, el) {
    var $element = $(el);
    var imageUrl = $element.data('bg-style');
    // Prevent any change to images names when   
    // they come with the modifier already
    if (imageUrl.indexOf('@2x') > -1){
      bigImage = '';
    }
    var urlWithModifier = imageUrl.substr(0, imageUrl.length - 4) + bigImage;
    var urlWithExtension = "url(" + urlWithModifier + imageUrl.substr(imageUrl.length - 4, imageUrl.length) + ")";
    $element.css("backgroundImage", urlWithExtension);
  });

   // Lazy for images [data-img-style]
   $('[data-img-src]').each(function (i, el) {
    var $element = $(el);
    var imageUrl = $element.data('img-src');
    // Prevent any change to images names when   
    // they come with the modifier already
    if (imageUrl.indexOf('@2x') > -1){
      bigImage = '';
    }
    var urlWithModifier = imageUrl.substr(0, imageUrl.length - 4) + bigImage;
    var urlWithExtension = urlWithModifier + imageUrl.substr(imageUrl.length - 4, imageUrl.length);
    $element.attr("src", urlWithExtension);
  });
});
// End Block Image lazy load 