import {Component, HostListener} from '@angular/core';
import {BackProcessingService} from './service/back-processing.service';
import {LocatingService} from './service/locating/locating.service';
import {NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {NgbDateITParserFormatter} from './shared/provider/ngb-date-it-parser-formatter';
import {PreDispatchGlobalActionsService} from './service/pre-dispatch-global-actions.service';
import {BuildingLocationInterface} from './core/models/building.interface';
import {GoogleApiService} from './shared/service/google.api.service';
import {PreDispatchService} from './service/pre-dispatch.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [{provide: NgbDateParserFormatter, useClass: NgbDateITParserFormatter}]
})
export class AppComponent {

    constructor(
        private backProcessingService: BackProcessingService,
        private locatingService: LocatingService,
        private preDispatchGlobalActionsService: PreDispatchGlobalActionsService,
        private googleApiService: GoogleApiService,
        private preDispatchService: PreDispatchService
    ) {
        this.googleApiService.loadApiScripts();
    }
    @HostListener('window:beforeunload', ['$event'])
    beforeunload(event: Event) {
        event.preventDefault();
        this.locatingService.stopAllLocatingProcess() ;
        const msg = this.backProcessingService.checkLeaving();
        if (msg) {
            event.returnValue = true;
            return msg;
        }
        return null ;
    }

    @HostListener('window:message', ['$event'])
    onMessage(e) {
        if (e.data.runPreDispatch) {
            this.preDispatchGlobalActionsService.startPreDispatchAction(e.data.runPreDispatch, e.data.data);
        } else if (e.data.handleSaysHi) {
            this.preDispatchGlobalActionsService.modalMessageRecived(e.data.handleSaysHi.message);
        } else if (e.data.locatingFixItems) {
            this.preDispatchGlobalActionsService.fixLocatingItems(e.data);
        } else if (e.data.pausePreDispatch) {
            console.log('here pause ----', e.data.pausePreDispatch);
            this.backProcessingService.ultimatePause(e.data.pausePreDispatch.id);
        }
    }

}
