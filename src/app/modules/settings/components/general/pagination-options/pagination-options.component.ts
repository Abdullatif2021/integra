import {Component, OnDestroy, OnInit} from '@angular/core';
import {SettingsService} from '../../../../../service/settings.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/internal/operators';
import {ApiResponseInterface} from '../../../../../core/models/api-response.interface';
import { TranslateService } from '@ngx-translate/core';
import {TranslateSelectorService} from '../../../../../service/translate-selector-service';

@Component({
  selector: 'app-pagination-options',
  templateUrl: './pagination-options.component.html',
  styleUrls: ['./pagination-options.component.css']
})
export class PaginationOptionsComponent implements OnInit, OnDestroy {


  loading = true ;
  unsubscribe: Subject<void> = new Subject();
  data;
  constructor(
    private settingsService: SettingsService ,
    private translate: TranslateService,
    private translateSelectorService: TranslateSelectorService,
    ) {
        this.translateSelectorService.setDefaultLanuage();
    }
  ngOnInit() {
    this.settingsService.getPaginationOptions().pipe(takeUntil(this.unsubscribe)).subscribe((res: any) => {
            if (res.success) {
                this.data = res.data ;
                this.loading = false ;
            }
        }
    );
  }

  edit(event, key) {
    this.data[key] = event.target.value ;
    this.settingsService.updatePaginationOptions(this.data.get_street_pagination, this.data.get_tree_pagination)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((result) => {
          console.log(result);
        });
  }

  ngOnDestroy() {
      this.unsubscribe.next();
      this.unsubscribe.complete();
  }

}
