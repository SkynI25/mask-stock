let addressText = "";

require('dotenv').config('./');

function removeRecommendList() {
    if(document.querySelectorAll('.search-results')[0]) {
        document.querySelectorAll('.search-results')[0].remove();
    }
}

function initRecommendAddr(results) {
    addressText = "";
    removeRecommendList();
    let search_res = document.createElement('div');
    search_res.classList.add('search-results');
    let search_list = document.createElement('ul');
    search_res.appendChild(search_list);

    if(results.common.errorCode !== "0") {
        notFoundAddress(search_list, results.common.errorMessage);
    } else {
        const jusosToSend = results.juso.map(el => el.jibunAddr);
        const jusosToShow = results.juso.map(el => el.roadAddr);

        let jusoMap = new Map();
        for(let i = 0; i < jusosToSend.length; i++) {
            jusoMap.set(jusosToSend[i], jusosToShow[i]);
        }
        createRecommendEl(search_list, jusoMap);
    }
    document.querySelectorAll('.address-info')[0].appendChild(search_res);
}

function notFoundAddress(parent, errorMsg) {
    let listEl = document.createElement('li');
    let anchorEl = document.createElement('a');
    anchorEl.textContent = errorMsg;
    listEl.appendChild(anchorEl);
    parent.appendChild(listEl);
}

function createRecommendEl(parent, data) {
    data.forEach((val, key) => {
        let listEl = document.createElement('li');
        let anchorEl = document.createElement('a');
        anchorEl.textContent = val;
        anchorEl.addEventListener('click', evt => {
            document.querySelectorAll('.address-field')[0].value  = val;
            document.querySelectorAll('.search-results')[0].remove();
            addressText = key.split(' ').filter((el, idx) => idx <= 2).join(' ');
        }, false);
        listEl.appendChild(anchorEl);
        parent.appendChild(listEl);
    });
}

async function addressRecommend(textData) {
    const data = new URLSearchParams();
    data.append('keyword', textData)
    data.append('confmKey', process.env.API_KEY);
    data.append('resultType', 'json');
    let result = await fetch(`https://www.juso.go.kr/addrlink/addrLinkApi.do`,{
        method: 'POST',
        body: data
    })
    .then(res => res.json());
    
    initRecommendAddr(result.results);
}

export {removeRecommendList, addressRecommend, addressText};