import { LightningElement } from 'lwc';

export default class UserForm extends LightningElement {
  // Variables to hold field values
  firstName = '';
  lastName = '';
  email = '';
  phoneNumber = '';

  // Handles input change for all fields
  handleInputChange(event) {
    const field = event.target.dataset.field; // Get the field name
    this[field] = event.target.value; // Set the corresponding property
  }

  // Handles submit button click
  handleSubmit() {
    console.log('First Name:', this.firstName);
    console.log('Last Name:', this.lastName);
    console.log('Email:', this.email);
    console.log('Phone Number:', this.phoneNumber);
  }
}
