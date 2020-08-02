import {Injectable} from '@angular/core';
import {GoogleApiService} from '../../../shared/service/google.api.service';

@Injectable()
export class GoogleMapsConfig {
    apiKey: string;

    constructor(private googleApiService: GoogleApiService) {
        this.loadKey();
        this.googleApiService.keyChanges.subscribe(
            key => {
                this.apiKey = key;
            }
        );
    }

    async loadKey() {
        this.apiKey = await this.googleApiService.getKey();
    }
}