import {Component, OnDestroy, OnInit} from '@angular/core';
import {takeUntil} from 'rxjs/internal/operators';
import {Subject} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {PreDispatchService} from '../../../../../../service/pre-dispatch.service';
import {IntegraaModalService} from '../../../../../../service/integraa-modal.service';

@Component({
  selector: 'app-pre-dispatch-log',
  templateUrl: './pre-dispatch-log.component.html',
  styleUrls: ['./pre-dispatch-log.component.css']
})
export class PreDispatchLogComponent implements OnInit, OnDestroy {

  constructor(
      private route: ActivatedRoute,
      private preDispatchService: PreDispatchService,
      private integraaModalService: IntegraaModalService,
  ) {}

  log = [];
  loading = true ;
  id = null ;
  unsubscribe: Subject<void> = new Subject();

  ngOnInit() {
    this.route.params.subscribe(params => { this.id = params['id']; this.loadLog(); });
  }

  loadLog() {
    this.preDispatchService.getLog(this.id).pipe(takeUntil(this.unsubscribe)).subscribe(
        res => {
          this.log = res.data;
          console.log(this.log, res);
          this.loading = false ;
        }, error => {
          this.loading = false;
        }
    );
  }


  showLog(id) {
      this.integraaModalService.open(`/pages/pre-dispatch/${id}/log`, {width: 900, height: 600}, {});
  }

  expand(item) {
      item.expanded = !(item.expanded);
  }

  ngOnDestroy() {
      this.unsubscribe.next();
      this.unsubscribe.complete();
  }
}
