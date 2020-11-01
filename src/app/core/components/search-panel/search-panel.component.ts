import {Component, ComponentFactoryResolver, ElementRef, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {FiltersService} from '../../../service/filters.service';
import {ApiResponseInterface} from '../../models/api-response.interface';
import {RecipientsService} from '../../../service/recipients.service';
import {ActionsService} from '../../../service/actions.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalDirective} from '../../../shared/directives/modal.directive';
import {FilterConfig} from '../../../config/filters.config';

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
  // used for view changes {
  _active_filters = {} ;
  _changed_filters = {};
  _has_active_filters = false ;
  // }
  filters_data: any ;
  filtersFields: any ;
  fieldsData: any ;
  searchFields: any ;
  search_value: any;
  active_cap = null ;
  subscriptions: any = {} ;
  grouping = {active: 'cap', filters: 'filters'} ;
  active_action: any = false ;
  _m_active_action = null ;
  actions: any = [];
  loaded = false ;

  filters = <any>{};
  @ViewChild(ModalDirective) modalHost: ModalDirective;
  @ViewChild('confirmUnAppliedFiltersModalRef') confirmUnAppliedFiltersModalRef: ElementRef;
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
          if (Array.isArray(actions)) {
              this.actions = actions ;
          } else {
              this.actions = null ;
              this.active_action = actions;
          }
      });
      this.filtersService.cleared.subscribe(() => {
          this._active_filters = this.fieldsData && this.fieldsData.fields &&
            this.fieldsData.fields.default_filters ? Object.assign({}, this.fieldsData.fields.default_filters) : {} ;
          this._m_active_action = null ;
          this.active_action = null ;
          this._search = null ;
          this.filters = this.fieldsData && this.fieldsData.fields &&
              this.fieldsData.fields.default_filters ? Object.assign({}, this.fieldsData.fields.default_filters) : {};
          this._has_active_filters = false ;
          this.isCollapsed = true ;
          this._changed_filters = {};
      });
      this.filtersService.fields.subscribe((data) => {
          this.fieldsData = data ;
          this.filters = Object.assign({}, data.fields.default_filters);
          this._active_filters = Object.assign({}, data.fields.default_filters);
          if ( this.loaded ) {
              this.initFields() ;
          }
      });

  }

  searchFieldChanged(event) {
      this._search = event ;
      this.search_value = null ;
  }

  search() {
      if (this._search && !this.search_value) { return ; }
      if (this._search && this._search.key && this.search_value) {
        const search = {} ;
        search[this._search.key] = typeof this.search_value === 'object' ?
            (this.search_value.id ? this.search_value.id : this.search_value.name) : this.search_value;
        this.filtersService.updateFilters(search);
      } else {
        this.filtersService.updateFilters([]) ;
      }
      this._active_filters = {} ;
  }

  changeFiltersValue(event, key, type, idx) {
      // if filters has action that needs to run on change, run it.
      if (typeof this.filtersFields[idx].change === 'function') {
          return this.filtersFields[idx].change(event) ;
      }

      // remove the active filter
      delete this._active_filters[key];
      this._changed_filters[key] = 1;

      if (this.filters[key] && typeof this.filters[key] === 'object' ?
          (Array.isArray(this.filters[key]) ? !this.filters[key].length : false) : !this.filters[key]) {
          delete this.filters[key];
      }

      // changes the filterField value, required in some filters, (the once with remote data loading.).
      if (typeof this.filtersFields[idx].key === 'string') {
          this.filtersFields[idx].value = this.filters[key] ;
      } else {
          if (!this.filtersFields[idx].value) {
              this.filtersFields[idx].value = {} ;
          }
          this.filtersFields[idx].value[key] = this.filters[key] ;
      }
  }

  filter() {
      const placeholders = {};
      if (this.filters_data && this.filters_data.caps_group && this.filters.recipientCap) {
          if (typeof this.filters['recipientCap'] === 'object') {
              placeholders['recipientCap'] = this.filters['recipientCap'].name;
          } else {
              placeholders['recipientCap'] = this.filters['recipientCap'];
          }
      }

      Object.keys(this.filters).forEach(filter => {
           const field = this.filtersFields.find(f => typeof f.key === 'object' ? f.key[0] === filter : f.key === filter );
           if (field && field.type === 'auto-complete') {
               this.filters[filter] = this.filters[filter][field.labelVal];
           }
      });

      this.filtersService.updateFilters(this.filters, placeholders) ;
      this._active_filters = Object.assign({}, this.filters) ;
      this._changed_filters = {} ;
      this._has_active_filters = Object.keys(this._active_filters).length ? true : false ;
      this.active_cap = null ;
      this._search = null ;
  }

  clearFilters() {
      this.filters = Object.assign({}, this.fieldsData.fields.default_filters);
      this._active_filters = Object.assign({}, this.fieldsData.fields.default_filters);
      this._changed_filters = {};
      this._has_active_filters = false ;

      this.filtersService.updateFilters(this.filters) ;
  }

  getFieldRemoteData(event, field) {
      this.auGetFieldRemoteData(event.term, field);
  }

  auGetFieldRemoteData(term, field) {
      if (!term || term === '') {
          field.items = field.originalItems ? field.originalItems : [] ;
          this.unsubscribeTo('fieldRemoteData') ;
          field.loadingState = false ;
      } else if (typeof field.getMethod === 'function') {
          this.unsubscribeTo('fieldRemoteData') ;
          field.loadingState = true ;
          this.subscriptions.fieldRemoteData = field.getMethod(term).subscribe((res: ApiResponseInterface) => {
              if (res.status === 'success' || res.success) {
                  field.originalItems = field.items ;
                  field.items = res.data ;
                  field.loadingState = false ;
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

  runAction(force = false) {
    if ( this.active_action && this.active_action.modal ) {
        if (!force && this.active_action.method && this.active_action.method === 'filters') {
            // check if there is any non committed filters
            if (Object.keys(this.filters).length !== Object.keys(this._active_filters).length) {

                this.modalService.open(this.confirmUnAppliedFiltersModalRef, {backdrop: 'static' });
                return false;
            }
        }
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.active_action.modal);
        const viewContainerRef = this.modalHost.viewContainerRef ;
        viewContainerRef.clear() ;
        const componentRef = viewContainerRef.createComponent(componentFactory);
        const instance = <any>componentRef.instance ;
        instance.data = this.active_action  ;
        const modalOptions = Object.assign({ windowClass: 'animated slideInDown', backdrop: 'static' },
            this.active_action.modalOptions ? this.active_action.modalOptions : {} );
        this.modalService.open(instance.modalRef, modalOptions) ;
    } else if ( this.active_action && typeof this.active_action.run === 'function' ) {
        this.active_action.run(this.active_action) ;
    }
  }

  checkActionSubmit(event) {
      if (event.code === 'Enter' && typeof this.active_action.submit === 'function') {
          this.active_action.submit(this.active_action, event);
      }
  }

  checkFilterSubmit(event) {
      if (event.code === 'Enter') {
          setTimeout(() => this.filter());
      }
  }

  checkSearchSubmit(event) {
      if (event.code === 'Enter') {
          setTimeout(() => this.search());
      }
  }

  changeViewButtonClicked(value) {
      this.filtersService.clickChangeViewButton(value);
  }

  clickHelperButton(tab) {
      if (this.fieldsData.fields.changeViewTabs.lock) {return ;}
      this.fieldsData.fields.changeViewTabs.tabs.forEach((_tab) => _tab.active = false);
      tab.active = true ;
      this.filtersService.changeViewTabsChanged(tab.value);
  }

  initFields() {
      if (!this.fieldsData || !this.fieldsData.fields) {
          return ;
      }
      this.filtersFields = this.fieldsData.fields.filters( this.fieldsData.container, this);
      this.searchFields = this.fieldsData.fields.search( this.fieldsData.container, this);
  }

}
