import {EventEmitter, Injectable, OnDestroy} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {GoogleGeocodeService} from './google.geocode.service';
import {TuttocittaGeocodeService} from './tuttocitta.geocode.service';
import {MapBoxGeocodeService} from './map-box.geocode.service';
import {SnotifyService} from 'ng-snotify';
import {Observable} from 'rxjs';
import {AppConfig} from '../../config/app.config';
import {LoadingService} from '../loading.service';
import {ApiResponseInterface} from '../../core/models/api-response.interface';
import {BuildingLocationInterface, LocatedBuildingInterface} from '../../core/models/building.interface';
import {BackProcessingService} from '../back-processing.service';
import {NavigationEnd, Router} from '@angular/router';

@Injectable()
export class LocatingService implements OnDestroy {

    constructor(
        private http: HttpClient,
        private loadingService: LoadingService,
        private googleGeocodeService: GoogleGeocodeService,
        private tuttocittaGeocodeService: TuttocittaGeocodeService,
        private mapBoxGeocodeService: MapBoxGeocodeService,
        private snotifyService: SnotifyService,
        private backProcessingService: BackProcessingService
    ) {
    }

    // output events .
    treeCreated = new EventEmitter<boolean>();
    productsNotFound = new EventEmitter<[BuildingLocationInterface]>() ;

    // the located items
    buildings = <[LocatedBuildingInterface]>[] ;
    // the items that was manually changed by the user and waiting to be relocated.
    fixed = <[BuildingLocationInterface]>[] ;

    // the pre dispatch that is being located
    preDispatch ;
    processed = 0 ;
    breakGroupingLoading = false ;

    async fix(buildings: [BuildingLocationInterface], skip = false, handle: EventEmitter<any>, preDispatch) {

        if (skip) {
            await this.createTree(handle);
            return this.snotifyService.success('Albero creato con successo', { showProgressBar: false});
        }

        Object.keys(buildings).forEach((key) => {
            if (buildings[key].lat && buildings[key].long) {
                buildings[key].is_fixed = true ;
                buildings[key].name = buildings[key].street ;
                this.buildings.push(buildings[key]) ;
            } else {
                buildings[key].name = buildings[key].street ;
                this.fixed.push(buildings[key]) ;
            }
        });

        // if there is items waiting to be located when there is no more items waiting user action, start locating them
        if (this.fixed.length) {
            handle.emit({
                stateObj: {state: true, message: 'initializing...', progress: 0, autProgress: false, hide_btn: true}
            });
            this.processed = 0 ;
            await this.process(this.fixed, this.fixed.length, handle, preDispatch, true);
            this.loadingService.state(false);
            this.fixed = <[BuildingLocationInterface]>[] ;
        }

        // if there is new located items, save them
        if (this.buildings.length) {
            await this.save();
        }

        // check if there is any more not localized buildings
        const nfound = await this.getNotFoundProducts(preDispatch).toPromise();
        if (nfound.data.length) {
            this.productsNotFound.emit(nfound.data);
            handle.emit({nfound: nfound.data});
            return false;
        }

        // if the process is done, create the tree.
        if (!this.buildings.length && !this.fixed.length) {
            await this.createTree(handle);
            this.snotifyService.success('Tutti gli indirizzo sono localizzati!', { showProgressBar: false});
        }
    }

    async startLocating(preDispatch, handle: EventEmitter<any>, preDispatchData, groupingProgress = true) {
        this.preDispatch = preDispatch ;
        await this.backProcessingService.updatePreDispatchActionStatus(preDispatch, '1');
        if (preDispatchData.status === 'notPlanned' || preDispatchData.status === 'in_grouping') {
            const grouping = await this.group(preDispatch, handle, groupingProgress);
            // if grouping was interrupted, pause the process stop working.
            if (!grouping) {
                this.backProcessingService.ultimatePause(preDispatch) ;
                return ;
            }
        }
        this.processed = 0 ;
        this.buildings = <[LocatedBuildingInterface]>[] ;
        this.fixed = <[BuildingLocationInterface]>[] ;
        handle.emit({stateObj: {state: true, message: 'initializing...', progress: 0, autProgress: false, hide_btn: true}});
        // start locating .
        while (true) {
            handle.emit({message: 'Fetching routes data to process'});
            const response = <ApiResponseInterface> await this.getPreDispatchToLocateProducts(preDispatch).toPromise();
            // break when the api returns error, or empty products list
            if (response.statusCode !== 200 || !response.data) {
                break;
            }
            if (!this.processed) {
                this.processed = response.data.localized_groups;
            }
            // there is no more items to process
            if (! await this.process(response.data.products, response.data.total_groups, handle, preDispatch) ) {
                break ;
            }
        }

        // If the process is paused.
        if (!this.backProcessingService.isRunning('locating-' + this.preDispatch)) {
            return false ;
        }

        // reset buildings to start the fix not found process .
        this.buildings = <[LocatedBuildingInterface]>[] ;
        await this.backProcessingService.updatePreDispatchActionStatus(preDispatch, null);
        const nfound = await this.getNotFoundProducts(preDispatch).toPromise() ;
        if (nfound.data.length) {
            // emit fix the not found items event.
            this.productsNotFound.emit(nfound.data);
            handle.emit({nfound: nfound.data});
        }

        // if every thing is done or the user is not in the pre-dispatch page, create the tree.
        if (!this.buildings.length && !this.fixed.length) {
            await this.createTree(handle);
            this.snotifyService.success('Tutti gli indirizzo sono localizzati!', { showProgressBar: false});
        }

        return true;
    }

