const express = require('express');
const callAPI = require('./apiCalls');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.static('./dist/project'));

app.get('/',(req,res)=>{
    return res.send('index.html',{root:__dirname});
})

app.get('/api/autocomplete/:keyword', async function (req, res) {
    console.log(`\nSearch-utilities Call: ${req.params.keyword}`);
    // if not found, response is [] with length 0
    let origRes = await callAPI.getAutocomplete(req.params.keyword);
    let msg = `${req.params.keyword} Search-utilities finished at ${Date()}\nLength of response: ${origRes.length}`;
    console.log(msg);
    return res.send(origRes);
    // if (origRes)
    //     return res.status(200).json(origRes);
})

app.get('/api/companyDescription/:tickerName', async function (req, res) {
    console.log(`\nSearch-utilities Call: ${req.params.tickerName}`);
    // if not found, response is [] with length 0
    let origRes = await callAPI.getCompanyDescription(req.params.tickerName.toUpperCase());
    let msg = `${req.params.tickerName} Search-utilities finished at ${Date()}\nLength of response: ${origRes.length}`;
    console.log(msg);
    return res.send(origRes);
    // if (origRes)
    //     return res.status(200).json(origRes);
})

app.get('/api/historicalData/:tickerName/:resolution/:startTime/:endTime', async function (req, res) {
    console.log(`\nSearch-utilities Call: ${req.params.tickerName}`);
    // if not found, response is [] with length 0
    let origRes = await callAPI.getHistoricalData(req.params.tickerName.toUpperCase(),req.params.resolution,req.params.startTime,req.params.endTime);
    let msg = `${req.params.tickerName} Search-utilities finished at ${Date()}\nLength of response: ${origRes.length}`;
    console.log(msg);
    return res.send(origRes);
    // if (origRes)
    //     return res.status(200).json(origRes);
})

app.get('/api/latestPrice/:tickerName', async function (req, res) {
    console.log(`\nSearch-utilities Call: ${req.params.tickerName}`);
    // if not found, response is [] with length 0
    let origRes = await callAPI.getLatestPrice(req.params.tickerName.toUpperCase());
    let msg = `${req.params.tickerName} Search-utilities finished at ${Date()}\nLength of response: ${origRes.length}`;
    console.log(msg);
    return res.send(origRes);
    // if (origRes)
    //     return res.status(200).json(origRes);
})

app.get('/api/news/:tickerName/:startDate/:endDate', async function (req, res) {
    console.log(`\nSearch-utilities Call: ${req.params.tickerName}`);
    // if not found, response is [] with length 0
    let origRes = await callAPI.getNews(req.params.tickerName.toUpperCase(),req.params.startDate,req.params.endDate);
    let msg = `${req.params.tickerName} Search-utilities finished at ${Date()}\nLength of response: ${origRes.length}`;
    console.log(msg);
    return res.send(origRes);
    // if (origRes)
    //     return res.status(200).json(origRes);
})

app.get('/api/recommendation/:tickerName', async function (req, res) {
    console.log(`\nSearch-utilities Call: ${req.params.tickerName}`);
    // if not found, response is [] with length 0
    let origRes = await callAPI.getRecommendation(req.params.tickerName.toUpperCase());
    let msg = `${req.params.tickerName} Search-utilities finished at ${Date()}\nLength of response: ${origRes.length}`;
    console.log(msg);
    return res.send(origRes);
    // if (origRes)
    //     return res.status(200).json(origRes);
})

app.get('/api/social/:tickerName', async function (req, res) {
    console.log(`\nSearch-utilities Call: ${req.params.tickerName}`);
    // if not found, response is [] with length 0
    let origRes = await callAPI.getSocial(req.params.tickerName.toUpperCase());
    let msg = `${req.params.tickerName} Search-utilities finished at ${Date()}\nLength of response: ${origRes.length}`;
    console.log(msg);
    return res.send(origRes);
    // if (origRes)
    //     return res.status(200).json(origRes);
})

app.get('/api/peers/:tickerName', async function (req, res) {
    console.log(`\nSearch-utilities Call: ${req.params.tickerName}`);
    // if not found, response is [] with length 0
    let origRes = await callAPI.getPeers(req.params.tickerName.toUpperCase());
    let msg = `${req.params.tickerName} Search-utilities finished at ${Date()}\nLength of response: ${origRes.length}`;
    console.log(msg);
    return res.send(origRes);
    // if (origRes)
    //     return res.status(200).json(origRes);
})

app.get('/api/earnings/:tickerName', async function (req, res) {
    console.log(`\nSearch-utilities Call: ${req.params.tickerName}`);
    // if not found, response is [] with length 0
    let origRes = await callAPI.getEarnings(req.params.tickerName.toUpperCase());
    let msg = `${req.params.tickerName} Search-utilities finished at ${Date()}\nLength of response: ${origRes.length}`;
    console.log(msg);
    return res.send(origRes);
    // if (origRes)
    //     return res.status(200).json(origRes);
})



// Start the server
const PORT = parseInt(process.env.PORT) || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END gae_node_request_example]

module.exports = app;