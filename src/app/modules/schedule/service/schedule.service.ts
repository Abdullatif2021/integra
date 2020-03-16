import {EventEmitter, Injectable, OnDestroy} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class ScheduleService implements OnDestroy {

    constructor(
        private http: HttpClient,
    ) {
    }

    unsubscribe = new EventEmitter();
    rightSideView = new EventEmitter();

    changeRightSideView(view, data) {
        this.rightSideView.emit({view: view, data: data});
    }

    showRightSideMap() {
        this.rightSideView.emit(null);
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
