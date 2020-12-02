import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ModalComponent} from '../../../../shared/modals/modal.component';
import {ActionsService} from '../../../../service/actions.service';
import {ActivitiesService} from '../../service/activities.service';
import {takeUntil} from 'rxjs/internal/operators';
import {Subject} from 'rxjs';
import {SnotifyService} from 'ng-snotify';

@Component({
  selector: 'app-create-new-activity',
  templateUrl: './create-new-activity.component.html',
  styleUrls: ['./create-new-activity.component.css']
})
export class CreateNewActivityComponent extends ModalComponent implements OnInit, OnDestroy {


  subActivities: [any] = [{}];
  disabled = true ;
  @ViewChild('modalRef') modalRef ;
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

  constructor(
      private activitiesService: ActivitiesService,
      private snotifyService: SnotifyService,
  ) {
    super();
  }

  ngOnInit() {
      this.init();
  }

  createActivity() {
      this.activitiesService.createNewActivity(this.data.method).pipe(takeUntil(this.unsubscribe)).subscribe(
          data => {
              if (data.statusCode !== 200) {
                  this.snotifyService.error(data.message, { showProgressBar: false, timeout: 4000 });
                  return ;
              }
              this.disabled = false;
              this.activityId = data.data.id;
          }, error => {
              this.disabled = false;

              this.snotifyService.error('Something went wrong !', { showProgressBar: false, timeout: 4000 });
          }
      );
  }

  loadPostmen(subActivity) {
      this.activitiesService.getPostmen(
          this.activityId, subActivity.startDate, subActivity.caps, subActivity.categories,
          subActivity.qtyPerDay, subActivity.nextSaturdayStatus, 0, 1, subActivity.id
      ).pipe(takeUntil(this.unsubscribe)).subscribe(
          data => {
              subActivity.postmenList = data.data;
          }, error => {
              this.snotifyService.error('Something went wrong !', { showProgressBar: false, timeout: 4000 });
          }
      );
  }

  loadRecommendedPostmen(subActivity) {
      this.activitiesService.getPostmen(
          this.activityId, subActivity.startDate, subActivity.caps, subActivity.categories,
          subActivity.qtyPerDay, subActivity.nextSaturdayStatus, 1, 1, subActivity.id
      ).pipe(takeUntil(this.unsubscribe)).subscribe(
          data => {
              subActivity.recommendedPostmenList = data.data;
          }, error => {
              this.snotifyService.error('Something went wrong !', { showProgressBar: false, timeout: 4000 });
          }
      );
  }

  recommendedPostmenChanged(subActivity) {
      subActivity.recommendedPostmen = null ;
  }

