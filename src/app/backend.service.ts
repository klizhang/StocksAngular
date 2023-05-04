import { Host, Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { HOST } from './host-name';

import { Autocomplete } from './Autocomplete';
import { Description } from './Description';
import { Historicaldata } from './HistoricalData';
import { Latestprice } from './LatestPrice';
import { News } from './News';
import { Recommendation } from './Recommendation';
import { Social } from './Social';
import { Peers }  from './Peers';
import { Earnings } from './Earnings';
import { AutocompleteResults } from './Autocomplete-results';
//import { start } from 'repl';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private autocompletePre = HOST + 'api/autocomplete';
  private descriptionPre = HOST + 'api/companyDescription';
  private historicalDataPre = HOST + 'api/historicalData';
  private latestPricePre = HOST + 'api/latestPrice';
  private newsPre = HOST + 'api/news';
  private recommendationPre = HOST + 'api/recommendation';
  private socialPre = HOST + 'api/social';
  private peersPre = HOST + 'api/peers';
  private earningsPre = HOST + 'api/earnings';

  constructor(private http: HttpClient) { }

  fetchAutocomplete(ticker: string): Observable<Autocomplete> {
    const autocompleteUrl = `${this.autocompletePre}/${ticker}`;
    return this.http.get<Autocomplete>(autocompleteUrl);
  }

  fetchDescription(ticker: string): Observable<Description> {
    const descriptionUrl = `${this.descriptionPre}/${ticker}`;
    return this.http.get<Description>(descriptionUrl);
  }

  fetchHistoricalData(ticker: string, resolution: string, startTime: number, endTime: number): Observable<Historicaldata> {
    const historicalDataUrl = `${this.historicalDataPre}/${ticker}/${resolution}/${startTime}/${endTime}`;
    return this.http.get<Historicaldata>(historicalDataUrl);
  }

  fetchLatestPrice(ticker: string): Observable<Latestprice> {
    const latestPriceUrl = `${this.latestPricePre}/${ticker}`;
    return this.http.get<Latestprice>(latestPriceUrl);
  }

  fetchNews(ticker: string, startDate: string, endDate: string): Observable<News[]> {
    const newsUrl = `${this.newsPre}/${ticker}/${startDate}/${endDate}`;
    return this.http.get<News[]>(newsUrl);
  }

  fetchRecommendation(ticker: string): Observable<Recommendation[]> {
    const recommendationUrl = `${this.recommendationPre}/${ticker}`;
    return this.http.get<Recommendation[]>(recommendationUrl);
  }

  fetchSocial(ticker: string): Observable<Social> {
    const socialUrl = `${this.socialPre}/${ticker}`;
    return this.http.get<Social>(socialUrl);
  }

  fetchPeers(ticker: string): Observable<Peers[]> {
    const peersUrl = `${this.peersPre}/${ticker}`;
    return this.http.get<Peers[]>(peersUrl);
  }

  fetchEarnings(ticker: string): Observable<Earnings[]> {
    const earningsUrl = `${this.earningsPre}/${ticker}`;
    return this.http.get<Earnings[]>(earningsUrl);
  }


  
  

}
