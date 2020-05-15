const Address = (function () {
    const addressProps = new WeakMap();

    class Address {
        constructor(text) {
            addressProps.set(this, { text });
        }
        
        get addressTxt() {
            return addressProps.get(this);
        }

        set addressTxt(addressText) {
            addressProps.get(this).text = addressText;
        }

        updateAddressTxt(addressText) {
            this.addressTxt = addressText;
        }
    }

    return Address;
})();

export default Address;