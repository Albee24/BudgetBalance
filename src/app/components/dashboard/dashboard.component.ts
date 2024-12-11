import { Component, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ManageBudgetDialogComponent } from '../manage-budget-dialog/manage-budget-dialog.component';
import { Budget } from '../../shared/models/budget';
import { BudgetService } from '../../shared/services/budget.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ManageTransactionsDialogComponent } from '../manage-transactions-dialog/manage-transactions-dialog.component';
import { TransactionService } from '../../shared/services/transaction.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  readonly panelOpenState = signal(false);
  budgets: Budget[] = [];
  expandedCards: boolean[] = this.budgets.map(() => true);

  public constructor(
    public dialog: MatDialog, 
    private budgetService: BudgetService,  
    private transactionService: TransactionService) {}
    private checkedForBalanceUpdate = false;

  ngOnInit(): void {
    this.budgetService.getBudgetsWithTransactions().subscribe((result) => {
      this.budgets = result;
      if (!this.checkedForBalanceUpdate) {
        this.updateBudgetBalancesIfNeeded(this.budgets);
      }
    });
  }

  updateBudgetBalancesIfNeeded(budgets: Budget[]) {
    budgets.forEach((budget: Budget) => {
        const today = new Date();
        const budgetLastUpdate = budget.lastUpdated.toDate()
        console.log(budgetLastUpdate);
        if (budgetLastUpdate.getDate() != today.getDate() || budgetLastUpdate.getMonth() != today.getMonth() || budgetLastUpdate.getFullYear != today.getFullYear) {
          this.updateBalanceForDate(budget, true)
        }
        this.checkedForBalanceUpdate = true;
    });
  }

  updateBalanceForDate(budget: Budget, shouldUpdateDb: boolean) {
    throw new Error('Method not implemented.');
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
}
