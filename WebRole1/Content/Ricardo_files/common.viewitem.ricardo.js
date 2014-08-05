/*! ** Common ViewItem JS for ricardo.ch	V. 2.41 06.12.2013 10:55  **** */


/* ************************************************************************ INCLUDES ************************************************************************ */

/*
  Epic Image Zoom v1.1
  (c) 2011. Web factory Ltd
  http://www.webfactoryltd.com/
  Sold exclusively on CodeCanyon
**/

(function($) {
  $.fn.epicZoom = function(options) {
    // cache body DOM element
    var body_el = $('body');

    // let's try not to clutter the $.fn namespace
    var methods = {
      isInBounds: function(event, offset, size, padding) {
        if (event.pageX < (offset.left + padding.left) || event.pageX > (offset.left + size.width + padding.left) ||
            event.pageY < (offset.top + padding.top) || event.pageY > (offset.top + size.height + padding.top)) {
          return false;
        } else {
          return true;
        }
      }, // isInBounds
      isDebug: function() {
        if (options.debug && typeof console !== 'undefined') {
          return true;
        } else {
          return false;
        }
      } // isDebug
    };

    // default options
    var defaults = {
      'size'          : 150,
      'border'        : '1px solid white',
      'largeImage'    : '',
      'magnification' : 1.0,
      'hideCursor'    : true,
      'blankCursor'   : './js/blank.png',
      'newPosition'   : false,
      'debug'         : false
    };
    options = $.extend(defaults, options);

    // debug
    options.debug = Boolean(options.debug);
    if (methods.isDebug()) {
      console.warn('Epic Image Zoom debugging is enabled.');
    }

    // size
    options.size = parseInt(options.size, 10);

    // magnification
    options.magnification = parseFloat(options.magnification);

    // hideCursor
    options.hideCursor = Boolean(options.hideCursor);

    // largeImage
    options.largeImage = $.trim(options.largeImage);

    // blankCursor
    options.blankCursor = $.trim(options.blankCursor);
    
    // alternative math
    options.newPosition = Boolean(options.newPosition);

    if (methods.isDebug()) {
      console.log('EIZ; options: ', options);
    }

    // process images
    return this.each(function() {
      var img = $(this);

      // plugin only works on images
      if (!img.is('img')) {
        if (methods.isDebug()) {
          console.error('EIZ works only on img elements.');
        }
        return this;
      }

      var preloadImg = $('<img />');
      if (options.largeImage) {
        preloadImg.attr('src', options.largeImage);
      } else {
        preloadImg.attr('src', img.attr('src'));
      }

      // wait for image to load
      preloadImg.load(function() {
        if (preloadImg.hasInit) {
          return false;
        }
        preloadImg.hasInit = true;

      // global counter
      if (typeof body_el.data('epicZoom-nb') === 'undefined') {
         body_el.data('epicZoom-nb', 0);
      }
      body_el.data('epicZoom-nb', body_el.data('epicZoom-nb') + 1);
      var eiz_nb = body_el.data('epicZoom-nb');

      if (methods.isDebug()) {
        console.log('EIZ; #', eiz_nb);
      }

      img.wrap('<span id="eiz-' + eiz_nb + '" class="eiz-container"></span>');
      var container = $('#eiz-' + eiz_nb).css('margin', 0)
                                         .css('padding', 0)
                                         .css('border', 0);

      container.append('<span class="eiz-magnifier"></span>');
      var magnifier = $('.eiz-magnifier', container).css('position', 'absolute')
                                                    .css('margin', 0)
                                                    .css('padding', 0)
                                                    .css('border', options.border)
                                                    .css('-moz-box-shadow', '0 0 5px #777, 0 0 10px #aaa inset')
                                                    .css('-webkit-box-shadow', '0 0 5px #777')
                                                    .css('box-shadow', '0 0 5px #777, 0 0 10px #aaa inset')
                                                    .css('overflow', 'hidden')
                                                    .css('z-index', 20)
                                                    .css('width', options.size + 'px')
                                                    .css('height', options.size + 'px');
      magnifier.append('<div><img alt="" title="" /></div>');
      var magnifierImg2 = $('img', magnifier).css('margin', 0)
                                             .css('padding', 0)
                                             .css('border', 0);
      if (options.largeImage) {
        magnifierImg2.attr('src', options.largeImage);
      } else {
        magnifierImg2.attr('src', img.attr('src'));
      }

      if (options.hideCursor) {
        magnifierImg2.css('cursor', 'none')
                     .css('cursor', 'url(' + options.blankCursor + '),none !important;');
      }

      var magnifierImg = $('div', magnifier).css('position', 'absolute')
                                            .css('margin', 0)
                                            .css('padding', 0)
                                            .css('border', 0)
                                            .css('z-index', 1)
                                            .css('overflow', 'hidden');

      // calculate positions and sizes
      magnifierImg2.width(magnifierImg2.width() * options.magnification);
      var ratio = magnifierImg2.width() / img.width();
      var offset = { left: img.offset().left, top: img.offset().top };
      var size = { width: img.width(), height: img.height() };
      var padding = { top: parseInt(img.css('padding-top'), 10), right: parseInt(img.css('padding-right'), 10),
                      bottom: parseInt(img.css('padding-bottom'), 10), left: parseInt(img.css('padding-left'), 10)};
      magnifier.hide();

      // recalculate positions on window resize
      $(window).resize(function() {
        offset = { left: img.offset().left, top: img.offset().top };
        size = { width: img.width(), height: img.height() };

        if (methods.isDebug()) {
          console.log('EIZ #' + eiz_nb + ': window resized, vars recalculated');
        }
      });

      container.mousemove(function(event){
        if (!methods.isInBounds(event, offset, size, padding)) {
         if (!magnifier.is(':animated')) {
              if (methods.isDebug()) {
                console.log('EIZ #' + eiz_nb + ': out of bounds');
              }
              container.trigger('mouseleave');
            }
            return false;
        }

        if(magnifier.is(':not(:animated):hidden')){
          container.trigger('mouseenter');
        }

        // move the magnifier and image with cursor
        if (!options.newPosition) {
          magnifier.css('left', event.pageX - options.size/2);
          magnifier.css('top', event.pageY - options.size/2);
          magnifierImg.css('left', -1 * (event.pageX - offset.left - padding.left) * ratio + options.size/2);
          magnifierImg.css('top', -1 * (event.pageY - offset.top - padding.top) * ratio + options.size/2);
        } else {
          magnifier.css('left', event.pageX - options.size/2 - img.offset().left);
          magnifier.css('top', event.pageY - options.size/2 - img.offset().top);
          magnifierImg.css('left', -1 * (event.pageX - padding.left - offset.left) * ratio + options.size/2);
          magnifierImg.css('top', -1 * (event.pageY - padding.top - offset.top) * ratio + options.size/2);
        }
      }).mouseleave(function(){
          magnifier.stop(true, true).hide();
      }).mouseenter(function(event){
          if (methods.isDebug()) {
            console.log('EIZ #' + eiz_nb + ': mouse enter container');
          }
          if (!methods.isInBounds(event, offset, size, padding)) {
            return false;
          }
          magnifier.stop(true, true).show();
      });
    }); // load

      // if image is loaded force load function to exec
      if (preloadImg.complete || preloadImg.naturalWidth > 0) {
        preloadImg.trigger('load');
      }
    }); // each
  }; // fn.epicZoom
} (jQuery));

