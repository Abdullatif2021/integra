import { LAZY_MAPS_API_CONFIG, LazyMapsAPILoader } from '@agm/core';
import { DocumentRef, WindowRef } from '@agm/core/utils/browser-globals';
import { Inject, Injectable } from '@angular/core';
import {GoogleApiService} from './google.api.service';
import {GoogleMapsScriptProtocol, LazyMapsAPILoaderConfigLiteral} from '@agm/core/services/maps-api-loader/lazy-maps-api-loader';

@Injectable()
export class IntegraaLazyMapApiLoaderService extends LazyMapsAPILoader implements LazyMapsAPILoaderConfigLiteral {

    public apiKey?: string;
    public clientId?: string;
    public channel?: string;
    public apiVersion?: string;
    public hostAndPath?: string;
    public protocol?: GoogleMapsScriptProtocol;
    public libraries?: string[];
    public region?: string;
    public language = 'IT';

    constructor(
        private googleApiService: GoogleApiService,
        @Inject(LAZY_MAPS_API_CONFIG) config: any,
        w: WindowRef,
        d: DocumentRef
    ) {
        super(config, w, d);
    }

    async load(): Promise<any> {
        if (this._scriptLoadingPromise) {
            return this._scriptLoadingPromise;
        }
        const key = await this.googleApiService.getKey();
        this._config = { ...this._config, apiKey: key.name };
        return super.load();
    }
}
