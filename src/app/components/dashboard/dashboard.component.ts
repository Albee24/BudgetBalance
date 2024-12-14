import { Component, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ManageBudgetDialogComponent } from '../manage-budget-dialog/manage-budget-dialog.component';
import { Budget } from '../../shared/models/budget';
import { BudgetService } from '../../shared/services/budget.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ManageTransactionsDialogComponent } from '../manage-transactions-dialog/manage-transactions-dialog.component';
import { TransactionService } from '../../shared/services/transaction.service';
import { Timestamp } from 'firebase/firestore';
import { addMonths, isSameDay, addWeeks, addDays, addYears, isBefore } from 'date-fns';
import { FormControl } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  transactionDate: Date = new Date();
  transactionDatePickerControl = new FormControl(this.transactionDate);
  readonly panelOpenState = signal(false);
  budgets: Budget[] = [];
  expandedCards: boolean[] = this.budgets.map(() => true);
  transactionDateHasChanged = false;

  public constructor(
    public dialog: MatDialog, 
    private budgetService: BudgetService,  
    private transactionService: TransactionService) {}
    private checkedForBalanceUpdate = false;

  ngOnInit(): void {
    this.budgetService.getBudgetsWithTransactions().subscribe((result) => {
      this.budgets = result;
      if (!this.checkedForBalanceUpdate && this.atLeastOneBudgetHasTransactions(this.budgets)) {
        this.updateBudgetBalancesIfNeeded(this.budgets);
      }
    });
  }

  resetBudgets() {
    this.transactionDate = new Date();
    this.transactionDatePickerControl = new FormControl(this.transactionDate);
    this.budgets = [];
    this.transactionDateHasChanged = false;
    this.ngOnInit();
  }

  onTransactionDateChange($event: MatDatepickerInputEvent<any,any>) {
    this.transactionDateHasChanged = true;
    this.transactionDate = $event.target.value;
    this.budgets.forEach((budget: Budget) => {
      this.updateBalanceForDate(budget, Timestamp.fromDate($event.target.value), false);
    });
  }

  atLeastOneBudgetHasTransactions(budgets: Budget[]): boolean {
    let hasBudget = false;
    budgets.forEach((budget: Budget) => {
      if (budget.transactions && budget.transactions.length > 0) {
        hasBudget = true;
        return;
      }
    });
    return hasBudget;
  }

  updateBudgetBalancesIfNeeded(budgets: Budget[]) {
    budgets.forEach((budget: Budget) => {
        const today = new Date();
        const budgetLastUpdate = budget.lastUpdated.toDate()
        if (budgetLastUpdate < today) {
          this.updateBalanceForDate(budget, Timestamp.fromDate(new Date()), true)
        }
        this.checkedForBalanceUpdate = true;
    });
  }

  updateBalanceForDate(budget: Budget, newDate: Timestamp, shouldUpdateDb: boolean) {
    let newBalance = 0;
    if (budget.balance) {
      newBalance = +budget.balance;
    }
    
    budget.transactions.forEach(transaction => {
      let occurrences = 0;
      if (transaction.startDate.toDate() <= newDate.toDate() && transaction.untilDate.toDate() >= newDate.toDate()){
        switch (transaction.frequencyType) {
          case 'Day': {
            let lastTransactionDate = transaction.startDate.toDate();
            while (lastTransactionDate <= newDate.toDate()) {
              if (lastTransactionDate > budget.lastUpdated.toDate()) {
                occurrences++;
              }
              lastTransactionDate = addDays(lastTransactionDate, transaction.frequencyNumber);
            }
            break;
          }
          case 'Weeks': {
            let lastTransactionDate = transaction.startDate.toDate();
            while (lastTransactionDate <= newDate.toDate()) {
              if (lastTransactionDate > budget.lastUpdated.toDate()) {
                occurrences++;
              }
              lastTransactionDate = addWeeks(lastTransactionDate, transaction.frequencyNumber);
            }
            break;
          }
          case 'Months': {
            let lastTransactionDate = transaction.startDate.toDate();
            while (lastTransactionDate <= newDate.toDate()) {
              if (lastTransactionDate > budget.lastUpdated.toDate()) {
                occurrences++;
              }
              lastTransactionDate = addMonths(lastTransactionDate, transaction.frequencyNumber);
            }
            break;
          }
          case 'Years': {
            let lastTransactionDate = transaction.startDate.toDate();
            while (lastTransactionDate <= newDate.toDate()) {
              if (lastTransactionDate > budget.lastUpdated.toDate()) {
                occurrences++;
              }
              lastTransactionDate = addYears(lastTransactionDate, transaction.frequencyNumber);
            }
            break;
          }
          default: {
            if (isBefore(transaction.startDate.toDate(), newDate.toDate())) {
              occurrences++;
            }
            break;
          }
        }
      }
      if (occurrences > 0) {
        console.log('found a transaction that needs' + occurrences + ' occurence(s) to be applied toward the budget ', transaction);
      }
      if (transaction.type == 'Expense') {
        newBalance -= occurrences * transaction.amount;
      } else {
        newBalance += occurrences * transaction.amount;
      }
    });

    if (!isSameDay(budget.lastUpdated.toDate(), newDate.toDate())) {
      budget.lastUpdated = newDate;
      budget.balance = '' + newBalance;
      console.log('updating budget with new balance ' + budget.balance + ' and new updateDate ' + newDate.toString());
      if (shouldUpdateDb && budget.id) {
        this.budgetService.updateBudget(budget.id, budget);
        console.log('and writing it to the db');
      }
    }
  }

  togglePanelState(index: number): boolean {
    this.expandedCards[index] = !this.expandedCards[index];
    if (this.budgets[index].transactions.length == 0 && this.budgets[index].id) {
        this.transactionService.getAllTransactions(this.budgets[index].id).subscribe(result => {
          if (result)
            this.budgets[index].transactions = result;
        })
    }
    return this.expandedCards[index];
  }

  createBudget() {
    this.dialog.open(ManageBudgetDialogComponent, {
      autoFocus: false,
      data: {
        budget: null
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        const newBudget: Budget = result;
        this.budgetService.createBudget(newBudget);
      }
    });
  }

  editBudget(budget: Budget) {
    this.dialog.open(ManageBudgetDialogComponent, {
      autoFocus: false,
      data: {
        budget: budget
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        const updatedBudget: Budget = result;
        if (budget.id) {
          this.budgetService.updateBudget(budget.id, updatedBudget);
        }
      }
    });
  }

  deleteBudget(budget: Budget) {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Are you sure you want to delete this budget?'
      }
    }).afterClosed().subscribe(result => {
      if (result && budget.id) {
        this.transactionService.deleteAllTransactions(budget.id).then(() => {
          if (budget.id)
          this.budgetService.deleteBudget(budget.id);
        })
      }
    });
  }

  manageTransactions(budget: Budget) {
    this.dialog.open(ManageTransactionsDialogComponent, {
      autoFocus: false,
      width: '900px',
      data: {
        budget: budget
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        const newBudget: Budget = result;
        this.transactionService.setAllTransactions(newBudget);
      }
    });
  }

  duplicateBudget(budget: Budget) {
    budget.name = budget.name + ' (Copy)'
    this.budgetService.createBudget(budget).then((newId) => {
      const newBudget = {
         ...budget, 
         id : newId 
      };
      this.transactionService.setAllTransactions(newBudget);
    })
  }
}
