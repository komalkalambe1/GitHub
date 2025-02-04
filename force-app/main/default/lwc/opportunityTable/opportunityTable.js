import { LightningElement, track, wire } from 'lwc';
import getOpportunities from '@salesforce/apex/fetchOpportunityRecordDigital.opportunityRecords';
import updateOpportunities from '@salesforce/apex/fetchOpportunityRecordDigital.updateOpportunity';
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';
import OPPORTUNITY_OBJECT from '@salesforce/schema/Opportunity';
import STAGE_NAME_FIELD from '@salesforce/schema/Opportunity.StageName';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class OpportunityTable extends LightningElement {
    @track opportunities = [];
    @track selectedRecords = [];
    @track error;
    @track isModalOpen = false;
    @track isConfirmationModalOpen = false;
    @track selectedStage = '';
    @track stageOptions = [];
    recordTypeId;

    columns = [
        { label: 'Opportunity Name', fieldName: 'Name', type: 'text' },
        { label: 'Stage', fieldName: 'StageName', type: 'text' },
        { label: 'Close Date', fieldName: 'CloseDate', type: 'date' }
    ];

    @wire(getObjectInfo, { objectApiName: OPPORTUNITY_OBJECT })
    opportunityMetadata({ data, error }) {
        if (data) {
            this.recordTypeId = data.defaultRecordTypeId;
        } else if (error) {
            this.showToast('Error', 'Error fetching Opportunity metadata', 'error');
        }
    }

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

    loadOpportunities() {
        getOpportunities()
            .then(data => {
                this.opportunities = data;
                this.error = undefined;
            })
            .catch(error => {
                this.error = error.body.message;
                this.opportunities = undefined;
                this.showToast('Error', 'Error loading opportunities', 'error');
            });
    }

    handleCheckboxChange(event) {
        this.selectedRecords = event.detail.selectedRows;
    }

    openModal() {
        if (this.selectedRecords.length > 0) {
            this.isModalOpen = true;
        } else {
            this.showToast('Warning', 'Please select at least one opportunity to update.', 'warning');
        }
    }

    closeModal() {
        this.isModalOpen = false;
    }

    handleStageChange(event) {
        this.selectedStage = event.target.value;
    }

    openConfirmationModal() {
        if (this.selectedRecords.length > 0 && this.selectedStage) {
            this.isModalOpen = false;
            this.isConfirmationModalOpen = true;
        } else {
            this.showToast('Warning', 'Please select a stage and opportunities to update.', 'warning');
        }
    }

    closeConfirmationModal() {
        this.isConfirmationModalOpen = false;
        this.isModalOpen = true;
    }

    updateStage() {
        const opportunitiesToUpdate = this.selectedRecords.map(record => ({
            Id: record.Id,
            StageName: this.selectedStage
        }));

        updateOpportunities({ opportunities: opportunitiesToUpdate })
            .then(() => {
                this.loadOpportunities();
                this.selectedRecords = [];
                this.isModalOpen = false;
                this.isConfirmationModalOpen = false;
                this.showToast('Success', 'Opportunities updated successfully!', 'success');
            })
            .catch(error => {
                this.error = error.body.message;
                this.showToast('Error', 'Error updating opportunities', 'error');
            });
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({ title, message, variant });
        this.dispatchEvent(event);
    }
}
