import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ListTreeService} from '../../service/list-tree.service';
import {TreeNodeInterface} from '../../../../core/models/tree-node.interface';
import {LocatingService} from '../../../../service/locating/locating.service';
import {takeUntil} from 'rxjs/internal/operators';
import {SettingsService} from '../../../../service/settings.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AddressesActionsService} from '../../service/addresses.actions.service';
import {SnotifyService} from 'ng-snotify';
import {ACAddress} from '../../../../core/models/address.interface';
import {PlanningService} from '../../../../service/planning/planning.service';
import {MapService} from '../../../../service/map.service';
import {ScheduleService} from '../../service/schedule.service';
import {BackProcessingService} from '../../../../service/back-processing.service';
import {PreDispatchGlobalActionsService} from '../../../../service/pre-dispatch-global-actions.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-addresses',
    templateUrl: './addresses.component.html',
    styleUrls: ['./addresses.component.css']
})
export class AddressesComponent implements OnInit, OnDestroy {

    constructor(
        private route: ActivatedRoute,
        private listTreeService: ListTreeService,
        private locatingService: LocatingService,
        private settingsService: SettingsService,
        private modalService: NgbModal,
        private addressesActionsService: AddressesActionsService,
        private snotifyService: SnotifyService,
        private planningService: PlanningService,
        private mapService: MapService,
        private scheduleService: ScheduleService,
        private backProcessingService: BackProcessingService,
        private preDispatchGlobalActionsService: PreDispatchGlobalActionsService,
        private translate: TranslateService,
    ) {
        translate.setDefaultLang('itly');
        const browserLang = translate.getBrowserLang();
        this.preDispatch = this.route.snapshot.params.id;
        this.preDispatchData = this.route.snapshot.data.data ;
    }

    preDispatch: number;
    unsubscribe = new EventEmitter();
    tree = <TreeNodeInterface[]>[
        // The root node of the tree .
        {id: '0', text: '', subtype: '', children: <[TreeNodeInterface]>[], parent: <TreeNodeInterface>{}, type: 'root', status: 0, page: 0}
    ];
    paginationOptions: any = {};
    dragging: TreeNodeInterface;
    move_to_items = [];
    all_start_points = [];
    all_end_points = [];
    toMoveItem: any;
    filter = [0, 0, 0];
    itemsCount = 0;
    searchSubscription: any ;
    searchMode = false ;
    @Input() preDispatchData: any ;
    errors = {} ;
    editingPoint = {};
    @ViewChild('startPointTextInput') startPointTextInput: ElementRef;
    @ViewChild('endPointTextInput') endPointTextInput: ElementRef;
    merge_data = {targets: [], source: null};
    markersSubscription;

    async ngOnInit() {
        // this.backProcessingService.getOrCreateHandle('locating-' + this.preDispatch).pipe(takeUntil(this.unsubscribe)).subscribe(
        //     async data => {
        //         if (data.treeCreated) {
        //             this.tree[0].children = await this.listTreeService.listNode(this.preDispatch, this.tree[0], 1, this.filter);
        //             this.loadMarkers(this.mapService.mapLocation);
        //         }
        //     }
        // )
        this.preDispatchGlobalActionsService.modalHandleMessages.pipe(takeUntil(this.unsubscribe)).subscribe(async data => {
            if (data.treeCreated) {
                this.tree[0].children = await this.listTreeService.listNode(this.preDispatch, this.tree[0], 1, this.filter);
                this.loadMarkers(this.mapService.mapLocation);
            }
        });
        this.tree[0].children = await this.listTreeService.listNode(this.preDispatch, this.tree[0], 1, this.filter);
        this.settingsService.getPaginationOptions().pipe(takeUntil(this.unsubscribe)).subscribe(
            data => {
                if (data.statusCode === 200) {
                    this.paginationOptions = data.data;
                }
            },
        );
        this.scheduleService.preDispatchDataChanged.pipe(takeUntil(this.unsubscribe)).subscribe(
            data => {
                this.preDispatchData = data ;
            }
        );
        this.planningService.moveItemsToInPlaningChanges.pipe(takeUntil(this.unsubscribe)).subscribe(
            data => {
                this.moveToInPlanning(data.modalRef, data.force, this.filter, 'to_planning');
            }
        );
        this.mapService.moved.pipe(takeUntil(this.unsubscribe)).subscribe(
            location => {
                this.loadMarkers(location);
            }
        );
        this.loadMarkers(this.mapService.mapLocation);
    }

