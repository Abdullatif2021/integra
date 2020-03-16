import {Directive, ViewContainerRef} from '@angular/core';

@Directive({
    selector: '[appPage]'
})
export class PageDirective {

    constructor(public viewContainerRef: ViewContainerRef) { }

}
