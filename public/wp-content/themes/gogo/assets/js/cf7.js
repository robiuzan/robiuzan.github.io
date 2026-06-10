jQuery( document ).ready(function($) {

const wpcf7Elm = document.querySelectorAll('.wpcf7');
if (wpcf7Elm) {

    if (wpcf7) {
        wpcf7.cached = 0;
    }

    wpcf7Elm.forEach(form => {
        form.addEventListener('wpcf7beforesubmit', function (event) {
            $('body').addClass('wait');

            $(form).find('.wpcf7-submit').addClass('wait disabled')

        }, false);


        form.addEventListener('wpcf7submit', function (event) {
            $('body').removeClass('wait');
        }, false)


        form.addEventListener('wpcf7mailsent', function (event) {
            setTimeout(() => {
                console.log('wpcf7mailsent');
                $('body').removeClass('wait');
                $(form).find('.wpcf7-submit').removeClass('wait disabled')
            }, 350)
        }, false);


        form.addEventListener('wpcf7invalid', function (event) {
            setTimeout(() => {
                console.log('wpcf7invalid');
                $('body').removeClass('wait');
                $(form).find('.wpcf7-submit').removeClass('wait disabled')
            }, 350)
        }, false);

        form.addEventListener('wpcf7mailfailed', function (event) {

            setTimeout(() => {
                console.log('wpcf7mailfailed');
                $('body').removeClass('wait');
                $(form).find('.wpcf7-submit').removeClass('wait disabled')
            }, 350)

        }, false);

    });

}

});