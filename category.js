import * as geo from './geoAPI';
import * as recommend from './recommend';
import * as maskStore from  "./maskStoreEl";

let addressText = "";

async function searchClick(addressText) {
    maskStore.removeStores();
    document.querySelectorAll('#progress_loading')[0].style.visibility = 'visible';
    let result = await fetch(`
    https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/storesByAddr/json?address=${encodeURI(addressText)}`)
    .then(res => res.json());
    if(result.stores.length > 0) {
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
        maskStore.addStores(result);
    } else {
        let noResult = document.createElement('h3');
        noResult.textContent = "검색결과가 없습니다.";
        document.querySelectorAll('.content')[0].appendChild(noResult);
    }
    document.querySelectorAll('#progress_loading')[0].style.visibility = 'hidden';
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
                        <img class="q-sign" src=${require('./resource/qsign.png')} aria-expanded="false">
                    </div>
                </a>
                <div class="a-content">
                    <div class="a-text">
                        <div class="a-mobile">
                            모바일)
                        </div>
                        <p>카카오톡과 같은 메신저로 접근하셨다면 우측 상단의 설정을 누른 뒤 <span class="pointout">다른 브라우저로 열기</span>를 클릭해주세요.</p>
                        <div class="another-solution">(그래도 안되는 경우)</div>
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
                        <img class="q-sign" src=${require('./resource/qsign.png')} aria-expanded="false">
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
                        <span>주소를 입력했는데 찾는 주소가 뜨지 않아요</span>
                    </div>
                    <div class="arrow-sign">
                        <img class="q-sign" src=${require('./resource/qsign.png')} aria-expanded="false">
                    </div>
                </a>
                <div class="a-content">
                    <div class="a-text">
                        <p>자동완성 목록에 나열되는 주소는 서울시를 처음 기준으로 해서 나열됩니다.<br><br>거주하시는 주소의 도로명 또는 아파트/오피스텔 명을 입력하시면 보다 정확한 주소가 제공됩니다.</p>
                        <div class="another-solution">(주소 입력 팁)</div>
                        <p>- 도로명 또는 건물 이름을 입력해서 검색한다.</p>
                        <p><b>예)</b> 한누리대로 411, 국립중앙박물관, 상암동 1595</p>
                        <p>- '시 또는 도'단위 + 구 또는 읍/면/동 이름을 같이 붙여서 입력한다.</p>
                        <p><b>예)</b> 서울특별시 강남구 논현동, 경상북도 경주시 황오동</p>
                    </div>
                </div>
            </li>
            <li>
                <a href="#" role="button">
                    <div class="q-content">
                        <span class="q-text">Q.</span>
                        <span>주소를 입력해서 나온 판매처들이 너무 많아요</span>
                    </div>
                    <div class="arrow-sign">
                        <img class="q-sign" src=${require('./resource/qsign.png')} aria-expanded="false">
                    </div>
                </a>
                <div class="a-content">
                    <div class="a-text">
                        <p>현재 해당 서비스는 구 또는 읍/면/동 범위까지만 지원하고 있습니다. 추 후 보다 정확한 정보를 제공하기 위해 업데이트 될 예정입니다.</p>
                        <p>이용에 불편을 드려 죄송합니다.</p>
                    </div>
                </div>
            </li>
            <li>
                <a href="#" role="button">
                    <div class="q-content">
                        <span class="q-text">Q.</span>
                        <span>위치 정보를 제공하면 어떻게 되나요?</span>
                    </div>
                    <div class="arrow-sign">
                        <img class="q-sign" src=${require('./resource/qsign.png')} aria-expanded="false">
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
                <p>현재 주변의 마스크 판매처를 찾으시려면 위에서 거리를 선택 후 업데이트 버튼을 클릭해주세요.
            </ul>
            `;
            document.querySelectorAll('#update')[0].addEventListener('click', evt => {
                navigator.geolocation.getCurrentPosition(geo.success, geo.error, geo.options);
            }, false);
        }
    }, false);

    document.querySelectorAll('ul > li > .search')[0].addEventListener('click', evt => {
        if(location.hash !== '#search') {
            document.querySelectorAll('.content')[0].innerHTML = `
            <div class="address-info">
        <h3>해당 구, 동내에 존재하는 판매처 목록을 검색합니다.</h3>
        <input class="address-field" placeholder="예) 한누리대로 411, 국립중앙박물관, 상암동 1595"><button id="search-button">검색</button>
    </div>
            `;
        }
        document.addEventListener('click', evt => {
            recommend.removeRecommendList();
        }, false);
        document.querySelectorAll('.address-field')[0].addEventListener('keyup', evt => {
            if(evt.target.value.length >= 2 && !/[^ㄱ-ㅎㅏ-ㅣ가-힣0-9a-zA-Z\s-_]/.test(evt.target.value)) {
                recommend.addressRecommend(evt.target.value);
            }
            if(!document.querySelectorAll('.address-field')[0].value.length) {
                recommend.removeRecommendList();
            }
        }, false);
        document.querySelectorAll('#search-button')[0].addEventListener('click', evt => {
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
        }, false);
    }, false);
};

export {menuClick}