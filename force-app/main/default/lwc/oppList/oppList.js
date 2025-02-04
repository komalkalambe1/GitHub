import { LightningElement, track, wire } from 'lwc';
import { subscribe, MessageContext } from 'lightning/messageService';
import ACCOUNT_MESSAGE_CHANNEL from '@salesforce/messageChannel/accountMessageChannel__c';
import getOpportunities from '@salesforce/apex/digitalAccountOppFetch.getOpportunities';
import { NavigationMixin } from 'lightning/navigation';

export default class OpportunityTable extends NavigationMixin(LightningElement) {
    @track accountId;
    @track opportunities = [];

    @wire(MessageContext)
    messageContext;

    columns = [
        { label: 'Opportunity Name', fieldName: 'Name', type: 'button', 
            typeAttributes: { label: { fieldName: 'Name' }, name: 'view', variant: 'base' } },
        { label: 'Stage', fieldName: 'StageName', type: 'text' },
        { label: 'Close Date', fieldName: 'CloseDate', type: 'date' }
    ];

    // Subscribe to LMS
    connectedCallback() {
        this.subscription = subscribe(this.messageContext, ACCOUNT_MESSAGE_CHANNEL, (message) => {
            if (message.accountId) {
                this.accountId = message.accountId;
                this.loadOpportunities();
            }
        });
    }

    // Fetch Opportunities
    loadOpportunities() {
        getOpportunities({ accountId: this.accountId })
            .then(data => {
                this.opportunities = data;
            })
            .catch(error => {
                console.error('Error fetching opportunities:', error);
            });
    }

    // Handle Opportunity Click - Open Opportunity Record Page
    handleOpportunityClick(event) {
        const row = event.detail.row;
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: row.Id,
                objectApiName: 'Opportunity',
                actionName: 'view'
            }
        });
    }
}
