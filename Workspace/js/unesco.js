var UNESCO = {};
(function() {

	var lock = false;

	var max_width = 1920;

	var resized_images_to_load = 0;

	var stop_loading_fade = false;
	
	var reconstructions = {};
	
	var reconstructions_loaded = 0;

	this.init = function() {

		var ns = this;

		this.resize();

		$("body").css('background-image', 'url(../webgl/data/textures/background.png)');	
		$("body").fadeIn('fast');

		//this.buildBrowse();

		//this.showBrowse();

		//ns.topStatusBar();

		//$(".UNESCO#slide-5").show();

		var slider = $(".UNESCO .items-inner");
		var item_height = 250;

		$(".UNESCO .arrow.up").click(function(e) {
			e.preventDefault();

			var top = parseInt(slider.css('top'), 10);

			if (!ns.lock && top < 0) {

				ns.lock = true;

				slider.animate({
					top : "+=" + item_height,
				}, 1000, function() {
					
					ns.lock = false;
				});

			}
		});

		$(".UNESCO .arrow.down").click(function(e) {
			e.preventDefault();

			var top = parseInt(slider.css('top'), 10);

			var height = slider.height();

			var item_height = slider.find('.item').height();
			
			var limit = (height * -1) + (item_height * 3);

			if (!ns.lock && top <= 0 && top > limit) {

				ns.lock = true;

				slider.animate({
					top : "-=" + item_height,
				}, 1000, function() {
				
					ns.lock = false;
				});
			}
		});

		function fading() {

			$(".loading").fadeTo(1000, 1, function() {

				if (!stop_loading_fade) {

					$(".loading").fadeTo(1000, 0, function() {

						if (!stop_loading_fade) {
							fading();
						}
					});
				}
			});

		}

		fading();

		$(".UNESCO .explore-button").click(function(e) {
			e.preventDefault();

			ns.hideSplash();

			ns.centerLogo();

			// Change app state to Level 0
			OnExploreClick();

		});

		$(".UNESCO #zoom-in-button").click(function(e) {
			e.preventDefault();
			ns.hideZoomIn();
			ZoomInFromLevel0ToLevel1(false);

		});

		$(".UNESCO #zoom-out-button").click(function(e) {
			e.preventDefault();
			ns.hideZoomOut();
			ZoomOutFromLevel1ToLevel0(false);

		});

		/*
		 $(".UNESCO#slide-9 .close-button").click(function(e) {
		 e.preventDefault();

		 $(".UNESCO#slide-5").show();
		 $(".UNESCO#slide-9").hide();

		 // On close, clean up the model Renderer
		 Params.MainScene = true;
		 if (modelRenderer) {
		 modelRenderer.Clear();
		 }

		 });

		 $(".UNESCO#slide-5 .close-button").click(function(e) {
		 e.preventDefault();

		 $(".UNESCO#slide-5").hide();

		 $(".UNESCO#menu-button").show();
		 $(".UNESCO#browse").show();

		 });

		 */

		$(".UNESCO#browse .item a").click(function(e) {
			e.preventDefault();

			$(".UNESCO#browse").hide();

			$(".UNESCO#menu-button").hide();

			ns.center($(".UNESCO#slide-5 ul"));

		});

		$(".UNESCO#slide-5 .magnify").click(function(e) {
			e.preventDefault();

			$(".UNESCO#slide-5").hide();
			$(".UNESCO#slide-9").show();

			Params.MainScene = false;

			var modelContainer = $(".UNESCO#slide-9 #glModelContainer");
			if (!modelRenderer) {
				modelRenderer = new PX.ModelRenderer();
				modelRenderer.Init(modelContainer[0], windowWidth, windowHeight);
			}

			// @NOTE: We do not pass filename extension. That's added internally in the Loaders
            //modelRenderer.Load("webgl/data/models/05_Hatra_Relief/", "05_Hatra_relief2", function( per )
			modelRenderer.Load("webgl/data/models/03_Stela_7/", "03_Stela_7", function( per )
			//modelRenderer.Load("webgl/data/models/16_Lion_of_Mosul/", "16_lion2", function( per )
			{
				//console.log("+---+  Loading: " + parseInt(per * 100.0) + "%" );
			});

		});

		$(".UNESCO#share-button").click(function(e) {
			e.preventDefault();

			var menu = $(".UNESCO.share-menu");

			if (menu.css('display') == 'none') {
				menu.fadeTo(1000, 1);
			} else {
				menu.fadeTo(1000, 0);
			}

		});

		$(".UNESCO#menu-button").click(function(e) {
			e.preventDefault();

			$(".UNESCO.furniture").hide();

			ns.overlayAppend();
			ns.center($(".UNESCO#about"));

			//ns.centerLogo();

			$(".UNESCO.close-button").show();

		});

		$(".close-button").click(function(e) {
			e.preventDefault();

			ns.overlayRemove();
			$(".UNESCO#about").hide();
			$(".UNESCO.furniture").show();

			$(this).hide();

		});

	}

	this.resize = function() {

		var ns = this;

		var window_width = window.innerWidth;

		if (window_width >= max_width) {
			var percentage = 100;
		} else {
			var percentage = (window_width * 100) / max_width;
		}

		function apply(elm, target) {

			if (elm.hasClass('resize-' + target)) {

				var attr = elm.css(target);

				attr = parseInt(attr, 10) * .01 * percentage;

				elm.css(target, attr + 'px');

			}

		}

		resized_images_to_load = $("img.resize").length;

		function afterLoad(img) {

			var attr = img[0].naturalWidth;

			var attr = attr * .01 * percentage;

			img.prop('width', attr);

			var attr = img[0].naturalHeight;

			var attr = attr * .01 * percentage;

			img.prop('height', attr);

			resized_images_to_load--;

			if (resized_images_to_load == 0) {

				ns.afterLoadImages();
			}

		}


		$("[class*=resize]").each(function() {

			if ($(this).hasClass('resize')) {

				if ($(this).is('img')) {

					//check if the image is already on cache
					if ($(this).prop('complete')) {

						afterLoad($(this));

					} else {
						/* Call the codes/function after the image is loaded */
						$(this).on('load', function() {

							afterLoad($(this));

						});
					}

				} else {

					$(this).addClass('resize-width');
					$(this).addClass('resize-height');
				}

			}

			apply($(this), 'width');
			apply($(this), 'height');
			apply($(this), 'top');
			apply($(this), 'left');
			apply($(this), 'right');
			apply($(this), 'bottom');
			apply($(this), 'font-size');
			apply($(this), 'margin-top');
			apply($(this), 'margin-bottom');
			apply($(this), 'margin-right');
			apply($(this), 'margin-left');

		});

	}

	this.center = function(elm) {

		this.centerPrep(elm);
		this.centerVertical(elm);
		this.centerHorizontal(elm);

	}

	this.centerPrep = function(elm) {

		elm.css('position', 'absolute');

		elm.css('visibility', 'hidden');

		elm.parent().show();

		elm.show();

	}

	this.centerVertical = function(elm) {

		this.centerPrep(elm);

		//HEIGHT
		var height = elm.height();

		var window_height = window.innerHeight;

		var offset = height / 2;

		var middle = window_height / 2;

		var top = middle - offset;

		elm.css('top', top + 'px');

	}

	this.centerHorizontal = function(elm) {

		this.centerPrep(elm);

		//WIDTH
		var width = elm.width();

		var window_width = window.innerWidth;

		var offset = width / 2;

		var middle = window_width / 2;

		var left = middle - offset;

		elm.css('left', left + 'px');

		elm.css('visibility', 'visible');

	}
	/*
	 this.topStatusBar = function() {

	 var ns = this;

	 var elm = $(".UNESCO .status-bar-top");

	 elm.show();

	 var status_bar_top_max_height = 44;

	 elm.animate({
	 height : "+=" + status_bar_top_max_height,
	 }, 1000, function() {

	 if($(".UNESCO#splash .explore-button").css('display') != 'block'){
	 elm.css('height', '0px');

	 ns.topStatusBar();
	 } else {
	 elm.css('height', status_bar_top_max_height +'px');

	 }

	 });

	 }

	 this.bottomStatusBar = function(percentage) {

	 var ns = this;

	 var elm = $(".UNESCO .status-bar-bottom");

	 elm.show();

	 var status_bar_bottom_max_height = 111;

	 var new_height = (percentage * .01) * status_bar_bottom_max_height;

	 elm.css('height', new_height + 'px');

	 }
	 */

	this.showExploreButton = function() {

		stop_loading_fade = true;

		$(".UNESCO .loading").hide();

		var exploreButton = $(".UNESCO .explore-button");
		exploreButton.css('display', 'block');
		exploreButton.css('opacity', 0.0);
		exploreButton.fadeTo(1000, 1);

		//this.bottomStatusBar(100);

	}

	this.hideSplash = function() {

		$(".UNESCO#splash").hide();
		$(".UNESCO.furniture").show();

	}

	this.showBrowse = function() {

		var elm = $(".UNESCO#browse");

		elm.show();

	}

	this.hideZoomIn = function() {

		var elm = $("#zoom-in-button");

		elm.hide();

	}

	this.hideZoomOut = function() {

		var elm = $("#zoom-out-button");

		elm.hide();

	}

	this.showZoomIn = function() {

		var elm = $("#zoom-in-button");

		elm.show();

	}

	this.showZoomOut = function() {

		var elm = $("#zoom-out-button");

		elm.show();

	}
	this.hideBrowse = function() {

		$(".UNESCO#browse").hide();

	}

	this.showLegend = function() {

		var elm = $(".UNESCO#legend");

		elm.show();

	}

	this.hideLegend = function() {

		$(".UNESCO#legend").hide();

	}

	this.afterLoadImages = function() {

		var ns = this;

		$("#browse li.text").each(function() {

			var elm = $(this);
			var sibling_height = elm.parent().find("li.image img").height();
			elm.css('height', sibling_height + 'px');

		});

		ns.center($("#splash"));

	}

	this.overlayAppend = function() {

		$("body").append('<div id="overlay"></div>');

	}

	this.overlayRemove = function() {

		$("#overlay").remove();

	}

	this.centerLogo = function() {

		this.centerHorizontal($("#logo"));

	}

	this.changeLevel2SelectedMarker = function(colorHex) {
		if (locationMarkers.clickedMarkerIndex && appStateMan.IsState(PX.AppStates.AppStateLevel2)) {
			locationMarkers.markers[locationMarkers.clickedMarkerIndex].targetColor.set(colorHex);
		}
	}

	this.buildBrowse = function(callback) {

		var ns = this;

		//read through reconstructions.json
		var url = "webgl/data/reconstructions.json";

		$.ajax({
			dataType : "json",
			url : url,
			success : function(data) {

				ns.processItems(data, callback);
			},
			error : function(data) {

				ns.processItems(data, callback);
			}
		});

	}
	
	this.processItems = function(data, callback){

		var ns = this;
		
		console.log('item');
				
		reconstructions = data;

		var items = [];
		$.each(data, function(key, val) {

			var details = val.details;

			var url = "details/" + details + "/data.json";

			if (details) {

				$.ajax({
					dataType : "json",
					url : url,
					success : function(data) {

						ns.processItem(data, callback);
					},
					error : function(data) {

						ns.processItem(data, callback);
					}
				});

			} else {

				ns.buildItem(key, val, callback);

			}

		});

		
	}
	
	this.processItem = function(data, callback){

		var ns = this;
		
		//model file name
		val.filename = data.filename;

		//date_constructed
		val.date_constructed = data.date_constructed;

		//date_destroyed
		val.date_destroyed = data.date_destroyed;

		//images
		val.images = data.images;

		//videos
		val.videos = data.videos;

		ns.buildItem(key, val, callback);

		
	}	

	this.buildItem = function(key, item, callback) {
				
		var ns = this;
		
		var content = $("#browse .items .clone").clone();

		content.removeClass('clone');

		content.attr('item-id', item.id);

		content.attr('location-id', item.location_id);

		content.find(".title .name").html(item.name);

		var status = 'Destroyed';

		if (item.details) {

			content.attr('folder', item.details);

			if (item.images.length) {
				status = 'Under Reconstruction';
			}

			if (item.filename) {
				content.attr('filename', item.filename);
				status = 'Reconstructed';
			}

			content.find(".image img").attr('src', 'details/' + item.details + '/image.png');

			content.find(".date").html(item.date_created + ' - ' + item.date_destroyed);

			var p = item.images;

			for (var key in p) {
				if (p.hasOwnProperty(key)) {
					//p[key]

					var obj = p[key];
					var output = obj[Object.keys(obj)[0]];

					content.find(".media .images").append('<img src="details/' + item.details + '/images/' + output + '" />');
				}
			}

			p = item.videos;

			for (var key in p) {
				if (p.hasOwnProperty(key)) {
					//p[key]
					var obj = p[key];
					var output = obj[Object.keys(obj)[0]];

					content.find(".media .videos").append('<iframe width="420" height="315" src="' + output + '" frameborder="0" allowfullscreen=""></iframe>');
				}
			}

		}

		ns.setStatus(key, status);
		
		content.find(".status").html(status);

		$("#browse .items .items-inner").append(content);

		/*

		//for each item

		//read data.json

		//create element

		<div class="clone item unselected resize-margin-bottom" item-id="ITEM_ID" location-id="LOCATION_ID">
		<ul class="clr">
		<li class="image resize-width">
		<a href="#"><img class="resize" src="IMAGE.PNG" /></a>
		</li>
		<li class="resize-width text">
		<div class="inner">
		<div class="title resize-font-size resize-width">
		<span class="name">NAME</span>

		<div class="date">
		<span class="date_created">DATE_CREATED</span> - <span class="date_destroyed">DATE_DESTROYED</span>
		</div>
		</div>

		<div class="status resize-margin-left resize-margin-top">
		STATUS
		</div>
		</div>
		</li>
		</ul>
		<div class="media">
		<div class="images">

		</div>
		<div class="videos">

		</div>
		</div>
		</div>

		*/
		//add to browse
		
		reconstructions_loaded++;
		
		console.log(reconstructions);
		
		console.log('loaded: ' + reconstructions_loaded + ' == ' + reconstructions.length);
		
		if(reconstructions_loaded == reconstructions.length){
			
			$("#browse .item:eq(1)").removeClass('unselected');
			console.log("CALL IT BACK");
			callback();
		}

	}
	
	this.reconstructions = function() {
		return reconstructions;
	}
	
	this.setStatus = function(key, status){
		
		reconstructions[key].status = status;
	}
	
	this.ajaxJSON = function(url, callback){
		
		$.ajax({
			dataType : "json",
			url : url,
			success : function(json) {
				callback(json);
			},
			error : function(data) {
				callback(json);
			}
		});	
		
	}
	
		
}).apply(UNESCO);

var img = new Image();
img.onload = function() {
	
	$(document).ready(function() {
	
		UNESCO.init();
	
	});	

	
};
img.onerror = function() {
};		
img.src = "../webgl/data/textures/background.png";


