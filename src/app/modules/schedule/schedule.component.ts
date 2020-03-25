import {Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
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
import {LocatingService} from '../../service/locating/locating.service';
import {PreDispatchService} from '../../service/pre-dispatch.service';
import {ScheduleService} from './service/schedule.service';
import {PageDirective} from '../../shared/directives/page.directive';

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
    markers: MapMarker[];
    percent = 0 ;
    show_map = true ;

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
        private preDispatchService: PreDispatchService,
        private scheduleService: ScheduleService,
        private componentFactoryResolver: ComponentFactoryResolver
    ) {
        this.preDispatch = this.route.snapshot.params.id;
        this.preDispatchData = this.route.snapshot.data.data;
    }

    latitude = 40.8440337;
    longitude = 14.3435834;
    zoom = 11;
    locatingHandle: any ;
    @ViewChild(PageDirective) pageHost: PageDirective;

    ngOnInit() {
        this.locatingHandle = this.backProcessingService.getOrCreateHandle('locating-' + this.preDispatch);
        this.locatingService.productsNotFound.pipe(takeUntil(this.unsubscribe)).subscribe(
            nfound => {
                this.nFoundItems = nfound;
                this.modalService.open(this.modalRef, {windowClass: 'animated slideInDown'});
            }
        );
        this.mapService.markersChanges.pipe(takeUntil(this.unsubscribe)).subscribe(
            data => { console.log('changes', data); this.markers = data ; }
        );
        this.scheduleService.rightSideView.pipe(takeUntil(this.unsubscribe)).subscribe(
            data => {
                if (data) {
                    this.show_map = false ;
                    this.loadRightSideView((<any>data).view, (<any>data).data) ;
                } else {
                    this.show_map = true ;
                }
            }
        )
        this.startInterval();
    }

    startInterval() {
        this.preDispatchService.getPreDispatchData(this.preDispatch, true).pipe(takeUntil(this.unsubscribe)).subscribe(
            data => {
                this.preDispatchData = data.data ;
                if (
                    this.preDispatchData.localize_status === 'pause' &&
                    this.backProcessingService.isRunning('locating-' + this.preDispatch)
                    && !this.backProcessingService.nameSpaceHasAny('updating-status')
                ) {
                    // pause pre-dispatch
                    this.locatingService.pause(this.preDispatch);
                }
                setTimeout(() => {
                    this.startInterval();
                }, 2000);
            },
            error => {
                setTimeout(() => {
                    this.startInterval();
                }, 2000);
            }
        );
    }

    activeTab(route) {
        return route === this.router.url;
    }


    async locate() {
        // this.loadingService.show();
        // this.loadingService.subscribeTo(this.locatingHandle);
        if (this.backProcessingService.isRunning('locating-' + this.preDispatch)) {
            this.loadingService.setLoadingState({
                state: true, message: 'checking loading state for this pre-distinta ...', progress: 0, autProgress: false, hide_btn: true
            });
            return ;
        }

        this.backProcessingService.run('locating-' + this.preDispatch, async(handle) => {
            const result: any = await this.locatingService.startLocating(this.preDispatch, handle, this.preDispatchData);
            if (result && result.data && result.data.preDispatch) {
                this.planningService.changePreDispatchData(result.data.preDispatch);
            }
            // update pre-dispatch data
            const data = await this.preDispatchService.getPreDispatchData(this.preDispatch).toPromise();
            this.planningService.changePreDispatchData(data.data);
        }, 'locating', this.preDispatch);
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

    async fixLocation(skip = false) {
        await this.locatingService.fix(<[BuildingLocationInterface]>this.fixedItems, skip, this.locatingHandle);
        this.fixedItems = <[BuildingLocationInterface]>[];
        // update pre-dispatch data
        const data = await this.preDispatchService.getPreDispatchData(this.preDispatch).toPromise();
        this.planningService.changePreDispatchData(data.data);
    }

    notFoundAddressChanged(data, item) {
        if (!data.hasObject || !data.address.strict) {
            console.log(data);
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
    centerChange(event) {
        this.mapService.move('center', event) ;
    }
    zoomChange(event) {
        this.mapService.move('zoom', event) ;
    }

    isRunning() {
        return this.preDispatchData.localize_status === 'play' || this.backProcessingService.isRunning('locating-' + this.preDispatch);
    }

    stopLocating() {
        this.locatingService.pause(this.preDispatch);
    }

    next() {
        this.planningService.next(this.router.url);
    }

    loadRightSideView(view, data) {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(view);
        const viewContainerRef = this.pageHost.viewContainerRef;
        viewContainerRef.clear();

        const componentRef = viewContainerRef.createComponent(componentFactory);
        (<any>componentRef.instance).data = data;
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

}
