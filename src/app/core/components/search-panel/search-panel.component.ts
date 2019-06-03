import {Component, EventEmitter, OnInit} from '@angular/core';
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
      this.typeahead.pipe(
            debounceTime(200),
            switchMap(term => this.test(term))
          ).subscribe((res: ApiResponseInterface) => {
            if (res.status === 'success') {
                this._search.items  = res.data ;
            }
          });
  }


  isCollapsed = true ;
  _search: any ;
  filters_data: any ;
  filtersFields: object ;
  searchFields: object ;
  search_value: string;
  typeahead = new EventEmitter<string>();

  // DUMMY DATA {
  caps = [
      {cap: 80022, val: 5348},
      {cap: 80022, val: 5348},
      {cap: 80022, val: 5348},
      {cap: 80022, val: 5348},
      {cap: 80022, val: 5348},
      {cap: 80022, val: 5348}
  ];
  // } DUMMY DATA
  test(term) {
      console.log(term);
      if (term && term !== '' && typeof this._search.getMethod !== 'undefined') {
          return this._search.getMethod(term) ;
      }
      return {'status': 'failed'} ;
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

  changeSearchValue(event, type) {
      switch (type) {
          case 'text': this.search_value = event ; break ;
          case 'date': this.search_value = event.target.value ; break ;
          case 'ng-select': this.search_value = event.id ;
      }
  }

  search() {
      if (this._search && !this.search_value) { return ; }
      if (this._search && this._search.key && this.search_value) {
        this.filtersService.updateFilters([{key: this._search.key, value: this.search_value}]);
      } else {
          this.filtersService.updateFilters([]) ;
      }
  }

  initFields() {
      this.searchFields = [
          {type: 'text', label: 'Nominativo Cliente', key: 'customerName'},
          {type: 'ng-select', label: 'Cliente', key: 'customerId', items:  this.filters_data.customers, labelVal: 'name'},
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
          {type: 'text', label: 'TENTATIVI', key: 'attempt'},
          {type: 'text', label: 'Nominativo MITTENTE', key: 'senderName'},
          {type: 'ng-select', label: 'MITTENTE', key: 'senderId', items: this.filters_data.senders, labelVal: 'name'},
          {type: 'ng-select', label: 'Categoria', key: 'categoryId', items: this.filters_data.categories, labelVal: 'name'},
          {type: 'ng-select', label: 'Agenzia', key: 'agencyId', items: this.filters_data.agencies, labelVal: 'name'},
          {type: 'ng-select', label: 'Product Type', key: 'typeId', items: this.filters_data.products_type, labelVal: 'type'},
          {type: 'text', label: 'Note', key: 'note'}
      ];
      this.filtersFields =  [
          {type: 'text', label: 'Cliente'},
          {type: 'text', label: 'Nominativo Cliente:', key: 'customerName'},
          {type: 'text', label: 'Postino previsto:'},
          {type: 'text', label: 'Agenzia:'},
          {type: 'text', label: 'Distinita Postale:', key: 'dispatchCode'},
          {type: 'text', label: 'Codice Barre:', key: 'barcode'},
          {type: 'text', label: 'Codice Atto:', key: 'actCode'},
          {type: 'text', label: 'Nome Prodotto:'},
          {type: 'text', label: 'Prodotto:'},
          {type: 'text', label: 'Categoria:'},
          {type: 'text', label: 'Stato/Esito:'},
          {type: 'text', label: 'Nominativo Destinatario:', key: 'recipientName'},
          {type: 'text', label: 'CAP Destinatario:'},
          {type: 'text', label: 'Indirizzo Destinatario:'},
          {type: 'text', label: 'Raggruppamento quantita:'},
          {type: 'text', label: 'Quantita per CAP:'},
          {type: ['text', 'text'], label: 'Data/Ora:', group: true, key: 'date'},
          {type: 'text', label: 'Articolo Legge:', key: 'articleLawName'},
          {type: ['text', 'text'], label: 'Data Articolo Legge:', group: true, key: 'articleLawDate'},
          {type: ['text', 'text'], label: 'Data Accettazione:', group: true, key: 'acceptanceDate'},
          {type: 'text', label: 'Cliente'},
      ];
  }




}
