import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {
  @Input() public ticker: string;
  @Input() public name: string;
  @Input() public currentPrice: number;
  @Input() public opt: string; // 'Buy' or 'Sell'
  @Input() public wallet: number;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  inputQuantity: number = 0;
  purchasedQuantity: number = 0;

  
  stockItem: any;

  getPortfolioStorage() {
    let portfolioArr = localStorage.getItem('Portfolio')
      ? JSON.parse(localStorage.getItem('Portfolio')!)
      : [];
    if (this.opt === 'Sell') {
      this.stockItem = portfolioArr.filter(
        (data:any) => data.ticker == this.ticker
      )[0];
      this.purchasedQuantity = this.stockItem.quantity;
    } else if (this.opt === 'Buy') {
      this.stockItem = portfolioArr.filter((data:any) => data.ticker == this.ticker)
        .length
        ? portfolioArr.filter((data:any) => data.ticker == this.ticker)[0]
        : { ticker: this.ticker, name: this.name, quantity: 0, totalCost: 0 ,avgcost: 0, change: 0, 
          currentPrice: this.currentPrice, marketValue: 0
          };
        console.log(this.stockItem);
    }
    console.log('init: ');
    console.log(portfolioArr);
  }

  public executeOpt() {
    if (this.opt === 'Sell') {
      let avgcost = this.stockItem.totalCost / this.stockItem.quantity;
      this.stockItem.quantity -= this.inputQuantity;
      this.stockItem.totalCost -= avgcost * this.inputQuantity;
      this.wallet += this.inputQuantity * this.currentPrice;
      localStorage.setItem('wallet',this.wallet.toString());
      console.log(
        `Sell ${this.ticker} ${this.inputQuantity}, ${this.stockItem.quantity} left, totalCost ${this.stockItem.totalCost}`
      );
    } else if (this.opt === 'Buy') {
      this.stockItem.quantity += this.inputQuantity;
      this.stockItem.totalCost += this.currentPrice * this.inputQuantity;
      this.wallet -= this.inputQuantity * this.currentPrice;
      localStorage.setItem('wallet',this.wallet.toString());
      console.log(
        `Buy ${this.ticker} ${this.inputQuantity}, ${this.stockItem.quantity} now, totalCost ${this.stockItem.totalCost}`
      );
    }
    let portfolioArr = localStorage.getItem('Portfolio')
      ? JSON.parse(localStorage.getItem('Portfolio')!)
      : [];
    if (!this.stockItem.quantity) {
      // delete stockItem from localStorage
      let portfolioArrNew = portfolioArr.filter(
        (data:any) => data.ticker != this.ticker
      );
      localStorage.setItem('Portfolio', JSON.stringify(portfolioArrNew));
    } else {
      // replace stockItem from localStorage
      if (portfolioArr.filter((item:any) => item.ticker == this.ticker).length) {
        portfolioArr.forEach((item: { ticker: any; }, i: number) => {
          if (item.ticker == this.stockItem.ticker) {
            portfolioArr[i] = this.stockItem;
          }
        });
      } else {
        portfolioArr.push(this.stockItem);
      }
      localStorage.setItem('Portfolio', JSON.stringify(portfolioArr));
    }
    this.transModalService.close(this.stockItem);
  }

  constructor(public transModalService: NgbActiveModal) { }

  ngOnInit(): void {
    
    this.getPortfolioStorage();

  }

}