/**
* hoverIntent is similar to jQuery's built-in "hover" function except that
* instead of firing the onMouseOver event immediately, hoverIntent checks
* to see if the user's mouse has slowed down (beneath the sensitivity
* threshold) before firing the onMouseOver event.
* 
* hoverIntent r6 // 2011.02.26 // jQuery 1.5.1+
* <http://cherne.net/brian/resources/jquery.hoverIntent.html>
* 
* hoverIntent is currently available for use in all personal or commercial 
* projects under both MIT and GPL licenses. This means that you can choose 
* the license that best suits your project, and use it accordingly.
* 
* // basic usage (just like .hover) receives onMouseOver and onMouseOut functions
* $("ul li").hoverIntent( showNav , hideNav );
* 
* // advanced usage receives configuration object only
* $("ul li").hoverIntent({
*	sensitivity: 7, // number = sensitivity threshold (must be 1 or higher)
*	interval: 100,   // number = milliseconds of polling interval
*	over: showNav,  // function = onMouseOver callback (required)
*	timeout: 0,   // number = milliseconds delay before onMouseOut function call
*	out: hideNav    // function = onMouseOut callback (required)
* });
* 
* @param  f  onMouseOver function || An object with configuration options
* @param  g  onMouseOut function  || Nothing (use configuration options object)
* @author    Brian Cherne brian(at)cherne(dot)net
*/
(function($) {
	$.fn.hoverIntent = function(f,g) {
		// default configuration options
		var cfg = {
			sensitivity: 7,
			interval: 100,
			timeout: 0
		};
		// override configuration options with user supplied object
		cfg = $.extend(cfg, g ? { over: f, out: g } : f );

		// instantiate variables
		// cX, cY = current X and Y position of mouse, updated by mousemove event
		// pX, pY = previous X and Y position of mouse, set by mouseover and polling interval
		var cX, cY, pX, pY;

		// A private function for getting mouse position
		var track = function(ev) {
			cX = ev.pageX;
			cY = ev.pageY;
		};

		// A private function for comparing current and previous mouse position
		var compare = function(ev,ob) {
			ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
			// compare mouse positions to see if they've crossed the threshold
			if ( ( Math.abs(pX-cX) + Math.abs(pY-cY) ) < cfg.sensitivity ) {
				$(ob).unbind("mousemove",track);
				// set hoverIntent state to true (so mouseOut can be called)
				ob.hoverIntent_s = 1;
				return cfg.over.apply(ob,[ev]);
			} else {
				// set previous coordinates for next time
				pX = cX; pY = cY;
				// use self-calling timeout, guarantees intervals are spaced out properly (avoids JavaScript timer bugs)
				ob.hoverIntent_t = setTimeout( function(){compare(ev, ob);} , cfg.interval );
			}
		};

		// A private function for delaying the mouseOut function
		var delay = function(ev,ob) {
			ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
			ob.hoverIntent_s = 0;
			return cfg.out.apply(ob,[ev]);
		};

		// A private function for handling mouse 'hovering'
		var handleHover = function(e) {
			// copy objects to be passed into t (required for event object to be passed in IE)
			var ev = jQuery.extend({},e);
			var ob = this;

			// cancel hoverIntent timer if it exists
			if (ob.hoverIntent_t) { ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t); }

			// if e.type == "mouseenter"
			if (e.type == "mouseenter") {
				// set "previous" X and Y position based on initial entry point
				pX = ev.pageX; pY = ev.pageY;
				// update "current" X and Y position based on mousemove
				$(ob).bind("mousemove",track);
				// start polling interval (self-calling timeout) to compare mouse coordinates over time
				if (ob.hoverIntent_s != 1) { ob.hoverIntent_t = setTimeout( function(){compare(ev,ob);} , cfg.interval );}

			// else e.type == "mouseleave"
			} else {
				// unbind expensive mousemove event
				$(ob).unbind("mousemove",track);
				// if hoverIntent state is true, then call the mouseOut function after the specified delay
				if (ob.hoverIntent_s == 1) { ob.hoverIntent_t = setTimeout( function(){delay(ev,ob);} , cfg.timeout );}
			}
		};

		// bind the function to the two event listeners
		return this.bind('mouseenter',handleHover).bind('mouseleave',handleHover);
	};
})(jQuery);

  /*!
 * Thumbnail helper for fancyBox
 * version: 1.0.7 (Mon, 01 Oct 2012)
 * @requires fancyBox v2.0 or later
 *
 * Usage:
 *     $(".fancybox").fancybox({
 *         helpers : {
 *             thumbs: {
 *                 width  : 50,
 *                 height : 50
 *             }
 *         }
 *     });
 *
 */
