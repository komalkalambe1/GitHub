
import { LightningElement, track } from 'lwc';

export default class LwcTask3 extends LightningElement {
    @track formData = {
        name: '',
        email: '',
        pan: '',
        aadhar: '',
        phone: '',
        gender: '',
        sports: []
    };

    // Regex patterns for validation
    regexPatterns = {
        name: /^[a-zA-Z\s]+$/,
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        pan: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
        aadhar: /^\d{12}$/,
        phone: /^[6-9]\d{9}$/,
    };

    handleInputChange(event) {
        const { name, value } = event.target;
        this.formData[name] = value;

        // Validate individual fields
        if (this.regexPatterns[name] && !this.regexPatterns[name].test(value)) {
            event.target.setCustomValidity(`Invalid ${name}`);
        } else {
            event.target.setCustomValidity('');
        }
        event.target.reportValidity();
    }

    handleRadioChange(event) {
        this.formData.gender = event.target.value;
        const inputs = this.template.querySelectorAll('input[type="radio"][name="gender"]');
        inputs.forEach((radio) => {
            radio.setCustomValidity(this.formData.gender ? '' : 'Please select a gender.');
            radio.reportValidity();
        });
    }

    handleCheckboxChange(event) {
        const { value, checked } = event.target;
        if (checked) {
            this.formData.sports.push(value);
        } else {
            this.formData.sports = this.formData.sports.filter((sport) => sport !== value);
        }

        const inputs = this.template.querySelectorAll('input[type="checkbox"][name="sports"]');
        inputs.forEach((checkbox) => {
            checkbox.setCustomValidity(this.formData.sports.length ? '' : 'Please select at least one sport.');
            checkbox.reportValidity();
        });
    }

    handleSubmit() {
        const inputs = [...this.template.querySelectorAll('input')];
        let isValid = true;

        inputs.forEach((input) => {
            if (!input.checkValidity()) {
                isValid = false;
                input.reportValidity();
            }
        });

        if (isValid) {
            alert('Form submitted successfully!');
            console.log('Form Data:', this.formData);
            // Reset form if needed
        } else {
            alert('Please fix errors before submitting.');
        }
        // if (isValid) {
        //     this.formData = '';
        //     // Logic for handling valid data (e.g., sending to server)
        //     console.log('Form submitted successfully:', this.errorMessage);
        // } else {
        //     this.errorMessage = 'Please fix the errors before submitting.';
        // }
    }
}
