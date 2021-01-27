import {ChangeDetectorRef, Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/internal/operators';
import {BuildingLocationInterface} from '../../core/models/building.interface';
import {PlanningService} from '../../service/planning/planning.service';
import {MapService} from '../../service/map.service';
import {MapMarker} from '../../core/models/map-marker.interface';
import {SnotifyService} from 'ng-snotify';
import {BackProcessingService} from '../../service/back-processing.service';
import {LoadingService} from '../../service/loading.service';
import {LocatingService} from '../../service/locating/locating.service';
import {PreDispatchService} from '../../service/pre-dispatch.service';
import {ScheduleService} from './service/schedule.service';
import {PageDirective} from '../../shared/directives/page.directive';
import {PreDispatchGlobalActionsService} from '../../service/pre-dispatch-global-actions.service';
import {AppConfig} from '../../config/app.config';
import { TranslateService } from '@ngx-translate/core';
import {TranslateSelectorService} from '../../service/translate-selector-service';

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
    exportResultsLink = '';

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
        public preDispatchService: PreDispatchService,
        private scheduleService: ScheduleService,
        private componentFactoryResolver: ComponentFactoryResolver,
        private preDispatchGlobalActionsService: PreDispatchGlobalActionsService,
        private translate: TranslateService,
        private translateSelectorService: TranslateSelectorService,

        ) {
        this.translateSelectorService.setDefaultLanuage();
        this.preDispatch = this.route.snapshot.params.id;
        this.preDispatchData = this.route.snapshot.data.data;
        this.exportResultsLink = AppConfig.endpoints.exportPreDispatchResults(this.preDispatchData.id);
          }

    latitude = 40.8440337;
    longitude = 14.3435834;
    zoom = 11;
    can_plan = false;
    paths = [] ;
    @ViewChild(PageDirective) pageHost: PageDirective;

    async ngOnInit() {
        this.preDispatchGlobalActionsService.modalHandleMessages.pipe(takeUntil(this.unsubscribe)).subscribe(
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
        this.preDispatchService.canPlanChanges.pipe(takeUntil(this.unsubscribe)).subscribe(
            can_plan => { this.can_plan = can_plan; }
        );

        this.startInterval();

    }

    startInterval() {
        this.preDispatchService.getPreDispatchData(this.preDispatch, true).pipe(takeUntil(this.unsubscribe)).subscribe(
            data => {
                if (data && data.data && data.data.status && data.data.status === 'planned' && this.preDispatchData.status !== 'planned') {
                    this.preDispatchService.preDispatchStatusChanged(data.data.status);
                }
                this.preDispatchData = data.data ;
                this.scheduleService.prodcastPreDispatchData(this.preDispatchData);
                // this.backProcessingService.handlePreDispatchActionsChanges(this.preDispatchData);
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
        window.parent.postMessage({runPreDispatch: this.preDispatchData}, '*');
        // this.preDispatchGlobalActionsService.startPreDispatchAction(this.preDispatchData);
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
        window.parent.postMessage(
            {locatingFixItems: 1, fixedItems: <[BuildingLocationInterface]>this.fixedItems, skip: skip, preDispatch: this.preDispatch},
            '*');
        // await this.locatingService.fix(<[BuildingLocationInterface]>this.fixedItems, skip, this.locatingHandle, this.preDispatch);
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
        window.parent.postMessage({pausePreDispatch: this.preDispatchData}, '*');
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

    resultsMoveTo(to) {
        this.preDispatchService.clickResultsMoveToButton(to);
    }

    mapReady(map) {
        const that = this;
        map.addListener('dragend', function () {
            that.mapService.move( map.center.lat(), map.center.lng(), map.zoom) ;
            that.latitude = map.center.lat();
            that.longitude = map.center.lng();
            that.zoom = map.zoom;
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
