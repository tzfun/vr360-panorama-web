(function($) {
	'use strict';

	// Create outer variables
	var wrapper, container, ajax, modal, content, info, prev, next, close, keybind, rsz, loadedContent = {};

	// Set default parameters
	var defaultSettings = {
		arrowKeys:     true,                // Left and right arrow keys for controls, Esc to close
		controls:      true,                // Display next / prev controls
		loop:          true,                // Loop back to the beginning
		maxWidth:      null,                // Maximum amount of pixels for width
		maxHeight:     null,                // Maximum amount of pixels for height
		maxScreen:     90,                  // Percentage of screen size (overrides maxWidth and maxHeight)
		updateRsz:     true,                // Update on window resize
		callback:      null,                // Callback function after every panel load
		lockScroll:    true,                // Prevent scrolling when pop-up is open
		contentType:   'image',             // Type of content to load,
		AJAXContainer: 'body > *',          // HTML element to laod into AJAX
	}; // End options


	var methods = {
		init : function(settings) {

			return this.click(function(e) {

				$(this).galpop('openBox',settings);

				e.preventDefault();


			}); // End click

		}, // End init
		openBox : function(settings,target,index) {
			// Override default options
			settings = $.extend({}, defaultSettings, settings);

			// bind variables
			wrapper.data({
				controls:      settings.controls,
				loop:          settings.loop,
				maxWidth:      settings.maxWidth,
				maxHeight:     settings.maxHeight,
				maxScreen:     settings.maxScreen,
				callback:      settings.callback,
				contentType:   settings.contentType,
			}); // end data

			var url           = target;
			var rel           = '';
			var group         = this;
			var AJAXContainer = ((this.data('galpop-container')) ? this.data('galpop-container') : settings.AJAXContainer);

			if (!index) {
				index = 0;
			}

			// Group items if is an array
			if( Object.prototype.toString.call( target ) === '[object Array]' ) {
				group = target;
				url   = group[index];
			}

			// If no target, use normal link
			if (!target) {
				url   = this.attr('href');
				rel   = this.data('galpop-group');
				group = $('[data-galpop-group="'+ rel +'"]');
				index = group.index(this);

				if (settings.arrowKeys) {
					$(document).on('keydown',keybind);
				}

				if (settings.updateRsz) {
					$(window).resize(rsz);
				}

				if (settings.lockScroll) {
					$('html').addClass('lock-scroll');
				}
			}

			wrapper.data({
				rel:           rel,
				group:         group,
				index:         index,
				status:        true,
				count:         group.length,
				AJAXContainer: AJAXContainer,
			});

			wrapper.fadeIn(500,'swing');

			// load the item
			this.galpop('preload',url);

			return this;
		}, // end open box
		closeBox : function() {

			wrapper.removeClass('complete').fadeOut(500,'swing',function() {
				content.empty();
				info.hide().empty();
				$(this).data('status',false);
				prev.hide();
				next.hide();
				container.removeAttr('style');
				wrapper.removeClass('loaded-ajax loaded-image loaded-iframe');

				// remove bound functions
				$(document).off('keydown',keybind);
				$(window).off('resize',rsz);
				$('html').removeClass('lock-scroll');
			});

		}, // end close box
		preload : function(url) {
			var contentType = wrapper.data('contentType');
			switch (contentType) {
				case 'AJAX':
					wrapper.addClass('loaded-ajax');
					this.galpop('loadAJAX',url);
					break;
				case 'iframe':
					wrapper.addClass('loaded-iframe');
					this.galpop('loadIframe',url);
					break;
				case 'image':
				default:
					wrapper.addClass('loaded-image');
					this.galpop('loadImage',url);
					break;
			}

			return this;
		}, // end preload
		loadImage : function(url) {
			var image = new Image();
			image.src = url;
			loadedContent.object    = image;
			loadedContent.resizable = true;
			image.onload = function() {
				// alert('good');
				wrapper.galpop('display');
			}; // end onload
			image.onerror = function() {
				// alert(url +' contains a broken image!');
				console.log(url +' contains a broken image!');
			}; // end onerror
			return this;
		}, // Load image
		loadIframe : function(url) {
			var iframe = $('<iframe src="'+ url +'" />');
			loadedContent.object    = iframe;
			loadedContent.resizable = false;

			wrapper.galpop('display');

			return this;
		}, // Load image
		loadAJAX : function(url) {
			var AJAXContainer = wrapper.data('AJAXContainer');
			loadedContent.resizable = false;
			$.ajax({
				url:url,
				type:'GET',
				dataType:'html',
				success: function(data){
					var jQueryFilter = $(data).filter(AJAXContainer);
					var jQueryFind   = $(data).find(AJAXContainer);
					if (jQueryFilter.length) {
						loadedContent.object = jQueryFilter;
						wrapper.galpop('display');
					} else if (jQueryFind.length) {
						loadedContent.object = jQueryFind;
						wrapper.galpop('display');
					} else {
						console.log('Element '+ AJAXContainer +' not found in DOM.');
					}
				},
				error: function (jqXHR, exception) {
					if (jqXHR.status === 0) {
						console.log('Not connect.\n Verify Network.');
					} else if (jqXHR.status == 404) {
						console.log('Requested page not found. [404]');
					} else if (jqXHR.status == 500) {
						console.log('Internal Server Error [500].');
					} else if (exception === 'parsererror') {
						console.log('Requested JSON parse failed.');
					} else if (exception === 'timeout') {
						console.log('Time out error.');
					} else if (exception === 'abort') {
						console.log('Ajax request aborted.');
					} else {
						console.log('Uncaught Error.\n' + jqXHR.responseText);
					}
				},
			});
			return this;
		}, // Load image
		resize : function() {
			var resizable    = loadedContent.resizable;
			var imageHeight  = loadedContent.object.naturalHeight;
			var imageWidth   = loadedContent.object.naturalWidth;
			var maxWidth     = wrapper.data('maxWidth');
			var maxHeight    = wrapper.data('maxHeight');
			var maxScreen    = wrapper.data('maxScreen');
			var screenHeight = $(window).height();
			var screenWidth  = $(window).width();
			var ratio        = 0;
			// var extraWidth   = container.outerWidth() - container.width();
			// var extraHeight  = container.outerHeight() - container.height();

			// set max width and height
			if (!maxWidth || maxWidth > screenWidth * maxScreen / 100) {
				maxWidth = screenWidth * maxScreen / 100;
			}
			if (!maxHeight || maxHeight > screenHeight * maxScreen / 100) {
				maxHeight = screenHeight * maxScreen / 100;
			}

			// Only resize locked aspect ratio content (images)
			if (resizable) {
				// Check if the current width is larger than the max
				if (imageWidth > maxWidth) {
					ratio       = maxWidth / imageWidth;
					imageHeight = imageHeight * ratio;
					imageWidth  = imageWidth * ratio;
				}

				// Check if current height is larger than max
				if (imageHeight > maxHeight) {
					ratio       = maxHeight / imageHeight;
					imageWidth  = imageWidth * ratio;
					imageHeight = imageHeight * ratio;
				}
			}

			container.css({
				height:     imageHeight,
				width:      imageWidth
			});

			return this;
		}, // End resize
		display : function() {
			this.galpop('resize');
			// wait for container to finish animations before displaying image
			setTimeout(function() {
				wrapper.addClass('complete');
				content.append(loadedContent.object).fadeIn(500,'swing',function() {
					wrapper.galpop('complete');
				});
			},500);

		}, // end display
		complete : function() {
			var controls = wrapper.data('controls');
			var callback = wrapper.data('callback');
			var index    = wrapper.data('index');
			var count    = wrapper.data('count');
			var loop     = wrapper.data('loop');

			wrapper.galpop('infoParse');

			// check if on first item and hide prev
			if (!controls || (index === 0 && !loop) || count <= 1) {
				prev.hide();
			} else {
				prev.show();
			}

			// check if on last item and hide next
			if (!controls || (index + 1 >= count && !loop) || count <= 1) {
				next.hide();
			} else {
				next.show();
			}

			// initiate callback function
			if ($.isFunction(callback)) {
				callback.call(this);
			}
		}, // end display
		moveItem : function(index) {
			// console.log('moveitem '+index);
			var group = wrapper.data('group');
			var next  = false;
			var url   = '';

			wrapper.removeClass('complete');
			info.fadeOut(500,'swing',function() {
				$(this).contents().remove();
			});
			content.fadeOut(500, 'swing', function() {
				// Remove current image
				$(this).empty();

				if (Object.prototype.toString.call( group ) === '[object Array]') {
					url = group[index];
				} else {
					// Get the next item to show
					next = group.eq(index);

					if (next.attr('href')) {
						url = next.attr('href');
					} else if (next.attr('src')) {
						url = next.attr('href');
					}
				}

				$.fn.galpop('preload',url);

				wrapper.data('index',index);
			});

			return this;
		}, // end move item
		next : function() {
			var index = wrapper.data('index');
			var loop  = wrapper.data('loop');
			// var group = wrapper.data('group');
			var count = wrapper.data('count');
			// alert(count + 5);
			// alert(index + 1 +' '+ count);
			// check if last item
			if (index + 1 < count) {
				// alert(index + 1 +' '+ count);
				// move to next item
				index++;
				wrapper.galpop('moveItem',index);
			} else if (loop) {
				// move to first item
				index = 0;
				wrapper.galpop('moveItem',index);
			}

			return this;
		}, // End next
		prev : function() {
			var index = wrapper.data('index');
			var loop  = wrapper.data('loop');
			// var group = wrapper.data('group');
			var count = wrapper.data('count');

			// check if first item
			if (index > 0) {
				index--;
				wrapper.galpop('moveItem',index);
			} else if (loop) {
				index = count - 1;
				wrapper.galpop('moveItem',index);
			}

			return this;
		}, // End prev
		infoParse : function() {
			var group = wrapper.data('group');

			if (group instanceof jQuery) {
				var index     = wrapper.data('index');
				var anchor    = group.eq(index);
				var title     = $.trim(anchor.attr('title'));
				var url       = $.trim(anchor.data('galpop-link'));
				var urlTitle  = $.trim(anchor.data('galpop-link-title'));
				var urlTarget = $.trim(anchor.data('galpop-link-target'));

				// clear info box
				info.html('');

				// new title
				if (title) {
					$('<p>'+ title +'</p>').appendTo(info);
				}

				// new link
				if (url) {
					if (!urlTitle) {
						urlTitle = url;
					}

					if (urlTarget) {
						urlTarget = 'target="'+ urlTarget +'"';
					}

					$('<p><a href="'+ url +'" '+ urlTarget +'>'+ urlTitle +'</a></p>').appendTo(info);
				}

				// show info box
				if (title || url) {
					info.fadeIn(500,'swing');
				}
			}

		}, // end info parse
		update : function() {
			var index = wrapper.data('index');
			wrapper.galpop('moveItem',index);
			return this;
		}, // end update
		destroy : function() {
			return this.off('click');
		} // End destroy
	}; // End method

	// Create the plugin name and defaults once
	var pluginName = 'galpop';

	$.fn[pluginName] = function(method) {

		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.'+ pluginName );
		}

	}; // End plugin

	$[pluginName] = {};
	$[pluginName].extend = function(name, method) {
		methods[name] = method;
	};


	$(document).ready(function() {
		wrapper   = $('<div id="galpop-wrapper" />').appendTo('body');
		container = $('<div id="galpop-container" />').appendTo(wrapper);
		prev      = $('<a href="#" id="galpop-prev" />').appendTo(container);
		next      = $('<a href="#" id="galpop-next" />').appendTo(container);
		ajax      = $('<div id="galpop-ajax" />').appendTo(container);
		modal     = $('<div id="galpop-modal" />').appendTo(container);
		content   = $('<div id="galpop-content" />').appendTo(modal);
		info      = $('<div id="galpop-info" />').appendTo(modal);
		close     = $('<a href="#" id="galpop-close" />').appendTo(modal);

		wrapper.click(function(e) {
			$(this).galpop('closeBox');

			e.preventDefault();
		});
		container.click(function(e) {
			e.stopPropagation();
		});
		prev.hide().click(function(e) {
			wrapper.galpop('prev');
			e.preventDefault();
		});
		next.hide().click(function(e) {
			wrapper.galpop('next');
			e.preventDefault();
		});
		close.click(function(e) {
			wrapper.galpop('closeBox');
			e.preventDefault();
		});
		info.on('click', 'a', function() {
			wrapper.galpop('closeBox');
		});
		keybind = function(e){
			var key  = e.which;
			var stop = false;
			switch (key) {
				case 27: // esc
					wrapper.galpop('closeBox');
					stop = true;
					break;
				case 37: // left arrow
					wrapper.galpop('prev');
					stop = true;
					break;
				case 39: // right arrow
					wrapper.galpop('next');
					stop = true;
					break;
			}
			if (stop) {
				e.preventDefault();
			}
		}; // end keybind
		rsz = function() {
			wrapper.galpop('resize');
		}; // end resize

	}); // end document ready

})(jQuery);
// (function($) {
// 	$.galpop.extend('samplemethod', function(prop, value) {
// 	  alert('extended sample method');
// 	});
// })(jQuery);
