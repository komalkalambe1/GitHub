import { LightningElement, track } from 'lwc';

export default class ValidationTask3 extends LightningElement {
    @track formData = {
        name: '',
        email: '',
        pan: '',
        aadhar: '',
        phone: '',
        gender: '',
        sports: []
    };

    @track errors = {
        name: '',
        email: '',
        pan: '',
        aadhar: '',
        phone: '',
        gender: '',
        sports: ''
    };

    regexPatterns = {
        name: /^[a-zA-Z\s]+$/,
        //email: /^[a-z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        email: /^[a-z0-9._%+-]+@gmail\.com$/,
        pan: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
        aadhar: /^\d{12}$/,
        phone: /^[6-9]\d{9}$/
    };

    handleInputChange(event) {
        const { name, value } = event.target;
        this.formData[name] = value;

        // Validate individual fields
        if (this.regexPatterns[name] && !this.regexPatterns[name].test(value)) {
            this.errors[name] = `Invalid ${name}`;
        } else {
            this.errors[name] = '';
        }
    }

    handleRadioChange(event) {
        this.formData.gender = event.target.value;

        // Validate radio buttons (gender selection)
        this.errors.gender = this.formData.gender ? '' : 'Please select a gender.';
    }

    handleCheckboxChange(event) {
        const { value, checked } = event.target;
        if (checked) {
            this.formData.sports.push(value);
        } else {
            this.formData.sports = this.formData.sports.filter((sport) => sport !== value);
        }

        // Validate checkboxes (at least one sport selected)
        this.errors.sports = this.formData.sports.length ? '' : 'Please select at least one sport.';
    }

    handleSubmit() {
        let isValid = true;

        // Check if there are any validation errors
        Object.keys(this.errors).forEach((key) => {
            if (this.errors[key]) {
                isValid = false;
            }
        });

        // If valid, submit the form and reset data
        if (isValid) {
            console.log('Form Data:', this.formData);
            this.formData = {
                name: '',
                email: '',
                pan: '',
                aadhar: '',
                phone: '',
                gender: '',
                sports: []
            };
            this.errors = {
                name: '',
                email: '',
                pan: '',
                aadhar: '',
                phone: '',
                gender: '',
                sports: ''
            };
            alert('Form submitted successfully!');
        } else {
            // Show error message below fields
            this.template.querySelectorAll('.error-message').forEach((msg) => msg.classList.add('show'));
            alert('Please fix errors before submitting.');
        }
    }
}