(function ($) {
  //Shortcut for fancyBox object
  var F = $.fancybox;

  //Add helper object
  F.helpers.thumbs = {
    defaults : {
      width    : 50,       // thumbnail width
      height   : 50,       // thumbnail height
      position : 'bottom', // 'top' or 'bottom'
      source   : function ( item ) {  // function to obtain the URL of the thumbnail image
        var href;

        if (item.element) {
          href = $(item.element).find('img').attr('src');
        }

        if (!href && item.type === 'image' && item.href) {
          href = item.href;
        }

        return href;
      }
    },

    wrap  : null,
    list  : null,
    width : 0,

    init: function (opts, obj) {
      var that = this,
        list,
        thumbWidth  = opts.width,
        thumbHeight = opts.height,
        thumbSource = opts.source;

      //Build list structure
      list = '';

      for (var n = 0; n < obj.group.length; n++) {
        list += '<li><a style="width:' + thumbWidth + 'px;height:' + thumbHeight + 'px;" href="javascript:jQuery.fancybox.jumpto(' + n + ');"></a></li>';
      }

      this.wrap = $('<div id="fancybox-thumbs"></div>').addClass(opts.position).appendTo('body');
      this.list = $('<ul>' + list + '</ul>').appendTo(this.wrap);

      //Load each thumbnail
      $.each(obj.group, function (i) {
        var href = thumbSource( obj.group[ i ] );

        if (!href) {
          return;
        }

        $("<img />").load(function () {
          var width  = this.width,
            height = this.height,
            widthRatio, heightRatio, parent;

          if (!that.list || !width || !height) {
            return;
          }

          //Calculate thumbnail width/height and center it
          widthRatio  = width / thumbWidth;
          heightRatio = height / thumbHeight;

          parent = that.list.children().eq(i).find('a');

          if (widthRatio >= 1 && heightRatio >= 1) {
            if (widthRatio > heightRatio) {
              width  = Math.floor(width / heightRatio);
              height = thumbHeight;

            } else {
              width  = thumbWidth;
              height = Math.floor(height / widthRatio);
            }
          }

          $(this).css({
            width  : width,
            height : height,
            top    : Math.floor(thumbHeight / 2 - height / 2),
            left   : Math.floor(thumbWidth / 2 - width / 2)
          });

          parent.width(thumbWidth).height(thumbHeight);

          $(this).hide().appendTo(parent).fadeIn(300);

        }).attr('src', href);
      });

      //Set initial width
      this.width = this.list.children().eq(0).outerWidth(true);

      this.list.width(this.width * (obj.group.length + 1)).css('left', Math.floor($(window).width() * 0.5 - (obj.index * this.width + this.width * 0.5)));
    },

    beforeLoad: function (opts, obj) {
      //Remove self if gallery do not have at least two items
      if (obj.group.length < 2) {
        obj.helpers.thumbs = false;

        return;
      }

      //Increase bottom margin to give space for thumbs
      obj.margin[ opts.position === 'top' ? 0 : 2 ] += ((opts.height) + 15);
    },

    afterShow: function (opts, obj) {
      //Check if exists and create or update list
      if (this.list) {
        this.onUpdate(opts, obj);

      } else {
        this.init(opts, obj);
      }

      //Set active element
      this.list.children().removeClass('active').eq(obj.index).addClass('active');
    },

    //Center list
    onUpdate: function (opts, obj) {
      if (this.list) {
        this.list.stop(true).animate({
          'left': Math.floor($(window).width() * 0.5 - (obj.index * this.width + this.width * 0.5))
        }, 150);
      }
    },

    beforeClose: function () {
      if (this.wrap) {
        this.wrap.remove();
      }

      this.wrap  = null;
      this.list  = null;
      this.width = 0;
    }
  }

}(jQuery));

/* ************************************************************************ INCLUDES END ************************************************************************ */


/* ************************************************************************ PAGE LOAD ************************************************************************ */

