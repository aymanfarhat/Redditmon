/* Main JS file */
$(".datepicker").datepicker({autoclose:true});

/* Combo box select change */
$("#subreddit_select a").on('click',function(event){
	$("#subreddit .txt").text($(this).text());
	$("#subreddit").data("value", $(this).data("value"));
});
