import { LightningElement, track, wire } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import ACCOUNT_MESSAGE_CHANNEL from '@salesforce/messageChannel/accountMessageChannel__c';
import getAccounts from '@salesforce/apex/digitalAccountOppFetch.getAccounts';

export default class AccountList extends LightningElement {
    @track accounts = [];
    
    @wire(MessageContext)
    messageContext;

    // Define Columns
    columns = [
        { label: 'Account Name', fieldName: 'Name', type: 'text' },
        { label: 'Action', type: 'button', 
            typeAttributes: { label: 'View Opportunities', name: 'view_opps', variant: 'brand' } }
    ];

    // Fetch Accounts
    @wire(getAccounts)
    wiredAccounts({ data, error }) {
        if (data) {
            this.accounts = data;
        } else {
            console.error('Error fetching accounts:', error);
        }
    }

    // Handle Account Selection
    handleAccountClick(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;

        if (actionName === 'view_opps') {
            // Publish Account ID
            publish(this.messageContext, ACCOUNT_MESSAGE_CHANNEL, { accountId: row.Id });
        }
    }
}