    // List Tree Methods

    async listNode(node, next) {
        if (!node.expanded && !node.children.length) {
            await this.load(node, next);
        }
        node.expanded = !node.expanded;
    }

    async load(node, next) {
        if (node.loading || this.searchMode || (node.page && node.type === 'oet'))  {
            return;
        }
        node.loading = true;
        node.children.push({skeleton: true});
        this.listTreeService.listNode(this.preDispatch, node, node.page, this.filter).then(
            data => {
                node.children.pop();
                this.addData(node, data, next);
            }
        );

    }

    async loadMore(node, next) {
        if (node.type === 'streetId' || (node.type !== 'oet' && this.searchMode)) {
            return;
        } // ignore the node where its children are static
        if (node.children.length && !node.loading) {
            node.page = !node.page ? 2 : ++node.page;
            await this.load(node, next);
        }
    }

    addData(node, data, next) {
        let _data;
        if (node.type !== 'oet') {
            _data = data;
        } else { // handle the leafs case, the api response is quit different.
            data.forEach((_new) => {
                if (node.subtype === _new.subtype) {
                    _data = _new.children;
                }
            });
        }
        if (_data) {
            node.children = node.children.concat(_data);
        }
        // if the results was lass than the tree pagination results count, keep this node in loading state.
        if (_data && _data.length >= this.paginationOptions.get_tree_pagination) {
            node.loading = false;
        } else {
            // console.log('loading stopped for node', next);
        }
    }

    // Move Node Methods

    onDrop(event, parent) {
        const item = this.getItem(event.data.next);
        this.moveNode(item, parent, event.data.next);
        this.dragging = null;
    }

    onDragEnd() {
        console.log('your drag is ended');
        this.dragging = null ;
    }

    moveNode(node, to, next, validated = false) {
        const oldParent = node.parent;
        if (this.listTreeService.moveItem(node, to, this.preDispatch, validated)) {
            node.loading = false;
            node.expanded = false;
        }
        if (!oldParent.children.length) {
            oldParent.loading = false;
            oldParent.expanded = false;
        }
    }

    onDragStart(event, item) {
        this.dragging = item;
    }

    isDropLocation(item): boolean {
        if (!this.dragging) { return false; }
        if (this.dragging.parent.id === item.id) { return false; }
        if (this.dragging.parent.type === item.type && this.dragging.parent.parent.id === item.parent.id) {
            return true;
        }
        return false;
    }

    isMovable(item) {
        if (item.node) { item = item.node; }
        return item.type === 'capId' || item.type === 'streetId';
    }

    isNonDropLocation(item): boolean {
        if (!this.dragging) { return false; }
        if (this.dragging.parent.type === item.type && this.dragging.parent.parent.id === item.parent.id) {
            return false;
        }
        return true;
    }

    getItem(next: string, id = null) {
        const location = next.split(':');

        let item: any = this.tree[0];
        location.forEach((elm) => {
            if (elm === '') {
                return;
            }
            item = item.children[elm];
        });
        if (id) {
            const temp = item.children.filter((elm) => elm.id === id);
            item = temp.length ? temp[0] : null;
        }
        return item;
    }

    submitMoveItem(select) {
        if (!select.itemsList.selectedItems[0]) {
            return;
        }
        const moveTo = select.itemsList.selectedItems[0];
        moveTo.type = this.toMoveItem.node.parent.type;
        this.moveNode(this.toMoveItem.node, moveTo.value, this.toMoveItem.next, true);
    }

    submitMergeStreets(select) {
        if (!select.itemsList.selectedItems[0]) {
            return;
        }
        const mergeWith = select.itemsList.selectedItems[0].value;
        const source = {
            city_id: this.merge_data.source.parent.parent.id,
            cap_id: this.merge_data.source.parent.id,
            street_id: this.merge_data.source.id
        };
        const target = {
            city_id: mergeWith.city.id,
            cap_id: mergeWith.cap.id,
            street_id: mergeWith.id
        };
        this.listTreeService.mergeTwoStreets(this.preDispatch, source, target).pipe(takeUntil(this.unsubscribe)).subscribe(
            async data => {
                this.snotifyService.success(this.translate.instant('schedule.address.snotify_mergeTwoStreets.success'),
                {showProgressBar: false});
                await this.reloadNode({item: {node: this.merge_data.source.parent, next: ''}});
                this.merge_data = {source: null, targets: []};

            },
            error => {
                this.snotifyService.error(this.translate.instant('schedule.address.snotify_mergeTwoStreets.error'),
                 {showProgressBar: false});
                this.merge_data = {source: null, targets: []};
            }
        );
    }

