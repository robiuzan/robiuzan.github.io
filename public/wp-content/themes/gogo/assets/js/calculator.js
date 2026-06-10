//const $ = require('jquery'); 
//require('magnific-popup');
jQuery( document ).ready(function($) {
    const firstStepId = $('.quiz-step.first-step').attr('data-step')

    window.calcData = [];
    window.PriceData = [];
    window.currentStep = false;
    window.steps = [firstStepId];

    $('.step-select').on('click', function (e) {
        e.preventDefault();
        $(this).addClass('selected')
        const nextStepId = $(this).attr('data-next-step')

        steps.push($(this).parents('.quiz-step').attr('data-step'));

        if (nextStepId) {
            moveToSlide(nextStepId)
        } else {
            moveToFinalStep();
        }

        $(window).trigger('step-change')
    })


    function moveToSlide(nextStepId) {

        $('.quiz-step').hide().removeClass('active')
        $(`.quiz-step[data-step="${nextStepId}"]`).addClass('active').fadeIn(500);

        $(window).trigger('step-change')
    }

    function moveToFinalStep() {
        $('.quiz-step.final .list-of-services').empty()
        $('.quiz-step.final .final-price').empty()

        window.PriceData = [];
        window.calcData = [];

        steps = Array.from(new Set(steps));

        steps.forEach((el) => {
            $(`.quiz-step[data-step='${el}']`).find('.selected')
                .each(function () {
                    if ($(this).find('.price').length) {
                        // El Contains a Price
                        window.PriceData.push(
                            $(this).find('.price').text().trim()
                        )
                        const clonedEl = $(this).clone()
                        clonedEl.find('.price').remove()

                        calcData.push(
                            clonedEl.text().trim()
                        )

                    } else {
                        calcData.push(
                            $(this).text().trim()
                        )
                    }
                })
        })

        calcData.forEach((el) => {
            $('.quiz-step.final .list-of-services').append(`<li>${el}</li>`)
        })
        window.PriceData.forEach((el) => {
            $('.quiz-step.final .final-price').append(`
                <div>${el}</div>
            `)
        })


        // Hide ALl Steps
        $('.quiz-step').hide()

        // Show Only Final Steps
        $(`.quiz-step.final`).addClass('active').fadeIn(500);

        $(window).trigger('step-change')
    }

    // Step Change Event
    $(window).on('step-change', function () {
        $('.preloader').addClass('active')

        const step = $('.quiz-step.active')

        // Step ID
        currentStep = step.attr('data-step');

        // Btn Back disabled
        if (currentStep != firstStepId) {
            $('.step-navigation .btn-back ').removeClass('disabled')
            $('.step-navigation .btn-start-over ').removeClass('disabled')
        } else {
            $('.step-navigation .btn-back ').addClass('disabled')
            $('.step-navigation .btn-start-over ').addClass('disabled')
        }

        $('.page-quiz').attr('data-step', currentStep)

        setTimeout(() => {
            $('.preloader').removeClass('active')
        }, 450)
    })


    // Back Button
    $('.step-navigation  .btn-back ').on('click', function (e) {
        e.preventDefault()

        let prevSlideID = steps[steps.length - 1] ? steps[steps.length - 1] : firstStepId;
        steps.pop();

        // Move To Prev Slide
        setTimeout(() => { moveToSlide(prevSlideID); }, 600);

        // Clear Current Step selected status
        clearSelectedForStep($(`.quiz-step[data-step="${prevSlideID}"]`))

        // Clear States from all Slides except previous one
        $('.quiz-step').each(function (el) {
            if (!steps.includes(prevSlideID)) {

                clearSelectedForStep(
                    $(el)
                )

            }
        })
    })


    // Start over Button
    $('.step-navigation  .btn-start-over ').on('click', function (e) {
        e.preventDefault()

        steps = [firstStepId]; // Clear Steps
        setTimeout(() => { moveToSlide(firstStepId); }, 600);

        // Remove Selected States from all Steps
        clearSelectedForStep($(`.quiz-step`))

    })


    function clearSelectedForStep(stepEl) {
        stepEl.find('.selected').removeClass('selected')
    }

});