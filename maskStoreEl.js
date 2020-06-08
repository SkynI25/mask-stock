import * as util from "./util.js";
import * as common from "./common.js";

function maskCondition(storeDatas, index) {
    let newMaskText = document.createElement('div');
    newMaskText.classList.add(common.classType.maskText);

    let newMaskTextP = document.createElement('p');
    newMaskTextP.textContent = "마스크 재고 : ";

    let newMaskCurrent = document.createElement('div');
    newMaskCurrent.classList.add(common.classType.maskCurrent);
    if(storeDatas.stores[index].remain_stat === 'plenty') {
        newMaskCurrent.classList.add(common.classType.greenLight);
    } else if(storeDatas.stores[index].remain_stat === 'some') {
        newMaskCurrent.classList.add(common.classType.yellowLight);
    } else if(storeDatas.stores[index].remain_stat === 'few') {
        newMaskCurrent.classList.add(common.classType.redLight);
    } else if(storeDatas.stores[index].remain_stat === 'empty') {
        newMaskCurrent.classList.add(common.classType.grayLight);
    } else if(storeDatas.stores[index].remain_stat === 'break') {
        newMaskCurrent.classList.add(common.classType.blackLight);
    }

    let newMaskRemain = document.createElement('p');
    newMaskRemain.classList.add(common.classType.maskRemain);
    if(storeDatas.stores[index].remain_stat === 'plenty') {
        newMaskRemain.textContent = `(100개 이상)`;
    } else if(storeDatas.stores[index].remain_stat === 'some') {
        newMaskRemain.textContent = `(30개 이상 100개 미만)`;
    } else if(storeDatas.stores[index].remain_stat === 'few') {
        newMaskRemain.textContent = `(2개 이상 30개 미만)`;
    } else if(storeDatas.stores[index].remain_stat === 'empty') {
        newMaskRemain.textContent = `(1개 이하)`;
    } else if(storeDatas.stores[index].remain_stat === 'break') {
        newMaskRemain.textContent = `(판매 중지)`;
    }

    let newStockDate = document.createElement('p');
    newStockDate.textContent = `입고 시간 : ${util.calcTime(storeDatas.stores[index].stock_at)}전`;
    newStockDate.classList.add(common.classType.stockDate);

    newMaskText.appendChild(newMaskTextP);
    newMaskText.appendChild(newMaskCurrent);
    newMaskText.appendChild(newMaskRemain);
    newMaskText.appendChild(newStockDate);

    return newMaskText;
}

function addMaskContent(storeDatas, index) {
    let newMaskContent = document.createElement('div');
    newMaskContent.classList.add(common.classType.maskContent);

    let newMaskText = maskCondition(storeDatas, index);
    newMaskContent.appendChild(newMaskText);

    return newMaskContent;
}

