import { LightningElement } from 'lwc';

export default class CustomEventParent2 extends LightningElement {

    obj = { name: '', age: '' }; 

   
    handleDetails(event) {
        this.obj = event.detail; 
    }
}