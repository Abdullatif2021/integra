import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {StreetsService} from '../../../service/streets.service';
import {LoadingService} from '../../../service/loading.service';
import {GoogleGeocodeService} from './google.geocode.service';
import {TuttocittaGeocodeService} from './tuttocitta.geocode.service';
import {MapBoxGeocodeService} from './map-box.geocode.service';
import {StreetInterface} from '../../../core/models/street.interface';
import {ApiResponseInterface} from '../../../core/models/api-response.interface';
import {SettingsService} from '../../../service/settings.service';
import {GoogleGeocodeResponseInterface} from '../../../core/models/google-geocode-responce.interface';
import {AppConfig} from '../../../config/app.config';
import {SnotifyService} from 'ng-snotify';

@Injectable()
export class LocatingService {

    constructor(
        private http: HttpClient,
        private streetsService: StreetsService,
        private loadingService: LoadingService,
        private googleGeocodeService: GoogleGeocodeService,
        private tuttocittaGeocodeService: TuttocittaGeocodeService,
        private mapBoxGeocodeService: MapBoxGeocodeService,
        private snotifyService: SnotifyService,
    ) {}

    relocate = new EventEmitter<StreetInterface>()
    streets = [] ;
    nfound = [] ;
    fixed = [] ;

    async fix(street: StreetInterface, name: string, lat: number, lng: number) {

        if (lat && lng) {
            street.lat = lat ;
            street.long = lng ;
            this.streets.push(street);
        } else {
            street.name = name ;
            this.fixed.push(street) ;
        }

        this.nfound = this.nfound.filter((elm) => elm.id !== street.id);
        if (!this.nfound.length && this.fixed.length) {
            this.loadingService.setLoadingState({state: true, message: 'initializing...', progress: 0, autProgress: false});
            await this.process(this.fixed);
            this.loadingService.state(false);
            this.fixed = [] ;
        }

        if (this.nfound.length) {
            this.relocate.emit(this.nfound[0]) ;
        }

        if (!this.streets.length && !this.fixed.length && !this.nfound.length) {
            this.snotifyService.success('All Streets are localized !', { showProgressBar: false});
        }
    }

    async startLocating(preDispatch) {

        let page = 0;
        this.loadingService.setLoadingState({state: true, message: 'initializing...', progress: 0, autProgress: false});
        while (true) {
            this.loadingService.message('Fetching routes data to process');
            const streets: ApiResponseInterface = await this.streetsService.getPreDisptachStreets(preDispatch, ++page).toPromise();
            if (! await this.process(streets.data) ) {
                break ;
            }
        }
        this.loadingService.state(false);
        this.streets = [] ;
        if (this.nfound.length) {
            this.relocate.emit(this.nfound[0]) ;
        }

        if (!this.streets.length && !this.fixed.length && !this.nfound.length) {
            this.snotifyService.success('All Streets are localized !', { showProgressBar: false});
        }
    }

    async process(streets) {

        if (!streets.length) { return ; }
        let processed = 0 ;
        let result ;

        for (let i = 0; i < streets.length; ++i) {
            this.loadingService.message(`Locating '${streets[i].name}' `);
            if ( result = await this.tuttocittaGeocodeService.locate(streets[i])) {
                this.streets.push(result);
                console.log(`${streets[i].name} located using tuttocitta`);
            } else if ( result = await this.googleGeocodeService.locate(streets[i]) ) {
                this.streets.push(result);
                console.log(`${streets[i].name} located using google`);
            } else if ( result = await this.mapBoxGeocodeService.locate(streets[i])) {
                this.streets.push(result);
                console.log(`${streets[i].name} located using MapBox`);
            } else {
                this.nfound.push(streets[i]);
            }

            this.loadingService.progress((++processed / streets.length) * 100);
        }
        this.loadingService.message(`Saving data...`);
        await this.save();
        return true ;
    }

    async save(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            if (!this.streets.length && !this.fixed.length) {
                return resolve(true);
            }
            this.http.post<ApiResponseInterface>(AppConfig.endpoints.updateStreetsData, {'streets': this.streets.concat(this.fixed)})
                .subscribe(
                    data => { resolve(data) ; },
                    error => { reject(error) ; }
                );
        });
    }

}
