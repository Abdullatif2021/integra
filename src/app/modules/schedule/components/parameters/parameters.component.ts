import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PlanningService} from '../../../../service/planning/planning.service';
import {ActivatedRoute} from '@angular/router';
import {NgbCalendar, NgbDate, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {PreDispatchService} from '../../../../service/pre-dispatch.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/internal/operators';
import {RecipientsService} from '../../../../service/recipients.service';
import {ScheduleService} from '../../service/schedule.service';
import {SnotifyService} from 'ng-snotify';
import {BackProcessingService} from '../../../../service/back-processing.service';
import {PreDispatchGlobalActionsService} from '../../../../service/pre-dispatch-global-actions.service';

@Component({
    selector: 'app-parameter',
    templateUrl: './parameters.component.html',
    styleUrls: ['./parameters.component.css']
})
export class ParametersComponent implements OnInit, OnDestroy {


    constructor(
        private planningService: PlanningService,
        private route: ActivatedRoute,
        private preDispatchService: PreDispatchService,
        private modalService: NgbModal,
        public recipientsService: RecipientsService,
        private scheduleService: ScheduleService,
        private snotifyService: SnotifyService,
        private backProcessingService: BackProcessingService,
        private preDispatchGlobalActionsService: PreDispatchGlobalActionsService
    ) {
        this.preDispatch = this.route.snapshot.parent.params.id;
        this.preDispatchData = this.route.snapshot.parent.data.data ;

    }

    options = {
        serviceTimeOptions: [
            {label: 'Default', value: ''},
            {label: '5 Minuti', value: '5'},
            {label: '10 Minuti', value: '10'},
            {label: '15 Minuti', value: '15'},
            {label: '20 Minuti', value: '20'},
            {label: '30 Minuti', value: '30'},
        ],
        travelModes: [
            {label: 'Moto', value: 'bicycle'},
            {label: 'Auto', value: 'car'}
        ],
        devision: [20, 50, 70, 100],
        target:  [{label: 'Percorso più corto', value: 'short_path'}, {label: 'Tempo minore', value: 'less_time'}],
        mixedCities:  [{label: 'Consentito', value: true}, {label: 'Non consentito', value: false}],
        pathStart:  [
            {label: 'Dal più vicino al più lontano', value: 'from_start_to_end'},
            {label: 'Dal più lontano al più vicino', value: 'from_end_to_start'}
        ],
    };

    subscription;
    data: any = {
        service_time_single: '',
        service_time_multiple: '',
        travel_mode: '',
        deviation: '',
        target: '',
        mixed_cities: '',
        path_start: '',
        departure_date: '',
        departure_time: '',
        pause_time_start: '',
        pause_time_end: '',
        post_man_number: '',
        hours_per_day_hour: '',
        hours_per_day_minute: '',
        max_product: '',
    };

    preDispatch;
    preDispatchData;
    visibleView;

    // match with other preDispatches
    preDispatchesList = [] ;
    preDispatchesPage = 1 ;
    selectedPreDispatch;
    preDispatchesLoaded = false ;
    matchRateData;

    options2Data = {
        departure_date: null,
        departure_time: null
    };
    // modals

    @ViewChild('verylowmatchesModal') verylowmatchesModal: NgbModalRef ;
    @ViewChild('lowmatchesModal') lowmatchesModal: NgbModalRef ;
    @ViewChild('fullmatchesModal') fullmatchesModal: NgbModalRef ;

    views = [{value: 1, label: 'Secondo i parametri impostati'}, {value: 2, label: 'Secondo predistinta pianificata'}];
    unsubscribe: Subject<void> = new Subject();
    errors = {} ;


    ngOnInit() {
        this.visibleView = this.views[0];
        // update the pre-dispatch data in case it was outdated, then initiate the form data object.
        this.preDispatchService.getPreDispatchData(this.preDispatchData.id).subscribe(
            res => {
                this.preDispatchData = res.data;
                this.updateDataObject();
            },
            error => {
                this.snotifyService.error('Qualcosa è andato storto!!');
            }
        );
        this.scheduleService.nextButtonClicked.pipe(takeUntil(this.unsubscribe)).subscribe(
            data => {
                if (this.visibleView.value === 2) {
                    this.changePreDispatch();
                } else {
                    this.save();
                }
            }
        );
        this.scheduleService.preDispatchDataChanged.pipe(takeUntil(this.unsubscribe)).subscribe(
            preDispatchData => {
                this.preDispatchData = preDispatchData;
            }
        );
        this.preDispatchGlobalActionsService.planningErrors.pipe(takeUntil(this.unsubscribe)).subscribe((e) => {
            this.checkErrors();
        });
    }

    updateDataObject() {
        let departure_date = this.preDispatchData.departure_date ? this.preDispatchData.departure_date.split(' ') : [] ;
        const departure_time = departure_date.length > 1 ? departure_date[1].substr(0, 5) : null;
        departure_date = departure_date[0] ? departure_date[0].split('-') : false  ;
        departure_date = departure_date ?
            <NgbDate>{year: parseInt(departure_date[0], 10), month: parseInt(departure_date[1], 10),
                day: parseInt(departure_date[2], 10) } : false;
        this.data = {
            service_time_single: this.findOption('service_time_single', this.options.serviceTimeOptions),
            service_time_multiple: this.findOption('service_time_multiple', this.options.serviceTimeOptions),
            travel_mode: this.findOption('travel_mode', this.options.travelModes),
            deviation: this.preDispatchData.deviation,
            target: this.findOption('target', this.options.target),
            mixed_cities: this.findOption('mixed_cities', this.options.mixedCities),
            path_start: this.findOption('path_start', this.options.pathStart),
            departure_date: departure_date,
            departure_time: departure_time,
            pause_time_start: this.preDispatchData.pause_time_start ? this.preDispatchData.pause_time_start.substr(0, 5) : null,
            pause_time_end: this.preDispatchData.pause_time_end ? this.preDispatchData.pause_time_end.substr(0, 5) : null,
            post_man_number: this.preDispatchData.post_man_number,
            hours_per_day_hour: this.preDispatchData.hours_per_day_hour,
            hours_per_day_minute: this.preDispatchData.hours_per_day_minute,
            max_product: this.preDispatchData.max_product,
        };
    }

    findOption(option, options) {
        for (const [key, _option] of Object.entries(options)) {
            if (_option['value'] === this.preDispatchData[option]) {
                return _option ;
            }
        }
        return ;
    }

    formatTime(time, key) {
        time = time.split(':');
        time.length < 2 ? time.push('00') : (time.length > 2 ? time = [time[0], time[1]] : time = time);
        time = time.map((v, j) => {
            v = v.replace(/\s/g, '');
            v = parseInt(v, 10) ? (v.length > 2 ? v[0] + v[1] : v) : '00';
            v = v > (j ? 60 : 24) || v < 0 ? (v > (j ? 60 : 24) ? (j ? '60' : '24') : '00') : v;
            return v.length === 1 ? '0' + v : v;
        });
        this.data[key] = time.join(':');
        return this.data[key];
    }

    timeChangeFormat(event) {
        if (event.code === 'Backspace') { return; }
        let time = event.target.value ;
        if (time[time.length - 1] === ':' && time.length === 3) { return ; }
        if (time[time.length - 1] === ':' && time.length < 3) { return event.target.value = (time.length === 2 ? '0' : '00') + time ; }
        if (!/^\d+$/.test(time[time.length - 1])) { time = time.substr(0, event.target.value.length - 1); }
        if (parseInt(time, 10) > 24 ) { time = 24; }
        if (parseInt(time, 10) < 0) { time = 0; }
        if (time.length === 2) { time += ':'; }
        event.target.value = time ;
    }
    validateNumber(value, key, min: any = false, max: any = false, minLength = null) {
        if (!parseInt(value, 10)) {
            value = '0';
        }
        value = max !== false && parseInt(value, 10) > max ? '' + max :  ( min !== false && parseInt(value, 10) < min ? '' + min : value);
        while (minLength && value.length < minLength) {
            value = '0' + value ;
        }
        this.data[key] = value ;
        return value;
    }

    getData() {
        const data: any = {...this.data} ;
        data['departure_date'] = (data.departure_date ? (typeof data.departure_date === 'object' ?
            Object.values(data.departure_date).join('/') :  data.departure_date) : '') +
            (data.departure_time ? ' ' + data.departure_time : '');
        data['hours_per_day'] = (data.hours_per_day_hour ? parseInt(data.hours_per_day_hour, 10)  : 0 ) +
            (data.hours_per_day_minute ? parseInt(data.hours_per_day_minute, 10) / Math.pow(10, data.hours_per_day_minute.length) : 0);
        data['pre_dispatch_id'] = this.preDispatch ;
        for (const [key, value] of Object.entries(data)) {
            if (typeof value === 'object') {
                data[key] = value ? value['value'] : null ;
            }
        }
        return data ;
    }


    changeView() {
        if (this.visibleView.value === 2 && !this.preDispatchesList.length) {
           this.loadAllPreDispatches();
        }
    }

    loadAllPreDispatches(reset = true, search = '') {
        this.preDispatchesLoaded = true ;
        if (reset) {
            this.preDispatchesPage = 1;
            this.preDispatchesList = [{skeleton: true}, {skeleton: true}, {skeleton: true}];
        } else {
            this.preDispatchesList.push({skeleton: true});
        }
        this.subscription = this.preDispatchService.getPlannedPreDispatches(this.preDispatchesPage, '50', search).subscribe(
            data => {
                if (data.data.length) {
                    this.preDispatchesLoaded = false ;
                    if (reset) {
                        this.preDispatchesList = data.data ;
                    } else {
                        this.preDispatchesList.pop();
                        this.preDispatchesList = this.preDispatchesList.concat(data.data) ;
                    }
                } else if (!data.data.length && !reset) {
                    this.preDispatchesList.pop();
                }
            });
    }

    loadMorePreDispatched() {
        if (this.preDispatchesLoaded) {
            return ;
        }
        this.preDispatchesPage++;
        this.loadAllPreDispatches(false, '');
    }

    selectPreDispatches(item) {
        this.selectedPreDispatch = item ;
    }

    searchPreDispatches(event) {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        this.loadAllPreDispatches(true, event);
    }

    async changePreDispatch(force = false, notMatchesOption = null, modal = null) {

        if (!this.selectedPreDispatch) {
            return ;
        }

        if (force) {
            if (modal && this.options2Data.departure_date && this.options2Data.departure_time) {
                modal.close();
            } else if (!this.options2Data.departure_date || !this.options2Data.departure_time) {
                return ;
            }
            const departureDate = (this.options2Data.departure_date ? (typeof this.options2Data.departure_date === 'object' ?
                Object.values(this.options2Data.departure_date).join('-') :  this.options2Data.departure_date) : '') +
                (this.options2Data.departure_time ? ' ' + this.options2Data.departure_time : '');
            await this.planningService.confirmPlanning(this.preDispatch, this.selectedPreDispatch.id, notMatchesOption, departureDate,
                (success) => {},
                (error) => {
                    if (error.statusCode === 201) {
                        this.preDispatchData.status = 'drawing_paths'; // force preDispatch status.
                        return window.parent.postMessage({runPreDispatch: this.preDispatchData, data: {ignoreDivide: true}}, '*');
                    }
                });
            return ;
            // return this.preDispatchGlobalActionsService.startPreDispatchAction(this.preDispatchData, {ignoreDivide: true});
        }

        this.planningService.getMatchesRate(this.preDispatch, this.selectedPreDispatch.id).subscribe(
            data => {
                this.matchRateData = data ;
                if (data.data.percent === 100) {
                    this.modalService.open(this.fullmatchesModal, {backdrop: 'static' });
                } else if (data.data.percent > 79) {
                    this.modalService.open(this.lowmatchesModal, {backdrop: 'static' });
                } else {
                    this.modalService.open(this.verylowmatchesModal, {backdrop: 'static' });
                }

            }, error => {
                console.log(error);
            }
        );
    }

    async save() {
        if (this.backProcessingService.isRunning('planning-' + this.preDispatch)) {
            this.snotifyService.warning('already in planning !', {
                position: 'centerTop',
                showProgressBar: false,
            });
        }
        await this.planningService.saveParameters(this.getData(), () => {
            if (this.preDispatchData.status === 'localized') {
                this.snotifyService.error('No Items to plan !', {
                    position: 'centerTop',
                    timeout: 6000,
                    showProgressBar: false,
                });
                return 'Data Saved !';
            }
            if (['notPlanned', 'in_grouping', 'in_localize'].find((elm) => elm === this.preDispatchData.status)) {
                this.snotifyService.warning('Per iniziare la pianificazione, è necessario localizzare questa pre-distinta',
                    {
                        position: 'centerTop',
                        showProgressBar: false,
                        type: 'confirm',
                        timeout: 6000,
                        buttons: [
                            {text: 'Close', action: (toast) => { this.snotifyService.remove(toast.id); }},
                            {text: 'Localize', action: (toast) => {
                                    // this.preDispatchGlobalActionsService.startPreDispatchAction(this.preDispatchData);
                                    window.parent.postMessage({runPreDispatch: this.preDispatchData}, '*');
                                    this.snotifyService.remove(toast.id);
                            }},
                        ]
                    }
                );
                return 'Data Saved !';
            }
            this.startPlanning();
            return 'Data Saved !' ;
        }, (e) => {
            if (this.data.departure_time && !this.data.departure_date) {
                this.errors['departure_date'] = 1;
            }
        });
    }

    removeErrors() {
        Object.keys(this.errors).forEach((key) => {
           if (this.data[key]) { delete this.errors[key]; }
        });
    }

    async startPlanning() {
        window.parent.postMessage({runPreDispatch: this.preDispatchData, data: {ignoreDivide: false}}, '*');
        // if (this.backProcessingService.isRunning('planning-' + this.preDispatch)) {
        //     return ;
        // }
        // const result = await this.preDispatchGlobalActionsService.startPreDispatchAction(this.preDispatchData);
    }

    checkErrors() {
        const data = this.getData() ;
        if (!data.post_man_number) {
            this.errors['post_man_number'] = 1 ;
        }
        if (!data.max_product) {
            this.errors['max_product'] = 1 ;
        }
        console.log(data, this.errors, 'echeck');
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

}
