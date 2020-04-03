import {EventEmitter, Injectable, OnDestroy} from '@angular/core';

@Injectable()
export class ScheduleService implements OnDestroy {

    constructor(
    ) {
    }

    unsubscribe = new EventEmitter();
    rightSideView = new EventEmitter();
    preDispatchDataChanged = new EventEmitter();
    nextButtonClicked = new EventEmitter<any>();

    next(source) {
        this.nextButtonClicked.emit(source);
    }

    changeRightSideView(view, data) {
        this.rightSideView.emit({view: view, data: data});
    }

    showRightSideMap() {
        this.rightSideView.emit(null);
    }

    prodcastPreDispatchData(preDispatchData) {
        this.preDispatchDataChanged.emit(preDispatchData);
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
