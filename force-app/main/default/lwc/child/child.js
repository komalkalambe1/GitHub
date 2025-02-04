import { LightningElement,api } from 'lwc';

export default class child extends LightningElement {

    @api childName;
    @api isSelected = false;

    get buttonLabel() {
        return this.isSelected ? 'Deselect' : 'Select';
    }

    toggleSelection() {
        this.isSelected = !this.isSelected;

        this.dispatchEvent(
            new CustomEvent('childtoggle', {
                detail: { childName: this.childName, isSelected: this.isSelected },
            })
        );
    } 
}