    // Actions on Nodes
    async reloadNode(event) {
        event.item.node.children = [];
        event.item.node.loading = false;
        event.item.node.page = 0;
        await this.load(event.item.node, event.item.next);
    }


    rename(text, input) {
        text.style.display = 'none';
        input.style.display = 'inline-block';
    }

    nameChanged(event, item, text, input) {
        text.style.display = 'inline-block';
        input.style.display = 'none';
        if (!event.target.value.trim()) {
            return;
        }
        const old = item.text;
        item.text = event.target.value;

        if (item.type === 'cityId') {
            this.addressesActionsService.renameCity(item.id, this.preDispatch, event.target.value).subscribe(
                data => {
                    this.snotifyService.success(this.translate.instant('schedule.address.snotify_renameCity.success'),
                     {showProgressBar: false});
                },
                error => {
                    item.text = old;
                    this.snotifyService.error(this.translate.instant('schedule.address.snotify_renameCity.error'),
                     {showProgressBar: false, timeout: 3000});
                }
            );
        } else if (item.type === 'streetId') {
            this.addressesActionsService.renameStreet(item.parent.parent.id, this.preDispatch, item.parent.id, item.id, event.target.value)
                .subscribe(
                    data => {
                        this.snotifyService.success(this.translate.instant('schedule.address.snotify_renameStreet.success'),
                         {showProgressBar: false});
                    },
                    error => {
                        item.text = old;
                        this.snotifyService.error(this.translate.instant('schedule.address.snotify_renameStreet.error'),
                         {showProgressBar: false, timeout: 3000});
                    }
                );
        }
    }

    // Start/End Points Methods

    submitChangeStartPoint(input) {
        if (!input.itemsList.selectedItems[0]) {
            return;
        }
        this.addressesActionsService.updatePreDispatchStartPoint(this.preDispatch, input.itemsList.selectedItems[0].value.id).subscribe(
            data => {
                if (data.success) {
                    this.snotifyService.success(this.translate.instant('schedule.address.snotify_updatePreDispatchStartPoint.success'),
                     {showProgressBar: false});
                    this.startPointTextInput.nativeElement.value = input.itemsList.selectedItems[0].value.text;
                } else {
                    this.snotifyService.error(this.translate.instant('schedule.address.snotify_updatePreDispatchStartPoint.error'),
                     {showProgressBar: false});
                }
            },
            error => {
                this.snotifyService.error(this.translate.instant('schedule.address.snotify_updatePreDispatchStartPoint.error'),
                 {showProgressBar: false});
            }
        );
    }

    async submitEditStartPoint(input) {
        this.locateStartEndPoint(input.address,  'editStartPoint').then(async(address) => {
            this.modalService.dismissAll();
            this.editingPoint['startPoint'] = false;
            try {
                const e_res = await this.addressesActionsService.editStartPoint(address, input.address.id).toPromise();
                if (!e_res.success) {
                    return this.snotifyService.error(this.translate.instant('schedule.address.snotify_editStartPoint.error'),
                     {showProgressBar: false});
                }
                const res = await this.addressesActionsService.updatePreDispatchStartPoint(this.preDispatch, input.address.id).toPromise();
                if (!res.success) {
                    return this.snotifyService.error(this.translate.instant('schedule.address.snotify_editStartPoint.error'),
                     {showProgressBar: false});
                }
                this.snotifyService.success(this.translate.instant('schedule.address.snotify_editStartPoint.success'),
                 {showProgressBar: false});
                this.startPointTextInput.nativeElement.value = input.address.text;
            } catch (e) {
                this.snotifyService.error(this.translate.instant('schedule.address.snotify_editStartPoint.error'),
                 {showProgressBar: false});
            }
        }).catch((e) => {
            console.log(e);
        });
    }

