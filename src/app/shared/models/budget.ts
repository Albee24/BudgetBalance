import { Transaction } from "./transaction";
import { Timestamp } from 'firebase/firestore';

export interface Budget {
        name: string;
        balance: string | null;
        description: string | null;
        id?: string;
        lastUpdated: Timestamp;
        transactions: Transaction[]
     }