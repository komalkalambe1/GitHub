
import { LightningElement, track } from 'lwc';

export default class Gender extends LightningElement {

  // @api logoUrl; // Accept the logo URL as a property
  @track isDropdownVisible = false; // Track dropdown visibility

  // Getter to dynamically control dropdown class
  get dropdownClass() {
    return this.isDropdownVisible
      ? "slds-dropdown slds-dropdown_right"
      : "slds-dropdown slds-dropdown_right slds-hide";
  }

  // Method to toggle dropdown visibility
  toggleDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;
  }
}