  loadOperators() {
      this.activitiesService.getOperators(1).pipe(takeUntil(this.unsubscribe)).subscribe(
          data => {
              this.operators = data.data;
          }, error => {
              this.snotifyService.error('Something went wrong !', { showProgressBar: false, timeout: 4000 });
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
      this.activitiesService.getAvailableCaps(this.activityId, page, subActivity.id)
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
              this.snotifyService.error('Something went wrong !', { showProgressBar: false, timeout: 4000 });
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
      this.activitiesService.updateActivity(this.activityId, this.activityName).subscribe(
          data => {
              if (data.statusCode === 200) {
                  this.saving = false ;
                  this.snotifyService.success('Activity Created Successfully', { showProgressBar: false, timeout: 4000 });
                  modal.close();
                  return ;
              }
              this.saving = false ;
              this.snotifyService.error(data.message, { showProgressBar: false, timeout: 4000 });
          }, error => {
              this.saving = false ;
              this.snotifyService.error('Something went wrong !', { showProgressBar: false, timeout: 4000 });
          }
      );
  }

  loadCategories(subActivity, page = 1) {
      subActivity.categoryPage = page ;
      subActivity.isCategoriesLoading = true ;
      if (page === 1) { this.allCategoriesLoaded = false ; }
      if (this.allCategoriesLoaded) { return ; }
      this.activitiesService.getAvailableProductsCategories(this.activityId, subActivity.caps, subActivity.id, 1)
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
              this.snotifyService.error('Something went wrong !', { showProgressBar: false, timeout: 4000 });
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
      this.activitiesService.getTotalProducts(this.activityId, subActivity.caps, subActivity.categories)
          .pipe(takeUntil(this.unsubscribe)).subscribe(
          data => {
              if (data.statusCode === 200) {
                  subActivity.totalQuantity = data.data;
                  return this.saveSubActivity(subActivity);
              }
              this.snotifyService.error(data.message, { showProgressBar: false, timeout: 4000 });
          }, error => {
              this.snotifyService.error('Something went wrong !', { showProgressBar: false, timeout: 4000 });
          }
      );
  }

  categoriesChanged(subActivity) {
      if (!subActivity.categories || !subActivity.categories.length) {
          return this.isReady(subActivity);
      }
      this.loadTotalProducts(subActivity);
      this.saveSubActivity(subActivity);
  }

  postmenChanged(subActivity) {
      this.saveSubActivity(subActivity);
  }

  loadEndDate(subActivity) {
      this.activitiesService.getSubActivityEndDate(
          this.activityId, subActivity.startDate, subActivity.postmen, subActivity.caps,
          subActivity.categories, subActivity.qtyPerDay, subActivity.nextSaturdayStatus
      ).pipe(takeUntil(this.unsubscribe)).subscribe(
              data => {
                  if (data.statusCode === 200) {
                      return subActivity.endDate = data.data.substr(0, 10).split('/').reverse().join('-');
                  }
                  this.snotifyService.error(data.message, { showProgressBar: false, timeout: 4000 });
              }, error => {
                this.snotifyService.error('Something went wrong !', { showProgressBar: false, timeout: 4000 });
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

  saveSubActivity(subActivity) {
      if (this.isReadyToGetEndDate(subActivity)) {
          this.loadEndDate(subActivity);
          this.resetAll();
      }
      if (this.isReady(subActivity)) {
          if (subActivity.created) {
              return this.updateSubActivity(subActivity);
          }
          return this.createNewSubActivity(subActivity);
      }
  }

  createNewSubActivity(subActivity) {
      this.activitiesService.createSubActivity(
          this.activityId, subActivity.operators, subActivity.postmen, subActivity.caps, subActivity.categories,
          subActivity.qtyPerDay, subActivity.nextSaturdayStatus ? true : false, subActivity.startDate).pipe(takeUntil(this.unsubscribe))
          .subscribe(
              data => {
                  if (data.statusCode === 200) {
                      subActivity.created = true ;
                      subActivity.id = data.data.id;
                      this.addCap = null ;
                      this.addCategory = null ;
                      return ;
                  }
                  this.checkIfAnyNotSaved();
                  this.snotifyService.error(data.message, { showProgressBar: false, timeout: 4000 });
              }, error => {
                  subActivity.created = true ;
                  subActivity.id = 1;
                  this.checkIfAnyNotSaved();
                  this.snotifyService.error('something went wrong', { showProgressBar: false, timeout: 4000 });
              }
          );
  }

  updateSubActivity(subActivity) {
      this.activitiesService.updateSubActivity(
          subActivity.id, subActivity.operators, subActivity.postmen, subActivity.caps, subActivity.categories,
          subActivity.qtyPerDay, subActivity.nextSaturdayStatus ? true : false, subActivity.startDate).pipe(takeUntil(this.unsubscribe))
          .subscribe(
              data => {
                  if (data && data.statusCode === 200) {
                      subActivity.created = true ;
                      console.log('add cap was cleared');
                      this.addCap = null ;
                      this.addCategory = null ;
                      return this.checkIfAnyNotSaved();
                  }
                  this.snotifyService.error(data.message, { showProgressBar: false, timeout: 4000 });
              }, error => {
                  this.snotifyService.error('something went wrong', { showProgressBar: false, timeout: 4000 });
              }
          );
  }

  checkIfAnyNotSaved() {
      let anyNotSaved = false ;
      if (!this.subActivities) { return ; }
      this.subActivities.forEach((subActivity) => {
         if (!subActivity.created) {anyNotSaved = true ; }
      });
      this.anyNotSaved = anyNotSaved ;
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
