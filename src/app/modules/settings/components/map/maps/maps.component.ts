import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiResponseInterface} from '../../../../../core/models/api-response.interface';
import {SettingsService} from '../../../../../service/settings.service';
import {first, withLatestFrom} from 'rxjs/internal/operators';

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
    settings = [];
    provider: number ;
    loading = true ;

    ngOnInit() {
        this.activatedRoute.params.subscribe( (params) => {
            this.provider = params.provider ;
            this.loadData();
        });
    }

    loadData() {
        this.loading = true;
        this.settingsService.getProviderKeys(this.provider).subscribe((res: ApiResponseInterface) => {
             this.settings = res.data ;
             this.loading = false ;
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
        this.settingsService.editProviderKey(setting, this.provider).subscribe();
    }

    create() {
        this.settingsService.createEmpty(this.provider).subscribe((res: ApiResponseInterface) => {
           if (res.status === 'success') {
               this.settings = res.data;
           }
        });
    }
}
