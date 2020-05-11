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

작업을 위해 각자만의 Code Editor Tool을 설치합니다.<br>

```
Visual Studio Code (권장)
```

### Installing

설치할 모듈
* **dotenv**
* **webpack**

dotenv 모듈의 경우 API_KEY 을 가릴 용도로, webpack은 배포용으로 설치합니다. 그러므로 아래와 같은 단계를 거칩니다.

먼저 아래 명령어를 입력하여 package.json 파일을 생성합니다
```
npm init
```

그리고 dotenv를 아래 명령어를 입력해 설치합니다.
```
npm install -D dotenv
```
그리고 webpack 패키지를 아래 명령어를 입력해 설치합니다.
```
npm install -D webpack webpack-cli
```

css 파일과 image들 파일 또한 번들링해서 배포할 것이므로 아래 명령어를 통해 필요한 패키지들을 설치합니다.

```
npm install -D style-loader css-loader file-loader
```

배포할 파일을 저장할 public 폴더도 생성해줍니다.<br>

```
|- package.json
|- node_modules
|- public
...
```

webpack.config.js 파일은 아래와 같이 설정합니다.
```
const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv').config({path: __dirname + '/.env'});
module.exports = {
    ...
    plugins: [
        new webpack.DefinePlugin({
            "process.env": JSON.stringify(dotenv.parsed)
        })
    ]
}
```

dotenv 와 webpack을 결합해서 쓰면 경로 문제가 발생하여 env 설정값을 제대로 읽어오지 못합니다. 이를 위해 위와 같은 추가 설정을 해주어 env 설정값을 읽을 수 있게끔 해줍니다.

## Deployment

실 서버에 배포하는 방법은 아래 블로그 글을 참고하시면 좋습니다.<br>
[마스크 재고 서비스 배포 과정](https://ktpark1651.tistory.com/248)

## Authors

* **Skyni25** - *whole process*

## License

This project is licensed under the MIT License

## Acknowledgments

* [Google Developer Doc](https://developers.google.com/web/fundamentals/native-hardware/user-location)
* [jongpak](https://developers.google.com/web/fundamentals/native-hardware/user-location)
* KCDC