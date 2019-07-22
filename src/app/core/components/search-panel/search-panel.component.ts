import {Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {FiltersService} from '../../../service/filters.service';
import {ApiResponseInterface} from '../../models/api-response.interface';
import {RecipientsService} from '../../../service/recipients.service';
import {ActionsService} from '../../../service/actions.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalDirective} from '../../../shared/directives/modal.directive';

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
  fieldsData: any ;
  searchFields: any ;
  search_value: string;
  active_cap = null ;
  subscriptions: any = {} ;
  grouping = {active: 'cap', filters: 'filters'} ;
  active_action: any = false ;
  _m_active_action = null ;
  actions: any = [];
  loaded = false ;
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
            this.loaded = true;
         }
      });
      this.actionsService.actionsChanges.subscribe((actions) => {
          this.actions = actions ;
      });
      this.filtersService.cleared.subscribe(() => {
          this._active_filters = [];
          this._m_active_action = null ;
          this.active_action = null ;
          this._search = null ;
          this._filters = [] ;
      });
      this.filtersService.fields.subscribe((data) => {
          this.fieldsData = data ;
          if ( this.loaded ) {
              this.initFields() ;
          }
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
    this._filters = this._filters.filter(elm => elm.key !== key);
    this._active_filters = this._active_filters.filter(elm => elm.key !== key);

    const val = this.getInputValue(event, type) ;
    if (val && val !== '') {
        if ( typeof val === 'object' && !val.length ) { return ; }
        this._filters.push({key: key, value: val});
    }
    if (typeof this.filtersFields[idx].key === 'string') {
        this.filtersFields[idx].value = val ;
    } else {
        if (!this.filtersFields[idx].value) {
            this.filtersFields[idx].value = {} ;
        }
        this.filtersFields[idx].value[key] = val ;
    }
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
      if (typeof key === 'object') {
          return this._active_filters.find( e => key.indexOf(e.key) !== -1) ;
      }
      return this._active_filters.find(e => e.key === key) ;

  }
  isFilled(key) {
      return this._filters.find(e => e.key === key) ;
  }

  clearFilters() {}

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
    if ( !appendField &&  this.active_action && typeof this.active_action.finish === 'function') {
        this.active_action.finish() ;
    }
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
    if ( action && !appendField && typeof action.init === 'function' ) {
        action.init() ;
    }
    this.active_action = action;
  }

  runAction() {
    if ( this.active_action && this.active_action.modal ) {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.active_action.modal);
        const viewContainerRef = this.modalHost.viewContainerRef ;
        viewContainerRef.clear() ;
        const componentRef = viewContainerRef.createComponent(componentFactory);
        const instance = <any>componentRef.instance ;
        instance.data = this.active_action  ;
        const modalOptions = Object.assign({ windowClass: 'animated slideInDown' },
            this.active_action.modalOptions ? this.active_action.modalOptions : {} );
        this.modalService.open(instance.modalRef, modalOptions) ;
    } else if ( this.active_action && typeof this.active_action.run === 'function' ) {
        this.active_action.run() ;
    }
  }

  checkActionSubmit(event) {
      if (event.code === 'Enter' && typeof this.active_action.submit === 'function') {
          this.active_action.submit(this.active_action, event);
      }
  }

  initFields() {
      this.filtersFields = this.fieldsData.fields.filters( this.fieldsData.container, this);
      this.searchFields = this.fieldsData.fields.search( this.fieldsData.container, this);
  }

}
