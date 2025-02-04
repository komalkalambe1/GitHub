import { LightningElement,track } from 'lwc';
import createRecord from '@salesforce/apex/insertAndUpdateAccount.accountMethod';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class AccountObject extends LightningElement {
    @track accountDetails = {
        name: '',
        Description: '',
        AccountNumber: '',
        BillingState: '',
        BillingStreet: '',
        BillingCity: '',
        BillingCountry: ''
    };

    // Handle input changes
    handleInputChange(event) {
        const fieldName = event.target.name;
        this.accountDetails[fieldName] = event.target.value;
    }
    buttonhandler(){
        createRecord({
            fname: this.accountDetails.name,
            numb: this.accountDetails.AccountNumber,
            billStreet: this.accountDetails.BillingStreet,
            billCity: this.accountDetails.BillingCity,
            billState: this.accountDetails.BillingState,
            billCountry: this.accountDetails.BillingCountry,
            description: this.accountDetails.Description,
        })
        .then(result => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: result,
                    variant: 'success'
                })
            );
        })
        .catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        });
    }

}