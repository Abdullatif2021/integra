import {Component, ElementRef, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {FiltersService} from '../../../service/filters.service';
import {ApiResponseInterface} from '../../models/api-response.interface';
import {debounceTime, switchMap} from 'rxjs/internal/operators';
import {RecipientsService} from '../../../service/recipients.service';

@Component({
  selector: 'app-search-panel',
  templateUrl: './search-panel.component.html',
  styleUrls: ['./search-panel.component.css']
})




export class SearchPanelComponent implements OnInit {

  constructor(
      private filtersService: FiltersService,
      private recipientsService: RecipientsService
  ) {
      this.search_typeahead.pipe(
            debounceTime(200),
            switchMap(term => this.getSearchSelectData(term))
          ).subscribe((res: ApiResponseInterface) => {
            if (res.status === 'success') {
                this._search.items  = res.data ;
            }
            this.search_loading = false ;
          });
  }

  isCollapsed = true ;
  _search: any ;
  _filters = [] ;
  _active_filters = [] ;
  filters_data: any ;
  filtersFields: object ;
  searchFields: object ;
  search_value: string;
  search_typeahead = new EventEmitter<string>();
  search_loading = false ;
  active_cap = null ;
  filtersGetData(event, idx) {
      if (typeof this.filtersFields[idx].getMethod === 'function') {
          this.filtersFields[idx].loading = true ;
          this.filtersFields[idx].getMethod(event.term).subscribe((res: ApiResponseInterface) => {
              if (res.status === 'success') {
                  this.filtersFields[idx].items = res.data ;
                  this.filtersFields[idx].loading = false ;
              }
          });
      }
  }
  getSearchSelectData(term) {
      this.search_loading = true ;
      if (term && term !== '' && this._search && typeof this._search.getMethod !== 'undefined') {
          return this._search.getMethod(term) ;
      }
      return [{'status': 'failed'}] ;
  }


  ngOnInit() {
      this.filtersService.getFiltersData().subscribe((res: ApiResponseInterface) => {
         if (res.status === 'success') {
            this.filters_data = res.data ;
            this.initFields();
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
          case 'ng-select': value = event && event.id ? event.id : null ;
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
  }

  changeFiltersValue(event, key, type, idx) {
    this._filters = this._filters.filter((elm) => {
        return elm.key !== key ;
    });
    const val = this.getInputValue(event, type) ;
    if (val && val !== '') {
        this._filters.push({key: key, value: val});
    }
    this.filtersFields[idx].value = val ;
  }

  filterCap(cap) {
      this.active_cap = cap ;
      this._active_filters = this._active_filters.filter((elm) => {
          return elm.key !== 'recipientCap' ;
      });
      this._active_filters.concat({key: 'recipientCap', value: cap.name});
      this.filtersService.updateFilters(this._active_filters) ;
  }

  filter() {
      this.filtersService.updateFilters(this._filters) ;
      this._active_filters = this._filters ;
      this.active_cap = null ;
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
              getMethod: (term) => this.recipientsService.getRecipientsByName(term), items: []},
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
          {type: 'simpleText', label: 'Codice Barre', key: 'barcode', value: ''},
          {type: 'simpleText', label: 'Codice Atto', key: 'actCode', value: ''},
          {type: 'simpleText', label: 'Nome Prodotto:', key: 'productTypeName', value: ''},
          // {type: 'simpleText', label: 'Prodotto:', disabled: true},
          {type: 'ng-select', label: 'Categoria', key: 'categoryId', items: this.filters_data.categories, labelVal: 'name', value: ''},
          // {type: 'simpleText', label: 'Stato/Esito:', disabled: true},
          {type: 'simpleText', label: 'Nominativo Destinatario', key: 'recipientName', value: ''},
          {type: 'ng-select', label: 'Destinatario', key: 'recipientId', labelVal: 'name',
              getMethod: (term) => this.recipientsService.getRecipientsByName(term), items: []},
          {type: 'ng-select', label: 'CAP Destinatario:', key: 'recipientCap', items: this.filters_data.caps_group, labelVal: 'name'},
          {type: 'simpleText', label: 'Indirizzo Destinatario:', key: 'destination'},
          // {type: 'simpleText', label: 'Raggruppamento quantita:', disabled: true},
          // {type: 'simpleText', label: 'Quantita per CAP:', disabled: true},
          {type: ['date', 'date'], label: 'Data/Ora:', group: true, key: ['fromDate', 'toDate']},
          {type: 'simpleText', label: 'Articolo Legge', key: 'articleLawName'},
          {type: ['date', 'date'], label: 'Data Articolo Legge:', group: true, key: ['fromArticleLawDate', 'toArticleLawDate']},
          {type: ['date', 'date'], label: 'Data Accettazione:', group: true, key: ['fromAcceptanceDate', 'toAcceptanceDate']},

          {type: 'number', label: 'TENTATIVI', key: 'attempt'}, // not in filters
          {type: 'simpleText', label: 'Nominativo MITTENTE', key: 'senderName'}, // not in filters
          {type: 'ng-select', label: 'MITTENTE', key: 'senderId', items: this.filters_data.senders, labelVal: 'name'}, // not in filters
          {type: 'ng-select', label: 'Product Type', key: 'typeId',
              items: this.filters_data.products_type, labelVal: 'type'}, // not in filters
         ];
  }




}
