import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleTableComponent } from './components/simple-table/simple-table.component';
import {SharedModule} from "../../shared/shared.module";
import { TableComponent } from './components/table/table.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [SimpleTableComponent, TableComponent],
  exports: [
      SimpleTableComponent,
      TableComponent
  ]
})
export class TablesModule { }
