import { LightningElement, api, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getOpportunitiesByAccount from '@salesforce/apex/OpportunityController.getOpportunitiesByAccountId';
 
export default class Opportunitynav extends NavigationMixin(LightningElement) {
    @api recordId; // Account ID passed to the component
    opportunities = [];
    error;
 
    @wire(getOpportunitiesByAccount, { accountId: '$recordId' })
    wiredOpportunities({ data, error }) {
        if (data) {
            this.opportunities = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.opportunities = [];
        }
    }
 
    handleOpportunityClick(event) {
        const opportunityId = event.currentTarget.dataset.id;
        // Use NavigationMixin.GenerateUrl to create the URL
        this[NavigationMixin.GenerateUrl]({
            type: 'standard__recordPage',
            attributes: {
                recordId: opportunityId,
                actionName: 'view',
            },
        }).then((url) => {
            // Open the generated URL in a new tab
            window.open(url, '_blank');
        }).catch((error) => {
            console.error('Error generating URL:', error);
        });
    }
}