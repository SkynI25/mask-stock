import * as coord from './geoAPI';

function calcTime(date) {
    let now = new Date() - new Date(date);
    if (now / (1000 * 60 * 60 * 24) >= 1) {
      return `${Math.floor(now / (1000 * 60 * 60 * 24))}일`
    } else if (now / (1000 * 60 * 60) >= 1) {
      return `${Math.floor(now / (1000 * 60 * 60))}시간`
    }
    return `${Math.floor(now / (1000 * 60))}분`
}

function haversineFormula(data) {
    let toRadians = Math.PI / 180;
    let R = 6371e3;
    let theta1 = coord.lat * toRadians;
    let theta2 = data.lat * toRadians;
    let deltaTheta = Math.abs(data.lat - coord.lat) * toRadians;
    let deltaGamma = Math.abs(data.lng - coord.lng) * toRadians;

    let a = Math.sin(deltaTheta / 2) * Math.sin(deltaTheta / 2) +
            Math.cos(theta1) *
            Math.cos(theta2) *
            Math.sin(deltaGamma / 2) *
            Math.sin(deltaGamma / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c
}

function sortByDistance(data) {
    let sortMap = new Map();
    for (let i = 0; i < data.length; i++) {
      sortMap.set(i, haversineFormula(data[i]))
    }
    let sortedMap = [...sortMap.entries()].sort((a, b) => {
      return a[1] - b[1] > 0 ? 1 : a[1] - b[1] < 0 ? -1 : 0
    });
    let sortedArr = [];
    for (let i = 0; i < sortedMap.length; i++) {
      let index = sortedMap[i][0]
      sortedArr.push(data[index])
    }
    return sortedArr;
}

function sortByStock(data) {
    let stockMap = new Map([
      ["plenty", 5],
      ["some", 4],
      ["few", 3],
      ["empty", 2],
      ["break", 1],
    ]);

    let storesMap = new Map()
    for (let i = 0; i < data.length; i++) {
      storesMap.set(i, stockMap.get(data[i].remain_stat))
    }
    let sortedMap = [...storesMap.entries()].sort((a, b) => {
      return a[1] < b[1] ? 1 : a[1] > b[1] ? -1 : 0
    });
    let sortedArr = [];
    for (let i = 0; i < sortedMap.length; i++) {
      let index = sortedMap[i][0]
      sortedArr.push(data[index])
    }

    return sortedArr;
}

function isAvailableStock(data) {
    return data.filter((s) => s.remain_stat !== "break").length;
}

export { calcTime, sortByDistance, sortByStock, isAvailableStock }
