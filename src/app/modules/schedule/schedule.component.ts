import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LocatingService} from './service/locating.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/internal/operators';
import {BuildingLocationInterface} from '../../core/models/building.interface';
import {PlanningService} from './service/planning.service';
import {MapService} from './service/map.service';
import {MapMarker} from '../../core/models/map-marker.interface';
import {SnotifyService} from 'ng-snotify';
import {BackProcessingService} from '../../service/back-processing.service';
import {LoadingService} from '../../service/loading.service';

@Component({
    selector: 'app-schedules',
    templateUrl: './schedule.component.html',
    styleUrls: ['./schedule.component.css'],
    providers: [
        LocatingService,
    ]
})
export class ScheduleComponent implements OnInit, OnDestroy {

    unsubscribe: Subject<void> = new Subject();
    preDispatch: number;
    @ViewChild('modalRef') modalRef;
    nFoundItems = <[BuildingLocationInterface]>[];
    fixedItems = {};
    errors = {};
    latLngInputState = [];
    preDispatchData: any;
    markers: [MapMarker];

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private locatingService: LocatingService,
        private modalService: NgbModal,
        private planningService: PlanningService,
        private mapService: MapService,
        private snotifyService: SnotifyService,
        private backProcessingService: BackProcessingService,
        private loadingService: LoadingService,
    ) {
        this.preDispatch = this.route.snapshot.params.id;
        this.preDispatchData = this.route.snapshot.data.data;
    }

    latitude = 40.8440337;
    longitude = 14.3435834;
    zoom = 11;
    locatingHandle: any ;

    ngOnInit() {

        this.locatingHandle = this.backProcessingService.getOrCreateHandle('locating-' + this.preDispatch);

        this.locatingHandle.pipe(takeUntil(this.unsubscribe)).subscribe(
            data => {
                if (typeof data.nFoundItems === 'undefined') {
                    return ;
                }
                this.backProcessingService.release('relocate-' + this.preDispatch);
                this.nFoundItems = data.nFoundItems;
                this.modalService.open(this.modalRef, {windowClass: 'animated slideInDown'});
            }
        );
        this.mapService.markersChanges.subscribe(
            data => { this.markers = data ; }
        );
    }

    activeTab(route) {
        return route === this.router.url;
    }

    async locate() {

        this.loadingService.show();
        this.loadingService.subscribeTo(this.locatingHandle);
        if (this.backProcessingService.isRunning('locating-' + this.preDispatch)) {
            this.loadingService.setLoadingState({
                state: true, message: 'checking loading state for this pre-distinta ...', progress: 0, autProgress: false, hide_btn: true
            });
            return ;
        }

        const notFound = this.backProcessingService.getWaiting('relocate-' + this.preDispatch);
        if (notFound) {
            this.loadingService.state(false);
            this.nFoundItems = notFound;
            this.modalService.open(this.modalRef, {windowClass: 'animated slideInDown'});
            this.backProcessingService.release('relocate-' + this.preDispatch);
            return ;
        }

        this.backProcessingService.run('locating-' + this.preDispatch, async(handle) => {
            const result: any = await this.locatingService.startLocating(this.preDispatch, handle);
            if (result && result.data && result.data.preDispatch) {
                this.planningService.changePreDispatchData(result.data.preDispatch);
            }
        });
    }

    group() {
        this.locatingService.group(this.preDispatch).subscribe(
            data => {
                this.snotifyService.success('Products Grouped Successfully', {showProgressBar: false});
                this.preDispatchData.status = 'in_planning' ;
            },
            error => {
                this.snotifyService.error('Something went wrong', {showProgressBar: false});
            }
        );
    }

    moveToInPlan(modalRef, force = false) {
        this.planningService.moveItemsToInPlaning(modalRef, force);
    }

    latLngInputActivate(event, nFoundItem, latInput, lngInput) {
        nFoundItem.lat = null;
        nFoundItem.long = null;
        latInput.value = '';
        lngInput.value = '';
        this.latLngInputState[nFoundItem.id] = event.target.checked;
    }

    fixLocation(skip = false) {
        this.locatingService.fix(<[BuildingLocationInterface]>this.fixedItems, skip, this.locatingHandle);
        this.fixedItems = <[BuildingLocationInterface]>[];
    }

    notFoundAddressChanged(data, item) {

        if (!data.hasObject || !data.address.strict) {
            return this.errors['invalid-building-' + item.id] = true;
        } else {
            this.errors['invalid-building-' + item.id] = false;
        }
        item.street = data.address.street;
        item.cap = data.address.cap;
        item.city = data.address.city;
        item.houseNumber = data.address.houseNumber;
        item.lat = data.address.lat;
        item.long = data.address.lng;

        this.fixedItems[item.id] = item;
    }

    notFoundCoordinatesChanged(event, type, item) {
        item[type] = event.target.value;
        this.fixedItems[item.id] = item;
    }

    // skipLocatingItem() {
    //     this.locatingService.fix(this.nFoundItem, null, null, null, true);
    // }

    navigateMap(event) {
        if (!event.hasObject || !event.address.lat || !event.address.lng) {
            return ;
        }
        this.latitude = event.address.lat ;
        this.longitude = event.address.lng ;
        this.zoom = 15.5;
    }

    mapClick(event) {
        this.mapService.mapClicked(event);
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

}
