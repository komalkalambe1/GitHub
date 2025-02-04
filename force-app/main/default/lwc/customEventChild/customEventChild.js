import { LightningElement } from 'lwc';

export default class CustomEventChild extends LightningElement {
    handleButtonClick() {
 
        const myEvent = new CustomEvent('message', {
            detail: 'Hello from the child component!'
        });
 
        // Dispatch the event
        this.dispatchEvent(myEvent);
    }

}