import { LightningElement, track } from 'lwc';
 
export default class LwcLightningTask3 extends LightningElement {
    @track formData = {
        name: '',
        email: '',
        pan: '',
        adhar: '',
        phone: '',
        sports: [],
        gender: ''
    }; 
  sportsOptions = [
    { label: 'Cricket', value: 'cricket' },
    { label: 'Football', value: 'football' },
    { label: 'Basketball', value: 'basketball' }
];
 
genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' }
];
 
     @track errorMessage = '';
 
    // Regex patterns
    regexPatterns = {
        name: /^[a-zA-Z\s]+$/,
       //email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
       email: /^[a-z0-9._%+-]+@gmail\.com$/,
        pan: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
        aadhar: /^\d{12}$/,
        phone: /^[6-9]\d{9}$/
    };
 
    handleInputChange(event) {
        const { name, value } = event.target;
    
        // Special handling for checkbox and radio groups
        if (event.target.type === 'checkbox-group') {
            this.formData[name] = event.detail.value || [];  // Default to an empty array if nothing is selected
        } else if (event.target.type === 'radio') {
            this.formData[name] = value;  // For radio buttons, directly update the value
        } else {
            this.formData[name] = value;   
        }
    
        // Validate the specific field
        if (this.regexPatterns[name] && !this.regexPatterns[name].test(value)) {
            event.target.setCustomValidity(`Invalid ${name}`);
        } else {
            event.target.setCustomValidity('');
        }
        event.target.reportValidity();
    }
    

    handleSubmit() {
        const inputs = [...this.template.querySelectorAll('lightning-input, lightning-radio-group, lightning-checkbox-group')];
        let isValid = true;
    
        // Validate all inputs
        inputs.forEach((input) => {
            const { name, value } = input;
            if (this.regexPatterns[name] && !this.regexPatterns[name].test(value)) {
                input.setCustomValidity(`Invalid ${name}`);
                isValid = false;
            } else {
                input.setCustomValidity('');
            }
            input.reportValidity();
        });
    
        if (isValid) {
            // Reset formData to its initial structure instead of an empty string
            this.formData = {
                name: '',
                email: '',
                pan: '',
                aadhar: '',
                phone: '',
                sports: [],
                gender: ''
            };
            // Logic for handling valid data (e.g., sending to server)
            //console.log('Form submitted successfully:', this.formData);
            alert('form Submitted successfully');
        } else {
            this.errorMessage = 'Please fix the errors before submitting.';
        }
    }
    

}