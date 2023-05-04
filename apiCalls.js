const fetch = require('node-fetch');
const async = require('express-async-await');
// const url = require('url');
// const https = require('https');
// const HttpsProxyAgent = require('https-proxy-agent');

const APIkey = 'c7qs882ad3ia6nr4t4d0';

module.exports.getAutocomplete = getAutocomplete;
module.exports.getCompanyDescription = getCompanyDescription;
module.exports.getHistoricalData = getHistoricalData;
module.exports.getLatestPrice = getLatestPrice;
module.exports.getNews = getNews;
module.exports.getRecommendation = getRecommendation;
module.exports.getSocial = getSocial;
module.exports.getPeers = getPeers;
module.exports.getEarnings = getEarnings;

async function getAutocomplete(keyword) {
    //4.1.4
    let url = `https://finnhub.io/api/v1/search?q=${keyword}&token=${APIkey}`;
    let headers = {'Content-Type': 'application/json'};
    let APIres = await fetch(url, {method: 'GET', headers: headers});
    let searchRes = await APIres.json();
    return searchRes;
}

async function getCompanyDescription(tickerName) {
    //4.1.1
    let url = `https://finnhub.io/api/v1/stock/profile2?symbol=${tickerName}&token=${APIkey}`;
    let headers = {'Content-Type': 'application/json'};
    let APIres = await fetch(url, {method: 'GET', headers: headers});
    let descriptionRes = await APIres.json();
    return descriptionRes;
}

async function getHistoricalData(tickerName,resolution,startTime,endTime) {
    //4.1.2
    let url = `https://finnhub.io/api/v1/stock/candle?symbol=${tickerName}&resolution=${resolution}&from=${startTime}&to=${endTime}&token=${APIkey}`;
    let headers = {'Content-Type': 'application/json'};
    let APIres = await fetch(url, {method: 'GET', headers: headers});
    let historyRes = await APIres.json();
    return historyRes;
}

// async function getLatestPrice(tickerName) {
//     // 4.1.3
//     let url = `https://finnhub.io/api/v1/quote?symbol=${tickerName}&token=${APIkey}`;
//     let headers = {'Content-Type': 'application/json'};
//     let APIres = await fetch(url, {method: 'GET', headers: headers});
//     let latestPriceRes = await APIres.json();
//     if (latestPriceRes.length === 0) {
//         return {"detail": "Not found."};
//     } else {
//         return latestPriceRes[0];
//     }
// }

async function getLatestPrice(tickerName) {
    // 4.1.3
    let url = `https://finnhub.io/api/v1/quote?symbol=${tickerName}&token=${APIkey}`;
    let headers = {'Content-Type': 'application/json'};
    let APIres = await fetch(url, {method: 'GET', headers: headers});
    let latestPriceRes = await APIres.json();
    return latestPriceRes;
}


// async function getNews(tickerName,startDate,endDate) {
//     //4.1.5
//     let url = `https://finnhub.io/api/v1/company-news?symbol=${tickerName}&from=${startDate}&to=${endDate}&token=${APIkey}`;
//     let headers = {'Content-Type': 'application/json'};
//     let APIres = await fetch(url, {
//         method: 'GET',
//         headers: headers,
//         // agent: new HttpsProxyAgent('http://127.0.0.1:1087')
//     }).catch(error => {
//         console.log("News fetch failed.");
//     });
//     let newsRes;
//     if (APIres == null) {
//         newsRes = null;
//     } else {
//         let origRes = await APIres.json();
//         let totalResults = await origRes.totalResults;
//         if (totalResults == 0) {
//             newsRes = [];
//         } else {
//             newsRes = await origRes.articles;
//         }
//     }
//     return newsRes;
// }

async function getNews(tickerName,startDate,endDate) {
    //4.1.5
    let url = `https://finnhub.io/api/v1/company-news?symbol=${tickerName}&from=${startDate}&to=${endDate}&token=${APIkey}`;
    let headers = {'Content-Type': 'application/json'};
    let APIres = await fetch(url, {
        method: 'GET',
        headers: headers,
        // agent: new HttpsProxyAgent('http://127.0.0.1:1087')
    }).catch(error => {
        console.log("News fetch failed.");
    });
    let origRes = await APIres.json();
    return origRes;
}

async function getRecommendation(tickerName) {
    // 4.1.6
    let url = `https://finnhub.io/api/v1/stock/recommendation?symbol=${tickerName}&token=${APIkey}`;
    let headers = {'Content-Type': 'application/json'};
    let APIres = await fetch(url, {method: 'GET', headers: headers});
    let recRes = await APIres.json();
    return recRes;
}

async function getSocial(tickerName) {
    // 4.1.7
    let url = `https://finnhub.io/api/v1/stock/social-sentiment?symbol=${tickerName}&from=2022-01-01&token=${APIkey}`;
    let headers = {'Content-Type': 'application/json'};
    let APIres = await fetch(url, {method: 'GET', headers: headers});
    let socialRes = await APIres.json();
    return socialRes;
}

async function getPeers(tickerName) {
    // 4.1.8
    let url = `https://finnhub.io/api/v1/stock/peers?symbol=${tickerName}&token=${APIkey}`;
    let headers = {'Content-Type': 'application/json'};
    let APIres = await fetch(url, {method: 'GET', headers: headers});
    let peersRes = await APIres.json();
    return peersRes;
}

async function getEarnings(tickerName) {
    // 4.1.9
    let url = `https://finnhub.io/api/v1/stock/earnings?symbol=${tickerName}&token=${APIkey}`;
    let headers = {'Content-Type': 'application/json'};
    let APIres = await fetch(url, {method: 'GET', headers: headers});
    let earningsRes = await APIres.json();
    return earningsRes;
    //HANDLE NULL RESPONSE
}







// async function getDailyChartData(startDate, tickerName) {
//     // Company’s Last day’s chart data (close price)
//     let url = `https://api.tiingo.com/iex/${tickerName}/prices?startDate=${startDate}&resampleFreq=4min&columns=close&token=${tiingoAPIkey}`;
//     let headers = {'Content-Type': 'application/json'};
//     let APIres = await fetch(url, {method: 'GET', headers: headers});
//     let dailyPriceRes = await APIres.json();
//     return dailyPriceRes;
// }

// async function getHistChartsData(startDate, tickerName) {
//     // Company’s Historical data in the last 2 years
//     let url = `https://api.tiingo.com/tiingo/daily/${tickerName}/prices?startDate=${startDate}&resampleFreq=daily&token=${tiingoAPIkey}`;
//     let headers = {'Content-Type': 'application/json'};
//     let APIres = await fetch(url, {method: 'GET', headers: headers});
//     let histRes = await APIres.json();
//     return histRes;
// }

