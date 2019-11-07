import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LoadingService} from '../../../service/loading.service';
import {GoogleGeocodeService} from './google.geocode.service';
import {TuttocittaGeocodeService} from './tuttocitta.geocode.service';
import {MapBoxGeocodeService} from './map-box.geocode.service';
import {LocatedRecipientInterface, RecipientLocationInterface} from '../../../core/models/recipient.interface';
import {ApiResponseInterface} from '../../../core/models/api-response.interface';
import {AppConfig} from '../../../config/app.config';
import {SnotifyService} from 'ng-snotify';
import {RecipientsService} from '../../../service/recipients.service';

@Injectable()
export class LocatingService {

    constructor(
        private http: HttpClient,
        private recipientService: RecipientsService,
        private loadingService: LoadingService,
        private googleGeocodeService: GoogleGeocodeService,
        private tuttocittaGeocodeService: TuttocittaGeocodeService,
        private mapBoxGeocodeService: MapBoxGeocodeService,
        private snotifyService: SnotifyService,
    ) {}

    // output events .
    relocate = new EventEmitter<RecipientLocationInterface>();
    treeCreated = new EventEmitter<boolean>();
    // the located items
    recipients = [] ;
    // the items that no provider was able to locate
    nfound = [] ;
    // the items that was manually changed by the user and waiting to be relocated.
    fixed = [] ;
    // the pre dispatch that is being located
    preDispatch ;

    async fix(recipient: RecipientLocationInterface, address: string, lat: number, lng: number, skip = false) {
        // define pseudo located recipient
        const _recipient = <LocatedRecipientInterface>{id: recipient.id, name: null, is_fixed: true} ;
        if (skip) {
            // if the user wants to skip this recipient
            _recipient.is_fixed = false ;
            this.recipients.push(_recipient) ;
        } else if (lat && lng) {
            // if the user entered the lat,lng manually
            _recipient.lat = lat ;
            _recipient.long = lng ;
            this.recipients.push(_recipient);
        } else {
            // if the user had entered a new address
            const _address = address.split(',');
            // the inputted address, can be a house number, street, cap... in this exact order
            if (_address[0] && _address[0].trim()) {
                recipient.street = _address[1].trim() ;
            }
            if (_address[1] && _address[1].trim()) {
                recipient.houseNumber = _address[0].trim() ;
            }
            if (_address[2] && _address[2].trim()) {
                recipient.cap = _address[2].trim() ;
            }

            // queue this recipient to be relocated.
            this.fixed.push(recipient) ;
        }

        // remove the items that was skipped or manually located from the unlocated items
        this.nfound = this.nfound.filter((elm) => elm.id !== recipient.id);

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
        } else if (this.recipients.length) { // else if there is new located items, save them
            await this.save();
        }

        // if the process is done, create the tree.
        if (!this.recipients.length && !this.fixed.length && !this.nfound.length) {
            await this.createTree();
            this.snotifyService.success('All recipients are localized !', { showProgressBar: false});
        }
    }

    async startLocating(preDispatch) {

        let page = 0;
        this.recipients = [] ;
        this.nfound = [] ;
        this.fixed = [] ;

        this.preDispatch = preDispatch ;
        this.loadingService.setLoadingState({state: true, message: 'initializing...', progress: 0, autProgress: false});
        while (true) {
            this.loadingService.message('Fetching routes data to process');
            const recipients = await this.recipientService.getPreDispatchToLocateRecipients(preDispatch, ++page).toPromise();
            if (recipients.statusCode !== 200 || ! await this.process(recipients.data) ) {
                break ;
            }
        }
        this.loadingService.state(false);
        this.recipients = [] ;
        if (this.nfound.length) {
            this.relocate.emit(this.nfound[0]) ;
        }

        if (!this.recipients.length && !this.fixed.length && !this.nfound.length) {
            await this.createTree();
            this.snotifyService.success('All recipients are localized !', { showProgressBar: false});
        }
    }

    async process(recipients) {

        if (!recipients.length) { return ; }
        let processed = 0 ;
        let result ;

        for (let i = 0; i < recipients.length; ++i) {
            this.loadingService
                .message(`Locating '${recipients[i].street}, ${recipients[i].houseNumber}, ${recipients[i].cap} ${recipients[i].city}'`);
            if ( result = await this.tuttocittaGeocodeService.locate(recipients[i]) ) {
                this.recipients.push(result);
                console.log(`${recipients[i].street} located using google`);
            } else if ( result = await this.googleGeocodeService.locate(recipients[i]) ) {
                this.recipients.push(result);
                console.log(`${recipients[i].street} located using google`);
            } else if ( result = await this.mapBoxGeocodeService.locate(recipients[i])) {
                this.recipients.push(result);
                console.log(`${recipients[i].street} located using MapBox`);
            } else {
                this.nfound.push(recipients[i]);
            }
            this.loadingService.progress((++processed / recipients.length) * 100);
        }
        this.loadingService.message(`Saving data...`);
        console.log(this.recipients);
        await this.save();
        return true ;
    }

    async save(): Promise<any> {
        return new Promise<any>(async(resolve, reject) => {
            if (!this.recipients.length) {
                return resolve(true);
            }
            this.http.post<ApiResponseInterface>(AppConfig.endpoints.updateStreetsData, {'streets': this.recipients})
                .subscribe(
                    data => { this.recipients = []; resolve(data) ; },
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

}
