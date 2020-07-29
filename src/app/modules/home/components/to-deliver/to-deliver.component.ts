import {Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { CitiesService } from '../../../../service/cities.service';
import { TablesConfig } from '../../../../config/tables.config';
import {StreetsService} from '../../../../service/streets.service';
import {ProductsService} from '../../../../service/products.service';
import {PaginationService} from '../../../../service/pagination.service';
import {ApiResponseInterface} from '../../../../core/models/api-response.interface';
import {FiltersService} from '../../../../service/filters.service';
import {TableComponent} from '../../../../shared/components/table/table.component';
import {ActionsService} from '../../../../service/actions.service';
import {PreDispatchAddComponent} from '../../modals/pre-dispatch-add/pre-dispatch-add.component';
import {PreDispatchNewComponent} from '../../modals/pre-dispatch-new/pre-dispatch-new.component';
import {ImportFromBarcodesComponent} from '../../modals/import-from-barcodes/import-from-barcodes.component';
import {SimpleTableComponent} from '../../../../shared/components/simple-table/simple-table.component';
import {FilterConfig} from '../../../../config/filters.config';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/internal/operators';
import {RecipientsService} from '../../../../service/recipients.service';
import {ActivatedRoute} from '@angular/router';
import {PreDispatchAddDirectComponent} from '../../modals/pre-dispatch-add-direct/pre-dispatch-add-direct.component';
import {PreDispatchService} from '../../../../service/pre-dispatch.service';
import {AgenciesService} from '../../../../service/agencies.service';
import {CustomersService} from '../../../../service/customers.service';
import {CategoriesService} from '../../../../service/categories.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalDirective} from '../../../../shared/directives/modal.directive';
import {PwsisbsConfirmModalComponent} from '../../modals/pwsisbs-confirm-modal/pwsisbs-confirm-modal.component';
import {PsbatpdwsiConfirmModalComponent} from '../../modals/psbatpdwsi-confirm-modal/psbatpdwsi-confirm-modal.component';
import {StreetsLocatingService} from '../../../../service/locating/streets-locating.service';
import {SnotifyService} from 'ng-snotify';

@Component({
  selector: 'app-to-deliver',
  templateUrl: './to-deliver.component.html',
  styleUrls: ['./to-deliver.component.css']
})
export class ToDeliverComponent implements OnInit, OnDestroy {

  productsTable = TablesConfig.table.productsTable ;
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

  actions = [
    {
        name: 'Crea nuova Pre-Distinta', fields: [
            { type: 'select', field: 'method', options: [
                    {name: 'Selezionati', value: 'selected'},
                    {name: 'Secondo i filtri applicati', value: 'filters'}
                ], selectedAttribute: {name: 'Selezionati', value: 'selected'}
            }
        ],
        modal: PreDispatchNewComponent
    },
    {
        name: 'Aggiungi a Pre-Distinta esistente', fields: [
            { type: 'select', field: 'method', options: [
                    {name: 'Selezionati', value: 'selected'},
                    {name: 'Secondo i filtri applicati', value: 'filters'}
                ], selectedAttribute: {name: 'Selezionati', value: 'selected'}
            }
        ],
        modal: PreDispatchAddComponent,
    },
    {
        name: 'Importa Prodotti da Codici a Barre', fields: [],
        modal: ImportFromBarcodesComponent,
    },
    {
        name: 'Carica prodotti da Scanner', fields: [
            { type: 'text', field: 'barcode', placeholder: 'Barcode'},
        ], submit: (data, event) => {
          this.filtersService.addBarcodeFilter(data.barcode);
          this.productsService.selectAllOnLoad(true);
          event.target.value = '';
        }, modal: PreDispatchNewComponent, init: () => {
          this.products = [];
          this._citiesTable.clearData();
          this._streetsTable.clearData();
        },
        finish: () => { this.filtersService.clearBarcodFilter(); }
    },
  ];

  citiesGetMethod = (page, rpp, name, order) => this.citiesService.getCities(page, rpp, name, order);
  streetsGetMethod = (page, rpp, name, order) => this.streetsService.getStreets(page, rpp, name, this.current_cities, order);

  constructor(
      private citiesService: CitiesService,
      private streetsService: StreetsService,
      private productsService: ProductsService,
      private paginationService: PaginationService,
      private filtersService: FiltersService,
      private actionsService: ActionsService,
      protected recipientsService: RecipientsService,
      private activatedRoute: ActivatedRoute,
      private preDispatchService: PreDispatchService,
      private agenciesService: AgenciesService,
      private customersService: CustomersService,
      protected categoriesService: CategoriesService,
      private componentFactoryResolver: ComponentFactoryResolver,
      private modalService: NgbModal,
      private snotifyService: SnotifyService
  ) {
      this.paginationService.updateResultsCount(null) ;
      this.paginationService.updateLoadingState(true) ;
      this.activatedRoute.queryParams.subscribe(params => {
          if (params['actionsonly'] === 'addproductstopd') {
              this.actions = <any>{
                  name: 'Aggiungi a Pre-Distinta esistente', fields: [
                      { type: 'select', field: 'method', options: [
                              {name: 'Selezionati', value: 'selected'},
                              {name: 'Secondo i filtri applicati', value: 'filters'}
                          ], selectedAttribute: {name: 'Selezionati', value: 'selected'}
                      }
                  ],
                  modal: PreDispatchAddDirectComponent,
              };
          }
          if (params['activepredispatch']) {
              this.preDispatchService.setActivePreDispatch(params['activepredispatch']);
          }
      });
      this.preDispatchService.confirmProductsWithSameInfoShouldBeSelected.pipe(takeUntil(this.unsubscribe)).subscribe(
          data => {
              this.openModal(PwsisbsConfirmModalComponent, data);
          }
      );
      this.preDispatchService.confirmProductsShouldBeAddedToPreDispatchWithSameInfo.pipe(takeUntil(this.unsubscribe)).subscribe(
          data => {
              this.openModal(PsbatpdwsiConfirmModalComponent, data);
          }
      );
  }

  ngOnInit() {
      this.citiesTable.title = 'Paese';
      this.citiesTable.searchPlaceHolder =  'Cerca Paese';
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
      this.actionsService.reloadData.pipe(takeUntil(this.unsubscribe)).subscribe((state) => {
          this.loadProducts(false) ;
          this._citiesTable.reload(true);
          this._streetsTable.reload(true);
          this.productsService.selectedProducts = [] ;
      });
      this.productsService.selectAllOnLoadEvent.pipe(takeUntil(this.unsubscribe)).subscribe((state: boolean) => {
          this.selectAllOnLoad = state ;
      });
      this.filtersService.setFields(FilterConfig.products, this);
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
      this._productsTable.loading(true);
      if (reset) {
          this.paginationService.updateCurrentPage(1, true);
          this.paginationService.updateLoadingState(true);
          this._productsTable.resetSelected();
      }
      this.subscription = this.productsService.getToDeliverProducts(
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

  selectedItemsChanged(items) {
      this.productsService.selectedProducts = items ;
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
              this.snotifyService.warning('Il nuovo nome è molto corto', { showProgressBar: false, timeout: 2000 });
              return ;
          }
          const promise = this.streetsService.renameStreet(event.item, event.inputValue);
          this.snotifyService.async('Re-localizza', promise, { showProgressBar: true, timeout: 4000 });
          return ;
      }
  }

  ngOnDestroy() {
      this.unsubscribe.next();
      this.unsubscribe.complete();
  }

}
