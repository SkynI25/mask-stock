import * as geo from './geoAPI.js';
import * as common from './common.js';
import * as recommend from './recommend.js';

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

function locationNear() {
    if(location.hash !== '#near' && location.hash !== '') {
        document.querySelectorAll('.content')[0].innerHTML = common.htmlContent.main;
        document.querySelectorAll('#update')[0].addEventListener('click', _ => {
            navigator.geolocation.getCurrentPosition(geo.success, geo.error, geo.options)
        });
    }
}

function searchKeyup(evt) {
    setTimeout(() => {
        if(evt.target.value.length >= 2 && !/[^ㄱ-ㅎㅏ-ㅣ가-힣0-9a-zA-Z\s-_]/.test(evt.target.value)) {
            recommend.addressRecommend(evt.target.value);
        }
        if(!document.querySelectorAll('.address-field')[0].value.length) {
            recommend.removeRecommendList();
        }
    }, 500);
}

const superHandler = {
    qnaClick : qnaClick,
    qnaClickHandler : qnaClickHandler,
    locationNear : locationNear,
    searchKeyup : searchKeyup,
};

export {superHandler}