$(document).ready(function () {
    // BS Styling Support
    // Add class to Buynow and Bid Buttons
    $('#it_btnBid').addClass('btn-warning');
    $('#it_btnBuyNow').addClass('btn-success');
    $('#it_btnBuyNow').prepend('<i class="icon-buynow icon-white"></i> ');

    // Zoom for the Picutre
    doZoomImage();

    // Tooltip for Bid Price
    if ($('#purchase #it_maxBid').length > 0) {
        var parentbox = $('#purchase');
        var biddingfield = $('#purchase #it_maxBid');
        var infofield = $('#purchase div.biddingInfo');
        var posleft = parentbox.offset().left;
        var postop = parentbox.offset().top;
        infofield.css("left", posleft);
        infofield.css("top", postop);
        biddingfield.focus(function () {
            $('div.biddingInfo').fadeIn("fast");
        });
        biddingfield.blur(function () {
            $('div.biddingInfo').fadeOut("fast");
        });
        $('#purchase #it_maxBid').focus(
	    function () {
	        this.select();
	    }
	    )
    }

    // Share on Twitter
    $('#sharetwitter').click(function () {
        doVirtualPageView('socialbookmarks_twitter');
        $.getJSON('http://api.bit.ly/shorten?version=2.0.1&login=ricardoch&apiKey=R_202bb05a51efd40081ec1efb32b4ff79&longUrl=' + encodeURIComponent(document.location) + '&format=json&callback=?',
	    function (data) {
	        $.each(data.results,
	        function (i, item) {
	            window.location = 'http://twitter.com/home/?status=' + encodeURIComponent(document.title) + ' ' + item.shortUrl;
	        });
	    });
    });
    // Share on Twitter END

    // Share on Facebook
    $('.fb_share_button').click(function () {
        doVirtualPageView('socialbookmarks_facebook');
        var fburl = 'http://www.facebook.com/sharer.php?u=' + encodeURIComponent(location.href) + '&t=' + encodeURIComponent(document.title);
        window.open(fburl, 'sharer', 'toolbar=0,status=0,width=626,height=436');
        return false;
    });
    // Share on Facebook END

    // Maximum Bid Info Link
    $('tr.it_autoBid td#it_date').live('click', function () {
        $(this).fancyHelp('http://help.qxlricardo.com/?c=2&link=maximalesgebot');
    });

    // Help Link for Stars
    (function () {
        var protocol = qxlVars.is_https ? 'https:' : 'http:';

        var reputationHelpPageURL = protocol + '//www.ricardo.ch/ueber-uns/de-ch/onlinehilfe.aspx#keyword=rq575a';
        if (qxlVars.is_french) {
            reputationHelpPageURL = protocol + '//www.fr.ricardo.ch/ueber-uns/fr-fr/aideenligne#keyword=rq575a';
        }
        $('.reputationIcon').fancybox({
            'href': reputationHelpPageURL,
            'type': 'iframe',
            'width': 980,
            'height': 600
        });
    })();

    // Get correct nipple pos
    var nippelpos = $('#details summary').outerHeight();
    $('#info div.nipple').css("top", nippelpos);
    // Get correct nipple pos END

    // Google Maps
    $("#it_location a").attr("href", "#googlemaps");
    $("#it_location a").attr("class", "fancybox.inline");
    $("#it_location a").fancybox({
        beforeLoad: loadGoogleMaps
    });

    // Tracking wanna bid
    $('input.btBuyNow, input.btBid').click(function () {
        //doVirtualPageView('/bids_placebid.html');
    });
    // Activity Map
    $('#it_btnBuyNow').click(function () {
        $.ajax({
            type: 'POST',
            url: 'http://www.ricardo.ch/ajax/themen/activity-map/insertbid.php',
            dataType: 'php',
            data: {
                articleid: $('#it_articleNr').text(),
                art: 'sold'
            }
        });
        return false;
    });

    // Tracking on page load
    //doVirtualPageView('/bids_viewitem.html');






    // Hide showcase when empty
    /**
    if($('ul#Showcase1').children().size() == 0 || $('ul#Showcase1 li:nth-child(2) span.SC_title').text() == 'none') {
    $('#showcase').hide();
    }**/

    // Hide highestbidder field when empty
    if ($('#it_highestBidder a').is(':empty')) {
        $('#it_highestBidder, .highestBidder_box').hide();
    } else {
        $('#it_highestBidder a').attr('href', '#tab_BidsHistory1');
        $('#it_highestBidder a').click(function () {
            $('#tab_BidsHistory1 a').click();
        });
    }

    //Link Ratings to Seller Page
    $('#it_rating').contents().filter(function () { return this.nodeType === 3; }).wrap('<a href="' + $('#it_sellerNick a').attr('href') + '" />');

    //Get Country Flag
    getCountry();

    /* AllInOneTab */
    if ($('#Tabs1 li.active').attr('id') != 'tab_ArticleDescription1') {
        $('#it_ctrl_Description').hide();
    }
    if ($('section#section_ArticleLog1').children().length == 2) {
        $('section#section_ArticleLog1').hide();
    }
    if ($('section#section_BidsHistory1').children().length == 2) {
        if (qxlVars.is_french) {
            $('section#section_BidsHistory1').find('h4').after('<p class="nobids">Aucune offre enregistrée jusqu’à présent</p>');
        } else {
            $('section#section_BidsHistory1').find('h4').after('<p class="nobids">Es liegen aktuell noch keine Gebote vor</p>');
        }
    }
    /* AllInOneTab END */

    // Trackings
    $('#it_linkObserver').click(function (event) {
        doTrack('itempage', 'link_observer', 'v1');
    });
    $('#bL_item2_Link').click(function (event) {
        doTrack('itempage', 'link_favorites', 'v1');
    });

    /* Google Translate ONLY FR */
    if (qxlVars.is_french) {
        $('#translate').click(function () {
            $.getScript('/contents/ch/scripts/libs/jquery/extensions/jquery.translate2.min.js', function () {
                $.translate.truncate = function (text, limit) {
                    var i, m1, m2, m3, m4, t, encoded = encodeURIComponent(text);

                    for (i = 0; i < 10; i++) {
                        try {
                            t = decodeURIComponent(encoded.substr(0, limit - i));
                        } catch (e) {
                            continue;
                        }
                        if (t) break;
                    }

                    return (!(m1 = null && /<(?![^<]*>)/.exec(t))) ? (//if no broken tag present
                        (!(m2 = null && />\s*$/.exec(t))) ? (//if doesn't end with '>'
                            (m3 = this._m3.exec(t)) ? (//if broken sentence present
                                (m4 = null && />(?![^>]*<)/.exec(t)) ? (
                                    m3.index > m4.index ? t.substring(0, m3.index + 1) : t.substring(0, m4.index + 1)
                                ) : t.substring(0, m3.index + 1)) : t) : t) : t.substring(0, m1.index);

                };

                try {
                    $.translate.load('AIzaSyBh_VVqvkczal59udw0kIGkL7G6AotcYRw', "2");
                }
                catch (err) {
                }
                $('#it_ArticleDescription').translate('de', 'fr', function () {
                    $('#ArticleDescription1 h2').after('<div id="translate_msg">Veuillez prendre note que la description a été traduite avec un traducteur automatique, il est donc possible que le sens du contenu diffère du texte original. ricardo.ch n\'assume aucune responsabilité pour les traductions erronées. <a href="#" id="reloadpage">Retour à la description originale.</a></div>');
                    $('#translate_msg').show();
                    $('#translate').hide();
                    $('#reloadpage').click(function () {
                        window.location.reload();
                    });
                    //doTrack('frtranslate/ricardo', 'frtranslate/ricardo-click');
                });
            });
        });
    }

});
/* ************************************************************************ PAGE LOAD END ************************************************************************ */


