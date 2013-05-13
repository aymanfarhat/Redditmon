/* Main JS file */

$(".datepicker").datepicker({autoclose:true});

/* Combo box select change */
$("#subreddit_select a").on('click',function(event){
	$("#subreddit .txt").text($(this).text());
	$("#subreddit").data("value", $(this).data("value"));
});

$('#fetchLogs').on('click',function(event){
	getLogs("programming","2013-05-06","2013-05-06",this,function(logs){
		console.log(logs);
	});
});

/* Requests log data via ajax and returns a list of json objects on success */
function getLogs(subreddit,start,end,btn,succ_callback)
{
	var btn_id = btn.id;
	
	var request = $.ajax({
		type: "GET",
		url: window.location.origin+"/logs",
		data: _.template("subreddit=<%=sub%>&start=<%=st%>&end=<%=en%>",{sub:subreddit,st:start,en:end}),
		beforeSend: function(){
			$(btn).addClass("disabled");
			$("#"+btn_id+" i").addClass("icon-spin");
			$("#"+btn_id+" span").text("Fetching...");
		},
	});
	
	request.done(function(reply){
		if(reply.status === "success")
		{
			obj_arr = _.map(reply.data.logs,function(str){
				return $.parseJSON(str);
			});
			succ_callback(obj_arr);
		}	
		else if(reply.status === "fail")
			notifyMsg(reply.data);
		else
			notifyMsg("An unexpected problem has occurred, recheck your input and try again.");
	});

	request.fail(function(jqXHR,textStatus){
	});
	
	request.always(function(){
		$(btn).removeClass("disabled");
		$("#"+btn_id+" i").removeClass("icon-spin");
		$("#"+btn_id+" span").text("Fetch");
	});
}

/* Displays messages in a modal window */
function notifyMsg(str)
{
	alert(str);
}
