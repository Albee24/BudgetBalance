import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';  // Ensure you're using compat API for simplicity
import { Observable } from 'rxjs';
import { Transaction } from '../models/transaction';
import { Budget } from '../models/budget';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private transactionsCollection!: AngularFirestoreCollection<Transaction>;
  private user !: any;

  constructor(private firestore: AngularFirestore) {
    this.user = JSON.parse(localStorage.getItem('user')!);
  }

  setAllTransactions(budget: Budget) {
    if (budget.id)
      this.deleteAllTransactions(budget.id).then(() => {
        const batch = this.firestore.firestore.batch();
  
        budget.transactions.forEach(transaction => {
          const docRef = this.firestore.firestore
            .collection(`users/${this.user.uid}/budgets/${budget.id}/transactions`)
            .doc();
          transaction.id = docRef.id;
          batch.set(docRef, transaction);
        });
        return batch.commit();
      });
  }

  getAllTransactions(budgetId: string): Observable<Transaction[]> {
    console.log('getting all budgets for ' + budgetId);
    this.transactionsCollection = this.firestore.collection<Transaction>('users/' + this.user.uid + '/budgets/' +budgetId + '/transactions');
    return this.transactionsCollection.valueChanges();
  }

  deleteAllTransactions(budgetId: string): Promise<void> {
    const transactionsRef = this.firestore.collection('users/' + this.user.uid + '/budgets/' +budgetId + '/transactions');
    return transactionsRef.get().toPromise().then(querySnapshot => {
      const batch = this.firestore.firestore.batch();
      if (querySnapshot)
        querySnapshot.forEach(doc => {
          const docRef = doc.ref;
          batch.delete(docRef);
        });
      return batch.commit();
    });
  }
}