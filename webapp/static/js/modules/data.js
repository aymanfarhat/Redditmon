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

        if(fireRequest())
        {
            logCache.from = from;
            logCache.to = to;
            logCache.subreddit = subreddit;

            var request = $.ajax({
                type: "GET",
                async:true,
                url: window.location.protocol+'//'+window.location.host+"/logs",
                data: _.template("subreddit=<%=sub%>&start=<%=st%>&end=<%=en%>",{sub:subreddit,st:from,en:to}),
                beforeSend: s.uiModule.fetchLogsBtnLoading(true),
            });
            
            request.done(function(reply)
            {
                if(reply.status === "success"&&(typeof reply.data.logs !== "undefined" && reply.data.logs.length > 0))
                {
                    var logObjects = _.map(reply.data.logs,function(str)
                    {
                        var logobj = $.parseJSON(str);
                        return {
                            readers: logobj.readers,
                            subscribers: logobj.subscribers,
                            time: logobj.time,
                            day: logobj.time.split("T")[0]
                        };
                    });
                    
                    logs = (from === to)?logObjects:reduceLogs(logObjects);
                    logCache.logs = logs;

                    PlotModule.plot(logCache.logs);
                }
                else
                {
                    logCache.logs = (logCache.logs.length > 0)?logCache.logs:[];
                    UIModule.msgBox("Oh snap!","No results were returned, review your input and try again.");
                }
                s.uiModule.fetchLogsBtnLoading(false);
            });
        }
    };
    
    var datalogAt = function(index)
    {
        return logCache.logs[index];
    };

    /* Check if a request should be fired or not,
     * only true condition is if input has changed 
     * or last request was empty.
     * */
    var fireRequest = function()
    {
        return (subreddit !== logCache.subreddit ||
        from !== logCache.from ||
        to !== logCache.to ||
        logCache.logs.length == 0);
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
