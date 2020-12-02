import { Component, OnInit } from '@angular/core';
import {ModalComponent} from '../modal.component';
import {ProductsService} from '../../../../service/products.service';
import {FiltersService} from '../../../../service/filters.service';
import {TranslateService} from '@ngx-translate/core';
import {TranslateSelectorService} from '../../../../service/translate-selector-service';

@Component({
  selector: 'app-import-from-barcodes',
  templateUrl: './import-from-barcodes.component.html',
  styleUrls: ['./import-from-barcodes.component.css']
})
export class ImportFromBarcodesComponent extends ModalComponent implements OnInit {

  items = [] ;

  constructor(
      private productsService: ProductsService,
      private filtersService: FiltersService,
      private translate: TranslateService,
      private translateSelectorService: TranslateSelectorService,

      ) {
        super();
        this.translateSelectorService.setDefaultLanuage();
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
      this.filtersService.updateFilters({barcode: this.items});
      modal.close();
  }

}
