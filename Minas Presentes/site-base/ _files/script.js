( function( $ ) {

$( document ).ready(function() {
$('.nav-container').prepend('<div id="indicatorContainer"><div id="pIndicator"><div id="cIndicator"></div></div></div>');

    var activeElement = $('.nav-container>ul>li:first');

    $('.nav-container>ul>li').each(function() {
        if ($(this).hasClass('active')) {
            activeElement = $(this);
        }
    });

  var posLeft = activeElement.position();
  var elementWidth = activeElement.width();
  posLeft = posLeft + elementWidth/2 -6;

  if (activeElement.hasClass('has-sub')) {
    posLeft -= 6;
  }

  $('.nav-container #pIndicator').css('left', posLeft);
  var element, leftPos, indicator = $('.nav-container pIndicator');

  $(".nav-container>ul>li").hover(function() {
        element = $(this);
        var w = element.width();

        if ($(this).hasClass('has-sub')){
          leftPos = element.position().left + w/2 - 12;
        }

        else {
          leftPos = element.position().left + w/2 - 6;
        }

        $('.nav-container #pIndicator').css('left', leftPos);
    }

    , function() {
      $('.nav-container #pIndicator').css('left', posLeft);
    });

  $('.nav-container>ul').prepend('<li id="nav-button"><a> </a></li>');
  $( "#nav-button" ).click(function(){

        if ($(this).parent().hasClass('open')) {
          $(this).parent().removeClass('open');
        }

        else {
          $(this).parent().addClass('open');
        }

      });
});
} )( jQuery );

/*Código para menu celular*/

( function( $ ){

    $('#nav').click( function(event){
        event.stopPropagation();
        $('.level-top').toggle();
    });

    $(document).click( function(){
        $('.level-top').hide();
    });

});

( function( $ ){

  $("#image1").elevateZoom({
    zoomType: "inner", 
    cursor: "crosshair" 
  });
  
});

jQuery.noConflict();

jQuery.noConflict();

