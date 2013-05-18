/* Module for dealing with the plot */
var PlotModule = (function(window,$)
{
	var init = function(){};

	var plot = function(logs)
	{
		var readers = [];
		
		_.each(logs,function(log,i){
			readers.push([moment.utc(log.time,"YYYY-MM-DD HH:mm"),log.readers]);
		});
		
		var settings = [
		{
			data: readers,
			color: '#FFAA42',
			label:'Readers',
			lines:{show:true},
			points:{show:true}
		},];

		var options = {
			xaxis: { mode: "time"}
		};

		$.plot("#placeholder",settings,options);

		/*
		Need to check later wether reader or subscriber selected
		$("#categswitch > button.active").text());
		*/
	};

	return {
		init: init,
		plot: plot
	};
})(window,jQuery);
