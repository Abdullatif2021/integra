import { TranslateService } from '@ngx-translate/core';
import { FiltersService } from './../../../../service/filters.service';
import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ModalComponent} from '../../../../shared/modals/modal.component';
import {takeUntil} from 'rxjs/internal/operators';
import {Subject} from 'rxjs';
import {SnotifyService} from 'ng-snotify';
import {TranslateSelectorService} from '../../../../service/translate-selector-service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ActivityCreateService} from '../../service/activity-create.service';
import {ActionsService} from '../../../../service/actions.service';

@Component({
  selector: 'app-create-new-activity',
  templateUrl: './create-new-activity.component.html',
  styleUrls: ['./create-new-activity.component.css']
})
export class CreateNewActivityComponent extends ModalComponent implements OnInit, OnDestroy {

  subActivities: [any] = [{}];
  disabled = true ;
  @ViewChild('modalRef') modalRef ;
  @ViewChild('showMoreModal') _showMoreModal;
  @ViewChild('exitConfirmModal') _exit_confirm_modal;
  unsubscribe: Subject<void> = new Subject();
  activityId;
  operators = [] ;
  postmen = [];
  caps = [];
  categories = [];
  hasConflict = false ;
  activityName = null ;
  anyNotSaved = true ;
  saving = false ;
  allCapsLoaded = false ;
  allCategoriesLoaded = false ;
  addCap ;
  addCategory ;
  _show_more_items = [];
  constructor(
      private activityCreateService: ActivityCreateService,
      private snotifyService: SnotifyService,
      private filtersService: FiltersService,
      private translateSelectorService: TranslateSelectorService,
      private actionsService: ActionsService,
      private modalService: NgbModal,
      private translate: TranslateService
  ) {
    super();
    this.translateSelectorService.setDefaultLanuage();
  }

  ngOnInit() {
      this.init();
  }

  createActivity() {
      this.activityCreateService.createNewActivity(this.data.method).pipe(takeUntil(this.unsubscribe)).subscribe(
          data => {
              if (data.statusCode !== 200) {
                  this.snotifyService.error(data.message, { showProgressBar: false, timeout: 4000 });
                  return ;
              }
              this.disabled = false;
              this.activityId = data.data.id;
          }, error => {
              this.disabled = false;

              this.snotifyService.error(this.translate.instant
                ('home.modules.delivering_calender.addNoteToSet.error'), { showProgressBar: false, timeout: 4000 });
          }
      );
  }

  loadPostmen(subActivity) {
      this.activityCreateService.getPostmen(
          this.activityId, subActivity.startDate, subActivity.caps, subActivity.categories,
          subActivity.qtyPerDay, subActivity.nextSaturdayStatus, 0, 1, subActivity.id
      ).pipe(takeUntil(this.unsubscribe)).subscribe(
          data => {
              subActivity.postmenList = data.data;
          }, error => {
              this.snotifyService.error(this.translate.instant
                ('home.modules.delivering_calender.addNoteToSet.error'), { showProgressBar: false, timeout: 4000 });
          }
      );
  }

  loadRecommendedPostmen(subActivity) {
      this.activityCreateService.getPostmen(
          this.activityId, subActivity.startDate, subActivity.caps, subActivity.categories,
          subActivity.qtyPerDay, subActivity.nextSaturdayStatus, 1, 1, subActivity.id
      ).pipe(takeUntil(this.unsubscribe)).subscribe(
          data => {
              subActivity.recommendedPostmenList = data.data;
          }, error => {
              this.snotifyService.error(this.translate.instant
                ('home.modules.delivering_calender.addNoteToSet.error'), { showProgressBar: false, timeout: 4000 });
          }
      );
  }

  recommendedPostmenChanged(subActivity) {
      subActivity.recommendedPostmen = null ;
  }

  loadOperators() {
      this.activityCreateService.getOperators(1).pipe(takeUntil(this.unsubscribe)).subscribe(
          data => {
              this.operators = data.data;
          }, error => {
              this.snotifyService.error(this.translate.instant
                ('home.modules.delivering_calender.addNoteToSet.error'), { showProgressBar: false, timeout: 4000 });
          }
      );
  }

