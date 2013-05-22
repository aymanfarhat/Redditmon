/* Module for dealing with the plot */
var PlotModule = (function(window,$)
{
	var s = {
		placeHolder:$("#placeholder"),
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
				if (previousPoint != item.dataIndex) 
				{
					previousPoint = item.dataIndex;
					
					$("#tooltip").remove();

					var x = item.datapoint[0],
						y = item.datapoint[1];
					
					showTooltip(item.pageX, item.pageY,parseInt(y));
				}
			}
			else {
				$("#tooltip").remove();
				previousPoint = null;            
			}
		});
		
		s.placeHolder.bind("plotclick",function(event, pos, item){
			console.log("click event");	
		});
	};

	var plot = function(logs)
	{
		var readers = [];
		
		_.each(logs,function(log, i){
			readers.push([moment.utc(log.time,"YYYY-MM-DD HH:mm"),log.readers]);
		});
		
		var settings = [{
			data: readers,
			color: '#FFAA42',
			label:'Readers',
			lines:{show:true},
			points:{show:true},
			}];

		var options = {
			xaxis: {mode:"time"},
			grid:{hoverable:true,clickable:true}
		};

		$.plot(s.placeHolder,settings,options);

		/*
		Need to check later wether reader or subscriber selected
		$("#categswitch > button.active").text());
		*/
	};

 	var showTooltip = function(x, y, contents) 
	{
       $('<div id="tooltip">'+contents+'</div>').css({
            'position': 'absolute',
            'display': 'none',
            'top': y-30,
            'left': x-30,
            'border': '1px solid #CCC',
            'padding': '2px',
            'background-color': '#FFF',
            'opacity': 0.80,
			'font-size':'20px'
        }).appendTo("body").fadeIn(200);
    }

	return {
		init: init,
		plot: plot
	};
})(window,jQuery);
