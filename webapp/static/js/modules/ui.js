/* Module for managing the user interface elements and their events */
var UIModule = function(window,$)
{
    var s = {
        dp: $(".datepicker").datepicker({autoclose:true,format:"DD MM dd, yyyy"}),
        aboutModal: $("#aboutModal"),
        msgModal: $("#msgModal"),
        msgModal_text: $("#msgModal #msg"),
        msgModal_title: $("#msgModal #title"),
        subredditBox: $("#subreddit"),
        subredditBox_title: $("#subreddit .txt"),
        subredditChoice: $("#subreddit_select a"),
        date_from: $("#date_from"),
        date_to: $("#date_to"),
        fetchLogsBtn: $("#fetchLogs"),
        fetchLogsBtn_icon: $("#fetchLogs i"),
        fetchLogsBtn_text: $("#fetchLogs span"),
        noAboutCheck: $('#noShowAboutDiag'),
        categSwitch: $('#categswitch > button.btn'),
        selectedCategSwitch: $("#categswitch button.active").text()
    };
    
    var init = function()
    {
        var self = this;
    
        bindUIActions();

        /* Detect other modules */
        s.dataModule = window.DataModule;
        s.plotModule = window.PlotModule;

        /* Date Picker default values */
        s.dp.datepicker("setValue");
        s.dp.attr("data-val",moment(new Date()).format("YYYY-MM-DD"));
    };
    
    var bindUIActions = function()
    {
        $(window).load(dispAbout());
        
        s.dp.on('changeDate',function(e){
            $(this).attr("data-val",moment(e.date).format("YYYY-MM-DD"));
        });

        s.subredditChoice.on('click',function(event)
        {
            s.subredditBox_title.text($(this).text());
            s.subredditBox.attr("data-val", $(this).data("value"));
            s.date_from.attr("disabled",false);
            s.date_to.attr("disabled",false);
            s.fetchLogsBtn.removeClass("disabled");
        });

        s.noAboutCheck.on('click',function(event)
        {
            if(Modernizr.localstorage)
            {
                var val = ($(this).is(":checked"))?"1":"0";
                localStorage.setItem('noAboutOnStart',val)  
            }
        });

        s.fetchLogsBtn.on('click',function(event)
        {
            if(!$(this).hasClass("disabled"))
            {
                var subreddit = s.subredditBox.attr('data-val');
                var start = s.date_from.attr('data-val');
                var end = s.date_to.attr('data-val');
                
                DataModule.requestLogs(subreddit,start,end);
            }
        });

        s.categSwitch.on('click',function(event)
        {
            s.selectedCategSwitch = $(this).text();

            if(DataModule.logCache.logs.length > 0)
                PlotModule.plot(DataModule.logCache.logs);
        });
    };
    
    var fetchLogsBtnLoading = function(loading)
    {
        if(loading === true)
        {
            s.fetchLogsBtn.addClass("disabled");
            s.fetchLogsBtn_icon.addClass("icon-spin");
            s.fetchLogsBtn_text.text("Fetching...");
        }
        else
        {
            s.fetchLogsBtn.removeClass("disabled");
            s.fetchLogsBtn_icon.removeClass("icon-spin");
            s.fetchLogsBtn_text.text("Fetch");
        }
    };

    var dispAbout = function()
    {
        if (!(Modernizr.localstorage && localStorage.getItem('noAboutOnStart') === "1"))
            s.aboutModal.modal("show");
        else
            s.noAboutCheck.prop('checked',true);
    };
    
    var msgBox = function(title,body)
    {
        s.msgModal_title.text(title);
        s.msgModal_text.text(body);
        s.msgModal.modal("show");
    };
    
    var getSelectedSwitch = function(){ return s.selectedCategSwitch; }
    
    /* Gets the number of days selected in the date range */
    var selectedDaysCount = function()
    {
        var start = moment(s.date_from.attr('data-val'));
        var end = moment(s.date_to.attr('data-val'));
        
        return end.diff(start,'days') + 1;
    }
    
    return { 
        init: init,
        msgBox: msgBox,
        fetchLogsBtnLoading: fetchLogsBtnLoading,
        getSelectedSwitch: getSelectedSwitch,
        selectedDaysCount: selectedDaysCount
    };
}(window,jQuery);