  loadCaps(subActivity, page = 1) {
      if (page < 2 || !this.caps) {
          this.caps = [] ;
      }
      if (page === 1) { this.allCapsLoaded = false ; }
      if (this.allCapsLoaded) { return ; }
      subActivity.capsPage = page ;
      subActivity.isCapsLoading = true ;
      this.activityCreateService.getAvailableCaps(this.activityId, page, subActivity.id)
          .pipe(takeUntil(this.unsubscribe)).subscribe(
          data => {
              if (!data.data || !data.data.length) {
                  this.allCapsLoaded = true ;
              }
              if (page > 1 && this.caps) {
                  this.caps = this.caps.concat(data.data);
              } else {
                  this.caps = data.data ;
              }
              subActivity.isCapsLoading = false ;
              // if (this.addCap) { this.caps.push(this.addCap); }
          }, error => {
              this.snotifyService.error(this.translate.instant
                ('home.modules.delivering_calender.addNoteToSet.error'), { showProgressBar: false, timeout: 4000 });
          });
  }

  init() {
      this.createActivity();
      this.loadOperators();
  }


  addNewSubActivity() {
    this.subActivities.push({});
    this.anyNotSaved = true ;
  }


  saveActivity(modal) {
      this.saving = true ;
      this.activityCreateService.updateActivity(this.activityId, this.activityName).subscribe(
          data => {
              if (data.statusCode === 200) {
                  this.saving = false ;
                  this.snotifyService.success(this.translate.instant
                    ('home.modules.delivering_calender.addNoteToSet.success1'), { showProgressBar: false, timeout: 4000 });
                  modal.close();
                  this.actionsService.reload.emit(true);
                  this.filtersService.updateFilters(this.saveActivity) ;
                  return ;
              }
              this.saving = false ;
              this.snotifyService.error(data.message, { showProgressBar: false, timeout: 4000 });
          }, error => {
              this.saving = false ;
              this.snotifyService.error(this.translate.instant
                ('home.modules.delivering_calender.addNoteToSet.error'), { showProgressBar: false, timeout: 4000 });
          }
      );
  }

  loadCategories(subActivity, page = 1) {
      subActivity.categoryPage = page ;
      subActivity.isCategoriesLoading = true ;
      if (page === 1) { this.allCategoriesLoaded = false ; }
      if (this.allCategoriesLoaded) { return ; }
      this.activityCreateService.getAvailableProductsCategories(this.activityId, subActivity.caps, subActivity.id, 1)
          .pipe(takeUntil(this.unsubscribe)).subscribe(
          data => {
              if (data.statusCode === 200) {
                  subActivity.isCategoriesLoading = false ;
                  this.saveSubActivity(subActivity);
                  if (subActivity.categories) {
                      subActivity.categories = subActivity.categories.filter((c) => data.data.find(i => i.id === c));
                  }
                  if (page > 1 && this.categories) {
                      if (!data.data || !data.data.length) {
                          this.allCategoriesLoaded = true ;
                      }
                      // if (this.addCategory) {
                      //     this.categories.push(this.addCategory);
                      // }
                      return this.categories = this.categories.concat(data.data);
                  }
                  this.categories = data.data;
                  if (this.addCategory) {
                      this.categories.push(this.addCategory);
                  }
                  return ;
              }
              this.snotifyService.error(data.message, { showProgressBar: false, timeout: 4000 });
          }, error => {
              this.snotifyService.error(this.translate.instant
                ('home.modules.delivering_calender.addNoteToSet.error'), { showProgressBar: false, timeout: 4000 });
          }
      );
  }

  capRemoved(event, subActivity) {
      if (subActivity.created && (!subActivity.caps || !subActivity.caps.length)) {
          this.addCap = event.value;
      }
  }

  categoryRemoved(event, subActivity) {
      if (subActivity.created && (!subActivity.categories || !subActivity.categories.length)) {
          this.addCategory = event.value;
      }
  }

