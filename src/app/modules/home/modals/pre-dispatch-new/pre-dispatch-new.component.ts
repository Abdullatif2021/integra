import { Component, OnInit } from '@angular/core';
import {ModalComponent} from '../modal.component';
import {ActionsService} from '../../../../service/actions.service';
import {ProductsService} from '../../../../service/products.service';
import {FiltersService} from '../../../../service/filters.service';

@Component({
  selector: 'app-pre-dispatch-new',
  templateUrl: './pre-dispatch-new.component.html',
  styleUrls: ['./pre-dispatch-new.component.css']
})
export class PreDispatchNewComponent extends ModalComponent  implements OnInit {

  constructor(
      private actionsService: ActionsService,
      public productsService: ProductsService,
      public filtersService: FiltersService
  ) {
      super();
  }

  name = '' ;
  error: any = false ;
  filtersCount = 0 ;
  selectedCount = 0;
  confirmed = false ;

  ngOnInit() {
    this.filtersCount = Object.keys(this.filtersService.filters).length;
    this.selectedCount = this.productsService.selectedProducts.length ;
    if (this.filtersService.specials.cities && !this.filtersService.specials.cities.all) { this.filtersCount++;}
    if (this.filtersService.specials.streets && !this.filtersService.specials.streets.all) { this.filtersCount++;}
  }

  changeName(event) {
    this.name = event.target.value ;
  }

  confirm() {
    this.confirmed = true ;
  }

  run(modal) {
    if ( !this.name || this.name === '' ) { return this.error = 1; }
    if ( this.name.length < 3 ) { return this.error = 2; }
    this.actionsService.createNewPreDispatch(this.data, this.name) ;
    modal.close();
  }

}
