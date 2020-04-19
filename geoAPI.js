import * as maskStore from  "./maskStoreEl.js";

let lat = 0;
let lng = 0;

let options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};

async function success(pos) {
    let crd = pos.coords;
    lat = crd.latitude;
    lng = crd.longitude;
    
    let selectBox = document.querySelectorAll('#distance-rad')[0];
    let distnace = selectBox.options[selectBox.selectedIndex].value

    maskStore.removeStores();
    document.querySelectorAll('#progress_loading')[0].style.visibility = 'visible';
    let result = await fetch(`
    https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/storesByGeo/json?lat=${crd.latitude.toFixed(6)}&lng=${crd.longitude.toFixed(6)}&m=${distnace}`)
    .then(res => res.json());
    maskStore.addStores(result);
    document.querySelectorAll('#progress_loading')[0].style.visibility = 'hidden';
}

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}

export {lat, lng, success, error, options}