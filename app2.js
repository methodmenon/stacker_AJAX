$(document).ready( function() {
	$('.inspiration-getter').submit(function(event) {
		$('.results').html('');
		var tag = $(this).find("input[name='answerers']").val();
		getTopAnswerers(tag);
	});
});


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

var showAnswerer = function(answerer) {

	//clone our answer result template code
	var result = $('.templates .answerer').clone();

	var user = result.find('.user');
	user.html('<p>Name: <a target="_blank" href=' + answerer.user.link + '>' + answerer.user.display_name + '</a>' + '</p>' + 
		'<p>Reputation ' + answerer.user.reputation + '</p>');

	var score = result.find('.score');
	score.text(answerer.score);

	var post_count = result.find('.post-count');
	post_count.text(answerer.post_count);

	return result;
};

var getTopAnswerers = function(tag) {

	var request = {
		site: 'stackoverflow'
	};

	var url = "http://api.stackexchange.com/2.2/tags/{%s}/top-answerers/all_time".replace('{%s}', tag);
	//var url = "http://api.stackexchange.com/2.2/tags/" + tag + "/top-answerers/all_time";

	var result = $.ajax({
		//url: "http://api.stackexchange.com/2.2/tags/" + tag + "/top-answerers/all_time",
		url: url,
		data: request,
		dataType: "jsonp",
		type: "GET",
		})
	.done(function(result) {
		var searchResults = showSearchResults(tag, result.items.length);

		$('.search-results').html(searchResults);

		$.each(result.items, function(i, item) {
			var answerer = showAnswerer(item);
			$('.results').append(answerer);
		});
	}).fail(function(jqXHR, error, errorThrown) {
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};
