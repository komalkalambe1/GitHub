import { LightningElement } from 'lwc';

export default class parent extends LightningElement {

    isChildOneSelected = false;
    isChildTwoSelected = false;
    isChildThreeSelected = false;

    get childOneStatus() {
        return this.isChildOneSelected ? 'Selected' : 'Deselected';
    }
    get childTwoStatus() {
        return this.isChildTwoSelected ? 'Selected' : 'Deselected';
    }
    get childThreeStatus() {
        return this.isChildThreeSelected ? 'Selected' : 'Deselected';
    }

    handleChildToggle(event) {
        const { childName, isSelected } = event.detail;
        if (childName === 'Child One') {
            this.isChildOneSelected = isSelected;
        } else if (childName === 'Child Two') {
            this.isChildTwoSelected = isSelected;
        } else if (childName === 'Child Three') {
            this.isChildThreeSelected = isSelected;
        }
        const selectedCount =
            (this.isChildOneSelected ? 1 : 0) +
            (this.isChildTwoSelected ? 1 : 0) +
            (this.isChildThreeSelected ? 1 : 0);

        this.dispatchEvent(
            new CustomEvent('childselectionchange', {
                detail: { selectedCount },
            })
        );
    }

    connectedCallback() {
        this.addEventListener('reset', this.resetSelection.bind(this));
    }

    resetSelection() {
        this.isChildOneSelected = false;
        this.isChildTwoSelected = false;
        this.isChildThreeSelected = false;

        this.dispatchEvent(
            new CustomEvent('childselectionchange', {
                detail: { selectedCount: 0 },
            })
        );
    }
}