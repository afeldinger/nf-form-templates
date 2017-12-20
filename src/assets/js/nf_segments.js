
var nf_segment = (function() {
    'use strict';


    var selects = $('select[id^="nf-segment"]'),
    	nf_segments = {
    		1: 'Cinema Addicts',
			2: 'Cinema Regulars',
			3: 'Film Fans',
			4: 'Film Consumers',
			5: 'Home Alone',
			6: 'Home Socials'
    	};

    // randomize select values
    function randomize_values() {
    	selects.each(function() {
    		var n = Math.ceil(Math.random() * ($(this).find('option').length - 1));
    		$(this).prop('selectedIndex', n).selectric('refresh');
    		console.log($(this).attr('id'), n);
    	});
    }

    // calculate segment based on field values
    function calc_nf_segment() {
    	// all segment fields need values
		if (
			selects.filter(function() {
				return $(this).val() === '';
			}).length !== 0
		) {
			return;
		}

		// all fields have values, proceed

		// set up variables and defaults
		var v = {},					// field value object
			film_freq = 2,			// film_frequency: 1 = often, 2 = rare
			cinema_freq = 3,		// cinema_frequency: 1 = often, 2 = occasionally, 3 = rarely, 4 = never
			interest,				// interest_level
			social,					// social_level
			nf_segment_value = 7,	// nf_segment_value
			nf_segment_label;		// nf_segment_label
		
		// assign field values to object for easier access
		selects.each(function() {
			v[$(this).attr('name').substr(11)] = parseInt($(this).val());
		});

		// set film frequency
		if (v.q1_1 < 8 || v.q1_2 < 5 || v.q1_3 < 5 || v.q1_4 < 5 || v.q1_5 < 5 || v.q1_7 < 5 ) film_freq = 1;

		// set cinema frequency
		if (film_freq === 1 && v.q1_1 <= 5) cinema_freq = 1;
		if (film_freq === 1 && (v.q1_1 === 6 || v.q1_1 === 5)) cinema_freq = 2;
		if (film_freq === 2 && v.q1_1 >= 7) cinema_freq = 4;

		// set interest & social levels
		interest = v.q2_1 + v.q2_3 + v.q2_5 + v.q2_6;
		social = v.q2_2 + v.q2_4;

		// set nf segment value
		if (cinema_freq === 1 && interest > 11) nf_segment_value = 1;	// cinema often, films often, interest high
		if (cinema_freq === 1 && interest < 12) nf_segment_value = 2;	// cinema often, films often, interest low
		if (cinema_freq === 2 && interest > 11) nf_segment_value = 3;	// cinema occassionally, films often, interest high
		if (cinema_freq === 2 && interest < 12) nf_segment_value = 4;	// cinema occassionally, films often, interest low
		if (cinema_freq === 3 && social < 6) nf_segment_value = 5;		// cinema rarely, films often, social low
		if (cinema_freq === 3 && social > 5) nf_segment_value = 6;		// cinema rarely, films oftem social high
		if (cinema_freq === 4) nf_segment_value = 7;					// cinema rarely, films rarely

		// set nf segment label
		nf_segment_label = nf_segments[nf_segment_value];
		
		return {
			v: v,
			film_freq: film_freq,
			cinema_freq: cinema_freq,
			interest: interest,
			social: social,
			nf_segment_value: nf_segment_value,
			nf_segment_label: nf_segment_label
		};

    }

    // assign calculation to event
    selects.on('change', function() {
    	var vals = calc_nf_segment();

		// assign field values
		if (vals) {
			$(':input#nf-segment-type').val(vals.nf_segment_value).trigger('change');
			$(':input#nf-segment-name').val(vals.nf_segment_label).trigger('change');
		}

    });

    return {
    	selects: selects,
    	calc: calc_nf_segment,
    	rand: randomize_values
    };
})();