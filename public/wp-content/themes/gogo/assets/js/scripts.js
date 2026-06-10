;(function ($, root, undefined) {
	$(function () {
		'use strict'

		$(document).ready(function () {
			$('.menu-toggle').click(function () {
				$(this).toggleClass('toggled')
				$('.main-navigation').toggleClass('toggled')
			})

			/*
			$("#masthead").sticky({topSpacing:0});
			*/

			$('[data-fancybox]').each(function () {
				Fancybox.bind(this, {
					Thumbs: {
						autoStart: true, // Автоматически включить миниатюры
					},
					Toolbar: {
						display: ['zoom', 'close'], // Настроить панель инструментов
					},
				})
			})

			/*
			$(".tab").click(function() {
				$(".tab").removeClass("active").eq($(this).index()).addClass("active");
				$(".tab_item").hide().eq($(this).index()).fadeIn()
			}).eq(0).addClass("active");
			$(".tab_item").css('display', 'none');
			$(".tab_item:first-child").css('display', 'block');
			*/

			$('.feedback-widget').owlCarousel({
				items: 3,
				loop: true,
				margin: 24,
				// stagePadding: 200,
				autoplay: false,
				autoplayTimeout: 5000,
				autoplayHoverPause: true,
				nav: false,
				dots: true,
				//rtl:true,
				autoHeight: true,
				responsive: {
					0: {
						items: 1,
						stagePadding: 0,
					},
					768: {
						items: 1,
						stagePadding: 150,
					},
					991: {
						items: 2,
						stagePadding: 100,
					},
					1200: {
						items: 3,
						// stagePadding: 200,
					},
				},
			})

			function updateMaxWidth() {
		        var containerWidth = $('.s-feedback .container').width();
		        $('.feedback-widget-sd .saswp-cct .saswp-sic .saswp-si, .feedback-widget-sd .saswp-cct .saswp-cs').css('max-width', containerWidth + 'px');
		    }
		    updateMaxWidth();
		    $(window).on('resize', function() {
		        updateMaxWidth();
		    });

			if (document.documentElement.clientWidth < 1201) {
				$('.section-locations .locations').addClass('owl-carousel')
				$('.section-locations .locations').owlCarousel({
					items: 2,
					loop: true,
					margin: 18,
					autoplay: false,
					autoplayTimeout: 5000,
					autoplayHoverPause: true,
					nav: false,
					dots: true,
					autoHeight: true,
					responsive: {
						0: {
							items: 1,
						},
						768: {
							items: 2,
						},
						991: {
							items: 2,
						},
						1200: {
							items: 2,
						},
					},
				})
			}

			$('.feedback-location-slider').owlCarousel({
				items: 1,
				loop: true,
				margin: 0,
				autoplay: false,
				autoplayTimeout: 5000,
				autoplayHoverPause: true,
				nav: false,
				dots: true,
				//rtl:true,
				autoHeight: true,
				animateOut: 'fadeOut',
				mouseDrag: false,
				touchDrag: false,
			})

			if (document.documentElement.clientWidth < 1025) {
				$('.section-coupons-slider .coupon-slider-mob').addClass('owl-carousel')
				$('.section-coupons-slider .coupon-slider-mob').owlCarousel({
					items: 3,
					loop: false,
					margin: 18,
					autoplay: false,
					autoplayTimeout: 5000,
					autoplayHoverPause: true,
					nav: false,
					dots: true,
					autoHeight: true,
					responsive: {
						0: {
							items: 1,
						},
						768: {
							items: 2,
						},
						991: {
							items: 3,
						},
						1200: {
							items: 3,
						},
					},
				})
				$('.s-latest-posts .posts-list').addClass('owl-carousel')
				$('.s-latest-posts .posts-list').owlCarousel({
					items: 3,
					loop: true,
					margin: 18,
					autoplay: false,
					autoplayTimeout: 5000,
					autoplayHoverPause: true,
					nav: false,
					dots: true,
					autoHeight: true,
					responsive: {
						0: {
							items: 1,
						},
						768: {
							items: 2,
						},
						991: {
							items: 3,
						},
						1200: {
							items: 3,
						},
					},
				})
			}
			if (document.documentElement.clientWidth < 768) {
				$('.section-advantages .grid-wrap').addClass('owl-carousel')
				$('.section-advantages .grid-wrap').owlCarousel({
					items: 1,
					loop: true,
					margin: 0,
					autoplay: false,
					autoplayTimeout: 5000,
					autoplayHoverPause: true,
					nav: false,
					dots: true,
					autoHeight: true,
				})
			}

			if ($('.acc-wrap').length) {
				$('.acc-item').each(function () {
					const accItem = $(this)
					const header = $(this).find('.acc-item__header')
					const body = $(this).find('.acc-item__body')

					header.on('click', function () {
						if (!accItem.hasClass('active')) {
							$('.acc-item.active')
								.removeClass('active')
								.find('.acc-item__body')
								.slideUp('fast')
							accItem.toggleClass('active')
							body.slideToggle('fast')
						} else {
							accItem.removeClass('active')
							body.slideUp('fast')
						}
					})
				})
				if (document.documentElement.clientWidth >= 992) {
					$(window).on('load', function () {
						$('.acc-item')
							.eq(0)
							.addClass('active')
							.find('.acc-item__body')
							.slideDown('fast')
					})
				}
			}

			if ($('.marquee').length && document.documentElement.clientWidth > 767) {
				/*
				$('.marquee').marquee({
					duration: document.documentElement.clientWidth <= 991 ? 15000 : 25000,
					gap: 0,
					delayBeforeStart: 0,
					direction: 'left',
					duplicated: true,
					startVisible: true,
				})
				*/
				$('.marquee .clients-carousel__inner').addClass('owl-carousel');
				$('.marquee .clients-carousel__inner').owlCarousel({
					items: 6,
					loop: true,
					margin: 0,
					autoplay: false,
					autoplayTimeout: 5000,
					autoplayHoverPause: true,
					nav: false,
					dots: true,
					autoHeight: true,
					responsive: {
						0: {
							items: 2,
						},
						768: {
							items: 3,
						},
						991: {
							items: 5,
						},
						1200: {
							items: 6,
						},
					},
				});
			}

			/*
			$( ".slider" ).each(function() {
				var owl1 = $(this);
				var amountSlide = owl1.find('.owl-item').length;
				owl1.owlCarousel({
					items:3,
					loop: (amountSlide > 1),
					margin:70,
					nav:true,
					navText:false,
					autoplay:true,
			   		autoplayTimeout:4000,
			    	autoplayHoverPause:true 
					responsive:{
						0:{
						    items:1
						    },
						480:{
						    items:2
						},
						769:{
						    items:3
						}
					}
				});
			});
			*/

			$('.toggle-coupon').click(function () {
				$(this).parent().hide()
				$('.section-coupons-slider .row > div').show()
			})

			$('.toggle-services').click(function () {
				$(this).parent().hide()
				$('.s-services-list .row > div').show()
			})

			$('.toggle-areas').click(function () {
				$(this).parent().hide()
				$('.location-list li').show()
			})

			$('.modal-handler').magnificPopup({
				type: 'inline',
				showCloseBtn: false,
				fixedContentPos: true,
				mainClass: 'mfp-fade',
				callbacks: {
					beforeOpen: function () {},
				},
			})

			$('.btn-close').on('click', function (e) {
				e.preventDefault()
				$.magnificPopup.close()
			})
		})

		$(window).load(function () {
			/*
			function heightDetect() {
				var h = $(".class1").height();
				$(".class2").height(h);
			};
			heightDetect();
			*/
			/*
			$('.item').matchHeight();
			$(window).resize(function(){

			});
			*/
		})
	})
})(jQuery, this)