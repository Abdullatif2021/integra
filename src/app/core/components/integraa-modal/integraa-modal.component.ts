import {Component, ComponentFactoryResolver, EventEmitter, Input, OnInit, ViewChild} from '@angular/core';
import {IntegraaModalService} from '../../../service/integraa-modal.service';
import {BackProcessingService} from '../../../service/back-processing.service';
import {TranslateService} from '@ngx-translate/core';


@Component({
  selector: 'app-integraa-modal',
  templateUrl: './integraa-modal.component.html',
  styleUrls: ['./integraa-modal.component.css']
})

export class IntegraaModalComponent implements OnInit {

  constructor(
      private componentFactoryResolver: ComponentFactoryResolver,
      private integraaModalService: IntegraaModalService,
      private backProcessingService: BackProcessingService,
      private translate: TranslateService,
    ) {}

  @ViewChild('modal') modal ;
  @ViewChild('modalsContainer') modalsContainer ;
  @Input() bounds ;

  modals: IntegraaModal[] = [] ;
  messagesBag = [];
  currentScroll = 0;
  ngOnInit() {
      this.integraaModalService.status.subscribe((opt) => {
          this.open(opt) ;
      });
      this.integraaModalService.messenger.subscribe( message => {
          this.modals.forEach((modal) => {
              if (modal.data['id'] === message.id && modal.data['location'] === message.location) {
                  if (modal.displayed) {// if the iframe is loaded send the message.
                      modal.tellIframe(message.message);
                  } else { // stack the message to send it whenever iframe is loaded.
                      this.messagesBag.push(message);
                  }
              }
          });
      } )
      this.backProcessingService.globalMessenger.subscribe(message => {
         this.modals.forEach((modal) => {
             if (modal.data['location'] === 'schedule' && modal.data['id'] === message.id) {
                 modal.tellIframe({handleSaysHi: message});
             }
         });
      });
  }

  open(opt) {

      // make body not scrollable.
      document.body.classList.add('contains-open-modal');

      const modal = new IntegraaModal() ;
      this.setCurrentScroll();
      modal.setOptions(opt) ;
      setTimeout(() => {modal.height = document.getElementsByTagName('body')[0].clientHeight ; }, 0);
      this.modals.push(modal) ;
      this.integraaModalService.updateModals(this.modals);
      if (opt.expand) {
          this.expand(modal);
      }
  }

  setCurrentScroll() {
      this.currentScroll = window.scrollY;
  }

  close(modal) {
      if (typeof this.modals === 'object') {
          this.modals = this.modals.filter((elm) => elm.id !== modal.id );
          this.integraaModalService.updateModals(this.modals);

          // make body scrollable
          document.body.classList.remove('contains-open-modal');
      }
  }

  minimize(modal: IntegraaModal) {
      modal.options.minimized = !modal.options.minimized ;
  }

  expand(modal: IntegraaModal) {
      modal.options.expanded = !modal.options.expanded;
      modal.options.fullWidth = false ;
      modal._status.change = 'expand' ;
      if (modal.options.expanded) {
          modal.options.sizeUnit = '%';
          modal.options.width = 100;
          modal.options.height = 100;
          modal.options.position = {x: 0, y: 0};
      } else {
          modal.options.sizeUnit = 'px';
          modal.options.width = modal._options.width;
          modal.options.height = modal._options.height;
          modal.options.position = modal._options.position;
          modal._status.change = false ;
      }
  }

  fullWidth(modal: IntegraaModal) {
      modal.options.fullWidth = !modal.options.fullWidth;
      modal.options.expanded = false ;
      modal._status.change = 'expand' ;
      if (modal.options.fullWidth) {
          modal.options.width = window.innerWidth;
          modal.options.position = {x: 0, y: modal.options.position.y} ;
      } else {
          modal.options.width = modal._options.width;
          modal.options.position = modal._options.position;
          modal._status.change = false ;
      }
  }

  onResizing(event, modal: IntegraaModal) {
      if (!modal._status.change &&
          !(event.width === modal.options.width && event.height === modal.options.height)) {
          modal._options.width = event.size.width ;
          modal._options.height = event.size.height ;
      }
  }

  onEndOffset(event, modal: IntegraaModal) {
      if (!modal._status.change && event.x > -1 && event.y > -1 &&
          !(event.x === modal.options.position.x && event.y === modal.options.position.y)) {
          modal._options.position = event ;
      }
  }

  openLink(modal) {
      (window.open(modal.options.url));
      this.close(modal);
  }

  display(event, modal) {
      modal.displayed = true ;
      this.sendWaitingMessages(modal) ;
  }

  sendWaitingMessages(modal) {
      this.messagesBag.forEach(message => {
          if (modal.data['id'] === message.id && modal.data['location'] === message.location) {
              modal.tellIframe(message.message);
          }
      });
  }


}

class IntegraaModal {

    inBounds = { top: true, left: true, right: true, bottom: true };
    _options = {
        minimized : false,
        expanded : false,
        fullWidth: false,
        sizeUnit: 'px',
        width : 600,
        height: 300,
        position: {x: 20, y: 20},
    };
    displayed = false ;
    _status = {
        change: null
    };
    options = Object.assign({}, this._options) ;
    id ;
    height = 0 ;
    data = {} ;
    title = '' ;
    iframemMssenger = new EventEmitter();

    constructor() {
      this.id = Date.now() ;
    }

    tellIframe(message) {
        this.iframemMssenger.emit(message);
    }

    setOptions(options) {
        const modal = this ;
        this.data = options.data ? options.data : {} ;
        this.title = options.title;
        delete options.data ;
        Object.keys(options).forEach(function(key) {
            modal._options[key] =  options[key] ;
        });
        this._options.position = {
            x: ((window).innerWidth - this._options.width) / 2 ,
            y: ((window).innerHeight - this._options.height) / 3
        }
        this.options = Object.assign({}, this._options) ;
    }

}
