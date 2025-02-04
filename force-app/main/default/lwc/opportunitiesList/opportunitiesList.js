import { LightningElement, api, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getOpportunitiesByAccount from '@salesforce/apex/OpportunityController.getOpportunitiesByAccount'

export default class OpportunitiesList extends NavigationMixin(LightningElement) {

    @api recordId; // Account Id passed from the parent or record page
    opportunities;
    error;

    @wire(getOpportunitiesByAccount, { accountId: '$recordId' })
    wiredOpportunities({ error, data }) {
        if (data) {
            this.opportunities = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.opportunities = undefined;
        }
    }

    handleNavigation(event) {
        const opportunityId = event.target.dataset.id;
        this[NavigationMixin.GenerateUrl]({
            type: 'standard__recordPage',
            attributes: {
                recordId: opportunityId,
                objectApiName: 'Opportunity',
                actionName: 'view'
            }
        }).then(url => {
            window.open(url, '_blank');
        });
    }
}