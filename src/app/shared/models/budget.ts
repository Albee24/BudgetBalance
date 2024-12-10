import { Transaction } from "./transaction";

export interface Budget {
        name: string;
        balance: string | null;
        description: string | null;
        id?: string;
        transactions: Transaction[]
     }