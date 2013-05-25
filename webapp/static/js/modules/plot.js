/* Module for dealing with the plot */
var PlotModule = (function(window,$)
{
    var s = {
        placeHolder:$("#placeholder"),
        plotDetail:$("#plotdetail"),
        detailLogTemplate:$("#detailLogTemp"),
        plot:null
    };
    
    var init = function()
    {
        BindUIActions();
    };

    var BindUIActions = function()
    {
        s.placeHolder.bind("plothover", function (event, pos, item) 
        {
            if(item) 
            {
                $("#tooltip").remove();

                var x = item.datapoint[0],
                    y = item.datapoint[1];
                    
                showTooltip(item.pageX, item.pageY,parseInt(y));
            }
            else
                $("#tooltip").remove();
        });
        
        s.placeHolder.bind("plotclick",function(event, pos, item)
        {
            if(item.dataIndex !==null)
            {
                var template = _.template(s.detailLogTemplate.html());
                
                var data = DataModule.datalogAt(item.dataIndex);
                s.plotDetail.html(template({
                    utc:moment(data.time).format("dddd MMMM D h:mm a"),
                    local:moment(data.time).add("minutes",moment().zone()*-1).format("dddd MMMM D h:mm a"),
                    readers:data.readers,
                    subs:data.subscribers
                }));

                s.plot.unhighlight();
                s.plot.highlight(item.series,item.datapoint);
            }
        });
    };

    var plot = function(logs)
    {
        console.log(logs);

        var logdata = [];

        var options = {
            xaxis: {mode:"time"},
            grid:{hoverable:true,clickable:true}
        };

        if(UIModule.getSelectedSwitch() == "Readers")
        {
            _.each(logs,function(log, i){
                logdata.push([moment.utc(log.time),log.readers]);
            });

            var settings = [{
                data:logdata,
                color:'#FFAA42',
                label:'Readers',
                lines:{show:true},
                points:{show:true},
                }];
        }
        else
        {
            _.each(logs,function(log, i){
                logdata.push([moment.utc(log.time),log.subscribers]);
            });

            var settings = [{
                data:logdata,
                color:'#DC143C',
                label:'Subscribers',
                lines:{show:true},
                points:{show:true},
                }];
        }
        s.plot = $.plot(s.placeHolder,settings,options);
    };

    var showTooltip = function(x, y, contents) 
    {
       $('<div id="tooltip">'+contents+'</div>').css({
            'position': 'absolute',
            'display': 'none',
            'top': y-32,
            'left': x-20,
            'border': '1px solid #CCC',
            'padding': '2px',
            'background-color': '#FFF',
            'font-size':'20px'
        }).appendTo("body").fadeIn(200);
    }

    return {
        init: init,
        plot: plot
    };
})(window,jQuery);
