import {Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LocatingService} from './service/locating.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/internal/operators';
import {BuildingLocationInterface} from '../../core/models/building.interface';
import {PlanningService} from './service/planning.service';

@Component({
  selector: 'app-schedules',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit, OnDestroy {

  unsubscribe: Subject<void> = new Subject();
  preDispatch: number ;
  @ViewChild('modalRef') modalRef;
  nFoundItems = <[BuildingLocationInterface]>[] ;
  fixedItems = {} ;
  errors = {} ;
  latLngInputState = [] ;
  preDispatchData: any ;
  constructor(
      private router: Router,
      private route: ActivatedRoute,
      private locatingService: LocatingService,
      private modalService: NgbModal,
      private planningService: PlanningService

  ) {
      this.preDispatch = this.route.snapshot.params.id;
      this.preDispatchData = this.route.snapshot.data.data;
  }

  ngOnInit() {
    this.locatingService.relocate.pipe(takeUntil(this.unsubscribe)).subscribe(
        nFoundItems => {
            this.nFoundItems = nFoundItems ;
            this.modalService.open(this.modalRef, { windowClass: 'animated slideInDown'}) ;
        }
    );
  }

  activeTab(route) {
    return route === this.router.url;
  }

  async locate() {
      const result: any = await this.locatingService.startLocating(this.preDispatch, this.preDispatchData.notFixedProductCount);
      if (result && result.data && result.data.preDispatch) {
          this.planningService.changePreDispatchData(result.data.preDispatch);
      }
  }

  moveToInPlan(modalRef, force = false) {
      this.planningService.moveItemsToInPlaning(modalRef, force);
  }

  latLngInputActivate(event, nFoundItem, latInput, lngInput) {
      nFoundItem.lat = null ;
      nFoundItem.long = null ;
      latInput.value = '' ;
      lngInput.value = '' ;
      this.latLngInputState[nFoundItem.id] = event.target.checked;
  }

  fixLocation(skip = false) {
      this.locatingService.fix(<[BuildingLocationInterface]>this.fixedItems, skip) ;
      this.fixedItems = <[BuildingLocationInterface]>[] ;
  }

  notFoundAddressChanged(data, item) {
      console.log(data.address, item) ;

      if (!data.hasObject || !data.address.strict) {
          return this.errors['invalid-building-' + item.id] = true ;
      } else {
          this.errors['invalid-building-' + item.id] = false ;
      }
      item.street = data.address.street ;
      item.cap = data.address.cap ;
      item.city = data.address.city ;
      item.houseNumber = data.address.houseNumber ;
      item.lat = data.address.lat ;
      item.long = data.address.lng ;

      this.fixedItems[item.id] = item ;
  }

  notFoundCoordinatesChanged(event, type, item) {
      item[type] = event.target.value ;
      this.fixedItems[item.id] = item ;
  }

  // skipLocatingItem() {
  //     this.locatingService.fix(this.nFoundItem, null, null, null, true);
  // }

  ngOnDestroy() {
      this.unsubscribe.next();
      this.unsubscribe.complete();
  }

}
