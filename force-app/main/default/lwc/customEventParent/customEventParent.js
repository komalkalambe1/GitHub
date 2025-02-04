import { LightningElement } from 'lwc';
export default class customEventParent extends LightningElement {
message;
    handleChildMessage(event) {
        this.message = event.detail;
        console.log('Received message: ', this.message);
    }
}
