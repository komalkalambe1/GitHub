//****************************************************************************************************
// @Name  of the Lwc   : accountOpportunityRecordsDisplay.js
// @Description        : component used to fetch Account Related Opportunity Records
// @Author             : Komal
// @Created Date       : 31/1/2025
// ********************************************************************************************** 


import { LightningElement, track,api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getAccounts from '@salesforce/apex/accountRelatedOpportunityModal.accountRecordsToDisplay';
 
export default class AccountOpportunityRecordsDisplay extends NavigationMixin(LightningElement) {

    @api recordId; // Accept recordId from Flow

    @track accounts = [];
    error;
   
    connectedCallback() {
        this.loadAccounts();
    }
 
    loadAccounts() {
        getAccounts() // Imperative Call
            .then(result => {
                this.accounts = result;
                this.error = undefined;
                console.log('Fetched Accounts:', this.accounts);
            })
            .catch(error => {
                this.error = error;
                this.accounts = [];
                this.showToast('Error', 'Error fetching accounts', 'error');
                console.error('Error:', error);
            });
    }

    handleViewOpportunities(event) {
        const accountId = event.currentTarget.dataset.id;
        this[NavigationMixin.Navigate]({
            type: 'standard__namedPage',
            attributes: {
                pageName: 'opportunityFetchRecord'  // page name
            },
            state: {
                c__recordId: accountId
            }
        });
    }
 
    
 handleViewOpportunities(event) {
        const accountId = event.currentTarget.dataset.id;
        console.log('Fetched accountId:', accountId);
     // Define PageReference
     const pageRef = {
         type: 'standard__webPage',
         attributes: {
             url: `/opportunityfetchrecord?c__recordId=${accountId}` // Correct URL format
         }
     };
 
     // Navigate using NavigationMixin
     this[NavigationMixin.Navigate](pageRef);
     }
}