import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { switchMap, debounceTime, tap, finalize } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BackendService } from '../backend.service';
import { Autocomplete } from '../Autocomplete';
import { AutocompleteResults } from '../Autocomplete-results';
import { ContentObserver } from '@angular/cdk/observers';
import { conditionallyCreateMapObjectLiteral } from '@angular/compiler/src/render3/view/util';
import { Location } from '@angular/common';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  inputForm = new FormGroup({
    input: new FormControl(''),
  });
  ticker: string;
  isLoading: boolean = true;
  empty: boolean = true;
  filteredCompanies: Autocomplete;
  filteredCompaniesResult: any[];
  currentText : string = '';
  isSubmitted:boolean = false;
  
  
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private backService: BackendService) { }

  ngOnInit(): void {
    if(localStorage.getItem('wallet') === null){
      localStorage.setItem('wallet','25000')
    }
    console.log(localStorage.getItem('wallet'));
    this.inputForm
    .valueChanges.pipe(
      debounceTime(300),
      tap((form) => {
        if(form.input.length>0){
          this.isLoading=true;
          this.empty = false;
        }
        else{
          this.empty = true;
        }
      }))
      .subscribe((value) => {
        this.backService.fetchAutocomplete(value.input).subscribe((data) => {
          this.filteredCompanies=data;
          this.isLoading=false;
          
          let i = data.count;
          while(i--){
            if (this.filteredCompanies.result[i].type != 'Common Stock' || this.filteredCompanies.result[i].symbol.includes(".")){
              this.filteredCompanies.result.splice(i,1);
            }
          }
        });        
      });
      
  }

  onSubmit(tickerData:any) {
    console.log(tickerData);
    this.ticker = tickerData.input;
    
    // console.log('tickerData: ', tickerData);
    this.router.navigateByUrl('/search/' + this.ticker);
    this.isSubmitted = true;
    //this.router.navigate(['/search' ,this.ticker]);
  }
  onSubmitAutocomplete(tickerData:any){
    this.ticker = tickerData;
    this.router.navigateByUrl('/search/' + this.ticker);
    this.isSubmitted = true;
  }

  

  // displayFn(company: Autocomplete) {
  //   if (company) {
  //     return company.result[0].description;
  //   }
  //   else{return '';}
  // }

  onClear(){
    this.isSubmitted = false;
    this.router.navigateByUrl('/search/home');
    
  }


}






