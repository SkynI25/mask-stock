import * as util from './util.js';

const Geolocation = (function() {
    const geoProps = new WeakMap();

    class Geolocation {
        constructor(lat, lng) {
            geoProps.set(this, {lat, lng});
        }
        get userLocation() {
            return geoProps.get(this);
        }
        set userLocation({lat, lng}) {
            if(isNaN(Number(lat)) || isNaN(Number(lng))) {
                throw new Error(`Invalid location input ${lat, lng}`);
            }
            this.userLocation.lat = lat;
            this.userLocation.lng = lng;
        }
        setLocation(obj) {
            this.userLocation = obj;
        }
        
        updateLocation() {
            navigator.geolocation.getCurrentPosition(pos => util.success(pos, this), util.error, util.options);
        }
    }

    return Geolocation;
})();

export default Geolocation;