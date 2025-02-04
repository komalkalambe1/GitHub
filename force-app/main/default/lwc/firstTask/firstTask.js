// import { LightningElement, track } from 'lwc';
 
// export default class LwcFormComponent extends LightningElement {
//     @track firstName = '';
//     @track lastName = '';
//     @track email = '';
//     @track phone = '';
 
//     handleInputChange(event) {
//         const field = event.target.label.toLowerCase().replace(' ', '');
//         this[field] = event.target.value;
//     }
 
//     handleSubmit() {
//         console.log('First Name:', this.firstName);
//         console.log('Last Name:', this.lastName);
//         console.log('Email:', this.email);
//         console.log('Phone Number:', this.phone);
//     }
// }

import { LightningElement } from 'lwc';
 
export default class SampleTask extends LightningElement {
    firstname;
    lastname;
    email;
    phone;
 
    field1(event){
        this.firstname = event.target.value;
    }
    field2(event){
        this.lastname = event.target.value;
    }
    field3(event){
        this.email = event.target.value;
    }
    field4(event){
        this.phone = event.target.value;
    }
 
    buttonHandler(){
        console.log(this.firstname);
        console.log(this.lastname);
        console.log(this.email);
        console.log(this.phone);
    }
}