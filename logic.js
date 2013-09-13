$(document).ready(function() {
    var originalParent;
    var originalIndex;
    var newIndex;
    var originalHTML;
    var targetParent;
    var originalText;

    function deleteParameter(list) {
    	var deleteButton = list.children('.delete');

    	// When the "x" button for a statement is clicked, delete the whole statement except for the dotted box
    	deleteButton.click(function() {
    		deleteButton.parent().children('li:not(.ui-state-dotted)').remove();
	 		
	 		// Add a dotted box to the statement if it does not already exist
	 		if (list.children('.ui-state-dotted').length === 0) {
	 			list.append('<li class="ui-state-dotted"></li>');
	 		}
    	});
    }

    function checkCanceled(list) {
    	if (list.length < 5 && list.hasClass('fullStatement') && list.children('.ui-state-dotted').length === 0) {
	 		targetParent.append('<li class="ui-state-dotted"></li>');
    	}
    }

  	function sortRules(event, ui) {
  		targetParent = ui.item.parent();
	 	targetParent.children('.ui-state-dotted').remove();

	 	// If the to-list is a statement and (1) the from-list is a item list or (2) the to-list and from-list are identical
	 	// Items can be rearranged within a single statement and dragged from a item list to a statement
	 	// Items cannot be dragged from one statement to another or from a statement to a item list
	 	if (targetParent.hasClass('fullStatement') && (originalParent.hasClass('piece'))) {
	 		// Add a dotted box (implying that another item can be added) if the total statement length is shorter than five items
	 		// If the total statement length is equal to five items, don't add another dotted box, but don't cancel the sort, either
	 		if (targetParent.children('li:not(.delete):not(.ui-state-dotted)').length < 5) {
	 		  	targetParent.append('<li class="ui-state-dotted"></li>');
	 		// Cancel the sort if the statement length has six or more items (including the current item)
	 		} else if (targetParent.children('li:not(.delete):not(.ui-state-dotted)').length >= 6) {
	 			$(this).sortable('cancel');
	 		}
	 	
	 		// Add a delete button if the statement does not already have it
	 		if (targetParent.children('.delete').length === 0) {
	 		 	$('<li class="delete">x</li>').insertBefore(targetParent.children('li:first-child'));
	 		}

	 		// Prevent like items from being placed next to each other
	 		// i.e., operators should never be next to operators, and parameters should never be next to parameters
	 		// Check if the item has the same class as the item before it or the item after it
	 		// or if the item is an operator and (1) the previous item is not a parameter (e.g., operator or undefined),
	 		// (2) the next item is an operator, and (3) the next item is undefined
	 		// This prevents operators from being placed next to each other, at the beginning or end of a statement,
	 		// but allows them to appear before a dotted box
	 		if ((ui.item.attr('class') === ui.item.prev().attr('class')) ||
				(ui.item.attr('class') === ui.item.next().attr('class')) ||
				(ui.item.hasClass('operator') && (!ui.item.prev().hasClass('parameter') || ui.item.next().hasClass('operator') || ui.item.next().attr('class') === undefined)) ||
				ui.item.prev().hasClass('ui-state-dotted')) {

				$(this).sortable('cancel');
				checkCanceled(targetParent);

			// Otherwise, if the sort arrangement is allowed, continue with the sort
			} else {
				if (ui.item.hasClass('parameter')) {
					ui.item.html('<form class="handler"><input type="text" class="search-input" name="search-input" value=""></form>');
					ui.item.css('padding', '5px');
				}

				if (originalText === 'Location') {
					ui.item.children('form').children('input').attr({
						'id': 'locationInput',
						'placeholder': 'Enter your city'
					});
					locationSearch();
				} else {
					ui.item.children('form').children('input').attr('placeholder', originalText);
				}

				originalParent.append('<li class="' + ui.item.attr('class') + '">' + originalHTML + '</li>');
				deleteParameter(targetParent);
			}
		} else if (targetParent.attr('id') === originalParent.attr('id')) {
 				// Grab the new target index of the item (after the sort ends)
				newIndex = ui.item.index();

				// Swap the current item with the item at its target index
				// if the target item is an even number away from the current item,
				// so that only like items are swapped with each other
				if (Math.abs(originalIndex - newIndex) % 2 === 0 && (ui.item.hasClass('operator') && !ui.item.prev().hasClass('operator'))) {
			 		ui.item.next().insertAfter(originalParent.children('li').eq(originalIndex));
			 	} else {
			 		$(this).sortable('cancel');
					checkCanceled(targetParent);
			 	}

		// Prevent items from being dragged from statements back into item lists
	 	} else {
	 		$(this).sortable('cancel');
			checkCanceled(targetParent);
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
    	handle: '.handler',
    	start: function(event, ui) {
    		originalParent = ui.item.parent();
	    	originalIndex = ui.item.index();
	    	originalHTML = ui.item.html();
	    	originalText = ui.item.children('span').html();

	    	ui.placeholder.css({		
				'background': '#fcf8e3',
				'border': '1px solid #fbeed5',
				'visibility': 'visible'
	    	});
	    },
      	stop: sortRules
    });
  });
});