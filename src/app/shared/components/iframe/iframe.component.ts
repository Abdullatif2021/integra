import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-iframe',
  templateUrl: './iframe.component.html',
  styleUrls: ['./iframe.component.css']
})
export class IframeComponent implements OnInit, AfterViewInit {

  @ViewChild('iframe') iframe: any;
  @Input() src ;
  @Output() load = new EventEmitter();
  @Input() messenger ;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
      this.src = this.sanitizer.bypassSecurityTrustResourceUrl(this.src);
      if (this.messenger) {
        this.messenger.subscribe(message => {
            console.log('message posted');
            this.iframe.contentWindow.postMessage(message);
        });
      }
  }

  ngAfterViewInit() {
    this.iframe.nativeElement.addEventListener('load', this.onLoad.bind(this));
  }

  onLoad(event) {
    this.load.emit(event);
  }
}
