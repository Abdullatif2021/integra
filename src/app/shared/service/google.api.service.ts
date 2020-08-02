import {SettingsService} from '../../service/settings.service';
import {HttpClient} from '@angular/common/http';
import {EventEmitter, Injectable} from '@angular/core';

@Injectable()
export class GoogleApiService {


    constructor(private http: HttpClient, private settingsService: SettingsService) {
    }

    keys: any;
    key_at = 0;
    loaded = false ;
    script: any ;
    keyChanges = new EventEmitter<any>();

    private async loadKeys(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.settingsService.getMapProviderKey('google_maps').then((data) => {
                this.keys = data.length ? data : [{name: 'AIzaSyDc5fJyy9BGpFE4t6kh_4dH1-WRYzKd_wI'}] ;
                resolve(true);
            });
        });
    }

    async getKey(next = false) {
        await this.makeSureKeysAreOk() ;
        this.key_at -= next ? -1 : 0;
        this.keyChanges.emit(this.keys[this.key_at]);
        return this.keys[this.key_at];
    }

    async makeSureKeysAreOk() {
        if (!this.keys) { await this.loadKeys(); }
        return this.keys && this.keys.length ;
    }

    async loadApiScripts(force = false): Promise<any> {
        return new Promise(async (resolve, reject) => {
            if (this.loaded && !force) { return resolve(true); }
            await this.makeSureKeysAreOk() ;
            this.script = document.createElement('script');
            (<any>window).gm_authFailure = () => {
                this.handleAuthFailure();
            }
            const j = Math.floor(Math.random() * 1000) ;
            const key = this.keys[this.key_at].name ;
            this.script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places&language=it&j=${j}`;
            document.head.appendChild(this.script);
            this.script.onload = () => {
                this.loaded = true ;
                return resolve(true);
            };
            this.script.onerror = (error) => {
                reject(error);
                this.script.remove();
            };
        });
    }

    handleAuthFailure() {
        return this.loadJsUsingNextKey();
    }

    async loadJsUsingNextKey() {
        this.script.remove();
        if (this.key_at < this.keys.length - 1) {
            let loaded = true ;
            this.key_at++;
            this.keyChanges.emit(this.keys[this.key_at]);
            delete (<any>window).google;
            await this.loadApiScripts(true).catch(e => {
                loaded = false ;
            });
            return loaded;
        }
        return false;
    }
}