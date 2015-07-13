$(document).ready( function() {
	//listen for submission events on the '.unanswered-getter' element
	$('.unanswered-getter').submit( function(event){
		// zero out results if previous search has run
		$('.results').html('');
		// initialize the variable tags, setting its value to the value the user submitted
		var tags = $(this).find("input[name='tags']").val();
		//run the getUnanswered function
		getUnanswered(tags);
	});
});

// this function takes the question object returned by StackOverflow 
// and creates new result to be appended to DOM
var showQuestion = function(question) {
	
	// clone our result template code
	var result = $('.templates .question').clone();
	
	// Set the question properties in result
	var questionElem = result.find('.question-text a');
	questionElem.attr('href', question.link);
	questionElem.text(question.title);

	// set the date asked property in result
	var asked = result.find('.asked-date');
	var date = new Date(1000*question.creation_date);
	asked.text(date.toString());

	// set the #views for question property in result
	var viewed = result.find('.viewed');
	viewed.text(question.view_count);

	// set some properties related to asker
	var asker = result.find('.asker');
	asker.html('<p>Name: <a target="_blank" href=http://stackoverflow.com/users/' + question.owner.user_id + ' >' +
													question.owner.display_name +
												'</a>' +
							'</p>' +
 							'<p>Reputation: ' + question.owner.reputation + '</p>'
	);

	return result;
};


// this function takes the results object from StackOverflow
// and creates info about search results to be appended to DOM
var showSearchResults = function(query, resultNum) {
	var results = resultNum + ' results for <strong>' + query;
	return results;
};

// takes error string and turns it into displayable DOM element
var showError = function(error){
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};

// takes a string of semi-colon separated tags to be searched for on StackOverflow
//calls other functions defined above
//creates an object that contains the parameters we will be passing into our StackExchange API
var getUnanswered = function(tags) {
	
	// the parameters we need to pass in our request to StackOverflow's API
	//the variable 'request' has a value that is a deferred object
	var request = {tagged: tags,
								site: 'stackoverflow',
								order: 'desc',
								sort: 'creation'};
	//request looks like this--> /2.2/questions/unanswered?order=desc&sort=activity&site=stackoverflow
	var result = $.ajax({
		url: "http://api.stackexchange.com/2.2/questions/unanswered",
		data: request,
		//have to specify "jsonp" for dataType --> b/c we are making a client-side cross-domain request to this API
		dataType: "jsonp",
		//specify the http method we are using 
		type: "GET",
		})
	.done(function(result){
		//.done block only executes if the AJAX returns successfully
		console.log(result);
		var searchResults = showSearchResults(request.tagged, result.items.length);

		$('.search-results').html(searchResults);

		$.each(result.items, function(i, item) {
			var question = showQuestion(item);
			$('.results').append(question);
		});
	})
	.fail(function(jqXHR, error, errorThrown){
		//.fail block only exectues when and if the AJAX request fails
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
	//in either case:
	//the STRATEGY IS TO CLONE the the appropriate DOM element
	//insert the new text and HTML into the clone (based on our response data)
	//then insert this cloned element into the visible .container div
};