/* ************************************************************************ METHODES ************************************************************************ */

// google Maps
function loadGoogleMaps() {
  var s = document.createElement("script");
  s.type = "text/javascript";
  s.src  = "http://maps.google.com/maps/api/js?v=3&sensor=true&callback=gmap_draw";
  window.gmap_draw = function() {
      $.getScript('/contents/ch/scripts/libs/jquery/extensions/jquery.gomap.min.js', function() {
          var address = $("#it_location a").html().replace(/<br\s*[\/]?>/gi, " ");
          if (qxlVars.is_french) {
              var mapsLang1 = 'Le vendeur habite dans ces alentours.<br> ';
              var mapsLang2 = 'Route vers cette r&eacute;gion';
          } else {
              var mapsLang1 = '<span style="font-size:10px;color:grey">Markierung auf Karte ist ein N&auml;herungswert</span><br>In dieser Ortschaft wohnt der Verk&auml;ufer.<br> ';
              var mapsLang2 = 'Route nach hierhin';
          }
          $("#googlemaps").goMap({
              markers: [{
                  address: address,
                  html: {
                      content: '<div style="width:240px;line-height:1.6em;text-align:left;font-size:12px">' + mapsLang1 + '<a href="http://maps.google.com/maps?saddr=&daddr=' + address + '" target ="_blank">' + mapsLang2 + '</a>',
                      popup: true
                  }
              }],
              maptype: 'ROADMAP',
              zoom: 14
          });
      });
  };
  $("head").append(s);
}
// google Maps END

// Help Function
$.fn.fancyHelp = function(link) {
    return $(this).fancybox({
        'href': link,
        'type': 'iframe',
        'width': 800,
        'height': 450
    });
};

// Change Country Flag
function getCountry() {
	var indexCountry = $('#it_location a').text().indexOf(', ') + 2;
	var country = $('#it_location a').text().substring(indexCountry);
	if (country != '') {
		$.get('/imgweb/2/V4/special/flags/' + country + '.gif',{},
	  function(msg,status){  
	      if (status == "success")
	      {
					$('#it_location a').html($('#it_location a').text().substring(0, indexCountry - 2));
					$('#it_location a').append('<img />');
		      $('#it_location a img').attr('src', '/imgweb/2/V4/special/flags/' + country + '.gif');
					$('#it_location a').attr('title', country);
	      }
	  });
	}
}

// Debug Function
function trace(s) {
  try { console.log(s) } catch (e) {  }
};

// google Analytics Event Tracking
function gaTracking(gaid) {
    try {
		trace(gaid);
		doVirtualPageView(gaid);
    }
    catch(err) {
        tracelog(err);
    }
}
  // Save Last Auctions
