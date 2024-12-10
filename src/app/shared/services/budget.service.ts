import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Budget } from '../models/budget';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  private budgetsCollection;

  constructor(private afs: AngularFirestore, private authService: AuthService) {
    const user = JSON.parse(localStorage.getItem('user')!);
     this.budgetsCollection = this.afs.collection<Budget>('users/' + user.uid + '/budgets');
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
}