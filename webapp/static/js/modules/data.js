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
                    var logObjects = _.map(reply.data.logs,function(str){
                        var logobj = $.parseJSON(str);
                        return {
                            readers: logobj.readers,
                            subscribers: logobj.subscribers,
                            time: logobj.time,
                            day: logobj.time.split("T")[0]
                        };
                    });

                    logCache.logs = (from === to)?logObjects:reduceLogs(logObjects);
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

    /* Reduces the collection of logs into smaller one based by 
     * merging repetitive date(day) data into single element */
    var reduceLogs = function(logs)
    {
        var logDict = {};
        
        /* Merge logs into a dictionary of days */
        _.each(logs,function(log){
            if(typeof logDict[log.day] === "undefined")
            {   logDict[log.day] = {
                    time: log.day,
                    readers: log.readers,
                    subscribers: log.subscribers,
                    count:1
                };
            }
            else
            {
                logDict[log.day].readers += log.readers;
                logDict[log.day].subscribers += log.subscribers;
                logDict[log.day].count += 1;
            }
        });
        
        var newlogs = _.values(logDict);

        /* Compute averages for each property */
        return _.map(newlogs,function(log){
            return {
                time:log.time,
                readers: Math.floor(log.readers/log.count),
                subscribers: Math.floor(log.subscribers/log.count),
            }; 
        });
    };
    
    return {
        init: init, 
        requestLogs: requestLogs,
        datalogAt: datalogAt,
        logCache: logCache
    }
})(window, jQuery);
