import { createElement } from 'lwc';
import AccountOpportunityRecordsDisplay from 'c/accountOpportunityRecordsDisplay';
import getAccounts from '@salesforce/apex/accountRelatedOpportunityModal.accountRecordsToDisplay';
import { NavigationMixin } from 'lightning/navigation';

// Mock Apex method
jest.mock('@salesforce/apex/accountRelatedOpportunityModal.accountRecordsToDisplay', () => ({
    default: jest.fn()
}));

describe('c-account-opportunity-records-display', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        jest.clearAllMocks(); // Clear mocks after each test
    });

    it('renders accounts successfully', async () => {
        // Mock account data
        const mockAccounts = [
            { Id: '0011A00000xyz123Q', Name: 'Test Account 1', Industry: 'Technology', Phone: '1234567890' },
            { Id: '0011A00000xyz456Q', Name: 'Test Account 2', Industry: 'Finance', Phone: '0987654321' }
        ];

        // Mock resolved Apex method
        getAccounts.mockResolvedValue(mockAccounts);

        // Create element
        const element = createElement('c-account-opportunity-records-display', {
            is: AccountOpportunityRecordsDisplay
        });

        document.body.appendChild(element);

        // Wait for async DOM updates
        await Promise.resolve();

        // Verify data rendering
        const rows = element.shadowRoot.querySelectorAll('tbody tr');
        expect(rows.length).toBe(2); // 2 accounts should be displayed

        // Verify displayed data
        expect(rows[0].textContent).toContain('Test Account 1');
        expect(rows[1].textContent).toContain('Test Account 2');
    });

    it('handles error scenario', async () => {
        // Mock rejection of Apex call
        getAccounts.mockRejectedValue(new Error('Apex method failed'));

        // Create component
        const element = createElement('c-account-opportunity-records-display', {
            is: AccountOpportunityRecordsDisplay
        });

        document.body.appendChild(element);

        // Wait for async DOM updates
        await Promise.resolve();

        // Verify error message is displayed
        const errorElement = element.shadowRoot.querySelector('.slds-text-color_error');
        expect(errorElement).not.toBeNull();
        expect(errorElement.textContent).toBe('Error fetching accounts: Apex method failed');
    });

    it('navigates to the correct URL when clicking "View Opportunities"', async () => {
        const mockAccounts = [
            { Id: '0011A00000xyz123Q', Name: 'Test Account 1', Industry: 'Technology', Phone: '1234567890' }
        ];
        getAccounts.mockResolvedValue(mockAccounts);

        const element = createElement('c-account-opportunity-records-display', {
            is: AccountOpportunityRecordsDisplay
        });

        document.body.appendChild(element);

        await Promise.resolve(); // Wait for rendering

        // Mock NavigationMixin
        element[NavigationMixin.Navigate] = jest.fn();

        // Simulate button click
        const button = element.shadowRoot.querySelector('lightning-button');
        button.dispatchEvent(new CustomEvent('click'));

        // Verify navigation call
        expect(element[NavigationMixin.Navigate]).toHaveBeenCalledWith({
            type: 'standard__webPage',
            attributes: {
                url: `/opportunityfetchrecord?c__recordId=0011A00000xyz123Q`
            }
        });
    });
});
