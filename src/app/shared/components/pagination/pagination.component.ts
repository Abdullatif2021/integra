import {Component, OnInit, Input, ViewChild} from '@angular/core';
import {PaginationService} from '../../../service/pagination.service';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {

  @Input() theme = 'light' ;
  @Input() results_count: number = null ;
  @Input() loading = true ;
  rpp = 20 ;
  pages = 0 ;
  @Input() current_page = 1;
  pages_list  = [
      {key: 20, value: 20},
      {key: 40, value: 40},
      {key: 60, value: 60},
      {key: 80, value: 80},
  ]

  constructor(private paginationService: PaginationService) { }

  ngOnInit() {
    this.paginationService.resultsCountChanges.subscribe((results: number) => {
      this.results_count = results ;
      this.updatePages();
    });
    this.paginationService.loadingStateChanges.subscribe((state: boolean) => {
      this.loading = state ;
      this.current_page = this.paginationService.current_page ;
    });
    this.paginationService.currentPageChanges.subscribe((page: number) => {
      this.current_page = page ;
    });
  }

  rppChanged(event) {
    console.log(event.value);
    this.paginationService.updateRpp(event.value);
    this.rpp = event.value ;
    this.updatePages() ;
  }

  updatePages() {
      this.pages = Math.ceil(this.results_count / this.rpp);
      console.log(this.results_count , this.rpp);
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
