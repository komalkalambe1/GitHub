//****************************************************************************************************
// @Name  of the Lwc   : displayOppRecords.js
// @Description        : component used to fetch Account Related Opportunity Records
// @Author             : Komal
// @Created Date       : 31/1/2025
// ********************************************************************************************** 



import { LightningElement, track, wire,api } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import getOpportunities from '@salesforce/apex/accountRelatedOpportunityModal.getOpportunitiesRecordsToDisplay';
import OpportunityStageUpdate from '@salesforce/apex/accountRelatedOpportunityModal.updateOpportunity';
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';
import OPPORTUNITY_OBJECT from '@salesforce/schema/Opportunity';
import STAGE_NAME_FIELD from '@salesforce/schema/Opportunity.StageName';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
 
export default class DisplayOppRecords extends LightningElement {

    @api recordId; // Accept recordId from Flow

    @track accountId;
    @track opportunities = [];
    @track error;
    @track selectedRecords = [];
    @track isModalOpen = false;
    @track isConfirmationModalOpen = false; // for confirmation modal
    @track selectedStage = '';
    @track stageOptions = [];
    recordTypeId;
 
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
 
    @wire(getObjectInfo, { objectApiName: OPPORTUNITY_OBJECT })
    opportunityMetadata({ data, error }) {
        if (data) {
            console.log('Fetched RecordTypeId:', data.defaultRecordTypeId);
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
        console.log('stage option ='+data);
        if (data) {
            console.log('stage option ='+data.values);
            this.stageOptions = data.values.map(item => ({
                label: item.label,
                value: item.value
               
            }));
           
        } else if (error) {
            this.showToast('Error', 'Error fetching stage picklist values', 'error');
        }
    }

    // connectedCallback() {
    //     this.extractAccountIdFromUrl();
    // }
   
    // extractAccountIdFromUrl() {
    //     const urlParams = new URLSearchParams(window.location.search);
    //     this.accountId = urlParams.get('c__recordId');
   
    //      if (this.accountId) {
    //          this.loadOpportunities();
    //               }
    // }
 
    @wire(CurrentPageReference)
     getStateParameters(currentPageReference) {
         if (currentPageReference) {
             console.log('Extracted AccountId:', currentPageReference);
             this.accountId = currentPageReference.state.c__recordId; // Get Account Id
             console.log('Extracted AccountId:', this.accountId);
 
             if (this.accountId) {
                 this.loadOpportunities();
             }  
         }
     }
 
    loadOpportunities() {
        getOpportunities({ accountId: this.accountId })
            .then((data) => {
                console.log('Fetched Opportunities:', JSON.stringify(data));
                this.opportunities = data;
                this.error = undefined;
            })
            .catch((error) => {
                console.error('Error fetching opportunities:', error);
                this.error = error;
                this.opportunities = [];
            });
    }
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
}
