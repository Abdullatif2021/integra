import {Component, OnInit, Input} from '@angular/core';
import {PaginationService} from '../../../service/pagination.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {

  @Input() theme = 'light' ;
  @Input() results_count: number = null ;
  @Input() loading = true ;
  rpp = 50 ;
  pages = 0 ;
  @Input() current_page = 1;
  pages_list  = [
      {key: 50, value: 50},
      {key: 100, value: 100},
      {key: 150, value: 150},
      {key: 200, value: 200},
      {key: 500, value: 500},
      {key: 1000, value: 1000},
      {key: 'Tutto', value: 9000000},
  ]

  constructor(private paginationService: PaginationService , private translate: TranslateService
    ) {
        translate.setDefaultLang('itly');
    }

  ngOnInit() {
    this.paginationService.resultsCountChanges.subscribe((results: number) => {
      this.results_count = results ;
      this.updatePages();
    });
    this.paginationService.loadingStateChanges.subscribe((state: boolean) => {
      this.loading = state ;
      console.log(this.loading);
      this.current_page = this.paginationService.current_page ;
    });
    this.paginationService.currentPageChanges.subscribe((page: number) => {
      this.current_page = page ;
    });
  }

  rppChanged(event) {
    this.paginationService.updateRpp(event.value);
    this.rpp = event.value ;
    this.updatePages() ;
  }

  updatePages() {
      this.pages = Math.ceil(this.results_count / this.rpp);
  }

  prevPage() {
    this.current_page = this.current_page - 1;
    this.paginationService.updateCurrentPage(this.current_page);
  }

  nextPage() {
    this.current_page = this.current_page + 1;
    this.paginationService.updateCurrentPage(this.current_page);
  }

  lastPage() {
    this.current_page = this.pages;
    this.paginationService.updateCurrentPage(this.current_page);
  }

  firstPage() {
    this.current_page = 1;
    this.paginationService.updateCurrentPage(this.current_page);
  }

  changePage(page) {
    this.current_page = page ;
    this.paginationService.updateCurrentPage(page);
  }

  range(start, end, max, min) {
    const range = [] ;
    for (let i = start ; i < end && i <= max ; ++i ) {
      if ( i > min) {
          range.push(i);
      } else {
        end++;
      }
    }
    return range ;
  }
}
