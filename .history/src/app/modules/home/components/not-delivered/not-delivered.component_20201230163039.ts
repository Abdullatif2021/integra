import {Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { CitiesService } from '../../../../service/cities.service';
import { TablesConfig } from '../../../../config/tables.config';
import {StreetsService} from '../../../../service/streets.service';
import {PaginationService} from '../../../../service/pagination.service';
import {ApiResponseInterface} from '../../../../core/models/api-response.interface';
import {FiltersService} from '../../../../service/filters.service';
import {TableComponent} from '../../../../shared/components/table/table.component';
import {ActionsService} from '../../../../service/actions.service';
import {SimpleTableComponent} from '../../../../shared/components/simple-table/simple-table.component';
import {FilterConfig} from '../../../../config/filters.config';
import {NotDeliveredService} from '../../../../service/not-delivered.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/internal/operators';
import {RecipientsService} from '../../../../service/recipients.service';
import {PreloadingStrategy , Router} from '@angular/router';
import {CategoriesService} from '../../../../service/categories.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalDirective} from '../../../../shared/directives/modal.directive';
import {SnotifyService} from 'ng-snotify';
import { TranslateService } from '@ngx-translate/core';
import {CreateNewActivityComponent} from '../../modals/create-new-activity/create-new-activity.component';
import {SetStatusModalComponent} from '../../../../shared/modals/set-status-modal/set-status-modal.component';
import {IntegraaModalService} from '../../../../service/integraa-modal.service';
import {TranslateSelectorService} from '../../../../service/translate-selector-service';

@Component({
  selector: 'app-not-delivered',
  templateUrl: './not-delivered.component.html',
  styleUrls: ['./not-delivered.component.css']
})
export class NotDeliveredComponent implements OnInit, OnDestroy {

  notDeliveredTable = TablesConfig.table.notDeliveredTable ;
  citiesTable = TablesConfig.simpleTable.citiesTable ;
  streetsTable = TablesConfig.simpleTable.streetsTable ;
  products: any ;
  @ViewChild('CitiesTable') _citiesTable: SimpleTableComponent ;
  @ViewChild('StreetsTable') _streetsTable: SimpleTableComponent ;
  @ViewChild('ProductsTable') _productsTable: TableComponent ;
  @ViewChild(ModalDirective) modalHost: ModalDirective;
  subscription: any = false ;
  current_cities = {all: true, items: [], search: null} ;
  current_streets = {all: true, items: [], search: null};
  selectAllOnLoad = false ;
  unsubscribe: Subject<void> = new Subject();
  order_field = null ;
  order_method = '1' ;
  refresh = 0 ;


  actions = [
    {
        name: this.translate.instant('home.to_delivered_action.create_one.value'), fields: [
            { type: 'select', field: 'method', options: [
                    {name: this.translate.instant('home.to_delivered_action.create_one.select'), value: 'selected'},
                    {name: this.translate.instant('home.to_delivered_action.create_one.by_filter'), value: 'filters'}
                ], selectedAttribute: {name: this.translate.instant('home.to_delivered_action.create_one.select'), value: 'selected'}
            }
        ],
        before_modal_open: (event) => this.createActivityCheck(event),
        modal: CreateNewActivityComponent,
        modalOptions: {size: 'xl'}
    },
    
    
    
    {
        name: this.translate.instant('home.modals.not_delivered_actions.action_name'), fields: [
            { type: 'select', field: 'method', options: [
                    {name: this.translate.instant('home.modals.not_delivered_actions.selected'), value: 'selected'},
                    {name: this.translate.instant('home.modals.not_delivered_actions.by_filter'), value: 'filters'}
                ], selectedAttribute: {name: 'Selezionati', value: 'selected'}
            }
        ],
        before_modal_open: (event) => this.createActivityCheck(event),
        modal: SetStatusModalComponent,
        modalData: {
            selected: () => this.notdeliveredService.getSelectedProducts(),
            state: 'not_delivered' }
 }];

  citiesGetMethod = (page, rpp, name, order) => this.citiesService.getNotDeliveredCities(page, rpp, name, order);
  streetsGetMethod = (page, rpp, name, order) => this.streetsService.getNotDeliveredStreets(page, rpp, name, this.current_cities, order);

  constructor(
      private citiesService: CitiesService,
      private streetsService: StreetsService,
      private paginationService: PaginationService,
      private filtersService: FiltersService,
      private integraaModalService: IntegraaModalService,
      private actionsService: ActionsService,
      protected recipientsService: RecipientsService,
      private notdeliveredService: NotDeliveredService,
      protected categoriesService: CategoriesService,
      private componentFactoryResolver: ComponentFactoryResolver,
      private modalService: NgbModal,
      private snotifyService: SnotifyService,
      private router: Router,
      private translate: TranslateService,
      private translateSelectorService: TranslateSelectorService,
      ) {
      this.translateSelectorService.setDefaultLanuage();
      this.paginationService.updateResultsCount(null) ;
      this.paginationService.updateLoadingState(true) ;
      }

  ngOnInit() {
      this.citiesTable.title = this.translate.instant('table_config.simpletable.cities_table.value');
      this.citiesTable.searchPlaceHolder =  this.translate.instant('table_config.simpletable.cities_table.plhold');
      this.filtersService.clear();
      this.loadProducts(false);
      this.paginationService.rppValueChanges.pipe(takeUntil(this.unsubscribe)).subscribe((rpp: number) => {
          this.loadProducts(false) ;
      });
      this.paginationService.currentPageChanges.pipe(takeUntil(this.unsubscribe)).subscribe( (page: number) => {
          this.loadProducts(false) ;
      });
      this.filtersService.filtersChanges.pipe(takeUntil(this.unsubscribe)).subscribe((filtersData: any) => {
          const filters = filtersData.filters ;
          this.citiesTable.title = filters.grouping === 'by_client' ? 'Cliente' : 'Paese' ;
          this.citiesTable.searchPlaceHolder = filters.grouping === 'by_client' ? 'Cerca Cliente' : 'Cerca Paese' ;
          if (filters.grouping === 'by_cap' && filters.recipientCap && filtersData.placeholders && filtersData.placeholders.recipientCap) {
              this._streetsTable.clearData();
              this._citiesTable.setSearchValue(filtersData.placeholders.recipientCap);
              this.current_cities = {all: true, items: [], search: filtersData.placeholders.recipientCap};
          } else if (this._citiesTable.resetIfAuto()) {
              this.current_cities = {all: true, items: [], search: null};
          }
          this.loadProducts(true) ;
          this._streetsTable.reload();
          this._citiesTable.reload();
      });
      this.actionsService.setActions(this.actions);
      this.notdeliveredService.selectAllOnLoadEvent.pipe(takeUntil(this.unsubscribe)).subscribe((state: boolean) => {
          this.selectAllOnLoad = state ;
      });
      this.filtersService.setFields(FilterConfig.notdelivered, this);
  }

  cityChanged(event) {
     this.current_cities = event;
     this._streetsTable.loadData(false) ;
     this.current_streets.all = true ;
     this.current_streets.items = [];
     this.loadProducts(true);
     this.filtersService.setSpecialFilter('cities', event);
  }

  streetChanged(event) {
      this.current_streets = event ;
      this.loadProducts(true);
      this.filtersService.setSpecialFilter('streets', event);
      console.log(event);
  }

  loadProducts(reset: boolean) {
      if ( this.subscription ) { this.subscription.unsubscribe(); }
      if (
          !this.current_cities.all && (!this.current_cities.items || !this.current_cities.items.length) ||
          !this.current_streets.all && (!this.current_streets.items || !this.current_streets.items.length)
      ) {
          this.products = [] ;
          return false;
      }
      this.products = [];
      this._productsTable.loading(false);
      if (reset) {
          this.paginationService.updateCurrentPage(1, true);
          this.paginationService.updateLoadingState(true);
          this._productsTable.resetSelected();
      }
      this.subscription = this.notdeliveredService.getNotDeliverProducts(
          this.current_cities,
          this.current_streets,
          this.order_field,
          this.order_method,
          // this.citiesType
      ).pipe(takeUntil(this.unsubscribe)).subscribe((res: ApiResponseInterface) => {
          this.paginationService.updateLoadingState(false);
          this.paginationService.updateResultsCount(res.pagination.total);
          this.products = res.data ;
          this._productsTable.loading(false);
          if (this.selectAllOnLoad) {
              setTimeout(() => this._productsTable.selectAll(), 0) ;
          }
          this.selectAllOnLoad = false ;
      });
  }

  changeOrder(event) {
        this.order_field = event.field;
        this.order_method = event.order === 'DESC' ? '1' : '2';
        this.loadProducts(false);
  }

  selectedItemsChanged(product) {
    this.notdeliveredService.selectedProducts = product ;
    console.log(product);
  }

  getCategoriesByName(name) {
      return this.categoriesService.getCategoriesByName(name);
  }

  openModal(modal, data, options = {}) {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(modal);
      const viewContainerRef = this.modalHost.viewContainerRef ;
      viewContainerRef.clear() ;
      const componentRef = viewContainerRef.createComponent(componentFactory);
      const instance = <any>componentRef.instance ;
      instance.data = data ;
      const modalOptions = <any>Object.assign({ windowClass: 'animated slideInDown', backdrop: 'static' }, options);
      this.modalService.open(instance.modalRef, modalOptions) ;
  }

  handleStreetsAction(event) {
      if (event.action.action === 'rename') {
          if (event.inputValue.length < 2 ) {
              this.snotifyService.warning(this.translate.instant('home.modals.not_delivered_actions.warning.name_is_short'),
               { showProgressBar: false, timeout: 2000 });
              return ;
          }
          const promise = this.streetsService.renameStreet(event.item, event.inputValue);
          console.log(event.item)
          this.snotifyService.async('Re-localizza', promise, { showProgressBar: true, timeout: 4000 });
          return ;
      }
  }
  showLogModal(elm) {
    this.integraaModalService.open(`/pages/product/${elm.id}/log`,
        {width: 1000, height: 600, title: `Log: ${elm.barcode}`}, {});
        this.refresh++ ;
        }

  createActivity(event) {
      if (event.method === 'selected' && !this.notdeliveredService.selectedProducts.length) {
          return this.snotifyService.warning(this.translate.instant('home.modals.not_delivered_actions.warning.select_first'),
           { showProgressBar: false, timeout: 2000 });
      } else if (event.method === 'filters' && !Object.keys(this.filtersService.filters).length
          && !Object.keys(this.filtersService.specials).length) {
          return this.snotifyService.warning(this.translate.instant('home.modals.not_delivered_actions.warning.no_filter_applied'),
           { showProgressBar: false, timeout: 2000 });
      }
      this.router.navigate(['not-delivered/activities']);
  }

  createActivityCheck(event) {
    if (event.method === 'selected' && !this.notdeliveredService.selectedProducts.length) {
        this.snotifyService.warning('You have to select products first', { showProgressBar: false, timeout: 2000 });
        return false;
    } else if (event.method === 'filters' && !Object.keys(this.filtersService.getFilterObject(true)).length) {
        this.snotifyService.warning('No Filters applied', { showProgressBar: false, timeout: 2000 });
        return false;
    }
    console.log(event)
    return true;
   
}

  ngOnDestroy() {
      this.unsubscribe.next();
      this.unsubscribe.complete();
  }
}
