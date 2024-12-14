import { Timestamp } from 'firebase/firestore';

export interface Transaction {
        name: string;
        amount: number;
        type: string;
        frequencyNumber: number;
        frequencyType: string;
        recurring: string;
        startDate: Timestamp;
        untilDate: Timestamp;
        id?: string;
 }