import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DragAndDropService {

    static DRAGGED_TYPE_ADDRESS = 0 ; // used for not matches and re-order, distinguished by the remote field value
    static DRAGGED_TYPE_PRODUCT = -1 ; // use for create new group
    static DRAGGED_TYPE_NOT_FIXED = 2 ; // used for not fixed items

    constructor() { }

    dragged = new EventEmitter();
    dropped = new EventEmitter();
    draggedElementType = 0 ;
    drag_elm: any ;
    remote = false ;
    readyToShowMap = false ;

    getDraggedElementType(){
        return this.draggedElementType;
    }

    drag(elm, remote = false, type = DragAndDropService.DRAGGED_TYPE_ADDRESS) {
        this.drag_elm = elm ;
        this.remote = remote ;
        this.dragged.emit(elm);
        this.draggedElementType = type;
    }

    drop(index, target) {
        // if the dragged element is a product, call product drop.
        if (this.draggedElementType === DragAndDropService.DRAGGED_TYPE_PRODUCT) {
            return this.productDrop(index, target);
        } else if (
            this.draggedElementType === DragAndDropService.DRAGGED_TYPE_NOT_FIXED ||
            this.drag_elm._hint === 'not_fixed'
        ) {
           return this.notFixedDrop(index, target);
        } else{ // if the dragged element is an address, call address drop.
            return this.addressDrop(index, target);
        }
    }

    notFixedDrop(index, target) {
        return this.dropped.emit({item: this.drag_elm, index: index, fromNotFixed: true});
    }

    // handles creating new group
    productDrop(index, target) {
        if (!this.drag_elm) {return ;}
        const list = [];
        if (Array.isArray(this.drag_elm)) {
            this.drag_elm.forEach((elm) => list.push(elm.id));
        } else { list.push(this.drag_elm.id); }
        return {list: list, items: this.drag_elm} ;
    }

    // handles address reorder and adding address from not matched tree.
    addressDrop(index, target) {
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
        const result = <any>{index: index, item: this.drag_elm, remote: this.remote, type: DragAndDropService.DRAGGED_TYPE_ADDRESS};
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
            productsCount: elm.productsCount,
            fromNotFixed: elm.fromNotFixed,
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

    setReadyToShowMap(state: boolean) {
        return this.readyToShowMap = state ;
    }

    _reset() {
        this.drag_elm = null ;
    }
}