    async submitEditEndPoint(input) {
        this.locateStartEndPoint(input.address,  'editEndPoint').then(async(address) => {
            this.modalService.dismissAll();
            this.editingPoint['endPoint'] = false ;
            try {
                const e_res = await this.addressesActionsService.editEndPoint(address, input.address.id).toPromise();
                if (!e_res.success) {
                    return this.snotifyService.error(this.translate.instant('schedule.address.snotify_editEndPoint.error'),
                     {showProgressBar: false});
                }
                const res = await this.addressesActionsService.updatePoreDispatchEndPoint(this.preDispatch, input.address.id).toPromise();
                if (!res.success) {
                    return this.snotifyService.error(this.translate.instant('schedule.address.snotify_editEndPoint.error'),
                     {showProgressBar: false});
                }
                this.snotifyService.success(this.translate.instant('schedule.address.snotify_editEndPoint.success'),
                 {showProgressBar: false});
                this.endPointTextInput.nativeElement.value = input.address.text;
            } catch (e) {
                this.snotifyService.error(this.translate.instant('schedule.address.snotify_editEndPoint.error2'), {showProgressBar: false});
            }
        }).catch((e) => {

        });
    }

    submitChangeEndPoint(select) {
        if (!select.itemsList.selectedItems[0]) {
            return;
        }
        this.addressesActionsService.updatePoreDispatchEndPoint(this.preDispatch, select.itemsList.selectedItems[0].value.id).subscribe(
            data => {
                if (data.success) {
                    this.snotifyService.success(this.translate.instant('schedule.address.snotify_updatePoreDispatchEndPoint.success'),
                     {showProgressBar: false});
                    this.endPointTextInput.nativeElement.value = select.itemsList.selectedItems[0].value.text;
                } else {
                    this.snotifyService.error(this.translate.instant('schedule.address.snotify_updatePoreDispatchEndPoint.error'),
                     {showProgressBar: false});
                }
            },
            error => {
                this.snotifyService.error(this.translate.instant('schedule.address.snotify_updatePoreDispatchEndPoint.error'),
                 {showProgressBar: false});
            }
        );
    }

    async locateStartEndPoint(address: ACAddress, error_domain: string): Promise<ACAddress> {
        return new Promise<ACAddress>( async(resolve, reject) => {
            if (!address.hasObject) {
                this.errors[error_domain] = this.translate.instant('schedule.address.locateStartEndPoint.error');
                return reject(false);
            }
            if (!address.located) {
                try {
                    const locatedAddress = await this.locatingService.locateAddress(address.address) ;
                    address.address.lat = locatedAddress.lat ;
                    address.address.lng = locatedAddress.long ;
                } catch (e) {
                    this.errors[error_domain] = this.translate.instant('schedule.address.locateStartEndPoint.error2');
                    return reject(e) ;
                }
            }
            this.errors[error_domain] = false ;
            return resolve(address) ;
        });
    }

    createStartPoint(input) {
        this.locateStartEndPoint(input.address,  'createStartPoint').then((address) => {
            this.modalService.dismissAll();
            this.addressesActionsService.createStartPoint(address).subscribe(
               data => {
                   this.snotifyService.success(this.translate.instant('schedule.address.createStartPoint.success'),
                    {showProgressBar: false});
               },
               error => {
                    this.snotifyService.error(this.translate.instant('schedule.address.createStartPoint.error'),
                        {showProgressBar: false});
               }
           ) ;
        }).catch((e) => {

        });
    }

    createEndPoint(input) {
        this.locateStartEndPoint(input.address,  'createEndPoint').then((address) => {
            this.modalService.dismissAll();
            this.addressesActionsService.createEndPoint(address).subscribe(
               data => {
                   this.snotifyService.success(this.translate.instant('schedule.address.createEndPoint.success'), {showProgressBar: false});
               },
               error => {
                    this.snotifyService.error(this.translate.instant('schedule.address.createEndPoint.error'), {showProgressBar: false});
               }
           ) ;
        }).catch((e) => {

        });
    }

    editPoint(pointType, select) {
        const point = select.itemsList.selectedItems[0] ;
        if (!point) {
            return;
        }
        this.editingPoint[pointType] = point.value ;
    }

    cancelEditPoint(pointType) {
        this.editingPoint[pointType] = false ;
        this.errors[pointType] = false ;
    }
    // Search/Filter Methods

    async filterChanged(event, type) {

        if (event.target.checked) {
            this.filter[type] = 1;
        } else {
            this.filter[type] = 0;
        }

        this.tree[0].children = await this.listTreeService.listNode(this.preDispatch, this.tree[0], 1, this.filter);
    }

