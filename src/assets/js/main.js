
(function() {
    'use strict';

    // remove empty content sections
    $('.page-header, .hero, .center-box, .content-section, .page-footer').each(function() {
    	if ($(this).html().trim() === '') {
    		$(this).remove();
    	}
    });

	// control hover states
	$('label').hover(
		function() {
			$(this).addClass('over');
		}, 
		function() {
			$(this).removeClass('over');
		}
	).filter(':has(.icon)').addClass('has-icon');

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
		$(this).parents('label').removeClass('focus');
	}).on('blur change', function() {
		$(this).parents('label').toggleClass('has-value', $(this).val()!=='');
	}).trigger('change');

	// add datepicker functionality
	$('.input-date').datepicker({
	    format: 'yyyy-mm-dd',
	    //orientation: 'auto left',
	    autoclose: true,
	    startView: 2,
	    language: 'da'
	}).on('changeDate', function(ev) {
		$(ev.currentTarget).trigger('blur');
	});

	// toggle child info visibility
	$('select#children').on('change', function() {
		var child_count = $(this).val() || 0;
		var $children = $(':input[id ^= "child-"]');

		$children.each(function() {
			var n = $(this).attr('id').split('-')[1];

			$(this).closest('.field-group-child').toggle(n<=child_count);
			if (n>child_count) {
				if ($(this).is('select')) {
					$(this).prop('selectedIndex', 0).selectric('refresh');
				} else {
					$(this).val('');
				}
			}
			
			return true;
		});

	}).trigger('change');

	// enable selectric for styling select boxes
	$('select').selectric({
		disableOnMobile: false,
		responsive: true,
		//inheritOriginalWidth: true,
	}).on('change', function() {
		$(this).valid();
	});




	$('form').validate({
		ignore: [],
		highlight: function(element, errorClass, validClass) {
            if(element.type === 'radio' || element.type === 'checkbox') {
                $(element.form).find('[name="' + element.name + '"]').each(function(){
                    var $this = $(this);
                    $this.addClass(errorClass).removeClass(validClass);
                    $this.closest('label').addClass('input-' + errorClass);
                });
            } else {
				$(element).addClass(errorClass).removeClass(validClass);
				$(element).closest('label').addClass('input-' + errorClass);
            }

		},
		unhighlight: function(element, errorClass, validClass) {
            if(element.type === 'radio' || element.type === 'checkbox') {
                $(element.form).find('[name="' + element.name + '"]').each(function(){
                    var $this = $(this);
                    $this.removeClass(errorClass).addClass(validClass);
                    $this.closest('label').removeClass('input-' + errorClass);
                });
            } else {
				$(element).removeClass(errorClass).addClass(validClass);
				$(element).closest('label').removeClass('input-' + errorClass);
			}
		},
		errorPlacement: function(error, element) {
			if (element.is(':radio') || element.is(':checkbox')) {
				//if (element.attr("name") == "PhoneFirst" || element.attr("name") == "PhoneMiddle" || element.attr("name") == "PhoneLast") {
				//error.insertAfter("#requestorPhoneLast");

				error.insertAfter($(':input[name=' + element.attr('name') + ']:last').closest('label'));
			} else if (element.is('select')) {
				error.appendTo(element.closest('.selectric-wrapper'));
			} else {
				error.insertAfter(element);
			}
		},
	});

	// add rules for member get member
	$(':text[name^="mgm"]').each(function() {
		var $name_parts = $(this).attr('name').split('_');
		var $field_partner = $(':text[name="' + $name_parts[0] + '_' + ($name_parts[1]==='name'? 'email_address_' : 'name') + '"]');

		if ($name_parts[0] !== 'mgm1' && $field_partner.length > 0) {
			$(this).rules('add', {
				required: {
					depends: function() {
						return $field_partner.val() !== '';
					}
				}
			});
		}
	});




})();