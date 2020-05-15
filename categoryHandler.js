import Geolocation from './geoAPI.js';
import * as common from './common.js';
import * as recommend from './recommend.js';

let content = document.querySelectorAll('.content')[0];

function qnaClickHandler(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    let setAriaExpanded = this.children[1].children[0].getAttribute('aria-expanded') === "false" ? "true" : "false";
    this.children[1].children[0].setAttribute('aria-expanded', setAriaExpanded);
    let isDisplay = this.parentElement.children[1].style.display;
    this.parentElement.children[1].style.display = isDisplay === 'block' ? 'none' : 'block';
}

function qnaClick() {
    const aList = document.querySelectorAll('.faq-list li a');
    for(let a of aList) {
        a.addEventListener('click', qnaClickHandler);
    }
}

function updateBtnHandler() {
    const geoLocation = new Geolocation(0, 0);
    geoLocation.updateLocation();
}

function locationNear() {
    if(location.hash !== '#near' && location.hash !== '') {
        content.innerHTML = common.htmlContent.main;

        const updateBtn = document.querySelectorAll('#update')[0];
        updateBtn.addEventListener('click', updateBtnHandler);
    }
}

function searchKeyup(evt) {
    const addressField = document.querySelectorAll('.address-field')[0];

    setTimeout(() => {
        if(evt.target.value.length >= 2 && !/[^ㄱ-ㅎㅏ-ㅣ가-힣0-9a-zA-Z\s-_]/.test(evt.target.value)) {
            recommend.addressRecommend(evt.target.value);
        }
        if(!addressField.value.length) {
            recommend.removeRecommendList();
        }
    }, 500);
}

const superHandler = {
    qnaClick,
    qnaClickHandler,
    locationNear,
    searchKeyup,
};

export default superHandler;