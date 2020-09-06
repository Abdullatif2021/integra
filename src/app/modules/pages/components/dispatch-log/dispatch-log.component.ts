import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/internal/operators';
import {IntegraaModalService} from '../../../../service/integraa-modal.service';
import {ActivatedRoute} from '@angular/router';
import {DispatchService} from '../../../../service/dispatch.service';

@Component({
  selector: 'app-dispatch-log',
  templateUrl: './dispatch-log.component.html',
  styleUrls: ['./dispatch-log.component.css']
})
export class DispatchLogComponent implements OnInit, OnDestroy {

    constructor(
        private route: ActivatedRoute,
        private dispatchService: DispatchService,
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
        this.dispatchService.getLog(this.id).pipe(takeUntil(this.unsubscribe)).subscribe(
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
