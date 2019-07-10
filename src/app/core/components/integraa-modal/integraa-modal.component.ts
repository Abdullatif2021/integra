import {Component, ComponentFactoryResolver, Input, OnInit, ViewChild} from '@angular/core';
import {IntegraaModalService} from '../../../service/integraa-modal.service';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-integraa-modal',
  templateUrl: './integraa-modal.component.html',
  styleUrls: ['./integraa-modal.component.css']
})

export class IntegraaModalComponent implements OnInit {

  constructor(
      private componentFactoryResolver: ComponentFactoryResolver,
      private integraaModalService: IntegraaModalService,
      private sanitizer: DomSanitizer
  ) { }

  @ViewChild('modal') modal ;
  @ViewChild('modalsContainer') modalsContainer ;
  @Input() bounds ;

  modals: IntegraaModal[] = [] ;

  ngOnInit() {
      this.integraaModalService.status.subscribe((opt) => {
          this.open(opt) ;
      });
  }

  open(opt) {
      const modal = new IntegraaModal(this.sanitizer) ;
      modal.setOptions(opt) ;
      setTimeout(() => {modal.height = document.getElementsByTagName('body')[0].clientHeight ;},0);
      this.modals.push(modal) ;
  }

  close(modal) {
      if (typeof this.modals === 'object') {
          this.modals = this.modals.filter((elm) => elm.id !== modal.id );
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
          modal.options.sizeUnit = 'px'
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
      (window.open(modal.options.raw_url));
      this.close(modal);
  }

  display(modal) {
      modal.displayed++ ;
  }

}

class IntegraaModal {

    inBounds = { top: true, left: true, right: true, bottom: true }
    _options = {
        minimized : false,
        expanded : false,
        fullWidth: false,
        sizeUnit: 'px',
        width : 600,
        height: 300,
        position: {x: 20, y: 20},
    }
    displayed = -1 ;
    _status = {
        change: null
    };
    options = Object.assign({}, this._options) ;
    id ;
    height = 0 ;

    constructor(private sanitizer: DomSanitizer) {
      this.id = Date.now() ;
    }

    setOptions(options) {
        const modal = this ;
        Object.keys(options).forEach(function(key) {
            if (key === 'url') {
                modal._options[key] = modal.sanitizer.bypassSecurityTrustResourceUrl(options[key]);
                modal._options['raw_url'] = options[key];
            } else {
                modal._options[key] =  options[key] ;
            }
        });
        this._options.position = {
            x: ((window).innerWidth - this._options.width) / 2 ,
            y: ((window).innerHeight - this._options.height) / 3
        }
        this.options = Object.assign({}, this._options) ;
    }

}