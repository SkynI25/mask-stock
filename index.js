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

    function sortByStock(data) {
        let stockMap = new Map([
            ['plenty', 5],
            ['some', 4],
            ['few', 3],
            ['empty', 2],
            ['break', 1]
        ]);

        let storesMap = new Map();
        for(let i = 0; i < data.length; i++) {
            storesMap.set(i, stockMap.get(data[i].remain_stat));
        }
        let sortedMap = [...storesMap.entries()].sort((a,b) => {
            return a[1] < b[1] ? 1 : a[1] > b[1] ? -1 : 0;
        });
        let sortedArr = [];
        for(let i = 0; i < sortedMap.length; i++) {
            let index = sortedMap[i][0];
            sortedArr.push(data[index]);
        }

        return sortedArr;
    }

    function sortingDataByType(data) {
        let onSaleStores = data.stores.filter(s => {
            return s.remain_stat != null && s.stock_at !== null && s.created_at !== null
        })
        if(document.querySelectorAll('#stock')[0] && document.querySelectorAll('#stock')[0].checked) {
            data.stores = sortByStock(onSaleStores);
        } else {
            data.stores = sortByDistance(onSaleStores);
        }

        return data;
    }

    function addStores(data) {
        let storeDatas = sortingDataByType(JSON.parse(data));
        let pharmacyCount = document.querySelectorAll('.content .pharmacy-total h2')[0].textContent + ' 총 ' + storeDatas.count + '개 지점';
        pharmacyCount += `\n(현재 : ${isAvailableStock(storeDatas.stores)}개 지점 보유중)`
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
        totalCount.textContent = totalCount.textContent.substring(0, 5);
        document.querySelectorAll('.pharmacy-list')[0].innerHTML = '';
        if(document.querySelectorAll('.notice')[0]) {
            document.querySelectorAll('.notice')[0].remove();
        }
    }

    async function success(pos) {
        let crd = pos.coords;
        lat = crd.latitude;
        lng = crd.longitude;
        
        let selectBox = document.querySelectorAll('#distance-rad')[0];
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

    function qnaClick() {
        const aList = document.querySelectorAll('.faq-list li a');
        for(let a of aList) {
            a.addEventListener('click', evt => {
                evt.preventDefault();
                evt.stopPropagation();
                let setAriaExpanded = a.children[1].children[0].getAttribute('aria-expanded') === "false" ? "true" : "false";
                a.children[1].children[0].setAttribute('aria-expanded', setAriaExpanded);
                let isDisplay = a.parentElement.children[1].style.display;
                a.parentElement.children[1].style.display = isDisplay === 'block' ? 'none' : 'block';
            });
        }
    }
    
    async function searchClick(addressText) {
        if(document.querySelectorAll('.pharmacy-total h2')[0]) {
            removeStores();
        }
        document.querySelectorAll('#progress_loading')[0].style.visibility = 'visible';
        let result = await fetch(`
        https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/storesByAddr/json?address=${encodeURI(addressText)}`)
        .then(res => res.text());
        let pharmacyTotal = document.createElement('div');
        pharmacyTotal.classList.add('pharmacy-total');
        let pharmacyCount = document.createElement('h2');
        pharmacyCount.classList.add('pharmacy-count');
        pharmacyCount.textContent = "판매처 : ";
        let pharmacyList = document.createElement('ul');
        pharmacyList.classList.add('pharmacy-list');
        pharmacyTotal.appendChild(pharmacyCount);
        document.querySelectorAll('.content')[0].appendChild(pharmacyTotal);
        document.querySelectorAll('.content')[0].appendChild(pharmacyList);
        addStores(result);
        document.querySelectorAll('#progress_loading')[0].style.visibility = 'hidden';
    }

    function menuClick() {
        document.querySelectorAll('ul > li > .FAQ')[0].addEventListener('click', evt => {
            if(location.hash !== '#faq') {
                document.querySelectorAll('.content')[0].innerHTML = `
                <div class="faq-title">
                <h3>FAQ</h3>
            </div>
            <ul class="faq-list">
                <li>
                    <a href="#" role="button">
                        <div class="q-content">
                            <span class="q-text">Q.</span>
                            <span>위치 및 재고 업데이트 버튼을 눌러도 목록이 안 떠요</span>
                        </div>
                        <div class="arrow-sign">
                            <img class="q-sign" src="resource/qsign.png" aria-expanded="false">
                        </div>
                    </a>
                    <div class="a-content">
                        <div class="a-text">
                            <div class="a-mobile">
                                모바일)
                            </div>
                            <p>1단계 : 휴대폰의 위치를 킨다.</p>
                            <p>2단계 : 사용하는 브라우저의 캐시를 지운다.</p>
                            <p>3단계 : 휴대폰 설정 > 애플리케이션 > Chrome > 앱 권한으로 들어가서 위치 권한을 허용해준다. (이미 허용되어 있는 경우 이 단계는 무시)</p>
                            <p>4단계 : 사이트에 재접속해서 '위치 및 재고 업데이트' 버튼을 누르면 '기기의 위치에 액세스하려고 합니다' 라는 팝업이 뜬다.</p>
                            <p>'허용' 버튼을 클릭해준다.</p>
        
                            <div class="another-solution">(위 방법으로도 안되는 경우)</div>
                            <p>Galaxy Q6 기종의 경우 위 방법으로 해결이 안되는 것으로 확인되었습니다.<br>
                            이 경우 play 스토어에서 새로운 모바일 브라우저(예: firefox)를 설치하셔서 사이트에 접속하시길 권장드립니다.</p>
                        </div>
                    </div>
                </li>
                <li>
                    <a href="#" role="button">
                        <div class="q-content">
                            <span class="q-text">Q.</span>
                            <span>판매처는 약국만 있나요?</span>
                        </div>
                        <div class="arrow-sign">
                            <img class="q-sign" src="resource/qsign.png" aria-expanded="false">
                        </div>
                    </a>
                    <div class="a-content">
                        <div class="a-text">
                            <p>현재 정부에서 제공하는 데이터로는 약국, 우체국, 하나로 마트 총 3개의 판매처에서 마스크를 판매하는 것으로 확인되었습니다.</p>
                        </div>
                    </div>
                </li>
                <li>
                    <a href="#" role="button">
                        <div class="q-content">
                            <span class="q-text">Q.</span>
                            <span>주소를 입력했는데 검색이 안되요</span>
                        </div>
                        <div class="arrow-sign">
                            <img class="q-sign" src="resource/qsign.png" aria-expanded="false">
                        </div>
                    </a>
                    <div class="a-content">
                        <div class="a-text">
                            <p>'시 또는 도'단위만 입력하면 검색이 불가능합니다. 구 또는 읍/면/동 이름을 같이 입력해주시기 바랍니다.<br><b>예)</b> '서울특별시 강남구' 또는 '서울특별시 강남구 논현동'</p>
                            <div class="another-solution">('시' 또는 '도'를 입력했지만 안되는 경우)</div>
                            <p>현재 공식 행정구역명으로만 검색이 가능합니다. '제주도'의 경우 '<b>제주특별자치도</b>'로, '세종시'의 경우 '<b>세종특별자치시</b>'과 같이 입력하여 주시기 바랍니다.</p>
                        </div>
                    </div>
                </li>
                <li>
                <li>
                    <a href="#" role="button">
                        <div class="q-content">
                            <span class="q-text">Q.</span>
                            <span>위치 정보를 제공하면 어떻게 되나요?</span>
                        </div>
                        <div class="arrow-sign">
                            <img class="q-sign" src="resource/qsign.png" aria-expanded="false">
                        </div>
                    </a>
                    <div class="a-content">
                        <div class="a-text">
                            <p>해당 위치 정보를 통해 근처에 있는 판매처 목록을 보여줍니다. 위치 정보는 따로 저장되거나 절대 악용되지 않습니다.</p>
                        </div>
                    </div>
                </li>
            </ul>
            <div class="service-provider">
                <h3>원하시는 정보를 찾지 못하셨나요?</h3>
                <p>아래 E-mail로 연락을 주시면 친절히 안내해드리겠습니다.</p>
                <p><a href="mailto:rlxo1651@naver.com">E-mail : rlxo1651@naver.com</a></p>
            </div>
                `;
                qnaClick();
            }
        }, false);
    
        document.querySelectorAll('ul > li > .near')[0].addEventListener('click', evt => {
            if(location.hash !== '#near' && location.hash !== '') {
                document.querySelectorAll('.content')[0].innerHTML = `
                <div class="pharmacy-total">
                    <h2 class="pharmacy-count">판매처 : </h2>
                    <div class="pharmacy-data">
                        <div class="select-distance">
                            <select id="distance-rad">
                                <option value="500">반경 500m</option>
                                <option value="1000">반경 1000m</option>
                                <option value="1500">반경 1500m</option>
                                <option value="2000">반경 2000m</option>
                                <option value="3000">반경 3000m</option>
                                <option value="4000">반경 4000m</option>
                                <option value="5000">반경 5000m</option>
                            </select>
                        </div>
                        <div class="sort-type">
                            <input type="radio" id="distance" name="sort_type" value="distance" checked="checked">
                            <label for="distance">거리순</label>
                            <input type="radio" id="stock" name="sort_type" value="stock">
                            <label for="stock">재고순</label>
                        </div>
                        <button id="update">위치 및 재고<br>업데이트</button>
                    </div>
                </div>
                <ul class="pharmacy-list">
                    <p>현재 주변의 마스크 판매처를 찾으시려면 위에서 거리를 선택 후 업데이트 버튼을 클릭해주세요.<br>
                메신저로 접근하셨다면 우측 상단의 설정을 누른 뒤 <span class="pointout">다른 브라우저로 열기</span>를 클릭해주세요.</p>
                </ul>
                `;
                document.querySelectorAll('#update')[0].addEventListener('click', evt => {
                    navigator.geolocation.getCurrentPosition(success, error, options);
                }, false);
            }
        }, false);

        document.querySelectorAll('ul > li > .search')[0].addEventListener('click', evt => {
            if(location.hash !== '#search') {
                document.querySelectorAll('.content')[0].innerHTML = `
                <div class="address-info">
            <h3>해당 구, 동내에 존재하는 판매처 목록을 검색합니다.</h3>
            <input class="address-field" placeholder="예) 서울특별시 강남구, 경상북도 경주시 황오동"><button id="search-button">검색</button>
        </div>
                `;
            }
            document.querySelectorAll('#search-button')[0].addEventListener('click', evt => {
                let addressText = document.querySelectorAll('.address-field')[0].value;
                const province = ["경기도", "충청북도", "충청남도", "강원도", "제주특별자치도", "전라북도", "전라남도", "경상북도", "경상남도"];
                const bigCities = ["서울특별시", "울산광역시", "인천광역시", "부산광역시", "대전광역시", "광주광역시", "대구광역시", "세종특별자치시"];
                const provRegex = new RegExp(`${province.join('|')}`, 'g');
                const cityRegex = new RegExp(`${bigCities.join('|')}`, 'g');
                if(/.*?[시|도].*?[구|읍|면|동]/.test(addressText) && (provRegex.test(addressText) || cityRegex.test(addressText))) {
                    searchClick(addressText);
                } else if((provRegex.test(addressText) || cityRegex.test(addressText)) && /.*[시|도](?=[^가-힣])*/gm.test(addressText)) {
                    alert("'시 또는 도' 단위로만 검색할 수 없습니다. 해당 구 이름과 읍/면/동 이름으로 검색해주세요.");
                } else {
                    alert('정확한 주소를 입력해주세요.\n(공식 행정구역명으로 검색하시는 것을 권합니다)');
                }
            }, false);
        }, false);
    };

    window.history.pushState("", "", window.location.pathname);
    document.querySelectorAll('#update')[0].addEventListener('click', evt => {
        navigator.geolocation.getCurrentPosition(success, error, options);
    }, false);
    menuClick();
})();