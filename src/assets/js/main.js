
(function() {
    'use strict';


	// control checkboxes and radiobuttons
	$('input[type=radio], input[type=checkbox]').each(function() {

		// set state on load
		$(this).parents('label').toggleClass('checked', $(this).is(':checked'));

		$(this).on('change', function() {

	        var fld_name = $(this).attr('name');
            $('input[name=' + fld_name + ']', $(this).parents('form:first')).add(this).each(function() {
                $(this).closest('label').toggleClass('checked', $(this).is(':checked'));
            });
		});
	});

	// control input fields focus/blur state
	$(':input').focus(function() {
		$(this).parents('label').addClass('focus');
	}).blur(function() {
		$(this).parents('label')
			.removeClass('focus')
			.toggleClass('has-value', $(this).val()!=='')
		;
	}).each(function() {
		$(this).parents('label').toggleClass('has-value', $(this).val()!=='');
	});

	
	$('label').hover(
		function() {
			$(this).addClass('over');
		}, 
		function() {
			$(this).removeClass('over');
		}
	).filter(':has(.icon)').addClass('has-icon');

})();