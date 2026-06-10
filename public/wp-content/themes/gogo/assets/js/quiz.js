jQuery(document).ready(function ($) {
	let Data = []
	let PriceData = []
	let currentStep = false

	$('.step-select').on('click', function (e) {
		e.preventDefault()

		$(this).addClass('selected')

		const nextStepId = $(this).attr('data-next-step')

		if (nextStepId) {
			moveToSlide(nextStepId)
		} else {
			moveToFinalStep()
		}

		$(window).trigger('step-change')
	})

	function moveToSlide(nextStepId) {
		$('.quiz-step').hide().removeClass('active')
		$(`.quiz-step[data-step="${nextStepId}"]`).addClass('active').fadeIn(500)

		$(window).trigger('step-change')
	}

	function moveToFinalStep() {
		$('.quiz-step.final .list-of-services').empty()
		$('.quiz-step.final .final-price').empty()

		PriceData = []
		Data = []

		$('.selected').each(function () {
			if ($(this).find('.price').length) {
				// El Contains a Price
				PriceData.push($(this).find('.price').text().trim())
				const clonedEl = $(this).clone()
				clonedEl.find('.price').remove()

				Data.push(clonedEl.text().trim())
			} else {
				Data.push($(this).text().trim())
			}
		})

		Data.forEach(el => {
			$('.quiz-step.final .list-of-services').append(`
            <li><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_154_2715)"><path d="M12 0C5.38346 0 0 5.38346 0 12C0 18.6165 5.38346 24 12 24C18.6165 24 24 18.6165 24 12C24 5.38346 18.6165 0 12 0ZM18.7068 8.84211L11.0376 16.4511C10.5865 16.9023 9.86466 16.9323 9.38346 16.4812L5.32331 12.782C4.84211 12.3308 4.81203 11.5789 5.23308 11.0977C5.68421 10.6165 6.43609 10.5865 6.91729 11.0376L10.1353 13.985L16.9925 7.12782C17.4737 6.64662 18.2256 6.64662 18.7068 7.12782C19.188 7.60902 19.188 8.3609 18.7068 8.84211Z" fill="#E36300"/>
</g><defs><clipPath id="clip0_154_2715"><rect width="24" height="24" fill="white"/></clipPath></defs></svg>${el}</li>
        `)
		})
		PriceData.forEach(el => {
			$('.quiz-step.final .final-price').append(`
            <div>${el}</div>
        `)
		})

		// Hide ALl Steps
		$('.quiz-step').hide()

		// Show Only Final Steps
		$(`.quiz-step.final`).addClass('active').fadeIn(500)

		$(window).trigger('step-change')
	}

	// Step Change Event
	$(window).on('step-change', function () {
		$('.preloader').addClass('active')

		const step = $('.quiz-step.active')

		// Step ID
		currentStep = step.attr('data-step')

		// Btn Back disabled
		if (currentStep != 1) {
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

		// Split the string by dots
		var parts = currentStep.split('.')
		// Remove the last element
		parts.pop()

		// Join the remaining parts back together with dots
		let newDataStep = parts.join('.')

		if (newDataStep == 2) {
			newDataStep = 1
		}

		moveToSlide(newDataStep)

		const prevSlide = $(`.quiz-step[data-step="${newDataStep}"]`)

		prevSlide.find('.selected').removeClass('selected')
		prevSlide.nextAll('.quiz-step').find('.selected').removeClass('selected')
	})

	// Start over Button
	$('.step-navigation  .btn-start-over ').on('click', function (e) {
		e.preventDefault()

		moveToSlide(1)

		const prevSlide = $(`.quiz-step[data-step="1"]`)
		prevSlide.find('.selected').removeClass('selected')
		prevSlide.nextAll('.quiz-step').find('.selected').removeClass('selected')
	})
})