$(document).ready(function () {
     /*****************************************************
     * Save Cookie Information V2.0 with Category Root
     * *************************************************** 
     */
    /*
     * This function create a Cookie for the Last Viewed Article Plugin
     * You need the qV Object
     * You need the tracelog Function (It's only for debuging)
     * You need cookies Helper http://code.google.com/p/cookies/wiki/Documentation
     */
    /*
    cleared Object for Visitedarticle
    aid = Article ID
    cat = Category Tree [Root Cat. ID, Child ID, Child ID, Final ID]
    cid = Condition ID (0 = used, 1 = new)
    tid = Type ID (0 = auction, 1 = buynow, 2 = mixed)
    */
    var ricHistoryVersion = '1.01';
   
    visitedarticle = function (aid, cat, cid, tid)
    {
    this.aid = aid;
    this.cat = cat;
    this.cid = cid;
    this.tid = tid;
    }
    
    /*
    Object for lastVisitedArticle
    gives a Visitedarticle with the current situation back
    */
    lastVisitedArticle = function (){
 
        
    };

    function lastVisitedArticle_Init()
    {
        // article ID

        lastVisitedArticle.prototype = new visitedarticle(0 ,qxlInfo.get_CategorieTree, 0 ,0);  
        lastVisitedArticle.prototype.get = function() {
            return this;
        }            
        lastVisitedArticle.prototype.aid = ($('#it_articleNr').text() > 0? $('#it_articleNr').text():""); // Grap of the article ID
        if (lastVisitedArticle.prototype.aid == "") // if the Grap emtpy .... 
        {
            if (qV.href.match(/an(\d+)/) != null)
            {
                lastVisitedArticle.prototype.aid = qV.href.match(/an(\d+)/)[1]; // ... check the url for the Aricel ID                
            }else{
                if (qV.href.match('articlenr=([0-9]*)') != null)
                {
                    lastVisitedArticle.prototype.aid = qV.href.match('articlenr=([0-9]*)')[1];
                }else{
                    lastVisitedArticle.prototype.aid = "";
                }
                
            }
        }else{
            return false; // give a wrong object back
        }
        
        if (lastVisitedArticle.prototype.aid == "")
        {
            return false;
        } else {
            // Conditions
            var conditions= new Object();
            conditions.news = ['Neu','Fabrikneu','Fabrikneu und ungeöffnet','Neuf',"Neuf et encore dans l'emballage"];
            conditions.used = ['Gebraucht','Neuwertig','Gebraucht','Antik','Defekt',"D'occasion",'Comme neuf','Utilisé - Occasion','Collection - Antiquité','Endommagé'];
            lastVisitedArticle.prototype.cid  = ($.inArray($('#it_condition').text(),conditions.news)>-1?1:0);
            
            // Type ID
            if ($('#it_buynowprice').val() > 0 && parseInt($('#it_maxBid').val()) >0)
            {
                lastVisitedArticle.prototype.tid = 2; // mixed type
            } else if ($('#it_buynowprice').val() > 0 ) {
                lastVisitedArticle.prototype.tid = 1; // buy now
            } else {
                lastVisitedArticle.prototype.tid = 0; // auction
            }
        }
    
    }
    lastVisitedArticle_Init();
    
    /*
    Object for LastActionArticle
    gives a Actionarticle with the current situation back
    fid = Action/Function ID(0=bid,1=bought)
    
    !!! TODO Insert the Call for Buy or Bid
     
    */
    lastActionArticle = function(fid)
    {
        this.prototype.fid= fid;
    }
    function lastActionArticle_Init(){
        lastActionArticle.prototype = lastVisitedArticle.prototype;    
    }
    lastActionArticle_Init();
    
    function writeLastViewedArticleCookie()
    {
    	try {
	        var maxArticleSave = 15; // Max Articles to Save
	        var cookieLiveTime = 2880;
	        var ricHistory = $.cookies.get('ricHistory'); // Get the Cookie
	        var cookiedomain = qV.host.replace('www.',''); // Create the domain Name
	        cookiedomain = cookiedomain.replace('auto.',''); // Create the domain Name
	        
	        var newOptions = {
	            hoursToLive: cookieLiveTime,
	            domain: cookiedomain
	        } // Options        
	        //tracelog(ricHistory); // Tracelog it's only for debuging and you needs the Tracelog Function for this Testing.
	        
	        
	        if (ricHistory === null) { // If the my LastArticles is null create a empty Object
	
	            ricHistory = {};
	            ricHistory.lastVisited = new Array();
	            ricHistory.lastActions = new Array();
	            ricHistory.Version = ricHistoryVersion;
	            
	            var t = new lastVisitedArticle();
	            if (t.aid)
	            {
	                ricHistory.lastVisited.unshift(Object.getPrototypeOf(t));
	            }
	            
	        }else{
	
	            
	            tracelog(ricHistory);            
	            /* Clear old Versions of the Cookie*/
	            if (ricHistory.Version == undefined)
	            { 
	
	                $.cookies.del('ricHistory', {path: '/', domain: cookiedomain});       
	                ricHistory = {};
	                ricHistory.lastVisited = new Array();
	                ricHistory.lastActions = new Array();
	                ricHistory.Version = ricHistoryVersion;
	                var t = new lastVisitedArticle();
	                if (t.aid)
	                {
	                    ricHistory.lastVisited.unshift(Object.getPrototypeOf(t));
	                }
	            
	            }         
	               
	            ricActVisit = new lastVisitedArticle();
	
	            var y = 0; // For Counter because the i Can not modified
	            for (var i in ricHistory.lastVisited)
	            {
	                if (ricHistory.lastVisited[y].aid == ricActVisit.aid)
	                {
	                    ricHistory.lastVisited.splice(y,1);
	                    y--;
	                }
	                y++;
	        
	            }
	            // Delete more then MaxSize
	            for (var i in ricHistory.lastVisited)
	            {
	
	                if (i >= maxArticleSave)
	                {
	                    ricHistory.lastVisited.splice(i,1);
	                }
	            }
	            if (ricActVisit.aid > 0)
	            {
	
	                 ricHistory.lastVisited.unshift(Object.getPrototypeOf(ricActVisit));
	            }
	            
	         //   tracelog(ricHistory);
	        }
	       
	        
	        // tracelog(myLastArticles);
	       // $('#ArticleDescription1').html(JSON.stringify(ricHistory));
	        $.cookies.set('ricHistory', ricHistory, newOptions); // Save the Cookie
	       //tracelog(ricHistory); // Tracelog it's only for debuging and you needs the Tracelog Function for this Testing.
		}
		catch(er)
		{
			
		}
    }
    
    
    lastActionArticleStart = function (fid)
    {
	    try{
	        var maxArticleSave = 15; // Max Articles to Save
	        var cookieLiveTime = 2880;
	        var ricHistory = $.cookies.get('ricHistory'); // Get the Cookie
	        var cookiedomain = qV.host.replace('www.',''); // Create the domain Name
	        cookiedomain = cookiedomain.replace('auto.',''); // Create the domain Name
	        //tracelog(ricHistory); // Tracelog it's only for debuging and you needs the Tracelog Function for this Testing.
	        
	        if (ricHistory === null) { // If the my LastArticles is null create a empty Object
	            ricHistory = {};
	            ricHistory.lastVisited = new Array();
	            ricHistory.lastActions = new Array();
	            ricHistory.Version = ricHistoryVersion;
	            // !TODO object
	            if (new lastActionArticle(fid).aid > 0)
	            {
	                ricHistory.lastActions.unshift(Object.getPrototypeOf(new lastActionArticle(fid)));
	            }
	        }else{
	            
	            
	            /* Clear old Versions of the Cookie*/
	            if (ricHistory.Version == undefined)
	            { 
	                $.cookies.del('ricHistory', {path: '/', domain: cookiedomain});       
	                ricHistory = {};
	                ricHistory.lastVisited = new Array();
	                ricHistory.lastActions = new Array();
	                ricHistory.Version = ricHistoryVersion;
	                if (new lastVisitedArticle().aid)
	                {
	                    ricHistory.lastVisited.unshift(Object.getPrototypeOf(new lastActionArticle()));
	                } 
	            }                
	            
	            ricActVisit = new lastActionArticle(fid);
	        
	            var y = 0; // For Counter because the i Can not modified
	            for (var i in ricHistory.lastAction)
	            {
	                if (ricHistory.lastAction[y].aid == ricActVisit.aid)
	                {
	                    ricHistory.lastAction.splice(y,1);
	                    y--;
	                }
	                y++;
	        
	            }
	            // Delete more then MaxSize
	            for (var i in ricHistory.lastAction)
	            {
	                if (i >= maxArticleSave)
	                {
	                    ricHistory.lastAction.splice(i,1);
	                }
	            }
	            if (ricActVisit.aid > 0)
	            {
	                ricHistory.lastAction.unshift(Object.getPrototypeOf(ricActVisit));
	            }
	            
	        }
	        
	        var cookiedomain = qV.host.replace('www.',''); // Create the domain Name
	        cookiedomain = cookiedomain.replace('auto.',''); // Create the domain Name
	        
	        var newOptions = {
	            hoursToLive: cookieLiveTime,
	            domain: cookiedomain
	        } // Options
	        
	        // tracelog(myLastArticles);
	        $.cookies.set('ricHistory', JSON.stringify(ricHistory), newOptions); // Save the Cookie
	        //tracelog(ricHistory); // Tracelog it's only for debuging and you needs the Tracelog Function for this Testing.
		}
		catch(er)
		{
			
		}
    }
    
    
    $('#uxButton').live('click',function(){
        writeLastActionArticleCookie($('#uxBuyType').val());
        return true;
    });
    writeLastViewedArticleCookie();   

    /*****************************************************
     *  END Save Cookie Information
     * *************************************************** 
     */

    moveReactivationLink();
    
});






