// import 'regenerator-runtime/runtime'

(function() {
    let options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    let count = 0;
    let lat = 0;

    function calcTime(date) {
        let now = new Date() - new Date(date);
        if((now / (1000 * 60)) < 60) {
            return `${Math.floor(now / (1000 * 60))}분`;
        } else if((now / (1000 * 60)) >= 60) {
            return `${Math.floor(now / (1000 * 60 * 60))}시간`;
        }
        return `${Math.floor(now / (1000 * 60 * 60 * 24))}일`;
    }

    function maskCondition(storeDatas, index) {
        // mask-text 생성
        let newMaskText = document.createElement('div');
        newMaskText.classList.add(`mask-text`);

        // mask-text > p, mask-current light, mask-remain  생성
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

        // mask-text에 mask-text > p, mask-current light, mask-remain 대입
        newMaskText.appendChild(newMaskTextP);
        newMaskText.appendChild(newMaskCurrent);
        newMaskText.appendChild(newMaskRemain);
        newMaskText.appendChild(newStockDate);

        return newMaskText;
    }

    function addMaskContent(storeDatas, index) {
        // mask-content 생성
        let newMaskContent = document.createElement('div');
        newMaskContent.classList.add(`mask-content`);

        let newMaskText = maskCondition(storeDatas, index);

        // mask-content에 mask-text, mask-current light 대입
        newMaskContent.appendChild(newMaskText);

        return newMaskContent;
    }

    function addNewElement(storeDatas, index) {
        // pharmacyN, 약국이름, 주소, mask-content 생성
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
        newAddr.textContent = storeDatas.stores[index].addr;

        // newElement 에 약국이름, 주소 대입
        newStoreHeader.appendChild(newStoreName);
        newStoreHeader.appendChild(newUpdateDate);
        newElement.appendChild(newStoreHeader);
        newElement.appendChild(newAddr);

        let newMaskContent = addMaskContent(storeDatas, index);
        // pharmacyN에 mask-content 대입
        newElement.appendChild(newMaskContent);

        return newElement;
    }

    function addStores(data) {
        let storeDatas = JSON.parse(data);
        let pharmacyCount = document.querySelectorAll('.content .pharmacy-total h2')[0].textContent + storeDatas.count + '개 지점';
        document.querySelectorAll('.content .pharmacy-total h2')[0].textContent = pharmacyCount;
        for(let i = 0; i < storeDatas.stores.length; i++) {
            let newElement = addNewElement(storeDatas, i);
            document.querySelectorAll('.pharmacy-list')[0].appendChild(newElement);
        }
    }

    function removeStores() {
        let totalCount = document.querySelectorAll('.pharmacy-total h2')[0];
        totalCount.textContent = totalCount.textContent.substring(0, 5);
        document.querySelectorAll('.pharmacy-list')[0].innerHTML = '';
    }

    async function success(pos) {
        let crd = pos.coords;
        lat = crd.latitude-count;
    
        console.log('Your current position is:');
        console.log(`Latitude : ${crd.latitude}`);
        console.log(`Longitude: ${crd.longitude}`);
        console.log(`More or less ${crd.accuracy} meters.`);
        console.log(`count : ${count}`);
        
        let selectBox = document.querySelectorAll('#distance')[0];
        let distnace = selectBox.options[selectBox.selectedIndex].value

        let result = await fetch(`
        https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/storesByGeo/json?lat=${lat.toFixed(6)}&lng=${crd.longitude.toFixed(6)}&m=${distnace}`)
        .then(res => res.text());
        removeStores();
        addStores(result);
        
        count += 0.001;
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