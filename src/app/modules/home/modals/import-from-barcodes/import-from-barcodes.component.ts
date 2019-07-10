import { Component, OnInit } from '@angular/core';
import {ModalComponent} from '../modal.component';
import {ProductsService} from '../../../../service/products.service';
import {FiltersService} from '../../../../service/filters.service';

@Component({
  selector: 'app-import-from-barcodes',
  templateUrl: './import-from-barcodes.component.html',
  styleUrls: ['./import-from-barcodes.component.css']
})
export class ImportFromBarcodesComponent extends ModalComponent implements OnInit {

  items = [] ;

  constructor(
      private productsService: ProductsService,
      private filtersService: FiltersService
  ) {
    super() ;
  }

  ngOnInit() {
  }

  valueChanged(event) {
    const val = event.target.value ;
    this.items = [] ;
    val.split('\n').forEach((elm) => {
      if (elm.trim() !== '') {
          this.items.push(elm.trim());
      }
    });
  }

  run(modal) {
      this.productsService.selectAllOnLoad(true);
      this.filtersService.updateFilters([{key: 'barcode', value: this.items}]);
      modal.close();
  }

}
