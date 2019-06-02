import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {

  resultsCountChanges = new EventEmitter<number>() ;
  loadingStateChanges = new EventEmitter<boolean>() ;
  rppValueChanges = new EventEmitter<number>() ;
  currentPageChanges = new EventEmitter<number>() ;
  currentPage = 1 ;
  rpp = 20 ;
  constructor() { }


  updateResultsCount(count: number) {
    this.resultsCountChanges.emit(count);
  }

  updateLoadingState(state: boolean) {
    this.loadingStateChanges.emit(state);
  }

  updateRpp(rpp: number) {
    this.rppValueChanges.emit(rpp);
    this.rpp = rpp ;
  }

  updateCurrentPage(page: number) {
    this.currentPageChanges.emit(page);
    this.currentPage = page ;
  }

}
