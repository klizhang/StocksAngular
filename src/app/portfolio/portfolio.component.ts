import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, Subscription, timer, forkJoin } from 'rxjs';
import { switchMap, debounceTime, takeWhile } from 'rxjs/operators';


import { BackendService } from '../backend.service';
import { TransactionComponent } from '../transaction/transaction.component';
import { Latestprice } from '../LatestPrice';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {
  portfolioArr:any[];
  isEmpty:boolean;
  tickerInfoArr:any[]; // array for display, obtained from latest price fetch and other caculation
  fetchFinish = false;
  fetchSubscribe: Subscription;
  wallet: number;
  oldWallet:number;
  private _buyAlertSuccess = new Subject<string>();
  buySuccessMessage = '';
  currentTransaction: string = '';
  transactionTicker: string = '';

  constructor(
    private transModalService: NgbModal,
    private backendService: BackendService
  ) { }


  fetchAllTicker() {
    console.log('Start fetch ' + Date());
    this.checkEmpty();
    if (this.isEmpty){
      this.portfolioArr = [];
    }
    else{
      this.portfolioArr = JSON.parse(localStorage.getItem('Portfolio')!);
    }
    console.log(this.portfolioArr);
    let newArr:any[] = [];
    this.portfolioArr.forEach((item,i) => {
      
      console.log("ITEM: ");
      console.log(item.ticker);
      console.log(i);
      this.backendService.fetchLatestPrice(item.ticker).subscribe(data => {
        let info = {
          ticker: item.ticker,
          name: item.name,
          quantity: item.quantity,
          totalCost: item.totalCost,
          avgCost: Math.round((item.totalCost/item.quantity)*100)/100, // totalCost / quantity
          change: Math.round((item.totalCost/item.quantity - data.c) * 100) / 100, // totalCost / quantity - latestprice.last
          currentPrice: data.c, // latestprice.last
          marketValue: data.c * item.quantity, // latestprice.last * quantity
        };
        newArr.push(info);
        console.log(newArr);
        console.log(i);
        localStorage.setItem('Portfolio',JSON.stringify(newArr));
      });

    });
    
    
    //this.backendService.fetchLatestPrice()
    // this.portfolioArr.forEach(item =>{
    //   let info = {
    //     ticker: item.ticker,
    //     name: item.name,
    //     quantity: item.quantity,
    //     totalCost: item.totalCost,
        // avgCost: avgcst, // totalCost / quantity
        // change: avgcst - res.last, // totalCost / quantity - latestprice.last
        // currentPrice: res.last, // latestprice.last
        // marketValue: res.last * tmpItem.quantity, // latestprice.last * quantity

    
    
    //   };
    // })
    // this.fetchSubscribe = timer(0, 15000).subscribe(() => {
    //   this.checkEmpty();
    //   let callArr:any[] = [];
    //   this.portfolioArr.forEach((item) => {
    //     callArr.push(this.backendService.fetchLatestPrice(item.ticker));
    //   });
    //   console.log("CALLARR BEFOR JOIN: ")
    //   console.log(callArr);
    //   forkJoin([callArr]).subscribe((responses) => {
    //     console.log('real fetch time: ' + Date());
    //     // console.log('Response in forkJoin: ' + responses);
    //     console.log("callARR: ")
    //     console.log(callArr);
    //     let infoArr:any[] = [];
    //     responses.forEach((res: any) => {
    //       let tmpItem = this.portfolioArr.filter(
    //         (data) => data.ticker === res.ticker
    //       )[0];
    //       console.log(responses);
    //       console.log(res.ticker);
    //       console.log("responses: ");
    //       console.log(this.portfolioArr);
    //       console.log("tmpItem: ")
    //       console.log(tmpItem);

    //       console.log("totalCosttemp: ");
          
    //       let avgcst = tmpItem.totalCost / tmpItem.quantity;
    //       let info = {
    //         ticker: res.ticker,
    //         name: tmpItem.name,
    //         quantity: tmpItem.quantity,
    //         totalCost: tmpItem.totalCost,
    //         avgCost: avgcst, // totalCost / quantity
    //         change: avgcst - res.last, // totalCost / quantity - latestprice.last
    //         currentPrice: res.last, // latestprice.last
    //         marketValue: res.last * tmpItem.quantity, // latestprice.last * quantity
    //       };
    //       infoArr.push(info);
    //     });
    //     this.tickerInfoArr = infoArr;
    //     this.fetchFinish = true;
    //     console.log(this.tickerInfoArr);
    //     });
    //   });
   }

   public removeFromPortfolio(tickerItem:any) {
    let portfolioArrOld = JSON.parse(localStorage.getItem('Portfolio')!);
    let portfolioArrNew = portfolioArrOld.filter(
      (data:any) => data.ticker != tickerItem.ticker.toUpperCase()
    );
    localStorage.setItem('Portfolio', JSON.stringify(portfolioArrNew));
    this.checkEmpty();
  }

  // removeFromTickerInfoArr(tickerItem:any) {
  //   let tickerInfoArrNew = this.tickerInfoArr.filter(
  //     (data) => data.ticker != tickerItem.ticker
  //   );
  //   this.tickerInfoArr = tickerInfoArrNew;
  // }

  openTransaction(ticker:string, name:string, currentPrice:number, opt:string,wallet:number) {
    const transModalRef = this.transModalService.open(
      TransactionComponent
    );
    transModalRef.componentInstance.ticker = ticker;
    transModalRef.componentInstance.name = name;
    transModalRef.componentInstance.currentPrice = currentPrice;
    transModalRef.componentInstance.opt = opt;
    transModalRef.componentInstance.wallet = wallet;
    this.oldWallet = wallet;
    transModalRef.result.then(() => {
      this.fetchAllTicker();
      this.wallet = (Number(localStorage.getItem('wallet')));
      this.transactionTicker = ticker;
      this.currentTransaction = opt;
      if(this.oldWallet != this.wallet){
        this._buyAlertSuccess.next('Message successfully changed.');
      }
    });
  }

  checkEmpty() {
  this.portfolioArr = localStorage.getItem('Portfolio')
    ? JSON.parse(localStorage.getItem('Portfolio')!)
    : [];
    if (this.portfolioArr.length) {
      this.isEmpty = false;
    } else {
      this.isEmpty = true;
    }
  }

  ngOnInit(): void {
    if(localStorage.getItem('wallet') === null){
      console.log('its null');
      localStorage.setItem('wallet','25000')
    }
    this.wallet = (Number(localStorage.getItem('wallet')));
    console.log(this.wallet);
    this.fetchAllTicker();
    this.fetchFinish = true;

    this._buyAlertSuccess.subscribe(
      (message) => (this.buySuccessMessage = message)
    );
    this._buyAlertSuccess
      .pipe(debounceTime(3000))
      .subscribe(() => (this.buySuccessMessage = ''));
  }

}
