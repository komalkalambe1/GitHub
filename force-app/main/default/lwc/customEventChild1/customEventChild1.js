import { LightningElement } from 'lwc';

export default class CustomEventChild1 extends LightningElement {

    inputValue = '';
 
    handleInputChange(event) {
        this.inputValue = event.target.value;
    }
 
    sendToParent() {
       
        const event = new CustomEvent('message', {
            detail: this.inputValue
        });
        this.dispatchEvent(event);
    }
}