    async searchTree(query) {
        if (this.searchSubscription) {
            this.searchSubscription.unsubscribe();
        }
        if (query === '') {
            this.tree = [
                // The root node of the tree .
                {
                    id: '0', text: '', subtype: '', children: [{skeleton: true}], parent: <TreeNodeInterface>{}, type: 'root',
                    status: 0, page: 0
                }
            ];
            this.searchMode = false ;
            return this.tree[0].children = await this.listTreeService.listNode(this.preDispatch, this.tree[0], 1, this.filter);
        }
        this.tree = [{id: '0', text: '', subtype: '', children: [{skeleton: true}], parent: <TreeNodeInterface>{},
            type: 'root', status: 0, page: 0}] ;
        this.searchSubscription = this. listTreeService.sendSearchTreeRequest(this.preDispatch, query).subscribe(
            data => {
                this.searchMode = true ;
                this.tree = this.listTreeService.createTreeFromSearchResponse(data.data) ;
            },
        );
    }


    async editBuildingAddress(input, item, container) {
        const address: ACAddress = input.address ;
        if (!address.hasObject) {
            return this.errors['editBuildingAddress-' + item.id] = this.translate.instant('schedule.address.editBuildingAddress.error') ;
        }
        if (!address.address.strict) {
            return this.errors['editBuildingAddress-' + item.id] = this.translate.instant('schedule.address.editBuildingAddress.error2') ;
        }
        if (!address.located) {
            try {
                const locatedAddress = await this.locatingService.locateAddress(address.address) ;
                address.address.lat = locatedAddress.lat ;
                address.address.lng = locatedAddress.long ;
                // use the located formatted address if it was found.
                if (locatedAddress.formattedAddress) {
                    if (locatedAddress.formattedAddress.cap) {
                        address.address.cap = locatedAddress.formattedAddress.cap ;
                    }
                    if (locatedAddress.formattedAddress.city) {
                        address.address.city = locatedAddress.formattedAddress.city ;
                    }
                    if (locatedAddress.formattedAddress.street) {
                        address.address.street = locatedAddress.formattedAddress.street ;
                    }
                    if (locatedAddress.formattedAddress.houseNumber) {
                        address.address.houseNumber = locatedAddress.formattedAddress.houseNumber ;
                    }
                }
            } catch (e) {
                return this.errors['editBuildingAddress-' + item.id] =
                this.translate.instant('schedule.address.editBuildingAddress.error3');
            }
        }
        this.errors['editBuildingAddress-' + item.id] = null ;
        container.style.display = 'none';
        this.addressesActionsService.changeBuldinAddress(address.address, item.id, this.preDispatch).subscribe(
            data => {
                this.snotifyService.success(this.translate.instant('schedule.address.changeBuldinAddress.success'),
                 {showProgressBar: false});
                this.reloadNode({item: {node: item.parent.parent}});
            },
            error => {
                this.snotifyService.error(this.translate.instant('schedule.address.changeBuldinAddress.error'), {showProgressBar: false});
            }
        );
    }
    async editBuildingLocation(latInput, lngInput, item, container) {

        if (!latInput.value || !lngInput.value || !parseFloat(latInput.value) || !parseFloat(lngInput.value)) {
            return this.errors['editBuildingLocation-' + item.id] = this.translate.instant('schedule.address.editBuildingLocation.error');
        }
        this.errors['editBuildingLocation-' + item.id] = null ;
        container.style.display = 'none' ;
        this.addressesActionsService.changeBuldinAddress({lat: latInput.value, lng: lngInput.value}, item.id, this.preDispatch).subscribe(
            data => {
                latInput.value = '' ;
                lngInput.value = '' ;
                this.mapService.removeMarker('EditLocationMarker');
                this.mapService.onClick(null);
                this.snotifyService.success(this.translate.instant('schedule.address.removeMarker.success'), {showProgressBar: false});
            },
            error => {
                this.snotifyService.error(this.translate.instant('schedule.address.removeMarker.error'), {showProgressBar: false});
                item.parent.expanded = false ;
                item.parent.loading = false ;
                this.reloadNode({item: {node: item.parent}});
            }
        );
    }


