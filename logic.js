$(document).ready(function() {
	var elementClasses = [];
    var classesInList = [];
    var currentElement;
    var prevElement;
    var originalParent;
    var originalIndex;
    var newIndex;
    var originalHTML;

  	function cancelSort(event, ui) {
	 	$(".ui-state-dotted").remove();

	 	if ($('#sortable2 li').length > 0 || $('#sortable3 li').length > 0) {
	  		$("#sortable1").append('<li class="ui-state-dotted"></li>');
	 	}

		if ((ui.item.attr('class') === ui.item.prev().attr('class')) ||
			(ui.item.attr('class') === ui.item.next().attr('class')) ||
			(ui.item.hasClass('operator') && (!ui.item.prev().hasClass('noun') || ui.item.next().hasClass('operator')))) {


			if (originalParent.attr('id') === 'sortable2' || originalParent.attr('id') === 'sortable3') {
				console.log('cancel')
				$(this).sortable('cancel');
			} else {
				newIndex = ui.item.index();

				if (Math.abs(originalIndex - newIndex) === 2) {
			 		ui.item.next().insertAfter($('#sortable1 li').eq(originalIndex));
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

    $('#sortable1, #sortable2, #sortable3').sortable({
    	connectWith: '.connectNounToList',
    	start: function(event, ui) {
    		originalParent = ui.item.parent();
	    	originalIndex = ui.item.index();
	    	originalHTML = ui.item.html();

	    	ui.placeholder.css({		
				'background': '#fcf8e3',
				'border': '1px solid #fbeed5',
				'visibility': 'visible'
	    	})
    	},
    	/*out: function ( event, ui ) {
    		if ($('#sortable2 li').length > 0) {
	        	if (ui.item.hasClass('and')) {
	          		$('#sortable3').append('<li class="ui-state-highlight operator and"><span>AND</span></li>');
	        	} else if (ui.item.hasClass('or')) {
	          		$('#sortable3').append('<li class="ui-state-highlight operator or"><span>OR</span></li>');
	        	}
    		}
    	},*/

    	/*receive: function(event, ui) {

	        elementClasses.push(ui.item.attr('class').split(' ')[1]);

	        if (elementClasses.length === 2) {
	         	currentElement = elementClasses[1];
	          	prevElement = elementClasses[0];

	          	if (currentElement === prevElement) {
	            	ui.item.remove();
	            	if (ui.item.hasClass('noun')) {	
	              		$('#sortable2').append('<li class="ui-state-highlight noun">' + ui.item.html() + '</li>');
	            	}
	          	}
	        } else if (elementClasses.length > 2) {
	          	currentElement = elementClasses[elementClasses.length - 1];
	          	prevElement = elementClasses[elementClasses.length - 2];

	          	if (currentElement === prevElement) {
	            	ui.item.remove();
	            	if (ui.item.hasClass('noun')) {
	              		$('#sortable2').append('<li class="ui-state-highlight noun">' + ui.item.html() + '</li>');
	            	}
	          	}
	        }
      	},*/
      	stop: cancelSort
    }).disableSelection();
  });
});