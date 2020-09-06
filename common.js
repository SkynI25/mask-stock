const maskText = `mask-text`;
const maskCurrent = `mask-current`;
const greenLight = `green`;
const yellowLight = `yellow`;
const redLight = `red`;
const grayLight = `gray`;
const blackLight = `black`;
const maskRemain = `mask-remain`;
const stockDate = `stock-date`;
const maskContent = `mask-content`;
const pharmacyItem = `pharmacy-item`;
const storeHeader = `store-header`;
const storeName = `store-name`;
const updateDate = `update-date`;
const addrLinkClass = `addr-link`;
const noticeClass = `notice`;
const addressInfo = 'address-info';
const loadingBar = document.querySelectorAll('#progress_loading')[0];

const classType = {
    maskText : maskText,
    maskCurrent : maskCurrent,
    greenLight : greenLight ,
    yellowLight : yellowLight,
    redLight : redLight,
    grayLight: grayLight,
    blackLight : blackLight,
    maskRemain  : maskRemain,
    stockDate : stockDate,
    maskContent : maskContent,
    pharmacyItem : pharmacyItem,
    storeHeader : storeHeader,
    storeName : storeName,
    updateDate  : updateDate,
    addrLinkClass : addrLinkClass,
    noticeClass : noticeClass,
    addressInfo : addressInfo,
}

const elementType = {
    
}

const htmlContent = {
    main : `
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
        <h2>안내말씀 드립니다.</h2>
        <p>현재 마스크 재고 API가 운영 중단 됨에 따라 현 서비스는 운영되지 않고 있습니다.
            불편함을 드려 죄송합니다.</p>
        <p>추후에 더 나은 서비스로 다시 찾아뵙겠습니다.</p>
    </ul>
    `,
    faq: `
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
                <img class="q-sign" src="./resource/qsign.png" aria-expanded="false">
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
                <img class="q-sign" src="./resource/qsign.png" aria-expanded="false">
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
                <img class="q-sign" src="./resource/qsign.png" aria-expanded="false">
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
                <img class="q-sign" src="./resource/qsign.png" aria-expanded="false">
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
                <img class="q-sign" src="./resource/qsign.png" aria-expanded="false">
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
    `,
    search : `
    <div class="address-info">
        <h3>해당 구, 동내에 존재하는 판매처 목록을 검색합니다.</h3>
        <input class="address-field" placeholder="예) 한누리대로 411, 국립중앙박물관, 상암동 1595"><button id="search-button">검색</button>
    </div>
    <div class="service-noti">
        <h2>안내말씀 드립니다.</h2>
        <p>현재 마스크 재고 API가 운영 중단 됨에 따라 현 서비스는 운영되지 않고 있습니다.
            불편함을 드려 죄송합니다.</p>
        <p>추후에 더 나은 서비스로 다시 찾아뵙겠습니다.</p>
    </div>
`
}

export {classType, elementType, loadingBar, htmlContent};