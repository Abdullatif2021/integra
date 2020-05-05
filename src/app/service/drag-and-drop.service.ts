import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DragAndDropService {

    constructor() { }

    dragged = new EventEmitter();
    dropped = new EventEmitter();
    drag_elm: any ;
    remote = false ;

    drag(elm, remote = false) {
        this.drag_elm = elm ;
        this.remote = remote ;
        this.dragged.emit(elm);
    }

    drop(index, target) {
        if (
            (!this.drag_elm || !target) ||
            (this.drag_elm.type === 'cityId' && target.type !== 'set') ||
            (this.drag_elm.type === 'capId' && target.type !== 'cityId') ||
            (this.drag_elm.type === 'streetId' && target.type !== 'capId') ||
            (this.drag_elm.type === 'oet') ||
            (this.drag_elm.type === 'building' && (target.type !== 'streetId' && target.type !== 'set' ))
        ) {
            return ;
        }

        // if the action is move, check if the new container has an element with same id, and handle this case.
        this.handleRepeated(target) ;
        const d_index = this.drag_elm.parent.children.indexOf( this.drag_elm ) ;
        if (d_index > index ) {
            this.drag_elm.parent.children.splice( d_index, 1 );
            if (this.drag_elm.type === 'building') {
                target.children.splice( index, 0, this.convertToBuildingDataShape(this.drag_elm, target) );
            } else {
                target.children.splice( index, 0, this.drag_elm );
            }
        } else {
            if (this.drag_elm.type === 'building') {
                target.children.splice( index, 0, this.convertToBuildingDataShape(this.drag_elm, target) );
            } else {
                target.children.splice( index, 0, this.drag_elm );
            }
            this.drag_elm.parent.children.splice( d_index, 1 );
        }

        if (this.drag_elm.type === 'streetId') {
            this.drag_elm.children = [] ;
            this.drag_elm.expanded = false ;
        }

        this.clearParent(this.drag_elm) ;

        this.drag_elm.parent = target ;
        const result = <any>{index: index, item: this.drag_elm, remote: this.remote};
        this.dropped.emit(result) ;
        this._reset() ;
        return result ;
    }

    convertToBuildingDataShape(elm, target) {
        return {
            id: elm.id,
            address: elm.address ? elm.address : elm.text,
            loaded: false,
            parent: target,
            type: 'building',
            addressId: elm.addressId,
            products: elm.products,
            priority: elm.mapPriority,
            productsCount: elm.productsCount
        };
    }

    clearParent(item) {
        let parent = item.parent;
        while (true) {
            if (!parent || (parent.children && parent.children.length)) {
                break;
            }
            const _id = parent.id ;
            parent = parent.parent ;
            if (parent && parent.children) {
                parent.children = parent.children.filter((elm) => elm.id !== _id) ;
            }
        }
    }

    handleRepeated(target) {
        if (!this.remote) {
            return ;
        }
        target.children = target.children.filter((elm) => elm.id !== this.drag_elm.id);
        this.drag_elm.expanded = false ;
        this.drag_elm.loading = false ;
        this.drag_elm.loaded = false ;
        this.drag_elm.page = 1;
        this.drag_elm.setId = target.setId ;
        this.drag_elm.children = [] ;
    }

    _reset() {
        this.drag_elm = null ;
    }
}
