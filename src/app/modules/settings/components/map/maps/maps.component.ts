import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot} from '@angular/router';
import {ApiResponseInterface} from '../../../../../core/models/api-response.interface';
import {SettingsService} from '../../../../../service/settings.service';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit {

    constructor(
        private activatedRoute: ActivatedRoute,
        private settingsService: SettingsService
    ) { }
    counter = -9999 ;
    settings = [];
    provider: number ;

    ngOnInit() {
        this.activatedRoute.data.subscribe((d) => {
            this.settings = d.res.data ;
        });
        this.activatedRoute.params.subscribe((params) => {
            this.provider = params.provider ;
        });
    }

    delete(setting) {
        this.settingsService.deleteProviderKey(setting.id).subscribe((res: ApiResponseInterface) => {
            if (res.status === 'success') {
                this.settings = this.settings.filter((elm) => {
                    return setting.id !== elm.id ;
                });
            }
        });
    }

    edit(event, field, setting) {
        setting[field] = event.target.value ;
        console.log(setting[field]) ;
        this.settingsService.editProviderKey(setting, this.provider).subscribe();
    }

    create() {
        this.counter++ ;
        this.settingsService.createEmpty(this.provider).subscribe((res: ApiResponseInterface) => {
           if (res.status === 'success') {
               this.settings = res.data;
           }
        });
    }
}
