import * as common from './common.js';
import * as recommend from './recommend.js';
import * as maskStore from  "./maskStoreEl.js";
import * as handler from "./categoryHandler.js"

let addressText = "";

async function searchClick(addressText) {
    maskStore.removeStores();
    common.loadingBar.style.visibility = 'visible';

    let result = await fetch(`
    https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/storesByAddr/json?address=${encodeURI(addressText)}`)
    .then(res => res.json());

    const content = document.querySelectorAll('.content')[0]
    if(result.stores.length > 0) {
        let pharmacyTotal = document.createElement('div');
        pharmacyTotal.classList.add('pharmacy-total');
        let pharmacyCount = document.createElement('h2');
        pharmacyCount.classList.add('pharmacy-count');
        pharmacyCount.textContent = "판매처 : ";
        let pharmacyList = document.createElement('ul');
        pharmacyList.classList.add('pharmacy-list');
        pharmacyTotal.appendChild(pharmacyCount);
        content.appendChild(pharmacyTotal);
        content.appendChild(pharmacyList);
        maskStore.addStores(result);
    } else {
        let noResult = document.createElement('h3');
        noResult.textContent = "검색결과가 없습니다.";
        content.appendChild(noResult);
    }
    common.loadingBar.style.visibility = 'hidden';
}

function locationFAQ() {
    if(location.hash !== '#faq') {
        document.querySelectorAll('.content')[0].innerHTML = common.htmlContent.faq;
        handler.superHandler.qnaClick();
    }
}

function searchHandler() {
    if(location.hash !== '#search') {
        document.querySelectorAll('.content')[0].innerHTML = common.htmlContent.search;
    }
    document.addEventListener('click', recommend.removeRecommendList());
    document.querySelectorAll('.address-field')[0].addEventListener('keyup', handler.superHandler.searchKeyup);
    document.querySelectorAll('#search-button')[0].addEventListener('click', searchClickHandler);
}

function menuClick() {
    document.querySelectorAll('ul > li > .FAQ')[0].addEventListener('click', locationFAQ);
    document.querySelectorAll('ul > li > .near')[0].addEventListener('click', handler.superHandler.locationNear);
    document.querySelectorAll('ul > li > .search')[0].addEventListener('click', searchHandler);
};

function searchClickHandler() {
    const province = ["경기도", "충청북도", "충청남도", "강원도", "제주특별자치도", "전라북도", "전라남도", "경상북도", "경상남도"];
    const bigCities = ["서울특별시", "울산광역시", "인천광역시", "부산광역시", "대전광역시", "광주광역시", "대구광역시", "세종특별자치시"];
    const provRegex = new RegExp(`${province.join('|')}`, 'g');
    const cityRegex = new RegExp(`${bigCities.join('|')}`, 'g');
    addressText = recommend.addressText || document.querySelectorAll('.address-field')[0].value;
    recommend.removeRecommendList();
    if(/.*?[시|도].*?[구|읍|면|동]/.test(addressText) && (provRegex.test(addressText) || cityRegex.test(addressText))) {
        searchClick(addressText);
    } else if((provRegex.test(addressText) || cityRegex.test(addressText)) && /.*[시|도](?=[^가-힣])*/gm.test(addressText)) {
        alert("'시 또는 도' 단위로만 검색할 수 없습니다. 해당 구 이름과 읍/면/동 이름으로 검색해주세요.");
    } else {
        alert('정확한 주소를 입력해주세요.\n(공식 행정구역명으로 검색하시는 것을 권합니다)');
    }
}

export {menuClick}