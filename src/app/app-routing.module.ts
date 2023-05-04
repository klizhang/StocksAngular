import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { SearchComponent } from './search/search.component';
import { WatchListComponent } from './watch-list/watch-list.component';
import { StockTickerComponent } from './stock-ticker/stock-ticker.component';
import {AppComponent} from './app.component'

const routes: Routes = [
  {path: '', redirectTo: '/search/home', pathMatch: 'full'},
  {path: 'search/home', component: SearchComponent},
  {path: 'search/:input' , component: SearchComponent},
  {path: 'watchlist', component: WatchListComponent},
  {path: 'portfolio', component: PortfolioComponent}
];

@NgModule({
  bootstrap:[AppComponent],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
