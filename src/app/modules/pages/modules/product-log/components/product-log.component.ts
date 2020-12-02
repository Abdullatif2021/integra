import { ProductsService } from '../../../../../service/products.service';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {from, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/internal/operators';
import {ActivatedRoute} from '@angular/router';
import {IntegraaModalService} from '../../../../../service/integraa-modal.service';
import { TranslateService } from '@ngx-translate/core';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-in-delivered-log',
  templateUrl: './product-log.component.html',
  styleUrls: ['./product-log.component.css']
})
export class ProductLogComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private todeliverservice: ProductService,
    private integraaModalService: IntegraaModalService,
    private translate: TranslateService,
) {}

log = [];
loading = true ;
id = null ;
unsubscribe: Subject<void> = new Subject();

ngOnInit() {
    this.route.params.subscribe(params => { this.id = params['id']; this.loadLog(); });
}

loadLog() {
    this.todeliverservice.getLog(this.id).pipe(takeUntil(this.unsubscribe)).subscribe(
        res => {
            this.log = res.data;
            this.loading = false ;
        }, error => {
            this.loading = false;
        }
    );
}


showLog(id) {
    this.integraaModalService.open(`/pages/product/${id}/log`, {width: 900, height: 600}, {});
}

expand(item) {
    item.expanded = !(item.expanded);
}

OnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
}

}