function moveReactivationLink()
{
    try {
      // 	var tmp = $('#ReactivationLink1').html();
      //	$('#ReactivationLink1').remove();  
      //	$('#closed_msg').append(tmp);
    }
    catch (er) {
    	trace(er);
    }	
}


function gaAdWords() {
	$('body').append('<img width="1" height="1" src="http://www.googleadservices.com/pagead/conversion/1072514009/?label=22deCNH3RRDZh7X_Aw&amp;guid=ON&amp;script=0" />');
	$('body').append('<img height="1" width="1" src="http://www.googleadservices.com/pagead/conversion/1032269129/?label=0E3-CLfTxgEQydqc7AM&amp;guid=ON&amp;script=0" />');
}
function evTracking(buyID) {
	$('body').append('<img width="1" height="1" src="http://pixel2313.everesttech.net/2313/p?ev_transid='+buyID+'&amp;ev_bid=1" />');
}
function tdTracking(buyID, orderValue, tdChecksum) {
	var tduid = $.cookies.get('TRADEDOUBLER');
	$('body').append('<img width="1" height="1" src="https://tbs.tradedoubler.com/report?organization=1375038&amp;event=165396&amp;orderNumber='+buyID+'&amp;orderValue='+orderValue+'&amp;currency=CHF&amp;checksum='+tdChecksum+'&amp;tduid='+tduid+'" />');
}

/*Zoom Actions*/
    
function doZoomImage()
{
    
    var deviceAgent = navigator.userAgent.toLowerCase();
    var $iOS = deviceAgent.match(/(iphone|ipod|ipad)/);

    if ($iOS) {
    
    } else {
        if ($('#it_bigPic').attr('src').indexOf('noimg_big.gif') >-1){      
            // Nothing to do...  
        }else{
            tracelog('version 3.03');
            
            $('#it_bigPic').removeAttr('alt');
            $('#it_bigPicLink').removeAttr('title');
            if ($('.eiz-magnifier').attr('class') == undefined)
            {
                
            }else{            
                // IF a other loupe is exist delete everthing.
                var tmpZomm = $('#it_bigPic');
                $('#it_bigPicLink').prepend(tmpZomm);                      
                $('.eiz-container').remove();
            }
			$('#it_bigPic').epicZoom({ largeImage: $('#it_bigPicLink').attr('href') , magnification: 1.5 });
            $('#it_bigPicLink').click(function() {
                $('#it_picList li a[href="' + $(this).attr('href').replace("450.", "Big.").replace("_450/", "_Big/") + '"]').click();
            });   			               
        }
    }    
}   

/* GALLERY Actions */
function changeImage() {
	$('#it_bigPic').attr('src', $(this).attr('href').replace("Big.", "450.").replace("_Big/", "_450/"));
	$('#it_bigPicLink').attr('href', $(this).attr('href'));
	doZoomImage();
}

function doNothing() {
	return false;
}


