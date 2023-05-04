import { Component, OnInit } from '@angular/core';
import { Subject, Subscription, timer, forkJoin } from 'rxjs';
import { Router } from '@angular/router';

import { BackendService } from '../backend.service';

import { Latestprice } from '../LatestPrice';
import { isNgTemplate } from '@angular/compiler';
import { Description } from '../Description';
import { StringMap } from '@angular/compiler/src/compiler_facade_interface';


@Component({
  selector: 'app-watch-list',
  templateUrl: './watch-list.component.html',
  styleUrls: ['./watch-list.component.css'],
})
export class WatchListComponent implements OnInit {
  isEmpty:boolean = true;
  watchlistArr: any[];
  //tickerInfoArr: any[]; // array of LatestPrice objects, obtained from latest price fetch
  fetchFinish = false;
  fetchSubscribe: Subscription;
  callArrName : Description;
  callArr : Latestprice;

  constructor(private backendService: BackendService, private router: Router) {}

  fetchAllTicker() {
    // console.log('Start fetch ' + Date());

    this.checkEmpty();
    if(this.isEmpty){
      this.watchlistArr = [];
    }
    else{
      this.watchlistArr = JSON.parse(localStorage.getItem('Watchlist')!);
    }
    let newArr:any[] = [];
    this.watchlistArr.forEach(item => {
      
      let currentPrice:number;
      
      console.log("ITEM: ");
      console.log(item);
      console.log(item.ticker);
      console.log(item.quantity);
      this.backendService.fetchLatestPrice(item.ticker).subscribe(data => {
        let info = {
          ticker: item.ticker,
          name: item.name,
          d: data.d,
          dp: data.dp,
          c: data.c, 
        };
        console.log("CURRENT INFO:");
        console.log(info);
        newArr.push(info);
        console.log(newArr);
        console.log(localStorage.setItem('Watchlist',JSON.stringify(newArr)));
      });

    });

  }

  checkEmpty() {
    this.watchlistArr = localStorage.getItem('Watchlist')
      ? JSON.parse(localStorage.getItem('Watchlist')!)
      : [];
    if (this.watchlistArr.length) {
      this.isEmpty = false;
    } else {
      this.isEmpty = true;
    }
  }

  // public removeFromWatchlist(tickerItem:any) {
  //   this.tickerInfoArr.splice(this.tickerInfoArr.indexOf(tickerItem), 1); //removes tickerItem from tickerInfoArr
  //   let watchlistArrOld = JSON.parse(localStorage.getItem('Watchlist')!);
  //   let watchlistArrNew = watchlistArrOld.filter(
  //     (data:any) => data.ticker != tickerItem.ticker.toUpperCase()
  //   );
  //   localStorage.setItem('Watchlist', JSON.stringify(watchlistArrNew));
  //   this.checkEmpty();
  // }

  public removeFromWatchlist(tickerItem:any) {
    this.watchlistArr.splice(this.watchlistArr.indexOf(tickerItem), 1); //removes tickerItem from tickerInfoArr
    let watchlistArrOld = JSON.parse(localStorage.getItem('Watchlist')!);
    let watchlistArrNew = watchlistArrOld.filter(
      (data:any) => data.ticker != tickerItem.ticker.toUpperCase()
    );
    localStorage.setItem('Watchlist', JSON.stringify(watchlistArrNew));
    console.log(watchlistArrNew);
    this.checkEmpty();
    //this.fetchAllTicker();
  }

  public linkToDetails(ticker:any) {
    console.log(ticker);
    this.router.navigateByUrl('/search/' + ticker);
  }

  createArr(ticker:string){
    let combined:any[] = [];
    
    this.backendService.fetchLatestPrice(ticker).subscribe(data =>{
      this.callArr = data;
      this.backendService.fetchDescription(ticker).subscribe(desc =>{
        this.callArrName = desc;
        console.log(this.callArrName);
      })
      
      console.log(this.callArr);
    });
    // console.log(this.callArrName);
    // console.log(this.callArr);
    combined.push(this.callArrName,this.callArr);
    console.log('NAMES:');
    console.log(this.callArrName);
    console.log('COMBINED:::');
    console.log(combined);
    console.log('VALUES:')
    console.log(JSON.stringify(combined[1]));
    // forkJoin([this.callArrName,this.callArr]).subscribe((responses) => {
    //   // console.log('real fetch time: ' + Date());
    //   let infoArr : any[] = [];
    //   // console.log('Response in forkJoin: ' + responses);

    //   responses.forEach((res: Latestprice) => {
    //     // let tickerName = this.watchlistArr.filter(
    //     //   (data) => data.ticker === res.ticker
    //     // )[0].name;
    //     let info = {
    //       //ticker: res.ticker,
    //       //name: item.ticker,
    //       last: res.c,
    //       change: res.d,
    //       changePercent: res.dp,
    //       timestamp: res.t,
    //     };
    //     infoArr.push(info);
    //     console.log(infoArr);
    //   });
    //   this.tickerInfoArr = infoArr;
    //   this.fetchFinish = true;
    //   console.log(this.tickerInfoArr);
    // });
    // console.log(this.tickerInfoArr);
  }

  // createArr(ticker:string){
  //   let callArr : any[] = [];
  //   let callArrName: any[] = [];
  //   let combined: any[] = [];
  //   //this.watchlistArr.forEach((item) => {
  //     callArrName.push(this.backendService.fetchDescription(ticker));
  //     callArr.push(this.backendService.fetchLatestPrice(ticker));
  //     combined.push(callArrName,callArr);
  //   //});
  //   forkJoin([callArrName,callArr]).subscribe((responses) => {
  //     // console.log('real fetch time: ' + Date());
  //     let infoArr : any[] = [];
  //     // console.log('Response in forkJoin: ' + responses);

  //     responses.forEach((res: Latestprice) => {
  //       // let tickerName = this.watchlistArr.filter(
  //       //   (data) => data.ticker === res.ticker
  //       // )[0].name;
  //       let info = {
  //         //ticker: res.ticker,
  //         //name: item.ticker,
  //         last: res.c,
  //         change: res.d,
  //         changePercent: res.dp,
  //         timestamp: res.t,
  //       };
  //       infoArr.push(info);
  //     });
  //     console.log(infoArr);
  //     this.tickerInfoArr = infoArr;
  //     this.fetchFinish = true;
  //     //console.log(this.tickerInfoArr);
  //   });
  //   //console.log(combined);

  // }

  ngOnInit() {
    this.checkEmpty;
    this.fetchAllTicker();
    this.fetchFinish = true;

    // for testing-----End
  }

  // ngOnDestroy() {
  //   this.fetchSubscribe.unsubscribe();
  //   console.log('Exist from Watchlist');
  // }
}
