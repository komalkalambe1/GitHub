import { LightningElement } from 'lwc';

export default class CustomEventParent1 extends LightningElement {

    messageFromChild = '';
 
    handleMessage(event) {
        this.messageFromChild = event.detail;  
    }
}