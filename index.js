import "./style.css";
import * as geo from "./geoAPI.js";
import * as category from "./category.js";
import loadingIcon from "./resource/loading.gif";

const progressLoading = document.querySelector('#progress_loading');

function loadingIMG() {
    const loadingBar = new Image();
    loadingBar.src = `./public/${loadingIcon}`;
    progressLoading.appendChild(loadingBar);
}

(function() {
    loadingIMG();
    window.history.pushState("", "", window.location.pathname);
    document.querySelectorAll('#update')[0].addEventListener('click', _ => {
        navigator.geolocation.getCurrentPosition(geo.success, geo.error, geo.options);
    }, false);
    category.menuClick();
})();