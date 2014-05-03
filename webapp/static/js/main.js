requirejs.config({
    paths: {
        jquery: [
            'http://cdnjs.cloudflare.com/ajax/libs/jquery/1.9.1/jquery.min',
            'vendor/jquery.min'
        ],
        bootstrap: [
            'http://netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/js/bootstrap.min',
            'vendor/bootstrap'
        ],
        underscore: [
            'http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4/underscore-min"',
            'vendor/underscore-min'
        ],
        moment: [
            'http://cdnjs.cloudflare.com/ajax/libs/moment.js/2.0.0/moment.min',
            'vendor/moment.min'
        ],
        jquery_flot: [
            'http://cdnjs.cloudflare.com/ajax/libs/flot/0.8/jquery.flot.min',
            'vendor/jquery.flot.min'
        ],
        jquery_flot_time: [
            'vendor/jquery.flot.time'
        ],
        bootstrap-datepicker: [
            'vendor/bootstrap-datepicker'
        ]
    }
});

// <script type="text/javascript" charset="utf-8" src="static/js/modules/ui.js"></script>
// <script type="text/javascript" charset="utf-8" src="static/js/modules/data.js"></script>
// <script type="text/javascript" charset="utf-8" src="static/js/modules/plot.js"></script>

// <script type="text/javascript" charset="utf-8">
//     (function(){
//         UIModule.init();
//         DataModule.init();
//         PlotModule.init();
//     })();
// </script>
//

require(['jquery', 'bootstrap', 'underscore', 'moment', 'jquery_flot', 'jquery_flot_time', 'bootstrap_datepicker'], 
        function(jquery, bootstrap, underscore, moment, jquery_float, jquery_flot_time, bootstrap_datepicker) {
});
