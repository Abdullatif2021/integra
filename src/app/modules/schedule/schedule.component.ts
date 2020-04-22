import {ChangeDetectorRef, Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/internal/operators';
import {BuildingLocationInterface} from '../../core/models/building.interface';
import {PlanningService} from '../../service/planning/planning.service';
import {MapService} from './service/map.service';
import {MapMarker} from '../../core/models/map-marker.interface';
import {SnotifyService} from 'ng-snotify';
import {BackProcessingService} from '../../service/back-processing.service';
import {LoadingService} from '../../service/loading.service';
import {LocatingService} from '../../service/locating/locating.service';
import {PreDispatchService} from '../../service/pre-dispatch.service';
import {ScheduleService} from './service/schedule.service';
import {PageDirective} from '../../shared/directives/page.directive';
import {PreDispatchGlobalActionsService} from '../../service/pre-dispatch-global-actions.service';

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
    nextAction = 'locating' ;
    actionInRun = false ;

    constructor(
        public router: Router,
        private route: ActivatedRoute,
        private locatingService: LocatingService,
        private modalService: NgbModal,
        private planningService: PlanningService,
        private mapService: MapService,
        private snotifyService: SnotifyService,
        public backProcessingService: BackProcessingService,
        private loadingService: LoadingService,
        private preDispatchService: PreDispatchService,
        private scheduleService: ScheduleService,
        private componentFactoryResolver: ComponentFactoryResolver,
        private preDispatchGlobalActionsService: PreDispatchGlobalActionsService,
        private ref: ChangeDetectorRef,
    ) {
        this.preDispatch = this.route.snapshot.params.id;
        this.preDispatchData = this.route.snapshot.data.data;
    }

    latitude = 40.8440337;
    longitude = 14.3435834;
    zoom = 11;
    locatingHandle: any ;
    paths = [] ;
    @ViewChild(PageDirective) pageHost: PageDirective;

    ngOnInit() {
        this.locatingHandle = this.backProcessingService.getOrCreateHandle('locating-' + this.preDispatch);
        this.locatingHandle.pipe(takeUntil(this.unsubscribe)).subscribe(
            data => {
                if (data.nfound) {
                    this.nFoundItems = data.nfound;
                    this.modalService.open(this.modalRef, {windowClass: 'animated slideInDown', backdrop: 'static'});
                }
            }
        );
        this.mapService.markersChanges.pipe(takeUntil(this.unsubscribe)).subscribe(
            data => { this.markers = data ; }
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
        );
        this.mapService.mapMoved.pipe(takeUntil(this.unsubscribe)).subscribe(
            data => {
                this.latitude = data.center.lat ;
                this.longitude = data.center.lng ;
                setTimeout(() => { this.zoom = data.zoom; }, 100);
            }
        );
        this.mapService.pathsChanges.pipe(takeUntil(this.unsubscribe)).subscribe(
            paths => {
               this.paths = paths;
            }
        );

        this.startInterval();
    }

    startInterval() {
        this.preDispatchService.getPreDispatchData(this.preDispatch, true).pipe(takeUntil(this.unsubscribe)).subscribe(
            data => {
                this.preDispatchData = data.data ;
                this.scheduleService.prodcastPreDispatchData(this.preDispatchData);
                this.backProcessingService.handlePreDispatchActionsChanges(this.preDispatchData);
                this.nextAction = this.backProcessingService.getPreDispatchAction(this.preDispatchData.status) ;
                this.actionInRun = this.preDispatchGlobalActionsService.isPreDispatchInRunStatus(this.preDispatchData);
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

    async runNextAction() {
        // window.parent.postMessage({runPreDispatch: this.preDispatchData}, '*');
        this.preDispatchGlobalActionsService.startPreDispatchAction(this.preDispatchData);
    }

    moveToInPlan(modalRef, force = false) {
        this.planningService.moveItemsToInPlaning(modalRef, force);
    }

    moveBackToAddresses(modalRef, force = false) {
        this.planningService.moveItemsBackToAddresses(modalRef, force);
    }

    latLngInputActivate(event, nFoundItem, latInput, lngInput) {
        nFoundItem.lat = null;
        nFoundItem.long = null;
        latInput.value = '';
        lngInput.value = '';
        this.latLngInputState[nFoundItem.id] = event.target.checked;
    }

    async fixLocation(skip = false) {
        await this.locatingService.fix(<[BuildingLocationInterface]>this.fixedItems, skip, this.locatingHandle, this.preDispatch);
        this.fixedItems = <[BuildingLocationInterface]>[];
        // update pre-dispatch data
        const data = await this.preDispatchService.getPreDispatchData(this.preDispatch).toPromise();
        this.scheduleService.prodcastPreDispatchData(data.data);
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

    stopAction() {
        this.preDispatchData.localize_status = 'pause';
        this.backProcessingService.ultimatePause(this.preDispatch);
    }

    next() {
        this.scheduleService.next(this.router.url);
    }

    trackMarkers(marker) {
        return marker.id + '-' + marker.type;
    }

    loadRightSideView(view, data) {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(view);
        const viewContainerRef = this.pageHost.viewContainerRef;
        viewContainerRef.clear();

        const componentRef = viewContainerRef.createComponent(componentFactory);
        (<any>componentRef.instance).data = data;
    }

    mapReady(map) {
        const that = this;
        map.addListener('dragend', function () {
            that.mapService.move( map.center.lat(), map.center.lng(), map.zoom) ;
            that.latitude = map.center.lat();
            that.longitude = map.center.lng();
            that.zoom = map.zoom;
            console.log(that.latitude, that.longitude);
        });
        map.addListener('zoom_changed', function () {
            that.mapService.move( map.center.lat(), map.center.lng(), map.zoom) ;
            that.latitude = map.center.lat();
            that.longitude = map.center.lng();
            that.zoom = map.zoom;
        });
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
        this.mapService.resetLocation();
    }

}
