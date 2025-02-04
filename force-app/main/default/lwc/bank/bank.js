import { LightningElement } from 'lwc';
import banklogo from '@salesforce/resourceUrl/Banklogo';
import cardLogo from '@salesforce/resourceUrl/Card';
 

export default class Bank extends LightningElement {

    logoUrl = banklogo;
    cardUrl = cardLogo;
 
}