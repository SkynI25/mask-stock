import 'regenerator-runtime/runtime'

(function() {
    let options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    let lat = 0;
    let lng = 0;

    function calcTime(date) {
        let now = new Date() - new Date(date);
        if((now / (1000 * 60 * 60 * 24)) >= 1) {
            return `${Math.floor(now / (1000 * 60 * 60 * 24))}일`;
        } else if((now / (1000 * 60 * 60)) >= 1) {
            return `${Math.floor(now / (1000 * 60 * 60))}시간`;
        }
        return `${Math.floor(now / (1000 * 60))}분`;
    }

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
        newStockDate.textContent = `입고 시간 : ${calcTime(storeDatas.stores[index].stock_at)}전`;
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
        newUpdateDate.textContent = `업데이트 시간 : ${calcTime(storeDatas.stores[index].created_at)}전`;
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

    function isAvailableStock(data) {
        return data.filter(s => s.remain_stat !== 'break').length;
    }

    function haversineFormula(data) {
        let toRadians = Math.PI / 180;
        let R = 6371e3;
        let theta1 = lat * toRadians;
        let theta2 = data.lat * toRadians;
        let deltaTheta = Math.abs(data.lat - lat) * toRadians;
        let deltaGamma = Math.abs(data.lng - lng) * toRadians;

        let a = Math.sin(deltaTheta/2) * Math.sin(deltaTheta/2) +
        Math.cos(theta1) * Math.cos(theta2) * Math.sin(deltaGamma/2) * Math.sin(deltaGamma/2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        return R * c;
    }

    function sortByDistance(data) {
        let sortMap = new Map();
        for(let i = 0; i < data.length; i++) {
            sortMap.set(i, haversineFormula(data[i]));
        }
        let sortedMap = [...sortMap.entries()].sort((a,b) => {
            return a[1] - b[1] > 0 ? 1 : a[1] - b[1] < 0 ? -1 : 0;
        });
        let sortedArr = [];
        for(let i = 0; i < sortedMap.length; i++) {
            let index = sortedMap[i][0];
            sortedArr.push(data[index]);
        }
        return sortedArr;
    }

    function sortingDataByType(data) {
        let stockMap = new Map([
            ['plenty', 5],
            ['some', 4],
            ['few', 3],
            ['empty', 2],
            ['break', 1]
        ]);

        if(document.querySelectorAll('#stock')[0].checked) {
            data.stores = data.stores.sort((a,b) => {
                return stockMap.get(a.remain_stat) - stockMap.get(b.remain_stat) < 0 ?
                1 : stockMap.get(a.remain_stat) - stockMap.get(b.remain_stat) > 0 ? -1 : 0
            });
        } else {
            data.stores = sortByDistance(data.stores);
        }

        return data;
    }

    function addStores(data) {
        let storeDatas = sortingDataByType(JSON.parse(data));
        let pharmacyCount = document.querySelectorAll('.content .pharmacy-total h2')[0].textContent + '총 ' + storeDatas.count + '개 지점';
        pharmacyCount += `\n(현재 : ${isAvailableStock(storeDatas.stores)}개 지점 보유중)`
        document.querySelectorAll('.content .pharmacy-total h2')[0].textContent = pharmacyCount;
        for(let i = 0; i < storeDatas.stores.length; i++) {
            if(storeDatas.stores[i].remain_stat != null && storeDatas.stores[i].stock_at !== null && storeDatas.stores[i].created_at !== null) {
                let newElement = addNewElement(storeDatas, i);
                document.querySelectorAll('.pharmacy-list')[0].appendChild(newElement);
            }
        }
    }

    function removeStores() {
        let totalCount = document.querySelectorAll('.pharmacy-total h2')[0];
        totalCount.textContent = totalCount.textContent.substring(0, 5);
        document.querySelectorAll('.pharmacy-list')[0].innerHTML = '';
    }

    async function success(pos) {
        let crd = pos.coords;
        lat = crd.latitude;
        lng = crd.longitude;
        
        let selectBox = document.querySelectorAll('#distance')[0];
        let distnace = selectBox.options[selectBox.selectedIndex].value

        removeStores();
        document.querySelectorAll('#progress_loading')[0].style.visibility = 'visible';
        let result = await fetch(`
        https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/storesByGeo/json?lat=${crd.latitude.toFixed(6)}&lng=${crd.longitude.toFixed(6)}&m=${distnace}`)
        .then(res => res.text());
        addStores(result);
        document.querySelectorAll('#progress_loading')[0].style.visibility = 'hidden';
    }
    
    function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    document.querySelectorAll('#update')[0].addEventListener('click', evt => {
        navigator.permissions.query({name:'geolocation'}).then(function(result) {
            if (result.state == 'granted') {
                navigator.geolocation.getCurrentPosition(success, error, options);
            } else if (result.state == 'prompt') {
                navigator.geolocation.getCurrentPosition(success, error, options);
            }
        });
    }, false);
})();