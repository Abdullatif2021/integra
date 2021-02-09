import { Component, OnInit } from '@angular/core';
import {ModalComponent} from '../modal.component';
import {FiltersService} from '../../../../service/filters.service';
import {ProductsService} from '../../../../service/products.service';
import {PreDispatchService} from '../../../../service/pre-dispatch.service';
import {PreDispatchActionsService} from '../../service/pre-dispatch-actions.service';
import {TranslateService} from '@ngx-translate/core';
import {TranslateSelectorService} from '../../../../service/translate-selector-service';

@Component({
  selector: 'app-pre-dispatch-add-direct',
  templateUrl: './pre-dispatch-add-direct.component.html',
  styleUrls: ['./pre-dispatch-add-direct.component.css']
})
export class PreDispatchAddDirectComponent extends ModalComponent implements OnInit {
    constructor(
        private preDispatchActionsService: PreDispatchActionsService,
        public productsService: ProductsService,
        public filtersService: FiltersService,
        private preDispatchService: PreDispatchService,
        private translate: TranslateService,
        private translateSelectorService: TranslateSelectorService,

        ) {
          super();
          this.translateSelectorService.setDefaultLanuage();
        }
    name = '' ;
    error: any = false ;
    filtersCount = 0 ;
    selectedCount = 0;
    confirmed = false ;

    ngOnInit() {
        this.filtersCount = Object.keys(this.filtersService.filters).length;
        this.selectedCount = this.productsService.selectedProducts.length ;
        if (this.filtersService.specials.cities && !this.filtersService.specials.cities.all) { this.filtersCount++; }
        if (this.filtersService.specials.streets && !this.filtersService.specials.streets.all) { this.filtersCount++; }
    }

    run(modal) {
        console.log('pre dishpatch add direct', this.preDispatchService.getActivePreDispatch());
        this.preDispatchActionsService.addToPreDispatch(this.data, this.preDispatchService.getActivePreDispatch()) ;
        modal.close();
    }
}
