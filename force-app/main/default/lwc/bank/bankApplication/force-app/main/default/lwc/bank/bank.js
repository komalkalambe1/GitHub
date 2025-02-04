import { LightningElement } from 'lwc';
import banklogo from '@salesforce/resourceUrl/banklogo';
import cardLogo from '@salesforce/resourceUrl/cardLogo';

export default class Bank extends LightningElement {

logoUrl = banklogo;
cardUrl = cardLogo;

}