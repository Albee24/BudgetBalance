import { Timestamp } from 'firebase/firestore';

export interface Transaction {
        name: string;
        amount: string;
        frequencyNumber: string;
        frequencyType: string;
        recurring: boolean;
        startDate: Timestamp;
        id?: string;
 }