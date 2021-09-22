/*!
 * 360 degree Image Slider v1.0
 * http://gaurav.jassal.me/#360
 *
 * Copyright 2012, gaurav@jassal.me
 * Dual licensed under the MIT or GPL Version 3 licenses.
 *
 */
 
 
 
 

(function ($) {
  "use strict";

   /**
   * @class ThreeSixty
   * **The ThreeSixty slider class**.
   *
   * This as jQuery plugin to create 360 degree product image slider.
   * The plugin is full customizable with number of options provided. The plugin
   * have the power to display images in any angle 360 degrees. This feature can be
   * used successfully in many use cases e.g. on an e-commerce site to help customers
   * look products in detail, from any angle they desire.
   *
   * **Features**
   *
   * - Smooth Animation
   * - Plenty of option parameters for customization
   * - Api interaction
   * - Simple mouse interaction
   * - Custom behavior tweaking
   * - Support for touch devices
   * - Easy to integrate
   * - No flash
   *
   * Example code:
   *      var product1 = $('.product1').ThreeSixty({
   *        totalFrames: 72,
   *        endFrame: 72,
   *        currentFrame: 1,
   *        imgList: '.threesixty_images',
   *        progress: '.spinner',
   *        imagePath:'/assets/product1/',
   *        filePrefix: 'ipod-',
   *        ext: '.jpg',
   *        height: 265,
   *        width: 400,
   *        navigation: true
   *      });
   * **Note:** There are loads other options that you can override to customize
   * this plugin.

   * @extends jQuery
   * @singleton
   * @param {String} [el] jQuery selector string for the parent container
   * @param {Object} [options] An optional config object
   *
   * @return this
   */

  $.ThreeSixty = function (el, options) {
    // To avoid scope issues, use 'base' instead of 'this'
    // to reference this class from internal events and functions.
    var base = this, AppCongif, frames = [], frames2 = [] ;

    // Access to jQuery and DOM versions of element
    /**
     * @property {$el}
     * jQuery Dom node attached to the slider inherits all jQuery public functions.
     */

    base.$el = $(el);
    base.el = el;

    // Add a reverse reference to the DOM object
    base.$el.data("ThreeSixty", base);

    /**
     * @method init
     * The function extends the user options with default settings for the
     * slider and initilize the slider.
     * **Style Override example**
     *
     *      var product1 = $('.product1').ThreeSixty({
     *        totalFrames: 72,
     *        endFrame: 72,
     *        currentFrame: 1,
     *        imgList: '.threesixty_images',
     *        progress: '.spinner',
     *        imagePath:'/assets/product1/',
     *        filePrefix: 'ipod-',
     *        ext: '.jpg',
     *        height: 265,
     *        width: 400,
     *        navigation: true,
     *        styles: {
     *          border: 2px solide #b4b4b4,
     *          background: url(http://example.com/images/loader.gif) no-repeat
     *        }
     *      });
     * @return this
     */
    base.init = function () {
		
      AppCongif = $.extend({}, $.ThreeSixty.defaultOptions, options);
      if (!AppCongif.parallel) {
		  //get all img src path from li list
		  var src = [];
		//for (var i = 0; i < AppCongif.totalFrames; i++) {
      base.$el.find(AppCongif.imgList).children("li").each(function( i ) {
        src.push( $( this ).children( "img" ).attr( 'src' ) );
      });
      //alert(src.length);
    
		//src.push($(AppCongif.imgList+" li:eq("+i+") img").attr('src'));
		//}
		//alert(src[0]);
		//remove all list we need to rebuild the li list 
		base.$el.find(AppCongif.imgList).children('li').remove();
        base.loadImages(src);//pass all images path to next function 
      }
      base.initProgress();
    };

    /**
     * @method initProgress
     * @private
     * This function setup the progress indicator styles.
     * If you want to overreide the default styles of the progress indicator
     * you need to pass the css styles in the styles property in plugin options.
     *
     */
    base.initProgress = function() {
      base.$el.css({
        width: AppCongif.width + "px",
        height: AppCongif.height + "px"
      }).css(AppCongif.styles);

      base.$el.find(AppCongif.progress).css({
        marginTop: ((AppCongif.height / 2) - 15) + 'px'
      });

      base.$el.find(AppCongif.progress).fadeIn("slow");

      base.$el.find(AppCongif.imgList).hide();
    };

    /**
     * @method loadImages
     * @private
     * The function asynchronously loads images and inject into the slider.
     */
      base.loadImages = function(src) {
      var li, imageName, image, host;
      li = document.createElement('li');
	  imageName = src[AppCongif.loadedImages] + ((base.browser.isIE()) ? '?' + new Date().getTime() : '');
      image = $('<img>').attr('src', imageName).addClass('previous-image').css({height: AppCongif.height, width: AppCongif.width}).appendTo(li);
	  if(frames.length >=  AppCongif.totalFrames)
	  {
      frames2.push(image);
	  }
	  else
	  {
		  frames.push(image);
	  }
	  
    base.$el.find(AppCongif.imgList).append(li);
      //$(image).load(function () {
      $(image).on('load',function () {
        base.imageLoaded(src);
      });
    };
    /**
     * @method loadImages
     * @private
     * The function gets triggers once the image is loaded. We also update
     * the progress percentage in this function.
     */
    base.imageLoaded = function (src) {
      AppCongif.loadedImages += 1;
      base.$el.find(AppCongif.progress).children("span").text(Math.floor(AppCongif.loadedImages / AppCongif.totalFrames * 100) + '%');
      if (AppCongif.loadedImages >= AppCongif.totalFrames) {
        frames[0].removeClass("previous-image").addClass("current-image");
        base.$el.find(AppCongif.progress).fadeOut("slow", function () {
          $(this).hide();
          base.showImages();
          base.showNavigation();
        });
      } else {
        base.loadImages(src);
      }
    };

    /**
     * @method loadImages
     * @private
     * This function is called when all the images are loaded.
     * **The function does following operations**
     * - Removes background image placeholder
     * - Displays the 360 images
     * - Initilizes mouse intraction events
     */
    base.showImages = function () {
      base.$el.css("background-image", 'none');
      base.$el.find('.txtC').fadeIn();
      base.$el.find(AppCongif.imgList).fadeIn();
      AppCongif.ready = true;

      base.initEvents();
      base.refresh();
    };

    /**
     * @method showNavigation
     * Creates a navigation panel if navigation is set to true in the
     * settings.
     */
    base.showNavigation = function() {
      if (AppCongif.navigation && !AppCongif.navigation_init) {
        var nav_bar, next, previous, play_stop;

        nav_bar = $('<div/>').attr('class', 'nav_bar');

        next = $('<a/>').attr({
          'href': '#',
          'class': 'nav_bar_next'
        }).html('next');

        previous = $('<a/>').attr({
          'href': '#',
          'class': 'nav_bar_previous'
        }).html('previous');

        play_stop = $('<a/>').attr({
          'href': '#',
          'class': 'nav_bar_play'
        }).html('play');

        nav_bar.append(previous);
        nav_bar.append(play_stop);
        nav_bar.append(next);

        base.$el.prepend(nav_bar);

        next.bind('mousedown touchstart', base.next);
        previous.bind('mousedown touchstart', base.previous);
        play_stop.bind('mousedown touchstart', base.play_stop);
        AppCongif.navigation_init = true;
      }
    };

    /**
     * @method play_stop
     * @private
     * Function toggles the autoplay rotation of 360 slider
     * @param {Object} [event] jQuery events object.
     *
     */

    base.play_stop = function(event) {
      event.preventDefault();

      if (!AppCongif.autoplay) {
        AppCongif.autoplay = true;
        AppCongif.play = setInterval(base.moveToNextFrame, 40);
        $(event.currentTarget).removeClass('nav_bar_play').addClass('nav_bar_stop');
      } else {
        AppCongif.autoplay = false;
        $(event.currentTarget).removeClass('nav_bar_stop').addClass('nav_bar_play');
        clearInterval(AppCongif.play);
        AppCongif.play = null;
      }
    };

    /**
     * @method next
     * Using this function you can rotate 360 to next 5 frames.
     * @param {Object} [event] jQuery events object.
     *
     */

    base.next = function(event) {
      if (event) { event.preventDefault(); }
      AppCongif.endFrame -= 5;
      base.refresh();
    };

    /**
     * @method previous
     * Using this function you can rotate 360 to previous 5 frames.
     * @param {Object} [event] jQuery events object.
     *
     */
    base.previous = function(event) {
      if (event) { event.preventDefault(); }
      AppCongif.endFrame += 1;
      base.refresh();
    };

    /**
     * @method play
     * You are start the auto rotaion for the slider with this function.
     *
     */
    base.play = function() {
      if (!AppCongif.autoplay) {
        AppCongif.autoplay = true;
        AppCongif.play = setInterval(base.moveToNextFrame, 40);
      }
    };

    /**
     * @method stop
     * You can stop the auto rotation of the 360 slider with this function.
     *
     */

    base.stop = function() {
      if (AppCongif.autoplay) {
        AppCongif.autoplay = false;
        clearInterval(AppCongif.play);
        AppCongif.play = null;
      }
    };

    /**
     * @method endFrame
     * @private
     * Function animates to previous frame
     *
     */
    base.moveToNextFrame = function () {
      if (AppCongif.autoplayDirection === 1) {
        AppCongif.endFrame -= 1;
      } else {
        AppCongif.endFrame += 1;
      }
      base.refresh();
    };

    /**
     * @method initEvents
     * @private
     * Function initilizes all the mouse and touch events for 360 slider movement.
     *
     */
    base.initEvents = function () {
      base.$el.bind('mousedown touchstart touchmove touchend mousemove click', function (event) {

        event.preventDefault();

        if ((event.type === 'mousedown' && event.which === 1) || event.type === 'touchstart') {
          AppCongif.pointerStartPosX = base.getPointerEvent(event).pageX;
          AppCongif.dragging = true;
        } else if (event.type === 'touchmove') {
          base.trackPointer(event);
        } else if (event.type === 'touchend') {
          AppCongif.dragging = false;
        }
        if (event.type === 'click' && !base.browser.isIE) {
          base.$el.css("cursor", "url(/sites/all/modules/field_slide_show_j360/images/hand_closed.png), auto");
        }
      });

      $(document).bind('mouseup', function (event) {
        //event.preventDefault();
        AppCongif.dragging = false;
        $(this).css("cursor", "none");
      });

      $(document).bind('mousemove', function (event) {
        if (AppCongif.dragging) {
          event.preventDefault();
          if(!base.browser.isIE) {
            base.$el.css("cursor", "url(/sites/all/modules/field_slide_show_j360/images/hand_closed.png), auto");
          }
        } else {
          if(!base.browser.isIE) {
            base.$el.css("cursor", "url(/sites/all/modules/field_slide_show_j360/images/hand_open.png), auto");
          }
        }
        base.trackPointer(event);

      });
    };

    /**
     * @method getPointerEvent
     * @private
     * Function returns touch pointer events
     *
     * @params {Object} [event]
     */
    base.getPointerEvent = function (event) {
      return event.originalEvent.targetTouches ? event.originalEvent.targetTouches[0] : event;
    };

    /**
     * @method trackPointer
     * @private
     * Function calculates the distance between the start pointer and end pointer/
     *
     * @params {Object} [event]
     */
    base.trackPointer = function (event) {
      if (AppCongif.ready && AppCongif.dragging) {
        AppCongif.pointerEndPosX = base.getPointerEvent(event).pageX;
        if (AppCongif.monitorStartTime < new Date().getTime() - AppCongif.monitorInt) {
          AppCongif.pointerDistance = AppCongif.pointerEndPosX - AppCongif.pointerStartPosX;
          AppCongif.endFrame = AppCongif.currentFrame + Math.ceil((AppCongif.totalFrames - 1) * AppCongif.speedMultiplier * (AppCongif.pointerDistance / base.$el.width()));
          base.refresh();
          AppCongif.monitorStartTime = new Date().getTime();
          AppCongif.pointerStartPosX = base.getPointerEvent(event).pageX;
        }
      }
    };

    /**
     * @method refresh
     * @public
     * Function refeshes the timer and set interval for render cycle.
     *
     */

    base.refresh = function () {
      
      if (AppCongif.ticker === 0) {
        AppCongif.ticker = setInterval(base.render, Math.round(1000 / AppCongif.framerate));
      }
    };

     /**
     * @method refresh
     * @private
     * Function render the animation frames on the screen with easing effect.
     */

    base.render = function () {
      var frameEasing;
      if (AppCongif.currentFrame !== AppCongif.endFrame) {
        frameEasing = AppCongif.endFrame < AppCongif.currentFrame ? Math.floor((AppCongif.endFrame - AppCongif.currentFrame) * 0.1) : Math.ceil((AppCongif.endFrame - AppCongif.currentFrame) * 0.1);
        base.hidePreviousFrame();
        AppCongif.currentFrame += frameEasing;
        base.showCurrentFrame();
      } else {
        window.clearInterval(AppCongif.ticker);
        AppCongif.ticker = 0;
      }
    };

    /**
     * @method hidePreviousFrame
     * @private
     * Function hide the previous frame in the animation loop.
     */

    base.hidePreviousFrame = function () {
      frames[base.getNormalizedCurrentFrame()].removeClass("current-image").addClass("previous-image");
    };

    /**
     * @method showCurrentFrame
     * @private
     * Function shows the current frame in the animation loop.
     */
    base.showCurrentFrame = function () {
      frames[base.getNormalizedCurrentFrame()].removeClass("previous-image").addClass("current-image");
    };

    /**
     * @method getNormalizedCurrentFrame
     * @private
     * Function normalize and calculate the current frame once the user release the mouse and release touch event.
     */

    base.getNormalizedCurrentFrame = function () {
      var c = Math.ceil(AppCongif.currentFrame % AppCongif.totalFrames);
      if (c < 0) {
        c += (AppCongif.totalFrames - 1);
      }
      return c;
    };
		
    base.browser = {};

    /**
     * Function to detect if the brower is IE
     * @return {boolean}
     *
     * http://msdn.microsoft.com/en-gb/library/ms537509(v=vs.85).aspx
     */
    base.browser.isIE = function () {
      var rv = -1;
      if (navigator.appName === 'Microsoft Internet Explorer')
      {
        var ua = navigator.userAgent;
        var re  = new RegExp('MSIE ([0-9]{1,}[\\.0-9]{0,})');
        if (re.exec(ua) !== null){
          rv = parseFloat( RegExp.$1 );
        }
      }

      return rv !== -1;
    };
		
    base.init();
  };

  $.ThreeSixty.defaultOptions = {
    /**
     * @cfg {Boolean} dragging [dragging=false]
     * @private
     * Private propery contains a flags if users is in dragging mode.
     */
    dragging: false,
    /**
     * @cfg {Boolean} ready [ready=false]
     * @private
     * Private propery is set to true is all assets are loading and application is
     * ready to render 360 slider.
     */
    ready: false,
    /**
     * @cfg {Number} pointerStartPosX
     * @private
     * private property mouse pointer start x position when user starts dragging slider.
     */
    pointerStartPosX: 0,
    /**
     * @cfg {Number} pointerEndPosX
     * @private
     * private property mouse pointer start x position when user end dragging slider.
     */
    pointerEndPosX: 0,
    /**
     * @cfg {Number} pointerDistance
     * @private
     * private property contains the distance between the pointerStartPosX and pointerEndPosX
     */
    pointerDistance: 0,
    /**
     * @cfg {Number} monitorStartTime
     * @private
     * private property contains time user took in dragging mouse from pointerStartPosX and pointerEndPosX
     */
    monitorStartTime: 0,
    monitorInt: 10,
    /**
     * @cfg {Number} ticker
     * @private
     * Timer event that renders the 360
     */
    ticker: 0,
    /**
     * @cfg {Number} speedMultiplier
     * This property controls the sensitivity for the 360 slider
     */
    speedMultiplier: 7,
    /**
     * @cfg {Number} totalFrames
     * Set total number for frames used in the 360 rotation
     */
    totalFrames: 180,
    /**
     * @cfg {Number} currentFrame
     * Current frame of the slider.
     */
    currentFrame: 0,
    /**
     * @cfg {Array} endFrame
     * Private perperty contains information about the end frame when user slides the slider.
     */
    endFrame: 0,
    /**
     * @cfg {Number} loadedImages
     * Private property contains count of loaded images.
     */
    loadedImages: 0,
    /**
     * @cfg {Array} framerate
     * Set framerate for the slider animation
     */
    framerate: 60,
    /**
     * @cfg {String} domains
     * Set comma seprated list of all parallel domain from where 360 assets needs to be loaded.
     */
    domains: null,
    /**
     * @cfg {String} domain
     * Domain from where assets needs to be loaded. Use this propery is you want to load all assets from
     * single domain.
     */
    domain: '',
    /**
     * @cfg {Boolean} parallel
     * Set to true if you want to load assets from parallel domain. Default false
     */
    parallel: false,
    /**
     * @cfg {Number} queueAmount
     * Set number of calls to be made on parallel domains.
     */
    queueAmount: 8,
    /**
     * @cfg {Number} idle
     * Mouse Inactivite idle time in seconds. If set more than 0 will auto spine the slider
     */
    idle: 0,
    /**
     * @cfg {String} filePrefix
     * Prefix for the image file name before the numeric value.
     */
    filePrefix: '',
    /**
     * @cfg {String} ext [ext=.png]
     * Slider image extension.
     */
    ext: 'png',
    /**
     * @cfg {Object} height [300]
     * Height of the slider
     */
    height: 300,
    /**
     * @cfg {Number} width [300]
     * Width of the slider
     */
    width: 300,

    /**
     * @cfg {Object} styles
     * CSS Styles for the 360 slider
     */
    styles: {},
    /**
     * @cfg {Boolean} navigation[false]
     * State if navigation controls are visible or not.
     */
    navigation: false,
    /**
     * @cfg {Boolean} autoplay[false]
     * Autoplay the 360 animation
     */
    autoplay: false,
    /**
     * @cfg {number} autoplayDirection [1]
     * Direction for autoplay the 360 animation. 1 for right spin, and -1 for left spin.
     */
    autoplayDirection: 1,
	/**
     * @cfg {number} autoplayDirection [1]
     * Direction for autoplay the 360 animation. 1 for right spin, and -1 for left spin.
     */
	allimages: '',
  };

  $.fn.ThreeSixty = function (options) {
    return Object.create(new $.ThreeSixty(this, options));
  };

}(jQuery));

/**
 *
 * Object.create method for perform as a fallback if method not available.
 * The syntax just takes away the illusion that JavaScript uses Classical Inheritance.
 */
if (typeof Object.create !== 'function') {
  Object.create = function (o) {
		'use strict';
    function F() {}
    F.prototype = o;
    return new F();
  };
}
