import {EventEmitter, Injectable} from '@angular/core';
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

@Injectable()
export class LocatingService {

    constructor(
        private http: HttpClient,
        private loadingService: LoadingService,
        private googleGeocodeService: GoogleGeocodeService,
        private tuttocittaGeocodeService: TuttocittaGeocodeService,
        private mapBoxGeocodeService: MapBoxGeocodeService,
        private snotifyService: SnotifyService,
    ) {
    }

    // output events .
    relocate = new EventEmitter<BuildingLocationInterface>();
    treeCreated = new EventEmitter<boolean>();
    // the located items
    buildings = [] ;
    // the items that no provider was able to locate
    nfound = [] ;
    // the items that was manually changed by the user and waiting to be relocated.
    fixed = [] ;
    // the pre dispatch that is being located
    preDispatch ;

    async fix(building: BuildingLocationInterface, address: string, lat: number, lng: number, skip = false) {
        // define pseudo located building
        const _recipient = <LocatedBuildingInterface>{id: building.id, name: null, is_fixed: true} ;
        if (skip) {
            // if the user wants to skip this building
            // uncomment this when this feature is ready on the backend
            // _recipient.is_fixed = false ;
            // this.buildings.push(_recipient) ;
        } else if (lat && lng) {
            // if the user entered the lat,lng manually
            _recipient.lat = lat ;
            _recipient.long = lng ;
            this.buildings.push(_recipient);
        } else {
            // if the user had entered a new address
            const _address = address.split(',');
            // the inputted address, can be a house number, street, cap... in this exact order
            if (_address[0] && _address[0].trim()) {
                building.street = _address[1].trim() ;
            }
            if (_address[1] && _address[1].trim()) {
                building.houseNumber = _address[0].trim() ;
            }
            if (_address[2] && _address[2].trim()) {
                building.cap = _address[2].trim() ;
            }

            // queue this building to be relocated.
            this.fixed.push(building) ;
        }

        // remove the items that was skipped or manually located from the unlocated items
        this.nfound = this.nfound.filter((elm) => elm.id !== building.id);

        // if there is items waiting to be located when there is no more items waiting user action, start locating them
        if (!this.nfound.length && this.fixed.length) {
            this.loadingService.setLoadingState({state: true, message: 'initializing...', progress: 0, autProgress: false});
            await this.process(this.fixed);
            this.loadingService.state(false);
            this.fixed = [] ;
        }

        // if there is more items waiting user action, dispatch an event informing other components.
        if (this.nfound.length) {
            this.relocate.emit(this.nfound[0]) ;
        } else if (this.buildings.length) { // else if there is new located items, save them
            await this.save();
        }

        // if the process is done, create the tree.
        if (!this.buildings.length && !this.fixed.length && !this.nfound.length) {
            await this.createTree();
            this.snotifyService.success('All buildings are localized !', { showProgressBar: false});
        }
    }

    async startLocating(preDispatch) {



        let page = 0;
        this.buildings = [] ;
        this.nfound = [] ;
        this.fixed = [] ;

        this.preDispatch = preDispatch ;
        this.loadingService.setLoadingState({state: true, message: 'initializing...', progress: 0, autProgress: false});
        while (true) {
            this.loadingService.message('Fetching routes data to process');
            const response = <ApiResponseInterface> await this.getPreDispatchToLocateBuildings(preDispatch, ++page).toPromise();
            if (response.statusCode !== 200 || ! await this.process(response.data) ) {
                break ;
            }
        }
        this.loadingService.state(false);
        this.buildings = [] ;
        if (this.nfound.length) {
            this.relocate.emit(this.nfound[0]) ;
        }

        if (!this.buildings.length && !this.fixed.length && !this.nfound.length) {
            await this.createTree();
            this.snotifyService.success('All buildings are localized !', { showProgressBar: false});
        }
    }

    async process(buildings) {

        if (!buildings.length) { return ; }
        let processed = 0 ;
        let result ;

        for (let i = 0; i < buildings.length; ++i) {
            this.loadingService
                .message(`Locating '${buildings[i].street}, ${buildings[i].houseNumber}, ${buildings[i].cap} ${buildings[i].city}'`);
            if ( result = await this.tuttocittaGeocodeService.locate(buildings[i]) ) {
                this.buildings.push(result);
                console.log(`${buildings[i].street} located using google`);
            } else if ( result = await this.googleGeocodeService.locate(buildings[i]) ) {
                this.buildings.push(result);
                console.log(`${buildings[i].street} located using google`);
            } else if ( result = await this.mapBoxGeocodeService.locate(buildings[i])) {
                this.buildings.push(result);
                console.log(`${buildings[i].street} located using MapBox`);
            } else {
                this.nfound.push(buildings[i]);
            }
            this.loadingService.progress((++processed / buildings.length) * 100);
        }
        this.loadingService.message(`Saving data...`);
        console.log(this.buildings);
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
                    data => { this.buildings = []; resolve(data) ; },
                    error => { reject(error) ; }
                );
        });
    }

    createTree(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.loadingService.setLoadingState({state: true, message: 'Creating Tree', progress: 0, autProgress: true});
            return this.http.post(AppConfig.endpoints.createTree, {'id': this.preDispatch}).subscribe(
                data => {
                    resolve(data) ;
                    this.loadingService.state(false);
                    this.treeCreated.emit(true);
                },
                error => {
                    reject(error) ;
                    this.loadingService.state(false);
                }
            );
        });
    }

    getPreDispatchToLocateBuildings(preDispatch, page = 1): Observable<{} | ApiResponseInterface> {
        const options = { params: new HttpParams().set('page', '' + page)};
        return this.http.get<ApiResponseInterface>(AppConfig.endpoints.getPreDispatchToLocateProducts(preDispatch), options);
    }

}
