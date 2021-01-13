// multiple tab
$(".content .tab_content").hide();
$(".content .tab_content:first-child").show();

$("ul li").click(function () {

  $("ul li").removeClass("active");
  $(this).addClass("active");

  var current_tab = $(this).attr("data-list");
  $(".content .tab_content").hide();
  $("." + current_tab).show();
})


// var ul = $("#tabs__ul");
// var li_tabs = $("#tabs__ul li");
// for (var i = 0; i < li_tabs.length; i++) {
//   li_tabs[i].addEventListener("click", function () {
//     var current = $("ul.active");
//     current[0].className = current[0].className.replace("active", "");
//     this.className += "active";

//     var current_tab_value = this.getAttribute("data-list");
//     document.getElementById(current_tab_value).style.display = "block";

//   });
// }
$(document).ready(function(){
    $('#tabs div').hide();
    $('#tabs div:first').show();
    $('#tabs ul li:first').addClass('active');
    $('#tabs ul li a').click(function(){ 
    $('#tabs ul li').removeClass('active');
    $(this).parent().addClass('active'); 
    var currentTab = $(this).attr('data-list'); 
    $('#tabs div').hide();
    $(currentTab).show();
    return false;
    });
    });
// swiper
var mySwiper = new Swiper('.swiper-container', {
  speed: 400,
  grabCursor: true,
  loop: true,
  // Optional parameters

  // // If we need pagination
  pagination: {
    el: '.swiper-pagination',
    dynamicBullets: true,
  },

  // Navigation arrows
  navigation: {
    nextEl: '.btn-ctr .btn-ctr--next',
    prevEl: '.btn-ctr .btn-ctr--pre',
  },
  // Disable preloading of all images
  preloadImages: true,
  // Enable lazy loading
  lazy: true,
  // // And if we need scrollbar
  // scrollbar: {
  //   el: '.swiper-scrollbar',
  // },
})

// date picker
$(".flatpickr").flatpickr({
	wrap: true
});

// photoswipe
var initPhotoSwipeFromDOM = function(gallerySelector) {
  var parseThumbnailElements = function(el) {
      var thumbElements = el.childNodes,
          numNodes = thumbElements.length,
          items = [],
          figureEl,
          linkEl,
          size,
          item;
      for(var i = 0; i < numNodes; i++) {
          figureEl = thumbElements[i]; // <figure> element
          if(figureEl.nodeType !== 1) {
              continue;
          }
          linkEl = figureEl.children[0]; // <a> element
          size = linkEl.getAttribute('data-size').split('x');
          item = {
              src: linkEl.getAttribute('href'),
              w: parseInt(size[0], 10),
              h: parseInt(size[1], 10)
          };
          if(figureEl.children.length > 1) {
              item.title = figureEl.children[1].innerHTML; 
          }
          if(linkEl.children.length > 0) {
              // <img> thumbnail element, retrieving thumbnail url
              item.msrc = linkEl.children[0].getAttribute('src');
          } 
          item.el = figureEl; // save link to element for getThumbBoundsFn
          items.push(item);
      }
      return items;
  };
  var closest = function closest(el, fn) {
      return el && ( fn(el) ? el : closest(el.parentNode, fn) );
  };
  var onThumbnailsClick = function(e) {
    
      e = e || window.event;
      e.preventDefault ? e.preventDefault() : e.returnValue = false;
      var eTarget = e.target || e.srcElement;
      var clickedListItem = closest(eTarget, function(el) {
          return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
      });
      if(!clickedListItem) {
          return;
      }
      var clickedGallery = clickedListItem.parentNode,
          childNodes = clickedListItem.parentNode.childNodes,
          numChildNodes = childNodes.length,
          nodeIndex = 0,
          index;
      for (var i = 0; i < numChildNodes; i++) {
          if(childNodes[i].nodeType !== 1) { 
              continue; 
          }
          if(childNodes[i] === clickedListItem) {
              index = nodeIndex;
              break;
          }
          nodeIndex++;
      }
      if(index >= 0) {
      
          openPhotoSwipe( index, clickedGallery );
      }
      return false;
  };
  var photoswipeParseHash = function() {
      var hash = window.location.hash.substring(1),
      params = {};
      if(hash.length < 5) {
          return params;
      }
      var vars = hash.split('&');
      for (var i = 0; i < vars.length; i++) {
          if(!vars[i]) {
              continue;
          }
          var pair = vars[i].split('=');  
          if(pair.length < 2) {
              continue;
          }           
          params[pair[0]] = pair[1];
      }
      if(params.gid) {
          params.gid = parseInt(params.gid, 10);
      }
      return params;
  };
  var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
      var pswpElement = document.querySelectorAll('.pswp')[0],
          gallery,
          options,
          items;
      items = parseThumbnailElements(galleryElement);
      options = {
          galleryUID: galleryElement.getAttribute('data-pswp-uid'),
          getThumbBoundsFn: function(index) {
              var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                  pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                  rect = thumbnail.getBoundingClientRect(); 

              return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
          },
          showAnimationDuration : 0,
          hideAnimationDuration : 0
      };
      if(fromURL) {
          if(options.galleryPIDs) {
              for(var j = 0; j < items.length; j++) {
                  if(items[j].pid == index) {
                      options.index = j;
                      break;
                  }
              }
          } else {
              options.index = parseInt(index, 10) - 1;
          }
      } else {
          options.index = parseInt(index, 10);
      }
      if( isNaN(options.index) ) {
          return;
      }
      if(disableAnimation) {
          options.showAnimationDuration = 0;
      }
      console.log(pswpElement)
      gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
      gallery.init();
  };
  var galleryElements = document.querySelectorAll( gallerySelector );
  for(var i = 0, l = galleryElements.length; i < l; i++) {
      galleryElements[i].setAttribute('data-pswp-uid', i+1);
      galleryElements[i].onclick = onThumbnailsClick;
  }
  var hashData = photoswipeParseHash();
  if(hashData.pid && hashData.gid) {
      openPhotoSwipe( hashData.pid ,  galleryElements[ hashData.gid - 1 ], true, true );
  }
};
//init photoswipe
$(window).on('load',function(){
  initPhotoSwipeFromDOM('.carousel-img');
})

// back to top
$('.back-to-top').click(function(){
    $('html, body').animate({scrollTop : 0},800);
    return false;
});
// menu bar
$(document).ready(function(){ 
    let menuHeight = $(".header__nav").offset().top
    function menuTop(){
        if ($(this).scrollTop() >= menuHeight) { 
            $('.header__nav').addClass("active"); 
        } else { 
            $('.header__nav').removeClass("active"); 
        } 
    };
    menuTop();
    $(window).scroll(menuTop);

});
// menu mobile
$(document).ready(function(){ 
    $(".hamburger").on("click", function(){
        $(".hamburger").toggleClass("active");
        $('.menu-left').toggleClass("active");
    })
})
// loading screen
$(window).on("load",function(){
    $(".loading-screen").fadeOut(1000);
  });
