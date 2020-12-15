import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {

  resultsCountChanges = new EventEmitter<number>() ;
  resultsCount = 0 ;
  loadingStateChanges = new EventEmitter<boolean>() ;
  rppValueChanges = new EventEmitter<number>() ;
  currentPageChanges = new EventEmitter<number>() ;
  current_page: any = 1 ;
  pagination_loading_state = true ;
  rpp: any = 50 ;
  constructor() { }


  updateResultsCount(count: number) {
    this.resultsCountChanges.emit(count);
    this.resultsCount = count;
  }

  updateLoadingState(state: boolean) {
    this.pagination_loading_state = state ;
    this.loadingStateChanges.emit(state);
  }

  updateRpp(rpp: number) {
      this.rpp = rpp ;
      this.rppValueChanges.emit(rpp);
  }

  updateCurrentPage(page: number, ignore: boolean = false ) {
      this.current_page = page ;
      if ( ! ignore ) { this.currentPageChanges.emit(page); }
  }

}
