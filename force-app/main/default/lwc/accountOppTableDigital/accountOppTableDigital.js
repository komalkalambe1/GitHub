import { LightningElement, track, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getAccounts from '@salesforce/apex/fetchOppDigital.getAccounts';
import getOpportunities from '@salesforce/apex/fetchOppDigital.getOpportunities';
import updateOpportunityStage from '@salesforce/apex/fetchOppDigital.updateOpportunityStage';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class AccountOppTableDigital extends NavigationMixin(LightningElement) {
    @track accounts = [];
    @track opportunities = [];
    @track selectedAccountId;
    @track selectedOpportunityId;
    @track selectedStage;
    @track showOpportunities = false;
    @track isModalOpen = false;
    @track isUpdateDisabled = true; 
    @track error;

    // Account Columns
    accountColumns = [
        { label: 'Account Name', fieldName: 'Name', type: 'text' },
        { label: 'Action', type: 'button', initialWidth: 150, 
            typeAttributes: { label: 'View Opportunities', name: 'view_opps', variant: 'brand' } }
    ];

    // Opportunity Columns (Updated with Click Event)
    opportunityColumns = [
        { label: 'Opportunity Name', fieldName: 'Id', type: 'button', 
            typeAttributes: { label: { fieldName: 'Name' }, name: 'view', variant: 'base' } },
        { label: 'Stage', fieldName: 'StageName', type: 'text' },
        { label: 'Close Date', fieldName: 'CloseDate', type: 'date' }
    ];

    // Stage Options for Modal
    stageOptions = [
        { label: 'Prospecting', value: 'Prospecting' },
        { label: 'Qualification', value: 'Qualification' },
        { label: 'Proposal', value: 'Proposal' },
        { label: 'Negotiation', value: 'Negotiation' },
        { label: 'Closed Won', value: 'Closed Won' },
        { label: 'Closed Lost', value: 'Closed Lost' }
    ];

    // Fetch Accounts
    @wire(getAccounts)
    wiredAccounts({ data, error }) {
        if (data) {
            this.accounts = data;
            this.error = undefined;
        } else {
            this.error = error ? error.body.message : 'Unknown Error';
            this.accounts = undefined;
        }
    }

    // Handle Account Click - Show Opportunities
    handleAccountClick(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;

        if (actionName === 'view_opps') {
            this.selectedAccountId = row.Id;
            this.loadOpportunities();
        }
    }

    // Fetch Opportunities for Selected Account
    loadOpportunities() {
        getOpportunities({ accountId: this.selectedAccountId })
            .then(data => {
                this.opportunities = data;
                this.showOpportunities = true;
            })
            .catch(error => {
                this.error = error ? error.body.message : 'Unknown Error';
                this.opportunities = undefined;
            });
    }

    // Handle Row Selection
    handleRowSelection(event) {
        const selectedRows = event.detail.selectedRows;
        if (selectedRows.length > 0) {
            this.selectedOpportunityId = selectedRows[0].Id;
            this.isUpdateDisabled = false; // Enable Update button
        } else {
            this.isUpdateDisabled = true; // Disable Update button
        }
    }

    // Handle Opportunity Click - Open Custom Lightning Page
    handleOpportunityClick(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;

        if (actionName === 'view') {
            const opportunityId = row.Id;

            // Navigate to Custom Lightning Page (Replace API Name)
            this[NavigationMixin.Navigate]({
                type: 'standard__webPage',
                attributes: {
                    url: `/lightning/cmp/c__Opportunity_Details_Page?recordId=${opportunityId}`
                }
            }, true);
        }
    }

    // Open Modal for Updating Stage
    handleUpdateClick() {
        this.isModalOpen = true;
    }

    // Close Modal
    closeModal() {
        this.isModalOpen = false;
    }

    // Handle Stage Change
    handleStageChange(event) {
        this.selectedStage = event.target.value;
    }

    // Save Updated Stage
    saveStage() {
        if (!this.selectedOpportunityId || !this.selectedStage) {
            this.showToast('Error', 'Please select a valid stage to update.', 'error');
            return;
        }
    
        updateOpportunityStage({ opportunityId: this.selectedOpportunityId, newStage: this.selectedStage })
            .then(() => {
                // Update the StageName in the local opportunities array
                const updatedOpportunity = this.opportunities.find(opportunity => opportunity.Id === this.selectedOpportunityId);
                if (updatedOpportunity) {
                    updatedOpportunity.StageName = this.selectedStage; // Update the local array
                }
    
                // Close the modal
                this.closeModal();
    
                // Show a success toast
                this.showToast('Success', 'Opportunity Stage Updated', 'success');
            })
            .catch(error => {
                console.error('Error updating stage:', error);
                this.showToast('Error', error.body.message || 'An error occurred while updating the stage.', 'error');
            });
    }
    

    closeModal() {
        this.isModalOpen = false; // This will close the modal
    }
    
    

    // Show Toast
    showToast(title, message, variant) {
        const event = new ShowToastEvent({ title, message, variant });
        this.dispatchEvent(event);
    }

    // Handle Back Button
    goBack() {
        this.showOpportunities = false;
    }
}
