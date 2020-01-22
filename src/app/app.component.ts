import {Component, HostListener} from '@angular/core';
import {BackProcessingService} from './service/back-processing.service';
import {LocatingService} from './service/locating/locating.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent {

    constructor(private backProcessingService: BackProcessingService, private locatingService: LocatingService) {
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

}