  capsChanged(event, subActivity) {
      if (subActivity.created) {
          this.resetLastCaps(subActivity);
      }
      if (!subActivity.caps || !subActivity.caps.length) { return this.isReady(subActivity); }
      this.loadCategories(subActivity);
      this.loadTotalProducts(subActivity);
      this.saveSubActivity(subActivity);
  }

  resetLastCaps(subActivity) {
      if (!subActivity.created || !this.subActivities || !this.subActivities.length) { return ; }
      if (this.subActivities[this.subActivities.length - 1].created) { return ; }
      this.subActivities[this.subActivities.length - 1].caps = null;
      this.resetLastCategories(subActivity);
  }

  resetLastCategories(subActivity) {
      if (!subActivity.created || !this.subActivities || !this.subActivities.length) { return ; }
      if (this.subActivities[this.subActivities.length - 1].created) { return ; }
      this.subActivities[this.subActivities.length - 1].categories = null;
  }

  loadTotalProducts(subActivity) {
      if (!subActivity.categories || !subActivity.categories.length) { return  ; }
      this.activityCreateService.getTotalProducts(this.activityId, subActivity.caps, subActivity.categories, subActivity.id)
          .pipe(takeUntil(this.unsubscribe)).subscribe(
          data => {
              if (data.statusCode === 200) {
                  subActivity.totalQuantity = data.data;
                  return this.saveSubActivity(subActivity);
              }
              this.snotifyService.error(data.message, { showProgressBar: false, timeout: 4000 });
          }, error => {
              this.snotifyService.error(this.translate.instant
                ('home.modules.delivering_calender.addNoteToSet.error'), { showProgressBar: false, timeout: 4000 });
          }
      );
  }

  async categoriesChanged(subActivity) {
      if (!subActivity.categories || !subActivity.categories.length) {
          return this.isReady(subActivity);
      }
      await this.saveSubActivity(subActivity);
      this.loadTotalProducts(subActivity);
  }

  postmenChanged(subActivity) {
      this.saveSubActivity(subActivity);
  }

  loadEndDate(subActivity) {
      this.activityCreateService.getSubActivityEndDate(
          this.activityId, subActivity.startDate, subActivity.postmen, subActivity.caps,
          subActivity.categories, subActivity.qtyPerDay, subActivity.nextSaturdayStatus, subActivity.id
      ).pipe(takeUntil(this.unsubscribe)).subscribe(
              data => {
                  if (data.statusCode === 200) {
                      return subActivity.endDate = data.data.substr(0, 10).split('/').reverse().join('-');
                  }
                  this.snotifyService.error(data.message, { showProgressBar: false, timeout: 4000 });
              }, error => {
                this.snotifyService.error(this.translate.instant
                ('home.modules.delivering_calender.addNoteToSet.error'), { showProgressBar: false, timeout: 4000 });
          }
      );
  }

  startDateChanged(subActivity) {
      subActivity.endDate = null ;
      this.loadEndDate(subActivity);
      this.saveSubActivity(subActivity);
  }

  resetAll() {
      this.caps = [] ;
      this.categories = [];
  }

  productsPerDayChanged(subActivity) {
      if (this.isReadyToGetEndDate(subActivity)) {
          this.loadEndDate(subActivity);
          this.resetAll();
      }
      this.saveSubActivity(subActivity);
  }

  isReadyToGetEndDate(subActivity) {
      return subActivity.caps && subActivity.categories && subActivity.qtyPerDay && subActivity.qtyPerDay !== '0' && subActivity.postmen
          && subActivity.caps.length && subActivity.categories.length && subActivity.postmen.length && subActivity.startDate;
  }

  isReady(subActivity) {
      if (subActivity.caps && subActivity.categories && subActivity.qtyPerDay && subActivity.postmen
          && subActivity.operators && subActivity.caps.length && subActivity.categories.length
          && subActivity.qtyPerDay !== '0' && subActivity.postmen.length && subActivity.startDate) {
          subActivity.ready = true ;
          this.checkConflicts();
          return true ;
      }
      subActivity.ready = false ;
      this.checkConflicts();
      return false ;
  }

