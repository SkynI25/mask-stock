# 마스크 재고 알림 서비스

사람들이 마스크 재고 현황을 쉽게 파악하여 편하게 구할 수 있도록 도움을 줌

## URL
[mask-stock](https://www.mask-stock.world)

## Features
* 주소 입력 시 추천 기능 제공
* 마스크 재고 현황 색깔별로 표현
* 판매처 목록을 재고순 및 거리순으로 정렬
* 현 위치 기준 500m 반경 ~ 5000m 반경까지 검색

## Getting started

이 프로젝트는 vanila javascript로 짜여졌으므로 별도의 라이브러리나 프레임워크는 필요하지 않습니다.

### Prerequisites

http-server 모듈의 경우 별도의 의존성이 없으므로 개발할 때 설치하여 사용하시길 권합니다.<br>
dotenv 모듈의 경우 API_KEY 을 가릴 용도로 사용합니다.

```
http-server, dotenv
```

### Installing

먼저 아래 명령어를 입력하여 package.json 파일을 생성합니다
```
npm init
```

그리고 http-server를 아래 명령어를 입력해 설치합니다.
```
npm install -g http-server
```

마지막으로 dotenv 를 설치합니다.

```
npm install -D dotenv
```

## Authors

* **Skyni25** - *whole process*

## License

This project is licensed under the MIT License

## Acknowledgments

* [Google Developer Doc](https://developers.google.com/web/fundamentals/native-hardware/user-location)
* [jongpak](https://developers.google.com/web/fundamentals/native-hardware/user-location)
* KCDC