import { LightningElement } from 'lwc';

export default class CustomEventChild2 extends LightningElement {

    name = ''; 
    age = '';  

    
    handleNameChange(event) {
        this.name = event.target.value;
    }

    
    handleAgeChange(event) {
        this.age = event.target.value;
    }

    
    sendDetailsToParent() {

        const event = new CustomEvent('senddetails', {
            detail: {
                name: this.name,
                age: this.age
            } 
        });

        this.dispatchEvent(event); 
    }
}