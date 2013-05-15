/* Main JS file */

/* About modal window on page load */
$(window).load(function(){
	if (!(Modernizr.localstorage && localStorage.getItem('noAboutOnStart') === "1"))
		$("#aboutModal").modal("show");
	else
		$('#noShowAboutDiag').prop('checked',true);
});

var dp = $(".datepicker");

/* Initialize DatePicker settings */
dp.datepicker({autoclose:true,format:"DD MM dd, yyyy"})
.on('changeDate',function(e){
	/* Set value for date compatible with the format to be received */
	$(this).attr("data-val",dateToVal(e.date));
});

/* Default date field values(today) */
dp.datepicker("setValue");
dp.attr("data-val",dateToVal(new Date()));

/* Combo box select change */
$("#subreddit_select a").on('click',function(event){
	/* Set value of the combo */
	$("#subreddit .txt").text($(this).text());
	
	$("#subreddit").attr("data-val", $(this).data("value"));

	/* Enable other fields */
	$("#date_from,#date_to").attr("disabled",false);
	$("#fetchLogs").removeClass("disabled");
});

/* Catch request submission action and call the approriate function */
$('#fetchLogs').on('click',function(event){
	if(!$(this).hasClass("disabled"))
	{
		var subreddit = $('#subreddit').attr('data-val');
		var start = $('#date_from').attr('data-val');
		var end = $('#date_to').attr('data-val');

		getLogs(subreddit,start,end,this,function(logs){
			if(logs.length > 0)
				console.log(logs);
			else
				notifyMsg("No results","The interval you specified didn't return any results for the chosen subreddit.");				
		});
	}
});

/* About dialog checkbox clicked */
$('#noShowAboutDiag').on('click',function(event){
	if(Modernizr.localstorage)
	{
		var val = ($(this).is(":checked"))?"1":"0";
		localStorage.setItem('noAboutOnStart',val)	
	}
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
			notifyMsg("Oh snap!",reply.data);
		else
			notifyMsg("Oh snap!","An unexpected problem has occurred, recheck your input and try again.");
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
function notifyMsg(title,body)
{
	$("#msgModal #title").text(title);
	$("#msgModal #msg").text(body);
	$("#msgModal").modal("show");
}

/* Format date object to desired value format*/
function dateToVal(dt)
{
	return ""+dt.getFullYear()+"-"+(dt.getMonth()+1)+"-"+dt.getDate();
}
