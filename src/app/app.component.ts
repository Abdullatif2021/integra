import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Integraa Planner';

  citiesTable = {
      title:'Paese',
      icon:'assets/images/city.jpg',
      searchPlaceHolder: 'Cerca Paese'
  } ;
  cities = [
      {name:'ALL',qt:'Q.ta: 25302'},
      {name:'Imola',qt:'Q.a: 6852'},
      {name:'Bologna',qt:'Q.a: 8535'},
      {name:'Napoli',qt:'Q.a: 3545'},
      {name:'Giuliano in Campagna',qt:'Q.a: 5105'},
      {name:'Roma',qt:'Q.a: 5105'},
      {name:'Qualano',qt:'Q.a: 8535'},
      {name:'Rimini',qt:'Q.a: 8535'},
      {name:'Modna',qt:'Q.a: 8535'},
  ] ;

  streetsTable = {
    title:'Strada',
    icon: 'assets/images/road.png',
    searchPlaceHolder: 'Cerca Strada'
  } ;

  streets = [
      {name:'ALL',qt:'Q.ta: 25302'},
      {name:'Via Rivabella',qt:'Q.a: 124'},
      {name:'Via Enrico uno Berlinguer',qt:'Q.a: 16'},
      {name:'Corso italia',qt:'Q.a: 10'},
      {name:'Via Del lavoro',qt:'Q.a: 2'},
      {name:'Via Del lavoro',qt:'Q.a: 253'},
      {name:'Via Del lavoro',qt:'Q.a: 124'},
      {name:'Via Del lavoro',qt:'Q.a: 124'},
      {name:'Via Del lavoro',qt:'Q.a: 124'},
      {name:'Via Del lavoro',qt:'Q.a: 124'},
      {name:'Via Del lavoro',qt:'Q.a: 124'},
      {name:'Via Del lavoro',qt:'Q.a: 124'},
      {name:'Via Del lavoro',qt:'Q.a: 124'},
      {name:'Via Del lavoro',qt:'Q.a: 124'},
      {name:'Via Del lavoro',qt:'Q.a: 124'},
      {name:'Via Del lavoro',qt:'Q.a: 124'},
  ]


}
