import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { combineLatest, forkJoin, Observable, of } from 'rxjs';
import { catchError, map, startWith, switchMap, tap } from 'rxjs/operators';
import { Budget } from '../models/budget';
import { AuthService } from './auth.service';
import { Transaction } from '../models/transaction';

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  private budgetsCollection;
  private user !: any;

  constructor(private afs: AngularFirestore, private authService: AuthService) {
     this.user = JSON.parse(localStorage.getItem('user')!);
     this.budgetsCollection = this.afs.collection<Budget>('users/' + this.user.uid + '/budgets');
  }

  // Create a new budget
  createBudget(budget: Budget): Promise<void> {
    console.log('creating new budget', budget);
    const id = this.afs.createId(); // Generates a unique ID
    return this.budgetsCollection.doc(id).set({
      ...budget,
      id: id
    });
  }

  // Get all budgets
  getBudgets(): Observable<Budget[]> {
    return this.budgetsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Budget;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  // Get a specific budget by ID
  getBudget(id: string): Observable<Budget | undefined> {
    return this.budgetsCollection.doc<Budget>(id).valueChanges();
  }

  // Update an existing budget
  updateBudget(id: string, budget: Budget): Promise<void> {
    return this.budgetsCollection.doc(id).update(budget);
  }

  // Delete a budget
  deleteBudget(id: string): Promise<void> {
    return this.budgetsCollection.doc(id).delete();
  }

  getBudgetsWithTransactions(): Observable<Budget[]> {
    return this.budgetsCollection.snapshotChanges().pipe(
      map((budgetDocs) => {
        return budgetDocs.map((budgetDoc) => {
          const data = budgetDoc.payload.doc.data() as Budget;
          const id = budgetDoc.payload.doc.id;
          return { id, ...data };
        });
      }),
      switchMap((budgets) => {
        if (budgets.length === 0) {
          return of([]);
        }
        return combineLatest(
          budgets.map((budget) =>
            this.afs
              .collection<Transaction>(
                `users/${this.user?.uid}/budgets/${budget.id}/transactions`
              )
              .snapshotChanges()
              .pipe(
                map((transactionDocs) => {
                  return transactionDocs.map((transactionDoc) => ({
                    id: transactionDoc.payload.doc.id,
                    ...(transactionDoc.payload.doc.data() as Transaction),
                  }));
                }),
                startWith([]),
                map((transactions) => ({
                  ...budget,
                  transactions,
                })),
                catchError((error) => {
                  console.error(
                    `Error fetching transactions for budget ${budget.id}:`,
                    error
                  );
                  return of({ ...budget, transactions: [] });
                })
              )
          )
        );
      }),
      catchError((error) => {
        console.error('Error fetching budgets or transactions:', error);
        return of([]);
      })
    );
  }
}