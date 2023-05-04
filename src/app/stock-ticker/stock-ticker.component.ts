import { Component, OnInit, ViewChild } from '@angular/core';
import { BackendService } from '../backend.service';

import { ActivatedRoute } from '@angular/router';
import { NgbAlert, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { interval, Subject, Subscription, timer } from 'rxjs';
import { switchMap, debounceTime, takeWhile } from 'rxjs/operators';

import * as Highcharts from 'highcharts/highstock';
import { Options } from 'highcharts/highstock';
declare var require: any;
require('highcharts/indicators/indicators')(Highcharts); // loads core and enables sma
require('highcharts/indicators/volume-by-price')(Highcharts); // loads enables vbp


import { Description } from '../Description';
import { Historicaldata } from '../HistoricalData';
import { Latestprice } from '../LatestPrice';
import { News } from '../News';
import { Recommendation } from '../Recommendation';
import { Social } from '../Social';
import { Peers } from '../Peers';
import { Earnings } from '../Earnings';
import { NewsModalComponent } from '../news-modal/news-modal.component';
import { TransactionComponent } from '../transaction/transaction.component';


@Component({
  selector: 'app-stock-ticker',
  templateUrl: './stock-ticker.component.html',
  styleUrls: ['./stock-ticker.component.css']
})
export class StockTickerComponent implements OnInit {

  private _StarAlertSuccess = new Subject<string>();
  private _buyAlertSuccess = new Subject<string>();
  info : Description;
  tickerExist=true;
  historicalData : Historicaldata;
  unfilteredNews: News[];
  news : News[] = [];
  latestPrice : Latestprice;
  recommendation : Recommendation[];
  social : Social;
  peers : Peers[];
  earnings : Earnings[];
  totalMentionsReddit: number;
  positiveMentionsReddit: number;
  negativeMentionsReddit: number;
  totalMentionsTwitter: number;
  positiveMentionsTwitter: number;
  negativeMentionsTwitter: number;
  inWatchlist = false;
  inPortfolio:boolean = false;
  localCurrentTime: number;
  currentTransaction: string = '';
  wallet:number;
  
  isMarketOpen : boolean = false;
  
  fetchSubscribe:Subscription;
  starSuccessMessage = '';
  buySuccessMessage = '';
  successMessage = '';

  dailyChartsFinish = false;
  histChartsFinish = false;
  isHighcharts = typeof Highcharts === 'object';
  chartConstructor = 'stockChart';
  Highcharts: typeof Highcharts = Highcharts; // required
  historicalChartOptions: Options;
  dailyChartOptions: Options;
  dailyChartsColor: string;
  recChartOptions: Options;
  surpriseChartOptions: Options;
  highcharts = Highcharts;

  input: string;

  getCurrentTime(){
    this.localCurrentTime = Date.now();
  }

  fetchDescription() {
    this._backendService.fetchDescription(this.input).subscribe((data) => {
      this.info = data;
      if (this.info.ticker) {
        this.tickerExist = true;
      } else {
        this.tickerExist = false;
      }
    });
  }

  fetchHistoricalData() {
    let dailyResolution = 'D';
    let crtTime = new Date();
    let endTime = Math.floor(crtTime.getTime()/1000);
    let year = crtTime.getFullYear();
    let month = crtTime.getMonth();
    let day = crtTime.getDate();
    let twoYearBack = new Date(year - 2, month, day);
    let histStartDate = twoYearBack.toISOString().slice(0, 10); // 2 years before current date
    let startTime = Math.floor(new Date(histStartDate).getTime()/1000);

    this._backendService
      .fetchHistoricalData(this.input, dailyResolution, startTime,endTime)
      .subscribe((data) => {
        this.historicalData = data;
        //console.log('HistoricalData fetched ' + Date());
        //console.log('HistoricalData length: ' + this.historicalData.t.length);
        this.histChartsFinish = false;
        this.createHistoricalCharts();
        this.histChartsFinish = true;
        //console.log('HistoricalData created ' + Date());
      });
  }

  createHistoricalCharts() {
    // split the data set into ohlc and volume
    let ohlc = [],
      volume = [],
      dataLength = this.historicalData.t.length,
      
      // set the allowed units for data grouping
      groupingUnits = [
        [
          'week', // unit name
          [1], // allowed multiples
        ],
        ['month', [1, 2, 3, 4, 6]],
      ];

    for ( let i = 0; i < dataLength; i += 1) {
      let timeStamp = this.historicalData.t[i]*1000;
      ohlc.push([
        timeStamp, // the date
        this.historicalData.o[i], // open
        this.historicalData.h[i], // high
        this.historicalData.l[i], // low
        this.historicalData.c[i], // close
      ]);

      volume.push([
        timeStamp, // the date
        this.historicalData.v[i], // the volume
      ]);
    }

    this.historicalChartOptions = {
      series: [
        {
          type: 'candlestick',
          name: this.input.toUpperCase(),
          id: this.input,
          zIndex: 2,
          data: ohlc,
        },
        {
          type: 'column',
          name: 'Volume',
          id: 'volume',
          data: volume,
          yAxis: 1,
        },
        {
          type: 'vbp',
          linkedTo: this.input,
          params: {
            volumeSeriesID: 'volume',
          },
          dataLabels: {
            enabled: false,
          },
          zoneLines: {
            enabled: false,
          },
        },
        {
          type: 'sma',
          linkedTo: this.input,
          zIndex: 1,
          marker: {
            enabled: false,
          },
        },
      ],
      title: { text: this.input.toUpperCase() + ' Historical' },
      subtitle: {
        text: 'With SMA and Volume by Price technical indicators',
      },
      yAxis: [
        {
          startOnTick: false,
          endOnTick: false,
          labels: {
            align: 'right',
            x: -3,
          },
          title: {
            text: 'OHLC',
          },
          height: '60%',
          lineWidth: 2,
          resize: {
            enabled: true,
          },
        },
        {
          labels: {
            align: 'right',
            x: -3,
          },
          title: {
            text: 'Volume',
          },
          top: '65%',
          height: '35%',
          offset: 0,
          lineWidth: 2,
        },
      ],
      tooltip: {
        split: true,
      },
      plotOptions: {
        // series: {
        //   dataGrouping: {
        //     units: groupingUnits,
        //   },
        // },
      },
      rangeSelector: {
        buttons: [
          {
            type: 'month',
            count: 1,
            text: '1m',
          },
          {
            type: 'month',
            count: 3,
            text: '3m',
          },
          {
            type: 'month',
            count: 6,
            text: '6m',
          },
          {
            type: 'ytd',
            text: 'YTD',
          },
          {
            type: 'year',
            count: 1,
            text: '1y',
          },
          {
            type: 'all',
            text: 'All',
          },
        ],
        selected: 2,
      },
      time: {
        //getTimezoneOffset: LATimezonOffset,
      },
    }; // required
  }

  fetchLatestPrice(){


    this._backendService.fetchLatestPrice(this.input).subscribe((data) => {
      this.latestPrice = data;
      let startTime, endTime;
      let latestResolution = '5';
      let crtTime = new Date();
      let crtTimeUNIX = Math.floor(crtTime.getTime()/1000);
      if(crtTimeUNIX-this.latestPrice.t>300){ //Market is closed
        endTime = this.latestPrice.t;
        startTime = endTime - 21600; //6 hours before
        this.isMarketOpen = false;
      }
      else{ //Market is open
        endTime = crtTimeUNIX;
        startTime = crtTimeUNIX - 21600;
        this.isMarketOpen = true;
      }
      if(this.latestPrice.d>0){ //positive(green)
        this.dailyChartsColor = '#007500';
      }
      else if(this.latestPrice.d<0){ //negative(red)
        this.dailyChartsColor = '#FF0000';
      }
      else{ //zero case
        this.dailyChartsColor = '#000000';
      }
      
      this._backendService.fetchHistoricalData(this.input,latestResolution,startTime,endTime).subscribe((data) => {
        this.historicalData = data;
        this.createDailyCharts(data);

      });
      
    });
    
  }
  
  createDailyCharts(data:Historicaldata) {
    // split the data set into close and volume
    let dailyClose = [],
      dataLength = data.t.length;

    for (let i = 0; i < dataLength; i++) {
      let timeStamp = data.t[i]*1000;
      dailyClose.push([timeStamp, data.c[i]]);
    }
    this.dailyChartOptions = {
      series: [
        {
          data: dailyClose,
          color: this.dailyChartsColor,
          
          name: this.input.toUpperCase(),
          type: 'line',
          tooltip: {
            valueDecimals: 2,
          },
        },
      ],
      title: { text: this.input.toUpperCase() + ' Hourly Price Variation' },
      rangeSelector: {
        enabled: false,
      },
      navigator: {
        enabled: false,
      },
      // time: {
      //  getTimezoneOffset: LATimezonOffset,
      // },
    };
  }

  fetchNews() {
    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth();
    let day = today.getDate();
    let startDate = new Date(year, month, day-7);
    let newsStartDate = startDate.toISOString().slice(0, 10); 
    let newsEndDate = today.toISOString().slice(0, 10); 

    this._backendService.fetchNews(this.input,newsStartDate,newsEndDate).subscribe((data) => {
      this.unfilteredNews = data;
      for (let i=0;i<data.length;i++){
        if (this.unfilteredNews[i].headline && this.unfilteredNews[i].image && this.news.length < 20){
          this.news.push(data[i])
        }
      }
    });
  }

  openNewsModal(news: News) {
    const newsModalRef = this.newsModalService.open(NewsModalComponent);
    newsModalRef.componentInstance.news = news;
  }

  openTransaction(ticker:string, name:string, currentPrice:number, opt:string, wallet:number) {
    
    const transModalRef = this.transModalService.open(
      TransactionComponent
    );
    transModalRef.componentInstance.ticker = ticker;
    transModalRef.componentInstance.name = name;
    transModalRef.componentInstance.currentPrice = currentPrice;
    transModalRef.componentInstance.opt = opt;
    transModalRef.componentInstance.wallet = wallet;
    transModalRef.result.then(() => {
      this.checkPortfolio();
      this.currentTransaction = opt;
      this._buyAlertSuccess.next('Message successfully changed.');
    });
  }

  fetchRecommendation(){
    this._backendService.fetchRecommendation(this.input).subscribe((data) => {
      this.recommendation = data;
      this.recommendationChart();
    })
  }

  recommendationChart(){
    let period = [];
    let strongBuy = [];
    let buy = [];
    let hold = [];
    let sell = [];
    let strongSell = [];
    for(let i=0;i<this.recommendation.length;i++){
      period.push(this.recommendation[i].period.slice(0,7));
      strongBuy.push(this.recommendation[i].strongBuy);
      buy.push(this.recommendation[i].buy);
      hold.push(this.recommendation[i].hold);
      sell.push(this.recommendation[i].sell);
      strongSell.push(this.recommendation[i].strongSell);
    }

    this.recChartOptions = {
    title: {
      text: 'Recommendation Trends'
    },
    xAxis: {
      categories: period
    },
    yAxis: {
      min: 0,
      title: {
        text: '#Analysis'
      },

    },
    legend: {
      align: 'center',
      verticalAlign: 'bottom',
      floating: false,
      borderColor: '#CCC',
      borderWidth: 1,
      shadow: false
    },
    tooltip: {
      headerFormat: '<b>{point.x}</b><br/>',
      pointFormat: '{series.name}: {point.y}'
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        dataLabels: {
          enabled: true
        }
      }
    },
    series: [{
      color: '#007500',
      name: 'Strong Buy',
      data: strongBuy,
      type: 'column'
    }, {
      color: '#00D100',
      name: 'Buy',
      data: buy,
      type: 'column'
    }, {
      color: '#b98b1d',
      name: 'Hold',
      data: hold,
      type: 'column'
    }, {
      color: '#f45b5b',
      name: 'Sell',
      data: sell,
      type: 'column'
    }, {
      color: '#813131',
      name: 'Strong Sell',
      data: strongSell,
      type: 'column'
    }]
  }
  }

  surpriseChart(){
    let period = [];
    let actual = [];
    let estimate = [];
    let surprise = [];
    let xLabels = [];
    for(let i=0;i<this.earnings.length;i++){
      period.push(this.earnings[i].period);
      actual.push(this.earnings[i].actual);
      estimate.push(this.earnings[i].estimate);
      surprise.push('Surprise: ' + this.earnings[i].surprise);
      xLabels.push(this.earnings[i].period + '<br>' + surprise[i]);
    }
    this.surpriseChartOptions = {
      title: {
        text: 'Historical EPS Surprises'
    },
    xAxis: {
        categories: xLabels,
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Quarterly EPS'
        }
    },
    tooltip: {
      shared: true,
    },
      series: [{
        name: 'Actual',
        data: actual,
        type: 'spline'
      },{
        name: 'Estimate',
        data: estimate,
        type: 'spline'
      }

    ]
    }
  }

  fetchSocial(){
    this._backendService.fetchSocial(this.input).subscribe((data) => {
      this.social = data;
      let sumMentionReddit = 0;
      let sumPositiveMentionsReddit = 0;
      let sumNegativeMentionsReddit = 0;
      let sumMentionTwitter = 0;
      let sumPositiveMentionsTwitter = 0;
      let sumNegativeMentionsTwitter = 0;
      for(let i=0;i<data.reddit.length;i++){
        sumMentionReddit+= data.reddit[i].mention;
        sumPositiveMentionsReddit += data.reddit[i].positiveMention;
        sumNegativeMentionsReddit += data.reddit[i].negativeMention;
      }
      this.totalMentionsReddit = sumMentionReddit;
      this.positiveMentionsReddit = sumPositiveMentionsReddit;
      this.negativeMentionsReddit = sumNegativeMentionsReddit;
      for(let i=0;i<data.twitter.length;i++){
        sumMentionTwitter+= data.twitter[i].mention;
        sumPositiveMentionsTwitter += data.twitter[i].positiveMention;
        sumNegativeMentionsTwitter += data.twitter[i].negativeMention;
      }
      this.totalMentionsTwitter = sumMentionTwitter;
      this.positiveMentionsTwitter = sumPositiveMentionsTwitter;
      this.negativeMentionsTwitter = sumNegativeMentionsTwitter;
      // console.log(this.totalMentionsReddit);
      //console.log('TWITTER:' + this.positiveMentionsTwitter);
    })
  }

  fetchPeers(){
    this._backendService.fetchPeers(this.input).subscribe((data) => {
      this.peers = data;
      // console.log(this.peers);
    })
  }

  fetchEarnings(){
    this._backendService.fetchEarnings(this.input).subscribe((data) => {
      this.earnings = data;
      this.surpriseChart();
    })
  }

  checkWatchlist() {
    let watchlistArr = localStorage.getItem('Watchlist')
      ? JSON.parse(localStorage.getItem('Watchlist')!)
      : [];
    let result = watchlistArr.filter(
      (data:any) => data.ticker === this.input.toUpperCase()
    );
    if (result.length) {
      this.inWatchlist = true;
    } else {
      this.inWatchlist = false;
    }
  }

  public checkPortfolio() {
    let portfolioArr = localStorage.getItem('Portfolio')
      ? JSON.parse(localStorage.getItem('Portfolio')!)
      : [];
    let resultPortfolio = portfolioArr.filter(
      (data:any) => data.ticker === this.input.toUpperCase()
    );
    if (resultPortfolio.length) {
      this.inPortfolio = true;
    } else {
      this.inPortfolio = false;
    }
  }

  public onClickStar() {
    this.inWatchlist = !this.inWatchlist;
    let watchlistArr : any[] = [];
    let watchlistArrNew;

    if(localStorage.getItem('Watchlist')===null){
      watchlistArr = [];
    }
    else{
      watchlistArr = JSON.parse(localStorage.getItem('Watchlist')!);
    }
    if (this.inWatchlist) {
      // add
      let watchlistItemNew = {
        ticker: this.info.ticker.toUpperCase(),
        name: this.info.name,
        c: this.latestPrice.c,
        d: this.latestPrice.d,
        dp: this.latestPrice.dp
      };
      console.log(watchlistItemNew);
      watchlistArr.push(watchlistItemNew);
      localStorage.setItem('Watchlist', JSON.stringify(watchlistArr));
    } else {
      // remove
      watchlistArrNew = watchlistArr.filter(
        (data) => data.ticker != this.input.toUpperCase()
      );
      localStorage.setItem('Watchlist', JSON.stringify(watchlistArrNew));
    }
    
    this._StarAlertSuccess.next('Message successfully changed.');

    
  }

  constructor(private route: ActivatedRoute,
    private _backendService: BackendService,
    private newsModalService: NgbModal,
    private transModalService: NgbModal) { }
    

  ngOnInit(): void {
    console.log('input: ' + this.input);
    this.route.paramMap.subscribe((params) => {
      if(params.get('input') === null){
        this.tickerExist=false;
        return;
      }
      else{
        this.input = params.get('input')!;
        
      }
      
      console.log('ticker name in stock-ticker: ' + this.input);
    });
    this.wallet = Number(localStorage.getItem('wallet'));
    this.getCurrentTime();
    this.fetchDescription();
    this.fetchLatestPrice();
    if(this.isMarketOpen==true){
      this.fetchSubscribe = timer(0, 15000).subscribe((val) => {
        console.log('val:' + val);
        this.fetchLatestPrice();
      });
    }
    this.fetchHistoricalData();
    this.fetchLatestPrice();
    this.fetchNews();
    this.fetchRecommendation();
    this.fetchSocial();
    this.fetchPeers();
    this.fetchEarnings();
    this.checkWatchlist();
    this.checkPortfolio();
  
      this._StarAlertSuccess.subscribe(
        (message) => (this.starSuccessMessage = message)
      );
      this._StarAlertSuccess
        .pipe(debounceTime(3000))
        .subscribe(() => (this.starSuccessMessage = ''));
  
      this._buyAlertSuccess.subscribe(
        (message) => (this.buySuccessMessage = message)
      );
      this._buyAlertSuccess
        .pipe(debounceTime(3000))
        .subscribe(() => (this.buySuccessMessage = ''));
    
    
    
  }
  
  ngOnDestroy() {
    if(this.isMarketOpen){
      this.fetchSubscribe.unsubscribe(); 
    }
  }
}
