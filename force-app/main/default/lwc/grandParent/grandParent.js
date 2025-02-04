import { LightningElement } from 'lwc';

export default class grandParent extends LightningElement {
    totalCount = 3; 
    selectedCount = 0; 

    
    handleChildSelection(event) {
        this.selectedCount = event.detail.selectedCount;
    }

    
    resetAll() {
        const resetEvent = new CustomEvent('reset');
        this.template.querySelector('c-parent').dispatchEvent(resetEvent);
    }
}