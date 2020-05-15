import "./style.css";
import Geolocation from "./geoAPI.js";
import menuClick from "./category.js";
import loadingIcon from "./resource/loading.gif";

const progressLoading = document.querySelector('#progress_loading');
const updateBtn = document.querySelectorAll('#update')[0];

function loadingIMG() {
    const loadingBar = new Image();
    loadingBar.src = `./public/${loadingIcon}`;
    progressLoading.appendChild(loadingBar);
}

function updateBtnHandler() {
    const geoLocation = new Geolocation(0, 0);
    geoLocation.updateLocation();
}

(function() {
    loadingIMG();
    window.history.pushState("", "", window.location.pathname);
    updateBtn.addEventListener('click', updateBtnHandler);
    menuClick();
})();