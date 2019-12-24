import {EventEmitter, Injectable, OnDestroy} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {LoadingService} from '../../../service/loading.service';
import {GoogleGeocodeService} from './google.geocode.service';
import {TuttocittaGeocodeService} from './tuttocitta.geocode.service';
import {MapBoxGeocodeService} from './map-box.geocode.service';
import {LocatedBuildingInterface, BuildingLocationInterface} from '../../../core/models/building.interface';
import {ApiResponseInterface} from '../../../core/models/api-response.interface';
import {AppConfig} from '../../../config/app.config';
import {SnotifyService} from 'ng-snotify';
import {Observable} from 'rxjs';
import {BackProcessingService} from '../../../service/back-processing.service';

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
    // the located items
    buildings = <[BuildingLocationInterface]>[] ;
    // the items that no provider was able to locate
    nfound = <[BuildingLocationInterface]>[] ;
    // the items that was manually changed by the user and waiting to be relocated.
    fixed = <[BuildingLocationInterface]>[] ;
    // the pre dispatch that is being located
    preDispatch ;
    processed = 0 ;

    async fix(buildings: [BuildingLocationInterface], skip = false, handle: EventEmitter<any>) {

        if (skip) {
            await this.createTree(handle);
            return this.snotifyService.success('Tree was created successfully', { showProgressBar: false});
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

        this.nfound = <[BuildingLocationInterface]>[] ;
        // if there is items waiting to be located when there is no more items waiting user action, start locating them
        if (this.fixed.length) {
            handle.emit({stateObj:
                    {state: true, message: 'initializing...', progress: 0, autProgress: false, hide_btn: true}
            });
        // this.loadingService.setLoadingState({state: true, message: 'initializing...', progress: 0, autProgress: false, hide_btn: true});
            this.processed = 0 ;
            await this.process(this.fixed, this.fixed.length, handle);
            this.loadingService.state(false);
            this.fixed = <[BuildingLocationInterface]>[] ;
        }

        // if there is new located items, save them
        if (this.buildings.length) {
            await this.save();
        }

        if (this.nfound.length) {
            handle.emit({nFoundItems: this.nfound, warning: true});
            this.backProcessingService.queue('relocate-' + this.preDispatch, this.nfound);
        }

        // if the process is done, create the tree.
        if (!this.buildings.length && !this.fixed.length && !this.nfound.length) {
            await this.createTree(handle);
            this.snotifyService.success('All buildings are localized !', { showProgressBar: false});
        }
    }

    async startLocating(preDispatch, total, handle: EventEmitter<any>) {
        let result = false ;
        let page = 0;
        this.processed = 0 ;
        this.buildings = <[BuildingLocationInterface]>[] ;
        this.nfound = <[BuildingLocationInterface]>[] ;
        this.fixed = <[BuildingLocationInterface]>[] ;

        this.preDispatch = preDispatch ;
        handle.emit({stateObj: {state: true, message: 'initializing...', progress: 0, autProgress: false, hide_btn: true}});
        // this.loadingService.setLoadingState({state: true, message: 'initializing...', progress: 0, autProgress: false, hide_btn: true});
        // start locating .
        while (true) {
            // this.loadingService.message('Fetching routes data to process');
            handle.emit({message: 'Fetching routes data to process'});
            const response = <ApiResponseInterface> await this.getPreDispatchToLocateBuildings(preDispatch, ++page).toPromise();
            // break when the api returns error, or there is no more items to process
            if (response.statusCode !== 200 || ! await this.process(response.data, total, handle) ) {
                break ;
            }
        }

        // remove the loader.
        handle.emit({state: false});
        // this.loadingService.state(false);
        // reset buildings to start the fix not found process .
        this.buildings = <[BuildingLocationInterface]>[] ;
        if (this.nfound.length) {
            // emit fix the not found items event.
            handle.emit({nFoundItems: this.nfound, warning: true}) ;
            this.backProcessingService.queue('relocate-' + this.preDispatch, this.nfound);
        }

        // if every thing is done, create the tree.
        if (!this.buildings.length && !this.fixed.length && !this.nfound.length) {
            result = await this.createTree(handle);
            this.snotifyService.success('All buildings are localized !', { showProgressBar: false});
        }

        return result ;
    }

    async process(buildings, total, handle: EventEmitter<any>) {

        if (!buildings.length) { return ; }
        let result ;

        for (let i = 0; i < buildings.length; ++i) {
            // this.loadingService
            //     .message(`Locating '${buildings[i].street}, ${buildings[i].houseNumber}, ${buildings[i].cap} ${buildings[i].city}'`);
            handle.emit({id: this.preDispatch,
                message: `Locating '${buildings[i].street}, ${buildings[i].houseNumber}, ${buildings[i].cap} ${buildings[i].city}'`
            });
            if ( result = await this.tuttocittaGeocodeService.locate(buildings[i]) ) {
                this.buildings.push(result);
                // console.log(`${buildings[i].street} located using tuttocitta ========= ${this.preDispatch} ========= `);
            } else if ( result = await this.googleGeocodeService.locate(buildings[i]) ) {
                this.buildings.push(result);
                // console.log(`${buildings[i].street} located using google ========= ${this.preDispatch} ========= `);
            } else if ( result = await this.mapBoxGeocodeService.locate(buildings[i])) {
                this.buildings.push(result);
                // console.log(`${buildings[i].street} located using MapBox ========= ${this.preDispatch} ========= `);
            } else {
                this.nfound.push(buildings[i]);
            }
            handle.emit({progress: (++this.processed / total) * 100 });
            // this.loadingService.progress((++this.processed / total) * 100);
        }
        handle.emit({message: `Saving data...`});
        // this.loadingService.message(`Saving data...`);
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
            this.http.post<ApiResponseInterface>(AppConfig.endpoints.updateStreetsData, {'streets': this.buildings})
                .subscribe(
                    data => { this.buildings = <[BuildingLocationInterface]>[]; resolve(data) ; },
                    error => { reject(error) ; }
                );
            resolve();
        });
    }

    createTree(handle: EventEmitter<any>): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            handle.emit({stateObj: {state: true, message: 'Creating Tree', progress: 0, autProgress: true, hide_btn: true}});
            this.loadingService.setLoadingState({state: true, message: 'Creating Tree', progress: 0, autProgress: true});
            return this.http.post(AppConfig.endpoints.createTree, {'id': this.preDispatch}).subscribe(
                data => {
                    resolve(data) ;
                    handle.emit({state: false});
                    this.treeCreated.emit(true);
                },
                error => {
                    reject(error) ;
                    handle.emit({state: false});
                }
            );
        });
    }

    getPreDispatchToLocateBuildings(preDispatch, page = 1): Observable<{} | ApiResponseInterface> {
        const options = { params: new HttpParams().set('page', '' + page)};
        return this.http.get<ApiResponseInterface>(AppConfig.endpoints.getPreDispatchToLocateProducts(preDispatch), options);
    }

    group(preDispatch) {
        return this.http.get<ApiResponseInterface>(AppConfig.endpoints.groupProducts(preDispatch), {});
    }

    ngOnDestroy() {
    }
}
