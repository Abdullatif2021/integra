import {Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {FiltersService} from '../../../service/filters.service';
import {ApiResponseInterface} from '../../models/api-response.interface';
import {RecipientsService} from '../../../service/recipients.service';
import {ActionsService} from '../../../service/actions.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalDirective} from '../../../shared/directives/modal.directive';
// import {FilterConfig} from '../../../config/filters.config';

@Component({
  selector: 'app-search-panel',
  templateUrl: './search-panel.component.html',
  styleUrls: ['./search-panel.component.css']
})

export class SearchPanelComponent implements OnInit {

  constructor(
      private filtersService: FiltersService,
      private recipientsService: RecipientsService,
      private actionsService: ActionsService,
      private componentFactoryResolver: ComponentFactoryResolver,
      private modalService: NgbModal
  ) {}

  isCollapsed = true ;
  _search: any ;
  _filters = [] ;
  _active_filters = [] ;
  filters_data: any ;
  filtersFields: any ;
  searchFields: object ;
  search_value: string;
  active_cap = null ;
  subscriptions: any = {} ;
  grouping = {active: 'cap', filters: 'filters'} ;
  active_action: any = false ;
  _m_active_action = null ;
  actions: any = [];
  @ViewChild(ModalDirective) modalHost: ModalDirective;

  unsubscribeTo(name) {
      if ( this.subscriptions[name] ) {
          this.subscriptions[name].unsubscribe() ;
      }
  }

  ngOnInit() {
      this.filtersService.getFiltersData().subscribe((res: ApiResponseInterface) => {
         if (res.status === 'success') {
            this.filters_data = res.data ;
            this.initFields();
         }
      });
      this.actionsService.actionsChanges.subscribe((actions) => {
          this.actions = actions ;
      });
      this.filtersService.cleared.subscribe(() => {
          this._active_filters = [];
          this._m_active_action = null ;
          this.active_action = null ;
      });
  }

  searchFieldChanged(event) {
      this._search = event ;
      this.search_value = null ;
  }

  getInputValue(event, type) {
      let value = null ;
      switch (type) {
          case 'text': value = event ; break ;
          case 'date': value = event.target.value ; break ;
          case 'simpleText': value = event.target.value ; break ;
          case 'number': value = event.target.value ; break ;
          case 'ng-select': value = event && event.id ? event.id : ( event && event.name ? event.name : null); break;
          case 'tag': value = event;
      }
      return value ;
  }
  changeSearchValue(event, type) {
      this.search_value = this.getInputValue(event, type) ;
  }

  search() {
      if (this._search && !this.search_value) { return ; }
      if (this._search && this._search.key && this.search_value) {
        this.filtersService.updateFilters([{key: this._search.key, value: this.search_value}]);
      } else {
        this.filtersService.updateFilters([]) ;
      }
      this._active_filters = [] ;
  }

  changeFiltersValue(event, key, type, idx) {
    if (typeof this.filtersFields[idx].change === 'function') {
        return this.filtersFields[idx].change(event) ;
    }
    this._filters = this._filters.filter((elm) => {
        return elm.key !== key ;
    });
    const val = this.getInputValue(event, type) ;
    if (val && val !== '') {
        if ( typeof val === 'object' && !val.length ) { return ; }
        this._filters.push({key: key, value: val});
    }
    this.filtersFields[idx].value = val ;
  }

  // TODO remake in a better way
  filterCap(cap) {
      this.active_cap = cap ;
      this._active_filters = this._active_filters.filter((elm) => {
          return elm.key !== 'recipientCap' ;
      });
      let filters = [] ;
      if (this.grouping.filters === 'filters' ) {
          filters = this._active_filters.concat({key: 'recipientCap', value: cap.id}) ;
      } else {
          this._active_filters = [] ;
          filters = [{key: 'recipientCap', value: cap.id}] ;
      }
      this.filtersService.updateFilters(filters) ;
  }

  filterCustomer(customer) {
      this.active_cap = customer ;
      this._active_filters = this._active_filters.filter((elm) => {
          return elm.key !== 'customerId' ;
      });
      let filters = [] ;
      if (this.grouping.filters === 'filters' ) {
          filters = this._active_filters.concat({key: 'customerId', value: customer.id}) ;
      } else {
          this._active_filters = [] ;
          filters = [{key: 'customerId', value: customer.id}] ;
      }
      this.filtersService.updateFilters(filters) ;
  }

  filter() {
      this.filtersService.updateFilters(this._filters) ;
      this._active_filters = this._filters ;
      this.active_cap = null ;
      this._search = null ;
  }

  isActive(key) {
      return this._active_filters.find(e => e.key === key) ;
  }

  clearFilters() {}

  initFields() {
      this.searchFields = [
          {type: 'ng-select', label: 'Cliente', key: 'customerId', items:  this.filters_data.customers, labelVal: 'name'},
          {type: 'text', label: 'Nominativo Cliente', key: 'customerName'},
          {type: 'text', label: 'Distinita Postale', key: 'dispatchCode'},
          {type: 'text', label: 'Codice Barre', key: 'barcode'},
          {type: 'text', label: 'Codice Atto', key: 'actCode'},
          {type: 'text', label: 'Nominativo Destinatario', key: 'recipientName'},
          {type: 'ng-select', label: 'Destinatario', key: 'recipientId', labelVal: 'name',
              getMethod: (term) => this.recipientsService.getRecipientsByName(term), items: this.filters_data.recipient},
          {type: 'date', label: 'Data/Ora', key: 'date'},
          {type: 'text', label: 'Articolo Legge', key: 'articleLawName'},
          {type: 'date', label: 'Data Articolo Legge', key: 'articleLawDate'},
          {type: 'date', label: 'Data Accettazione', key: 'acceptanceDate'},
          {type: 'number', label: 'TENTATIVI', key: 'attempt'},
          {type: 'text', label: 'Nominativo MITTENTE', key: 'senderName'},
          {type: 'ng-select', label: 'MITTENTE', key: 'senderId', items: this.filters_data.senders, labelVal: 'name'},
          {type: 'ng-select', label: 'Categoria', key: 'categoryId', items: this.filters_data.categories, labelVal: 'name'},
          {type: 'ng-select', label: 'Agenzia', key: 'agencyId', items: this.filters_data.agencies, labelVal: 'name'},
          {type: 'ng-select', label: 'Product Type', key: 'typeId', items: this.filters_data.products_type, labelVal: 'type'},
          {type: 'text', label: 'Note', key: 'note'}
      ];
      this.filtersFields =  [
          {type: 'simpleText', label: 'Nominativo Cliente', key: 'customerName', value: ''},
          {type: 'ng-select', label: 'Cliente', key: 'customerId', items:  this.filters_data.customers, labelVal: 'name', value: ''},
          // {type: 'simpleText', label: 'Postino previsto:', disabled: true},
          {type: 'ng-select', label: 'Agenzia', key: 'agencyId', items: this.filters_data.agencies, labelVal: 'name', value: ''},
          {type: 'simpleText', label: 'Distinita Postale', key: 'dispatchCode', value: ''},
          {type: 'tag', label: 'Codice Barre', key: 'barcode', value: '', _class: 'tags-select'},
          {type: 'simpleText', label: 'Codice Atto', key: 'actCode', value: ''},
          {type: 'simpleText', label: 'Nome Prodotto:', key: 'productTypeName', value: ''},
          {type: 'ng-select', label: 'Prodotto', key: 'productTypeNameId',
              items: this.filters_data.products_type, labelVal: 'type'},
          {type: 'ng-select', label: 'Categoria', key: 'categoryId', items: this.filters_data.categories, labelVal: 'name', value: ''},
          // {type: 'simpleText', label: 'Stato/Esito:', disabled: true},
          {type: 'simpleText', label: 'Nominativo Destinatario', key: 'recipientName', value: ''},
          {type: 'ng-select', label: 'Destinatario', key: 'recipientId', labelVal: 'name',
              getMethod: (term) => this.recipientsService.getRecipientsByName(term), items: this.filters_data.recipient},
          {type: 'ng-select', label: 'CAP Destinatario:', key: 'recipientCap', items: this.filters_data.caps_group, labelVal: 'name'},
          {type: 'simpleText', label: 'Indirizzo Destinatario:', key: 'destination'},
          {type: 'ng-select', label: 'Raggruppamento quantita:', labelVal: 'name',
              items: [{name: 'Quantità per CAP', id: 'cap'}, {name: 'Quantità per Cliente', id: 'client'}],
              change: (val) => {this.groupByChanged(val) ; }, unclearbale: true,
              selectedAttribute: {name: 'Quantità per CAP', id: 'cap'}},
          {type: 'ng-select', key: '__quantity_', label: 'Quantita per CAP:', items : [
              {name: 'Tutto', id: 'all'}, {name: 'Con Filtri Applicati', id: 'filters'} ], labelVal: 'name',
              selectedAttribute: {name: 'Con Filtri Applicati', id: 'filters'},
              change: (val) => {this.grouping.filters = val.id ; }, unclearbale: true
          },
          {type: ['date', 'date'], label: 'Data/Ora:', group: true, key: ['fromDate', 'toDate']},
          {type: 'simpleText', label: 'Articolo Legge', key: 'articleLawName'},
          {type: ['date', 'date'], label: 'Data Articolo Legge:', group: true, key: ['fromArticleLawDate', 'toArticleLawDate']},
          {type: ['date', 'date'], label: 'Data Accettazione:', group: true, key: ['fromAcceptanceDate', 'toAcceptanceDate']},
         ];
  }

  groupByChanged(val) {
      this.grouping.active = val.id ;
      let selected = {} ;
      switch (val.id) {
          case 'cap': selected = {
              type: 'ng-select', key: '__quantity_', label: 'Quantita per CAP:', items : [
                  {name: 'Tutto', id: 'all'},
                  {name: 'Con Filtri Applicati', id: 'filters'}
              ], labelVal: 'name', change: (value) => {this.grouping.filters = value.id ; },
              selectedAttribute: {name: 'Con Filtri Applicati', id: 'filters'}, unclearbale: true} ; break ;
          case 'client': selected = {
              type: 'ng-select', key: '__quantity_', label: 'Quantita per Client:', items : [
                  {name: 'Tutto', id: 'all'},
                  {name: 'Con Filtri Applicati', id: 'filters'}
              ], labelVal: 'name', change: (value) => {this.grouping.filters = value.id ; },
              selectedAttribute: {name: 'Con Filtri Applicati', id: 'filters'}, unclearbale: true} ; break ;
      }
      for (let i = 0; i < this.filtersFields.length ; ++i) {
          if ( this.filtersFields[i].key && this.filtersFields[i].key === '__quantity_') {
              this.filtersFields[i] = selected ;
          }
      }
  }

  getFieldRemoteData(event, field) {
      if (!event.term || event.term === '') {
          field.items = field.originalItems ? field.originalItems : [] ;
          this.unsubscribeTo('fieldRemoteData') ;
          field.loading = false ;
      } else if (typeof field.getMethod === 'function') {
          this.unsubscribeTo('fieldRemoteData') ;
          field.loading = true ;
          this.subscriptions.fieldRemoteData = field.getMethod(event.term).subscribe((res: ApiResponseInterface) => {
              if (res.status === 'success') {
                  field.originalItems = field.items ;
                  field.items = res.data ;
                  field.loading = false ;
              }
          });
      }
    }

  changeActiveAction(action, appendField = null, appendVal = null) {
    if ( action && appendField ) {
        if ( appendField.type === 'select' ) {
            action[appendField['field']] = appendVal ? appendVal.value : null ;
        } else {
            action[appendField['field']] = appendVal && appendVal.target.value && appendVal.target.value !== '' ?
                appendVal.target.value : null ;
        }
    }
    if ( action && !appendField && action.fields) {
        action.fields.forEach((field) => {
            action[field.field] = field.selectedAttribute && field.selectedAttribute.value ? field.selectedAttribute.value : '' ;
        });
    }
    this.active_action = action;
  }

  runAction() {

    if ( this.active_action.modal ) {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.active_action.modal);
        const viewContainerRef = this.modalHost.viewContainerRef ;
        viewContainerRef.clear() ;
        const componentRef = viewContainerRef.createComponent(componentFactory);
        const instance = <any>componentRef.instance ;
        instance.data = this.active_action ;
        this.modalService.open(instance.modalRef,{ windowClass: 'animated slideInDown' }) ;
    } else if ( typeof this.active_action === 'object' && typeof this.active_action.run === 'function' ) {
        this.active_action.run() ;
    }
  }



}
