import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {PlacesAutocompleteService} from '../../service/places.autocomplete.service';
import {ACAddress} from '../../../core/models/address.interface';
import {FormattedAddress} from '../../../core/models/building.interface';

@Component({
    selector: 'app-address-input',
    templateUrl: './address-input.component.html',
    styleUrls: ['./address-input.component.css']
})

export class AddressInputComponent implements OnInit, OnChanges {

    constructor(
        private googlePlacesService: PlacesAutocompleteService
    ) {
    }

    address: ACAddress;

    @Output() invalidInput = new EventEmitter();
    @Output() changed = new EventEmitter<ACAddress>();
    @Input() point;
    @Input() _class = '';
    @Input() disabled = false ;
    inputValue = '';
    appendId: number;

    ngOnInit() {
    }

    ngOnChanges(changes) {
        if (changes.point) {
            const address = this.googlePlacesService.formattedAddressToObject(changes.point.currentValue.text);
            if (!address) {
                this.address = <ACAddress>{
                    id: changes.point.currentValue.id, text: changes.point.currentValue.text,
                    address: null, located: false, hasObject: false
                };
            } else {
                this.address = address;
                if (changes.point.currentValue.lat) {
                    this.address.address.lat = changes.point.currentValue.lat;
                }
                if (changes.point.currentValue.long) {
                    this.address.address.lng = changes.point.currentValue.long;
                }
                this.address.id = changes.point.currentValue.id;
            }
            this.inputValue = changes.point.currentValue.text;
            if (changes.point.currentValue.id) {
                this.appendId = changes.point.currentValue.id;
            } else {
                this.appendId = null;
            }
        }
    }

    handleAddressChange(event) {
        const address: any = this.googlePlacesService.formattedAddressToObject(event.formatted_address);
        const formattedAddress = this.googlePlacesService.getAddressObject(event) ;
        if (formattedAddress) {
            if (formattedAddress.cap) {
                address.address.cap = formattedAddress.cap ;
            }
            if (formattedAddress.city) {
                address.address.city = formattedAddress.city ;
            }
            if (formattedAddress.street) {
                address.address.street = formattedAddress.street ;
            }
            if (formattedAddress.houseNumber) {
                address.address.houseNumber = formattedAddress.houseNumber ;
            }
        }
        if (!address) {
            this.address = <ACAddress>{text: address, address: null, located: false, hasObject: false};
            this.changed.emit(this.address);
            return false;
        }
        address.address.lat = event.geometry.location.lat();
        address.address.lng = event.geometry.location.lng();
        if (address.address.lat && address.address.lng) {
            address.located = true;
        }
        address.located = true;
        if (this.appendId) {
            address.id = this.appendId;
        }
        this.address = address;
        this.changed.emit(this.address);
    }

    addressInputChange(event) {
        const address = this.googlePlacesService.formattedAddressToObject(event.target.value);
        if (!address) {
            this.address = <ACAddress>{text: event.target.value, address: null, located: false, hasObject: false};
            this.changed.emit(this.address);
            return false;
        }
        if (this.appendId) {
            address.id = this.appendId;
        }
        this.address = address;
        this.changed.emit(this.address);
    }
}
