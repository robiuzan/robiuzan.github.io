jQuery( document ).ready(function($) {

//* Side Mobile Navigation

    $('.nav-toggle').on('click', function (e) {
        e.preventDefault()
        $('.nav-side').addClass('active')
        disablePageScroll()
    })

    // Close
    $('.nav-side__close').on('click', function (e) {
        e.preventDefault()
        $('.nav-side').removeClass('active')
        enablePageScroll()
    })

    $(document).on('click', '.nav-side .menu li.menu-item-has-children>a .sub-menu-toggle', function (e) {
        if (document.documentElement.clientWidth <= 1199) {
            e.preventDefault();
            $(this).parents('li').eq(0).toggleClass('active');
            $(this).parents('li').eq(0).find('.sub-menu').eq(0).slideToggle('fast');
        }
    });


//* Fixed Desktop Navigation


    const navMain = $('.nav-main')
    const offsetTop = navMain.offset().top

    let lastScroll = 0;
    $(window).on('scroll load', function () {
        const scroll = $(this).scrollTop();
        if (scroll >= offsetTop) {
            navMain.addClass('fixed');
        } else {
            navMain.removeClass('fixed');
        }
        lastScroll = scroll;
    });


//* Dropdown Menu

    // Mega Menu
    $('.menu-item-has-children ').each(function () {
        if (document.documentElement.clientWidth > 991) {

            const link = $(this);
            const megaMenu = link.find('.sub-menu').eq(0);
            let mouseOnMegaMenu = false;

            // Link Hover
            link.on('mouseover touchstart', () => {
                $('.menu-item-has-children ').removeClass('active');
                $('.sub-menu').removeClass('active');

                link.addClass('active');
                megaMenu.addClass('active');
            });

            // Mega Menu Hover
            megaMenu.on('mouseover touchstart', (e) => {
                $('.menu-item-has-children ').removeClass('active');
                $('.sub-menu').removeClass('active');

                mouseOnMegaMenu = true;
                megaMenu.addClass('active');
            });

            // Link Leave
            link.on('mouseleave', (e) => {
                setTimeout(() => {
                    if (!mouseOnMegaMenu) {
                        link.removeClass('active');
                        megaMenu.removeClass('active');
                    }
                }, 290);
            });

            // Mega Menu Leave
            megaMenu.on('mouseleave', (e) => {
                mouseOnMegaMenu = false;
                setTimeout(() => {
                    megaMenu.removeClass('active');
                    link.removeClass('active');
                }, 200);
            });

        }

    });

    // Click Outside
    $(document).on('click', function (e) {
        if (document.documentElement.clientWidth > 991) {

            let el = $(e.target);
            if ($('.sub-menu.active').length) {
                if (
                    !el.is('.mega-menu.active') &&
                    !el.is('.mega-menu-wrap.active') &&
                    !el.parents('.mega-menu-wrap.active').length &&
                    !el.parents('.mega-menu.active').length
                ) {
                    $('.sub-menu.active').removeClass('active');
                    $('.menu-item-has-children.active').removeClass('active');
                }
            }

        }
    });



    $('.locations-drop-down').appendTo('.locations-dropdown')
    $('.services-drop-down').appendTo('.services-dropdown')


    // Template Padding

    function setPadding() {
        const $navMain = $('.nav-main');
        if ($navMain.length) {
            const H = $navMain.outerHeight(true);
            $('.template-header').css({
                'padding-top': `${H}px`
            });
        }
    }

    setPadding();

    let resizeTimeout;
    $(window).on('resize orientationchange', function () {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(setPadding, 150); // Throttle function
    });


});