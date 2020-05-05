import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {takeUntil} from 'rxjs/internal/operators';

@Component({
  selector: 'app-iframe',
  templateUrl: './iframe.component.html',
  styleUrls: ['./iframe.component.css']
})
export class IframeComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('iframe') iframe: any;
  @Input() src ;
  @Output() load = new EventEmitter();
  @Input() messenger ;
  unsubscribe = new EventEmitter();

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
      this.src = this.sanitizer.bypassSecurityTrustResourceUrl(this.src);
      if (this.messenger) {
        this.messenger.pipe(takeUntil(this.unsubscribe)).subscribe(message => {
            console.log('message posted', this.iframe);
            this.iframe.nativeElement.contentWindow.postMessage(message);
        });
      }
  }

  ngAfterViewInit() {
    this.iframe.nativeElement.addEventListener('load', this.onLoad.bind(this));
  }

  onLoad(event) {
    this.load.emit(event);
  }

  ngOnDestroy() {
      this.unsubscribe.next();
      this.unsubscribe.complete();
  }
}
