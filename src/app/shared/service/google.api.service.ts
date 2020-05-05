import {SettingsService} from '../../service/settings.service';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable()
export class GoogleApiService {


    constructor(private http: HttpClient, private settingsService: SettingsService) {
    }

    keys: any;
    loaded = false ;

    private async loadKeys(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.settingsService.getMapProviderKey('google_maps').then((data) => {
                this.keys = data.length ? data : [{name: 'AIzaSyDc5fJyy9BGpFE4t6kh_4dH1-WRYzKd_wI'}] ;
                resolve(true);
            });
        });
    }

    async loadApiScripts(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            if (this.loaded) { return resolve(true); }
            if (!this.keys) { await this.loadKeys(); }
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${this.keys[0].name}&libraries=places&language=it`;
            document.head.appendChild(script);
            script.onload = () => {
                this.loaded = true ;
                return resolve(true);
            };
            script.onerror = (error) => {
                reject(error);
                script.remove();
            };
        });
    }
}