function addNewElement(storeDatas, index) {
    let newElement = document.createElement('li');
    newElement.classList.add(common.classType.pharmacyItem);

    let newStoreHeader = document.createElement('div');
    newStoreHeader.classList.add(common.classType.storeHeader);
        
    let newStoreName = document.createElement('h1');
    newStoreName.textContent = storeDatas.stores[index].name;
    newStoreName.classList.add(common.classType.storeName);

    let newUpdateDate = document.createElement('p');
    newUpdateDate.textContent = `업데이트 시간 : ${util.calcTime(storeDatas.stores[index].created_at)}전`;
    newUpdateDate.classList.add(common.classType.updateDate);

    let div4Map = document.createElement('div');
    let flexArea = document.createElement('div');
    let newAddr = document.createElement('p');
    let addrLink = document.createElement('a');
    let caretDown = document.createElement('i');
    let mapArea = document.createElement('div');
    let naverMap = document.createElement('div');
    let seeBigMap = document.createElement('a');
    addrLink.textContent = storeDatas.stores[index].addr;
    addrLink.addEventListener('click', function(evt) {
        evt.preventDefault();
    })
    seeBigMap.href = `https://search.naver.com/search.naver?ie=UTF-8&query=${encodeURI(storeDatas.stores[index].addr)}`;
    seeBigMap.target = `_blank`;
    seeBigMap.addEventListener('click', function(evt) {
        evt.stopPropagation();
    })
    addrLink.classList.add(common.classType.addrLinkClass);

    div4Map.setAttribute('aria-expanded', false);
    div4Map.classList.add('map-trigger');
    flexArea.classList.add('map-trigger__flex-Area');
    caretDown.classList.add('fas', 'fa-caret-down', 'fa-2x', 'flip-normal');
    
    let id = index === 0 ? `map` : `map${index+1}`;
    naverMap.id = id;
    naverMap.classList.add('map-trigger__map');
    seeBigMap.classList.add('map-trigger__mapText');
    seeBigMap.textContent = "웹에서 검색하기";
    newAddr.appendChild(addrLink);
    flexArea.appendChild(newAddr);
    flexArea.appendChild(caretDown);
    div4Map.appendChild(flexArea);
    mapArea.appendChild(naverMap);
    mapArea.appendChild(seeBigMap);
    mapArea.classList.add('hide');
    div4Map.appendChild(mapArea);
    flexArea.addEventListener('click', () => {
        const isExpanded = div4Map.getAttribute('aria-expanded') === "false" ? false : true;
        if(isExpanded) {
            caretDown.classList.add('flip-reverse');
            caretDown.classList.remove('flip-normal');
            div4Map.setAttribute('aria-expanded', false);
            mapArea.classList.toggle('hide');
        } else {
            if(!caretDown.classList.contains('flip-normal')) {
                caretDown.classList.add('flip-normal');
            }
            if(caretDown.classList.contains('flip-reverse')) {
                caretDown.classList.remove('flip-reverse');
            }
            mapArea.classList.toggle('hide');
            div4Map.setAttribute('aria-expanded', true);
            const map = new naver.maps.Map(id, {
                center: new naver.maps.LatLng(storeDatas.stores[index].lat, storeDatas.stores[index].lng),
                zoom: 15
            });
            
            new naver.maps.Marker({
                position: new naver.maps.LatLng(storeDatas.stores[index].lat, storeDatas.stores[index].lng),
                map: map
            });
        }
    });

    newStoreHeader.appendChild(newStoreName);
    newStoreHeader.appendChild(newUpdateDate);
    newElement.appendChild(newStoreHeader);
    newElement.appendChild(div4Map);

    let newMaskContent = addMaskContent(storeDatas, index);
    newElement.appendChild(newMaskContent);

    return newElement;
}

function sortingDataByType(data, geo) {
    const sortType = document.querySelectorAll('.sort-type')[0];
    
    let onSaleStores = data.stores.filter(s => {
        return s.remain_stat != null && s.stock_at !== null && s.created_at !== null
    })
    if(sortType && document.querySelectorAll('#stock')[0].checked) {
        data.stores = util.sortByStock(onSaleStores);
    } else if(sortType && document.querySelectorAll('#distance')[0].checked) {
        data.stores = util.sortByDistance(onSaleStores, geo);
    } else {
        data.stores = onSaleStores;
    }

    return data;
}

function addStores(result, geo) {
    const storeDatas = sortingDataByType(result, geo);
    const searchResult = document.querySelectorAll('.content .pharmacy-total h2')[0];
    let pharmacyCount = searchResult.textContent + ' 총 ' + storeDatas.count + '개 지점';
    pharmacyCount += `\n(현재 : ${util.isAvailableStock(storeDatas.stores)}개 지점 보유중)`
    searchResult.textContent = pharmacyCount;

    const newNotice = document.createElement('p');
    newNotice.textContent = `주소를 클릭하시면 해당 위치를 지도로 확인할 수 있습니다`;
    newNotice.classList.add(common.classType.noticeClass);

    const pharmacyList = document.querySelectorAll('.pharmacy-list')[0];
    document.querySelectorAll('.content')[0].insertBefore(newNotice, pharmacyList);

    for(let i = 0; i < storeDatas.stores.length; i++) {
        const newElement = addNewElement(storeDatas, i);
        pharmacyList.appendChild(newElement);
    }
}

function removeStores() {
    const notice = document.querySelectorAll('.notice');
    const totalCount = document.querySelectorAll('.pharmacy-total h2');

    if(totalCount.length > 0) {
        totalCount[0].textContent = totalCount[0].textContent.substring(0, 5);
        totalCount.forEach((el, i) => {
            if(i > 0) {
                el.remove();
            }
        });
    }
    if(location.hash === '#search') {
        [...document.querySelectorAll('.content')[0].children].forEach(el => el.className !== common.classType.addressInfo ? el.remove() : el)
    } else if(location.hash === '#near' || location.hash === '') {
        document.querySelectorAll('.pharmacy-list')[0].innerHTML = '';
        if(notice) {
            notice.forEach(el => el.remove());
        }
    }   
}

export {addStores, removeStores}