    async moveToInPlanning(modalRef, force = false, filter = null, status = null) {
        const data = this.listTreeService.select.fetchSelectedItems(this.tree[0]);
        if (force) {
            return this.planningService.moveToInPlanning(this.preDispatch, data, filter, status, () => {
                this.reloadNode({item: {node: this.tree[0]}});
                return this.translate.instant('schedule.address.moveToInPlanning.return');
            });
        }
        return this.planningService.moveToInPlanningCheck(this.preDispatch, data, filter, status).subscribe(
            result => {
                if (result.data) {
                    // show the modal
                    this.modalService.open(modalRef, {backdrop: 'static' });
                } else {
                    this.planningService.moveToInPlanning(this.preDispatch, data, filter, status, () => {
                        this.reloadNode({item: {node: this.tree[0]}});
                        return this.translate.instant('schedule.address.moveToInPlanning.return');
                    });
                }
            }
        );
    }

    // Modals Methods

    openMoveItemModal(event, modal) {
        this.modalService.open(modal, {backdrop: 'static' });
        this.move_to_items = [];
        if (event.item.node.type === 'streetId') {
            this.listTreeService.getMoveToCaps(this.preDispatch, event.item.node.parent.parent.id, event.item.node.parent.id).subscribe(
                data => {
                    this.move_to_items = data.data;
                }
            );
        } else if (event.item.node.type === 'capId') {
            this.listTreeService.getMoveToCities(this.preDispatch, event.item.node.parent.id).subscribe(
                data => {
                    this.move_to_items = data.data;
                }
            );
        }
        this.toMoveItem = event.item;
    }

    openChangeStartPointModal(event, modal) {
        this.modalService.open(modal, {backdrop: 'static' });
        this.all_start_points = [];
        this.addressesActionsService.getAllStartPoints().subscribe(
            data => {
                this.all_start_points = data.data;
            });
    }

    openChangeEndPointModal(event, modal) {
        this.modalService.open(modal, {backdrop: 'static' });
        this.all_start_points = [];
        this.addressesActionsService.getAllEndPoints().subscribe(
            data => {
                this.all_end_points = data.data;
            });
    }


    openMergeStreetsModal(item, modal) {
        this.modalService.open(modal, {backdrop: 'static' });
        this.merge_data.source = item ;
        this.listTreeService.getStreetMergeAvailableStreets(this.preDispatch, item.parent.parent.id, item.parent.id)
            .pipe(takeUntil(this.unsubscribe)).subscribe(
                data => {
                    this.merge_data.targets = data.data;
                }
        );
    }

    openModal(modal) {
        this.modalService.open(modal, {backdrop: 'static' });
    }

    changeLocationOnMap(element, hideElements = []) {
        this.showElement(element, hideElements);
        this.mapService.onClick((event: any) => {
            let marker = this.mapService.getMarker('EditLocationMarker');
            if (!marker) {
                marker = this.mapService.createMarker('EditLocationMarker', event.coords.lat, event.coords.lng, '');
            } else {
                marker.lat = event.coords.lat ;
                marker.lng = event.coords.lng ;
            }
            element.querySelector('.edit-location-lat-input').value = event.coords.lat ;
            element.querySelector('.edit-location-lng-input').value = event.coords.lng ;
        });
    }

    // View Related Methods

    getStepIdx(idx) {
        if (idx === 0) {
            this.itemsCount = 0;
        }
        return this.itemsCount++;
    }

    getLvlClass(next) {
        return ('lvl-' + (next + '').split(':').length);
    }

    getStatusClass(item) {
        return !item.status ? '' : 'status-' + item.status;
    }

    showElement(element, hideElements = []) {
        element.style.display = 'block';
        hideElements.forEach((elm) => {
            elm.style.display = 'none' ;
        });
    }

    select(node: TreeNodeInterface) {
        this.listTreeService.select.select(node);
    }

    loadMarkers(mapLocation) {
        if (this.markersSubscription) {
            this.markersSubscription.unsubscribe();
        }
        this.markersSubscription = this.listTreeService.getAddressesTreeMapMarkers(
            this.preDispatch,
            mapLocation.center.lat,
            mapLocation.center.lng,
            mapLocation.zoom
        ).pipe(takeUntil(this.unsubscribe)).subscribe(
            data => {
                if (!data.data) { return ; }
                this.mapService.reset();
                this.mapService.createMarkersList(data.data, (event, marker) => {
                    this.addressesActionsService.changeBuldinAddress(
                        {lat: event.coords.lat, lng: event.coords.lng},
                        marker.id, this.preDispatch).subscribe(_data => {
                            this.snotifyService.success(this.translate.instant('schedule.address.createMarkersList.success'),
                            {showProgressBar: false});
                        });
                });
            }
        );
    }

    // Life Cycle OnDestroy

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }


}
