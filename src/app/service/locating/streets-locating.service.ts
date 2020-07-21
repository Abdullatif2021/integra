import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {GoogleGeocodeService} from './google.geocode.service';
import {TuttocittaGeocodeService} from './tuttocitta.geocode.service';
import {MapBoxGeocodeService} from './map-box.geocode.service';
import {SnotifyService} from 'ng-snotify';
import {BackProcessingService} from '../back-processing.service';
import {AppConfig} from '../../config/app.config';
import {map} from 'rxjs/internal/operators';

@Injectable()
export class StreetsLocatingService {

    constructor(
        private http: HttpClient,
        private googleGeocodeService: GoogleGeocodeService,
        private tuttocittaGeocodeService: TuttocittaGeocodeService,
        private mapBoxGeocodeService: MapBoxGeocodeService,
        private snotifyService: SnotifyService,
        private backProcessingService: BackProcessingService
    ) {
    }

    running = false ;

    async startLocating() {
        if (this.running) {
            console.log('running');
            return ;
        }
        let streets = await this.getStreets().toPromise().catch(e => {});
        if (!streets) {
            return ;
        }
        this.snotifyService.info('Some streets are being localized!', { showProgressBar: false});
        this.running = true ;
        while (streets) {
            const located = [];
            const not_located = [] ;
            // loop through all of the streets and locate them
            for (let i = 0; i < streets.length; ++i) {
                let result = null ;
                if (result = await this.googleGeocodeService.locateStreet(streets[i])) {
                    located.push(result);
                } else if (result = await this.tuttocittaGeocodeService.locateStreet(streets[i])) {
                    located.push(result);
                } else if (result = await this.mapBoxGeocodeService.locateStreet(streets[i])) {
                    located.push(result);
                } else {
                    // add the street as a none located item.
                    located.push({ id: streets[i],  isFixed: false});
                }
            }
            streets = null;
            const save = await this.save(located).toPromise().catch(e => {console.log('error fetching streets')});
            streets = await this.getStreets().toPromise().catch(e => {});
        }
    }


    getStreets() {
        const options = {headers: new HttpHeaders({'ignoreLoadingBar': ''})};
        return this.http.get<any>(AppConfig.endpoints.getStreetToLocalize, options).pipe(map(response => response.data));
    }


    save(located) {
        const data = { streets: located };
        const options = {headers: new HttpHeaders({'ignoreLoadingBar': ''})};
        return this.http.post<any>(AppConfig.endpoints.saveLocalizedStreets, data, options)
            .pipe(map(response => response.data));
    }

}
