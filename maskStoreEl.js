import * as util from "./util";

function maskCondition(storeDatas, index) {
    let newMaskText = document.createElement('div');
    newMaskText.classList.add(`mask-text`);

    let newMaskTextP = document.createElement('p');
    newMaskTextP.textContent = "마스크 재고 : ";

    let newMaskCurrent = document.createElement('div');
    newMaskCurrent.classList.add(`mask-current`);
    if(storeDatas.stores[index].remain_stat === 'plenty') {
        newMaskCurrent.classList.add(`green`);
    } else if(storeDatas.stores[index].remain_stat === 'some') {
        newMaskCurrent.classList.add(`yellow`);
    } else if(storeDatas.stores[index].remain_stat === 'few') {
        newMaskCurrent.classList.add(`red`);
    } else if(storeDatas.stores[index].remain_stat === 'empty') {
        newMaskCurrent.classList.add(`gray`);
    } else if(storeDatas.stores[index].remain_stat === 'break') {
        newMaskCurrent.classList.add(`black`);
    }

    let newMaskRemain = document.createElement('p');
    newMaskRemain.classList.add(`mask-remain`);
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
    newStockDate.classList.add(`stock-date`);

    newMaskText.appendChild(newMaskTextP);
    newMaskText.appendChild(newMaskCurrent);
    newMaskText.appendChild(newMaskRemain);
    newMaskText.appendChild(newStockDate);

    return newMaskText;
}

function addMaskContent(storeDatas, index) {
    let newMaskContent = document.createElement('div');
    newMaskContent.classList.add(`mask-content`);

    let newMaskText = maskCondition(storeDatas, index);
    newMaskContent.appendChild(newMaskText);

    return newMaskContent;
}

function addNewElement(storeDatas, index) {
    let newElement = document.createElement('li');
    newElement.classList.add(`pharmacy${index+1}`);
    newElement.classList.add(`pharmacy-item`);

    let newStoreHeader = document.createElement('div');
    newStoreHeader.classList.add(`store-header`);
        
    let newStoreName = document.createElement('h1');
    newStoreName.textContent = storeDatas.stores[index].name;
    newStoreName.classList.add(`store-name`);

    let newUpdateDate = document.createElement('p');
    newUpdateDate.textContent = `업데이트 시간 : ${util.calcTime(storeDatas.stores[index].created_at)}전`;
    newUpdateDate.classList.add(`update-date`);

    let newAddr = document.createElement('p');
    let addrLink = document.createElement('a');
    addrLink.textContent = storeDatas.stores[index].addr;
    addrLink.href = `https://search.naver.com/search.naver?ie=UTF-8&query=${encodeURI(storeDatas.stores[index].addr)}`;
    addrLink.target = `_blank`
    addrLink.classList.add(`addr-link`);
    newAddr.appendChild(addrLink);

    newStoreHeader.appendChild(newStoreName);
    newStoreHeader.appendChild(newUpdateDate);
    newElement.appendChild(newStoreHeader);
    newElement.appendChild(newAddr);

    let newMaskContent = addMaskContent(storeDatas, index);
    newElement.appendChild(newMaskContent);

    return newElement;
}

function sortingDataByType(data) {
    let onSaleStores = data.stores.filter(s => {
        return s.remain_stat != null && s.stock_at !== null && s.created_at !== null
    })
    if(document.querySelectorAll('.sort-type')[0] && document.querySelectorAll('#stock')[0].checked) {
        data.stores = util.sortByStock(onSaleStores);
    } else if(document.querySelectorAll('.sort-type')[0] && document.querySelectorAll('#distance')[0].checked) {
        data.stores = util.sortByDistance(onSaleStores);
    } else {
        data.stores = onSaleStores;
    }

    return data;
}

function addStores(result) {
    let storeDatas = sortingDataByType(result);
    let pharmacyCount = document.querySelectorAll('.content .pharmacy-total h2')[0].textContent + ' 총 ' + storeDatas.count + '개 지점';
    pharmacyCount += `\n(현재 : ${util.isAvailableStock(storeDatas.stores)}개 지점 보유중)`
    document.querySelectorAll('.content .pharmacy-total h2')[0].textContent = pharmacyCount;

    let newNotice = document.createElement('p');
    newNotice.textContent = `주소를 클릭하시면 해당 위치를 지도로 확인할 수 있습니다`;
    newNotice.classList.add(`notice`);
    document.querySelectorAll('.content')[0].insertBefore(newNotice, document.querySelectorAll('.pharmacy-list')[0]);

    for(let i = 0; i < storeDatas.stores.length; i++) {
        let newElement = addNewElement(storeDatas, i);
        document.querySelectorAll('.pharmacy-list')[0].appendChild(newElement);
    }
}

function removeStores() {
    let totalCount = document.querySelectorAll('.pharmacy-total h2')[0];
    if(totalCount) {
        totalCount.textContent = totalCount.textContent.substring(0, 5);
    }
    if(location.hash === '#search') {
        [...document.querySelectorAll('.content')[0].children].forEach(el => el.className !== 'address-info' ? el.remove() : el)
    } else if(location.hash === '#near' || location.hash === '') {
        document.querySelectorAll('.pharmacy-list')[0].innerHTML = '';
        if(document.querySelectorAll('.notice')[0]) {
            document.querySelectorAll('.notice')[0].remove();
        }
    }   
}

export {addStores, removeStores}