  checkConflicts() {
      let hasConflict = false ;
      if (!this.subActivities || !this.subActivities.length) { return this.hasConflict = false ; }
      this.subActivities.forEach(subActivity => {
         if (subActivity.created && !subActivity.ready) { hasConflict = true ; }
      });
      this.hasConflict = hasConflict ;
  }

  async saveSubActivity(subActivity) {
      if (this.isReadyToGetEndDate(subActivity)) {
          this.loadEndDate(subActivity);
          this.resetAll();
      }
      if (this.isReady(subActivity)) {
          if (subActivity.created) {
              return await this.updateSubActivity(subActivity);
          }
          return await this.createNewSubActivity(subActivity);
      }
  }

  createNewSubActivity(subActivity) {
      return new Promise((resolve) => {
          this.activityCreateService.createSubActivity(
              this.activityId, subActivity.operators, subActivity.postmen, subActivity.caps, subActivity.categories,
              subActivity.qtyPerDay, subActivity.nextSaturdayStatus ? true : false, subActivity.startDate).pipe(takeUntil(this.unsubscribe))
              .subscribe(
                  data => {
                      if (data.statusCode === 200) {
                          subActivity.created = true ;
                          subActivity.id = data.data.id;
                          this.addCap = null ;
                          this.addCategory = null ;
                          this.checkIfAnyNotSaved();
                          return resolve({data: data, error: 0});
                      }
                      this.checkIfAnyNotSaved();
                      this.snotifyService.error(data.message, { showProgressBar: false, timeout: 4000 });
                      return resolve({data: data, error: 1})
                  }, error => {
                      subActivity.created = true ;
                      subActivity.id = 1;
                      this.checkIfAnyNotSaved();
                      this.snotifyService.error(this.translate.instant
                      ('home.modules.delivering_calender.addNoteToSet.error'), { showProgressBar: false, timeout: 4000 });
                      return resolve({data: null, error: 1});
                  }
              );
      });
  }

  updateSubActivity(subActivity) {
      return new Promise((resolve) => {
          this.activityCreateService.updateSubActivity(
              subActivity.id, subActivity.operators, subActivity.postmen, subActivity.caps, subActivity.categories,
              subActivity.qtyPerDay, subActivity.nextSaturdayStatus ? true : false, subActivity.startDate).pipe(takeUntil(this.unsubscribe))
              .subscribe(
                  data => {
                      if (data && data.statusCode === 200) {
                          subActivity.created = true ;
                          this.addCap = null ;
                          this.addCategory = null ;
                          this.checkIfAnyNotSaved();
                          return resolve({data: data, error: 0});
                      }
                      this.snotifyService.error(data.message, { showProgressBar: false, timeout: 4000 });
                      return resolve({data: data, error: 1});
                  }, error => {
                      this.snotifyService.error(this.translate.instant
                      ('home.modules.delivering_calender.addNoteToSet.error'), { showProgressBar: false, timeout: 4000 });
                      return resolve({data: null,  error: error});
                  }
              );
      });
  }

  checkIfAnyNotSaved() {
      let anyNotSaved = false ;
      if (!this.subActivities) { return ; }
      this.subActivities.forEach((subActivity) => {
         if (!subActivity.created) {anyNotSaved = true ; }
      });
      this.anyNotSaved = anyNotSaved ;
  }

  openShowMoreModal(items, key) {
      this._show_more_items = items.map(i => i[key]);
      this.modalService.open(this._showMoreModal);
  }

  showExitConfirmModal() {
      this.modalService.open(this._exit_confirm_modal);
  }

  confirmExit(do_delete) {
      if (do_delete && this.activityId) {
          this.activityCreateService.deleteActivity(this.activityId).subscribe(
              data => {
                  this.actionsService.reload.emit(true);
              },
              error => {
                  console.log(error);
              }
          );
      } else {
          this.actionsService.reload.emit(true);
      }
      this.modalService.dismissAll();
  }

  deleteLast() {
      this.subActivities.pop();
      this.checkIfAnyNotSaved();
  }

  ngOnDestroy() {
      this.unsubscribe.next();
      this.unsubscribe.complete();
  }
}
