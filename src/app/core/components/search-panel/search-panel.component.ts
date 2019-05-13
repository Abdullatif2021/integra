import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-panel',
  templateUrl: './search-panel.component.html',
  styleUrls: ['./search-panel.component.css']
})




export class SearchPanelComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  isCollapsed : boolean = true ;

  searchFields = [
      {type:'text',label:'Cliente'},
      {type:'text',label:'Nominativo Cliente:'},
      {type:'text',label:'Postino previsto:'},
      {type:'text',label:'Agenzia:'},
      {type:'text',label:'Distinita Postale:'},
      {type:'text',label:'Codice Barre:'},
      {type:'text',label:'Codice Atto:'},
      {type:'text',label:'Nome Prodotto:'},
      {type:'text',label:'Prodotto:'},
      {type:'text',label:'Categoria:'},
      {type:'text',label:'Stato/Esito:'},
      {type:'text',label:'Nominativo Destinatario:'},
      {type:'text',label:'CAP Destinatario:'},
      {type:'text',label:'Indirizzo Destinatario:'},
      {type:'text',label:'Raggruppamento quantita:'},
      {type:'text',label:'Quantita per CAP:'},
      {type:['text','text'],label:'Data/Ora:',group:true},
      {type:'text',label:'Articolo Legge:'},
      {type:['text','text'],label:'Data Articolo Legge:',group:true},
      {type:['text','text'],label:'Data Accettazione:',group:true},
      {type:'text',label:'Cliente'},
  ];

  caps = [
      {cap:80022,val:5348},
      {cap:80022,val:5348},
      {cap:80022,val:5348},
      {cap:80022,val:5348},
      {cap:80022,val:5348},
      {cap:80022,val:5348}
  ]




}