    async process(buildings, total, handle: EventEmitter<any>, preDispatch, unpausable = false) {

        if (!buildings.length) { return false; }
        let result ;

        const onePercent = Math.ceil(total / 100.0);
        console.log('locating page contains ', buildings.length, ' items!');
        for (let i = 0; i < buildings.length; ++i) {
            if ( result = await this.tuttocittaGeocodeService.locate(buildings[i]) ) {
                this.buildings.push(result);
                console.log(buildings[i], ' located by tuttocitta');
            } else if (result = await this.googleGeocodeService.locate(buildings[i])) {
                this.buildings.push(result);
                console.log(buildings[i], ' located by google');
            } else if ( result = await this.mapBoxGeocodeService.locate(buildings[i])) {
                this.buildings.push(result);
            } else {
                console.error(buildings[i], ' was not located');
                this.buildings.push({ id: buildings[i].id, lat: 0, long: 0, is_fixed: false, name: buildings[i].street});
            }
            // if the process is paused save and stop working.
            if (!this.backProcessingService.isRunning('locating-' + preDispatch) && !unpausable) {
                console.log('saving because of pause ', this.buildings);
                await this.save();
                return false ;
            }
            // save every 1%
            if (this.processed % onePercent === 0) {
                console.log('saving every 1% ', this.buildings);
                await this.save();
            }
        }

        console.log('saving because of stage end ', this.buildings);
        await this.save();
        return true ;
    }

    async locateAddress(address): Promise<LocatedBuildingInterface> {
        return new Promise<LocatedBuildingInterface>(async (resolve, reject) => {
            this.loadingService.setLoadingState({
                state: true, message: `Locating '${address.street}, ${address.houseNumber}, ${address.cap} ${address.city}'`,
                progress: 0, autProgress: true
            });
            let result: LocatedBuildingInterface ;
            if ( result = await this.tuttocittaGeocodeService.locate(address) ) {
                resolve(result) ;
            } else if ( result = await this.googleGeocodeService.locate(address) ) {
                resolve(result) ;
            } else if ( result = await this.mapBoxGeocodeService.locate(address)) {
                resolve(result) ;
            } else {
                console.log('was not able to locate',  `${address.street}, ${address}, ${address.cap} ${address.city}`);
                reject(null) ;
            }
            this.loadingService.state(false);
        });
    }

    async save(): Promise<any> {
        return new Promise<any>(async(resolve, reject) => {
            if (!this.buildings.length) {
                return resolve(true);
            }
            this.http.post<ApiResponseInterface>(AppConfig.endpoints.updateStreetsData, {'streets': this.buildings}, {
                headers: new HttpHeaders({ 'ignoreLoadingBar': '' })
            })
                .subscribe(
                    data => { this.buildings = <[LocatedBuildingInterface]>[]; resolve(data) ; },
                    error => { reject(error) ; }
                );
        });
    }

    createTree(handle: EventEmitter<any>): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            handle.emit({stateObj: {state: true, message: 'Creating Tree', progress: 0, autProgress: true, hide_btn: true}});
            // this.loadingService.setLoadingState({state: true, message: 'Creating Tree', progress: 0, autProgress: true});
            return this.http.post(AppConfig.endpoints.createTree, {'id': this.preDispatch}, {
                headers: new HttpHeaders({ 'ignoreLoadingBar': '' })
            }).subscribe(
                data => {
                    resolve(data) ;
                    handle.emit({state: false, treeCreated: true});
                    this.treeCreated.emit(true);
                },
                error => {
                    reject(error) ;
                    handle.emit({state: false});
                }
            );
        });
    }

    getPreDispatchToLocateProducts(preDispatch): Observable<{} | ApiResponseInterface> {
        return this.http.get<ApiResponseInterface>(AppConfig.endpoints.getPreDispatchToLocateProducts(preDispatch),
            {headers: new HttpHeaders({'ignoreLoadingBar': ''})});
    }

    getNotFoundProducts(preDispatch): Observable<any> {
        console.log('preDispatch2', preDispatch);
        return this.http.get<ApiResponseInterface>(AppConfig.endpoints.getNotFoundProducts(preDispatch));
    }

    group(preDispatch, handle, progress = true): Promise<any> {
        return new Promise<any>(async(_resolve) => {

            // send the start grouping request and forget it.
            this.http.get<ApiResponseInterface>(AppConfig.endpoints.groupProducts(preDispatch), {}).subscribe(
                data => {
                    this.breakGroupingLoading = true ;
                        return _resolve(true);
                },
                error => {
                    return _resolve(false);
                }
            );

            // create the check loading interval
            if (progress) {
                this.createGroupingProgressInterval(preDispatch, handle);
            }

        });
    }

    getGroupingProgress(preDispatch) {
        return this.http.get<ApiResponseInterface>(AppConfig.endpoints.groupingProgress(preDispatch));
    }

    createGroupingProgressInterval(preDispatch, handle) {
        return new Promise(async (_resolve) => {
            let data = await this.getGroupingProgress(preDispatch).toPromise();
            while (data.data !== 100 && this.backProcessingService.isRunning('locating-' + preDispatch)) {
                if (this.breakGroupingLoading) {
                    return _resolve(true);
                }
                handle.emit({
                    stateObj: {state: true, message: 'Grouping...', progress: data.data, autProgress: false, hide_btn: true}
                });
                await this.sleep(1000);
                data = await this.getGroupingProgress(preDispatch).toPromise();
            }
            return _resolve(true);
        });
    }

    sleep(time) {
        return new Promise<any>((_resolve) => {
            setTimeout(() => { _resolve(true); }, time);
        });
    }

    stopAllLocatingProcess() {
        const process = this.backProcessingService.getAllByNameSpace('locating') ;
        if (!process) {
            return ;
        }
        process.forEach((elm) => {
            this.backProcessingService.updatePreDispatchActionStatus(elm, null);
        });
    }

    ngOnDestroy() {
    }
}
