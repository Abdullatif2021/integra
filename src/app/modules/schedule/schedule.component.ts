import {Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LocatingService} from './service/locating.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/internal/operators';
import {BuildingLocationInterface} from '../../core/models/building.interface';

@Component({
  selector: 'app-schedules',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit, OnDestroy {

  unsubscribe: Subject<void> = new Subject();
  preDispatch: number ;
  @ViewChild('modalRef') modalRef;
  nFoundItem: BuildingLocationInterface ;
  latLngInputState = false ;

  constructor(
      private router: Router,
      private route: ActivatedRoute,
      private locatingService: LocatingService,
      private modalService: NgbModal,

  ) {
      this.preDispatch = this.route.snapshot.params.id;
  }

  ngOnInit() {
    this.locatingService.relocate.pipe(takeUntil(this.unsubscribe)).subscribe(
        nFoundItem => {
            this.nFoundItem = nFoundItem ;
            this.modalService.open(this.modalRef, { windowClass: 'animated slideInDown', size: 'sm'}) ;
        }
    );
  }

  activeTab(route) {
    return route === this.router.url;
  }

  locate() {
      this.locatingService.startLocating(this.preDispatch);
  }

  latLngInputActivate(event) {
      this.latLngInputState = event.target.checked;
  }

  fixLocation(locationInput, latInput, lngInput) {
      if (this.latLngInputState) {
          return this.locatingService.fix(this.nFoundItem, null, latInput.value, lngInput.value);
      }
      this.locatingService.fix(this.nFoundItem, locationInput.value, null, null);
  }

  skipLocatingItem() {
      this.locatingService.fix(this.nFoundItem, null, null, null, true);
  }

  ngOnDestroy() {
      this.unsubscribe.next();
      this.unsubscribe.complete();
  }

}
