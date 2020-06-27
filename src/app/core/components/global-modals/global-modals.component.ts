import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {takeUntil} from 'rxjs/internal/operators';
import {PreDispatchService} from '../../../service/pre-dispatch.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-global-modals',
  templateUrl: './global-modals.component.html',
  styleUrls: ['./global-modals.component.css']
})


// place all popups you want to fire anywhere in the website here.
export class GlobalModalsComponent implements OnInit, OnDestroy {

  constructor(
      private preDispatchService: PreDispatchService,
      private modalService: NgbModal,
  ) { }

  @ViewChild('confirmPlanningModalRed') planningConfirmModal;
  unsubscribe: Subject<void> = new Subject();

  ngOnInit() {
      this.preDispatchService.showConfirmPlanningModalCalls.pipe(takeUntil(this.unsubscribe)).subscribe(
          data => { this.modalService.open(this.planningConfirmModal, {backdrop: 'static'}); }
      );

  }


  confirmPlanningActionChosen(action) {
      // window.parent.postMessage({confirmPlanningClicked: action}, '*');
      this.preDispatchService.confirmPlanningModalGotUserResponse.emit(action);

  }

  ngOnDestroy() {
      this.unsubscribe.next();
      this.unsubscribe.complete();
  }
}
