
$(document).ready(function() {
	var elementClasses = [];
    var classesInList = [];
    var currentElement;
    var prevElement;
    var originalParent;
    var originalIndex;
    var newIndex;
    var originalHTML;

  	function sortRules(event, ui) {
	 	originalParent.children('.ui-state-dotted').remove();

	 	if (originalParent.children('li').length < 5 && (originalParent.attr('id') === 'statement1' || originalParent.attr('id') === 'statement2')) {
	  		originalParent.append('<li class="ui-state-dotted"></li>');
	 	}

		if ((ui.item.attr('class') === ui.item.prev().attr('class')) ||
			(ui.item.attr('class') === ui.item.next().attr('class')) ||
			(ui.item.hasClass('operator') && (!ui.item.prev().hasClass('noun') || ui.item.next().hasClass('operator') || ui.item.next().attr('class') === undefined))) {

			if (originalParent.attr('id') === 'operators' || originalParent.attr('id') === 'parameters') {
				$(this).sortable('cancel');
			} else {
				newIndex = ui.item.index();

				if (Math.abs(originalIndex - newIndex) % 2 === 0) {
			 		ui.item.next().insertAfter(originalParent.children('li').eq(originalIndex));
				} else {
					$(this).sortable('cancel');
				}

			}

		} else {
			if (ui.item.hasClass('noun')) {
				ui.item.html('<input type="text">');
				ui.item.css('padding', '5px');
			}

			if (originalHTML === 'Location') {
				ui.item.children('input').attr({
					'id': 'locationInput',
					'placeholder': 'Enter your city'
				});
				locationSearch();
			} else {
				ui.item.children('input').attr('placeholder', originalHTML);
			}

		originalParent.append('<li class="' + ui.item.attr('class') + '">' + originalHTML + '</li>');
		}

  	}

  	function locationSearch() {
  		var input = document.getElementById('locationInput');
  		var cities = {
  			types: ['(cities)'],
  			componentRestrictions: {country: 'us'}
  		};

  		var autocomplete = new google.maps.places.Autocomplete(input, cities);
  	}


  $(function() {

    $('#statement1, #statement2, #operators, #parameters').sortable({
    	connectWith: '.connectLists',
    	start: function(event, ui) {
    		originalParent = ui.item.parent();
	    	originalIndex = ui.item.index();
	    	originalHTML = ui.item.html();

	    	ui.placeholder.css({		
				'background': '#fcf8e3',
				'border': '1px solid #fbeed5',
				'visibility': 'visible'
	    	});
	    },
      	stop: sortRules
    }).disableSelection();
  });
});