import { LightningElement, api, track, wire } from 'lwc';
import oppMethod from '@salesforce/apex/fetchOpportunityRecords.opportunityRecords';
import OpportunityStageUpdate from '@salesforce/apex/fetchOpportunityRecords.updateOpportunity';
import { NavigationMixin } from 'lightning/navigation';
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';
import OPPORTUNITY_OBJECT from '@salesforce/schema/Opportunity';
import STAGE_NAME_FIELD from '@salesforce/schema/Opportunity.StageName';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
 
export default class AccountOpportunities extends NavigationMixin(LightningElement) {
    @api recordId; // Account Id
    @track opportunities = [];
    @track selectedRecords = [];
    @track error;
    @track isModalOpen = false;
    @track isConfirmationModalOpen = false; // for confirmation modal
    @track selectedStage = '';
    @track stageOptions = [];
    recordTypeId; // Store recordTypeId dynamically
 
    columns = [
    {
        label: 'Opportunity Name',
        fieldName: 'Name',
        type: 'button',
        typeAttributes: {
            label: { fieldName: 'Name' },
            name: 'view',
            variant: 'base'
        }
    },
    { label: 'Stage', fieldName: 'StageName', type: 'text' },
    { label: 'Close Date', fieldName: 'CloseDate', type: 'date' }
];
 
 
    // Wire adapter to fetch Opportunity object metadata
    @wire(getObjectInfo, { objectApiName: OPPORTUNITY_OBJECT })
    opportunityMetadata({ data, error }) {
        if (data) {
            this.recordTypeId = data.defaultRecordTypeId;
        } else if (error) {
            this.showToast('Error', 'Error fetching Opportunity metadata', 'error');
        }
    }
 
    // Wire adapter to fetch picklist values for StageName field
    @wire(getPicklistValues, {
        recordTypeId: '$recordTypeId',
        fieldApiName: STAGE_NAME_FIELD
    })
    stagePicklistValues({ data, error }) {
        if (data) {
            this.stageOptions = data.values.map(item => ({
                label: item.label,
                value: item.value
            }));
        } else if (error) {
            this.showToast('Error', 'Error fetching stage picklist values', 'error');
        }
    }
 
    connectedCallback() {
        this.loadOpportunities();
    }
 
    // Fetch Opportunities Imperatively
    loadOpportunities() {
        oppMethod({ accId: this.recordId })
            .then(data => {
                this.opportunities = data.map(opportunity => ({
                    ...opportunity,
                    selected: false,
                   
                }));
                this.error = undefined;
            })
            .catch(error => {
                this.error = error.body.message;
                this.opportunities = undefined;
                this.showToast('Error', 'Error loading opportunities', 'error');
            });
    }
 
    // handleRowAction(event) {
    //     const row = event.detail.row;
    //     const opportunityPageUrl = `/lightning/r/Opportunity/${row.Id}/view`;
    //     window.open(opportunityPageUrl, '_blank');
    // }
 
    // checkbox selection
    handleCheckboxChange(event) {
        const selectedRows = event.detail.selectedRows;
        this.selectedRecords = selectedRows;
    }
 
    // Open modal for selecting the stage
    openModal() {
        if (this.selectedRecords.length > 0) {
            this.isModalOpen = true;
           
        } else {
            this.showToast('Warning', 'Please select at least one opportunity to update.', 'warning');
        }
    }
 
    // Close the modal
    closeModal() {
        this.isModalOpen = false;
    }
 
    // Handle stage selection in the modal
    handleStageChange(event) {
        this.selectedStage = event.target.value;
    }
 
    // Open confirmation modal before updating
    openConfirmationModal() {
        if (this.selectedRecords.length > 0 && this.selectedStage) {
            this.isModalOpen = false;
            this.isConfirmationModalOpen = true;
             
        } else {
            this.showToast('Warning', 'Please select a stage and opportunities to update.', 'warning');
        }
    }
 
    // Close the confirmation modal
    closeConfirmationModal() {
        this.isConfirmationModalOpen = false;
        this.isModalOpen = true;
    }
 
    // Handle stage update action after confirmation
    updateStage() {
        // Prepare the selected opportunities for update
        const opportunitiesToUpdate = this.selectedRecords.map(record => ({
            Id: record.Id,
            StageName: this.selectedStage
        }));
 
        // Call Apex to update the opportunities
        OpportunityStageUpdate({ opportunities: opportunitiesToUpdate })
            .then(() => {
                // Update the local data to reflect changes without a refresh
                this.opportunities = this.opportunities.map(opportunity => {
                    const updatedRecord = opportunitiesToUpdate.find(record => record.Id === opportunity.Id);
                    return updatedRecord ? { ...opportunity, StageName: updatedRecord.StageName } : opportunity;
                });
 
                // Clear selected records and close modals
                this.selectedRecords = [];
                this.isModalOpen = false;
                this.isConfirmationModalOpen = false;
 
                // Show success toast
                this.showToast('Success', 'Opportunities updated successfully!', 'success');
               
                // Clear checkboxes after success
                const dataTable = this.template.querySelector('lightning-datatable');
                if (dataTable) {
                    dataTable.selectedRows = []; // Clear selected rows in the datatable
                }
            })
            .catch(error => {
                this.error = error.body.message;
                console.error('Error updating opportunities:', this.error);
 
                // Show error toast
                this.showToast('Error', 'Error updating opportunities', 'error');
            });
    }
 
    // Show toast notifications
    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(event);
    }
    handleRowAction(event) {
    const row = event.detail.row;
 
    // Use NavigationMixin to navigate to the record page in a new tab
    this[NavigationMixin.GenerateUrl]({
        type: 'standard__recordPage',
        attributes: {
            recordId: row.Id,
            objectApiName: 'Opportunity',
            actionName: 'view'
        }
    }).then((url) => {
        window.open(url, '_blank'); // Open the record page in a new tab
    });
}
 
}
 