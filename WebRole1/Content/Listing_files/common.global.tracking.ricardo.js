/*! ** Tracking  V 1.00 02.04.2014 11:40  **** */

$(document).ready(function() {

    // A/B Testing with Optimizely specific tracking
    var is_splitMode = window.location.href.match(/(S|s)plit(M|m)ode/) != null ? true : false;

    if (is_splitMode) {
        var script_path = '/contents/ch/scripts/tracking/tracking.splitmode.ricardo.js';
        $.getScript(script_path);
    }

    // Search specific tracking
    var is_search = window.location.href.match(/(kaufen\/|search\/index)/) != null ? true : false;

    if (is_search) {
        var script_path = '/contents/ch/scripts/tracking/tracking.search.ricardo.js';
        $.getScript(script_path);
    }

    // Tracking specific to the frontpage
    if (qxlVars && qxlVars.is_homepage === true) {
        $.getScript('/contents/ch/scripts/tracking/tracking.homepage.ricardo.js');
    }

});