function GTMViewItempage()
{

	var sellerid = 0;
	var regex = /IDU=([^&]+)/i;
	try{
		
		if ($('#it_sellerNick a').attr('href').match(regex)!==null)
		{
			sellerid = $('#it_sellerNick a').attr('href').match(regex)[1];	
		}else{ 
			if($("#it_rating a").length >0 ){		
				if($('#it_rating a').attr('href').match(regex)!==null){
					sellerid = $('#it_rating a').attr('href').match(regex)[1];	
				}
			}
		}
	}
	catch (er)
	{
		
	}
	

	

	dataLayer.push(
				{ 	'pageName' : 'detail_page_' + qxlInfo.get_CategorieNumber,
	              	'event': 'loading', 
					'category1' : ( typeof qxlInfo != "undefined" && typeof qxlInfo.get_CategorieTree != "undefined" && $.isArray(qxlInfo.get_CategorieTree) && qxlInfo.get_CategorieTree[0] ? qxlInfo.get_CategorieTree[0] : '') ,
				  	'category2' :( typeof qxlInfo != "undefined" && typeof qxlInfo.get_CategorieTree != "undefined" && $.isArray(qxlInfo.get_CategorieTree) && qxlInfo.get_CategorieTree[1] ? qxlInfo.get_CategorieTree[1] : '') ,
				  	'category3' :( typeof qxlInfo != "undefined" && typeof qxlInfo.get_CategorieTree != "undefined" && $.isArray(qxlInfo.get_CategorieTree) && qxlInfo.get_CategorieTree[2] ? qxlInfo.get_CategorieTree[2] : '') ,
				  	'category4' :( typeof qxlInfo != "undefined" && typeof qxlInfo.get_CategorieTree != "undefined" && $.isArray(qxlInfo.get_CategorieTree) && qxlInfo.get_CategorieTree[3] ? qxlInfo.get_CategorieTree[3] : '') ,
				  	'category5' :( typeof qxlInfo != "undefined" && typeof qxlInfo.get_CategorieTree != "undefined" && $.isArray(qxlInfo.get_CategorieTree) && qxlInfo.get_CategorieTree[4] ? qxlInfo.get_CategorieTree[4] : '') ,
				  	'template': 'detail_page',
				  	'language' : (qxlVars.is_french?2:1),
				  	'first' : (parseInt($('#it_pageViews').text())==1?'1':'0'),
				  	'sellerId' : sellerid,
				  	'ArticleId' : qxlInfo.get_ArticleID
				});		

}

function BidProductsQuantity(){
  if ($('#it_btnBid').length == 1 && $('#it_qty_box').length == 1){
    var cloneBidQuan = $('#it_qty_box').clone();
    var cloneBidQuanWrap = cloneBidQuan.wrap('<div></div>')
    $('fieldset#it_qty_box').remove();
    $('#it_bidMinValue').after(cloneBidQuanWrap);
  }
}


/*function priceOfferFix(){
 if($('input.btmakeOffer.button.btn').length>0){

    tracelog('is PriceOfferPage');
    var bidPriceVal = $('input#it_maxBid').val();
    var priceOfferVal = $('input.offerInp').val();
    var shippingCosts = $('#tp_bidShippingCost').text().replace('CHF','');
    var totalPrice = shippingCosts*1 + 1*priceOfferVal;
    var totalPriceRound = totalPrice.toFixed(2);
    $('#tp_currentBidTotal').text('CHF' + bidPriceVal);
    $('#tp_autoBidTotal').text('CHF ' + priceOfferVal);
    $('#tp_totalPrice').text('CHF ' + totalPriceRound);
    
    $('.btmakeOffer').on('click', function(){
      var bidPriceVal = $('input#it_maxBid').val();
      var priceOfferVal = $('input.offerInp').val();
      var shippingCosts = $('#tp_bidShippingCost').text().replace('CHF','');
      var totalPrice = shippingCosts*1 + 1*priceOfferVal;
      var totalPriceRound = totalPrice.toFixed(2);
      $('#tp_currentBidTotal').text('CHF' + bidPriceVal);
      $('#tp_autoBidTotal').text('CHF ' + priceOfferVal);
      $('#tp_totalPrice').text('CHF ' + totalPriceRound);
    });
  }else{
    tracelog('not PriceOfferPage')}
}*/



$(document).ready(function() {
	
	// Remove standard behaviour
	$('#it_bigPic, #it_picList li img').unbind('click');
	
	// Create Links for all the images
	$('#it_picList li img').wrap(function() {
	    return '<a class="fancybox-thumb" rel="fancybox-thumb" href="' + $(this).attr('src').replace("prem.", "Big.").replace("_prem/", "_Big/") + '" />';
	});
	GTMViewItempage();
	// Hover Intent for Item Page
	var config = {    
	     over: changeImage, // function = onMouseOver callback (REQUIRED)    
	     timeout: 300, // number = milliseconds delay before onMouseOut    
	     out: doNothing // function = onMouseOut callback (REQUIRED)    
	};
	$(".fancybox-thumb").hoverIntent(config);
	
	// Add FancyBox action
	$(".fancybox-thumb").fancybox({
	    loop : true,
			prevEffect	: 'fade',
			nextEffect	: 'fade',
			helpers	: {
						overlay	: {
							opacity : 0.8,
							css : {
								'background-color' : '#000'
							}
						},
						thumbs	: {
							width		: 60,
							height	: 60
						}
					}
	});
	$('#it_bigPic').click(function() {
	    $('#it_picList li a[href="' + $(this).attr('src').replace("450.", "Big.").replace("_450/", "_Big/") + '"]').click();
	});

  BidProductsQuantity();
  //priceOfferFix();
});

/* GALLERY Actions END */


/* ************************************************************************ METHODES END ************************************************************************ */
