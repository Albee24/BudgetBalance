import { Timestamp } from 'firebase/firestore';

export interface Transaction {
        name: string;
        amount: string;
        frequencyNumber: string;
        frequencyType: string;
        recurring: string;
        startDate: Timestamp;
        untilDate: Timestamp;
        id?: string;
 }