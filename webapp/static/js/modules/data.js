/* Module for managing requests and data manipulation */
var DataModule = (function(window, $)
{
	var s = {};
	
	/* Stores the results of the last successsful request */
	var logCache = {
		from:"",
		to:"",
		subreddit:"",
		logs:[]
	};
	
	var init = function()
	{
		s.uiModule = window.UIModule
	};

	var requestLogs = function(subreddit,from,to)
	{
		if(subreddit !== logCache.subreddit ||
		from !== logCache.from ||
		to !== logCache.to ||
		logCache.logs.length == 0)
		{
			logCache.from = from;
			logCache.to = to;
			logCache.subreddit = subreddit;

			var request = $.ajax({
				type: "GET",
				async:false,
				url: window.location.origin+"/logs",
				data: _.template("subreddit=<%=sub%>&start=<%=st%>&end=<%=en%>",{sub:subreddit,st:from,en:to}),
				beforeSend: s.uiModule.fetchLogsBtnLoading(true),
			});
			
			request.done(function(reply){
				if(reply.status === "success")
				{
					logCache.logs = _.map(reply.data.logs,function(str){
						return $.parseJSON(str);
					});
				}
				else
					logCache.logs = [];
			});
			
			request.always(s.uiModule.fetchLogsBtnLoading(false));
		}
		return logCache.logs;
	};
	
	var datalogAt = function(index)
	{
		return logCache.logs[index];
	};

	return {
		init: init, 
		requestLogs: requestLogs,
		datalogAt: datalogAt,
		logCache: logCache
	}
})(window, jQuery);
