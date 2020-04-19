import * as category from "./category.js";
import * as geo from "./geoAPI.js";

(function() {
    window.history.pushState("", "", window.location.pathname);
    document.querySelectorAll('#update')[0].addEventListener('click', evt => {
        navigator.geolocation.getCurrentPosition(geo.success, geo.error, geo.options);
    }, false);
    category.menuClick();
})();