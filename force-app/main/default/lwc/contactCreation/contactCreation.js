import { LightningElement, wire, track } from 'lwc';
import getContactRecordTypes from '@salesforce/apex/ContactController.getContactRecordTypes';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ContactCreation extends LightningElement {
    @track recordTypes = [];
    @track selectedRecordTypeId = null;
    showForm = false;

    @wire(getContactRecordTypes)
    wiredRecordTypes({ data, error }) {
        if (data) {
            this.recordTypes = data.map(rt => ({
                label: rt.Name,
                value: rt.Id
            }));
        } else if (error) {
            this.showToast('Error', 'Failed to load record types', 'error');
        }
    }

    handleRecordTypeChange(event) {
        this.selectedRecordTypeId = event.detail.value;
        this.showForm = true;
    }

    handleSuccess(event) {
        this.showToast('Success', 'Contact created successfully', 'success');
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}
