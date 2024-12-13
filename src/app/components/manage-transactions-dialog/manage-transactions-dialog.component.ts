import { AfterViewInit, Component, ElementRef, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Budget } from '../../shared/models/budget';
import { TransactionService } from '../../shared/services/transaction.service';
import { Transaction } from '../../shared/models/transaction';

@Component({
  selector: 'app-manage-transactions-dialog',
  templateUrl: './manage-transactions-dialog.component.html',
  styleUrl: './manage-transactions-dialog.component.css'
})
export class ManageTransactionsDialogComponent  implements OnInit, AfterViewInit {
    transactionForm!: FormGroup;
    budget!: Budget;
    startingTransactions: Transaction[] = []
    editId = '';

  constructor(
    public dialogRef: MatDialogRef<ManageTransactionsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private elementRef: ElementRef,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
      this.budget = this.data.budget;
      if (this.budget.transactions.length == 0 && this.budget.id) {
        this.transactionService.getAllTransactions(this.budget.id).subscribe(result => {
          if (result)
            this.budget.transactions = result;
            this.startingTransactions = this.budget.transactions.map(transaction => ({ ...transaction }));
        })
      } else {
        this.startingTransactions = this.budget.transactions.map(transaction => ({ ...transaction }));
      }
      this.createTransactionForm();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const firstFocusable = this.elementRef.nativeElement.querySelector('button, [href], input, mat-input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (firstFocusable && firstFocusable instanceof HTMLElement) {
        firstFocusable.focus();
      }
    }, 0);
  }

  createTransactionForm(){
    this.transactionForm = new FormGroup({
      name: new FormControl('',Validators.required),
      amount: new FormControl('',Validators.required),
      startDate: new FormControl('',Validators.required),
      recurring: new FormControl('',Validators.required),
      frequencyType: new FormControl(''),
      frequencyNumber: new FormControl(''),
      untilDate: new FormControl('')
    })
    this.transactionForm.get('recurring')?.valueChanges.subscribe((value) => {
      this.adjustRequiredFields(value);
    });
  }
  
  submit(){
    if (this.transactionForm) {
      if(this.transactionForm.valid){
        const transaction = {
          name: this.transactionForm.controls['name'].value,
          amount: this.transactionForm.controls['amount'].value,
          frequencyType: this.transactionForm.controls['frequencyType'].value,
          frequencyNumber: this.transactionForm.controls['frequencyNumber'].value,
          recurring: this.transactionForm.controls['recurring'].value,
          startDate: this.transactionForm.controls['startDate'].value,
          untilDate: this.transactionForm.controls['untilDate'].value,
          id: this.editId
        }
        if (this.editId) {
          this.budget.transactions = this.budget.transactions.map(foundTransaction =>
            foundTransaction.id === this.editId ? transaction : foundTransaction
          );
          this.editId = '';
        } else {
          this.budget.transactions?.push(transaction);
        }
        this.transactionForm.controls['name'].setValue('');
        this.transactionForm.controls['amount'].setValue('');
        this.transactionForm.controls['frequencyType'].setValue('');
        this.transactionForm.controls['frequencyNumber'].setValue('');
        this.transactionForm.controls['recurring'].setValue('');
        this.transactionForm.controls['startDate'].setValue('');
        this.transactionForm.controls['untilDate'].setValue('');
      }
    }
  }

  save() {
    this.dialogRef.close(this.budget);
  }

  cancel() {
    this.budget.transactions = this.startingTransactions;
    this.dialogRef.close();
  }

  adjustRequiredFields(newValue: any) {
    if (newValue === 'Yes') {
      this.transactionForm.get('frequencyType')?.setValidators([Validators.required]);
      this.transactionForm.get('frequencyNumber')?.setValidators([Validators.required]);
      this.transactionForm.get('untilDate')?.setValidators([Validators.required]);
    } else {
      this.transactionForm.controls['frequencyType'].clearValidators();
      this.transactionForm.controls['frequencyNumber'].clearValidators();
      this.transactionForm.controls['untilDate'].clearValidators();
    }
    this.transactionForm.get('frequencyType')?.updateValueAndValidity();
    this.transactionForm.get('frequencyNumber')?.updateValueAndValidity();
    this.transactionForm.get('untilDate')?.updateValueAndValidity();
  }

  trackByFn(index: number, item: Transaction): any {
    return item.id;
  }

  removeTransaction(transaction: Transaction): void {
    const index = this.budget.transactions.findIndex((tran) => tran.id === transaction.id);
    if (index !== -1) {
      this.budget.transactions.splice(index, 1);
    }
  }

  areTransactionsEqual(list1: Transaction[], list2: Transaction[]): boolean {
    if (list1.length !== list2.length) {
      return false;
    }
  
    for (let i = 0; i < list1.length; i++) {
      const transaction1 = list1[i];
      const transaction2 = list2[i];
  
      if (transaction1.id !== transaction2.id ||
          transaction1.name !== transaction2.name ||
          transaction1.amount !== transaction2.amount ||
          transaction1.recurring !== transaction2.recurring ||
          transaction1.frequencyType !== transaction2.frequencyType ||
          transaction1.frequencyNumber !== transaction2.frequencyNumber) {
        return false;
      }
    }
  
    return true;
  }

  editTransaction(tran: Transaction) {
    console.log('editing tran', tran);
    console.log(tran.untilDate, typeof tran.untilDate);
    this.transactionForm.controls['name'].setValue(tran.name);
    this.transactionForm.controls['amount'].setValue(tran.amount);
    this.transactionForm.controls['startDate'].setValue(tran.startDate.toDate());
    this.transactionForm.controls['recurring'].setValue(tran.recurring);
    this.transactionForm.controls['untilDate'].setValue(tran.untilDate ? tran.untilDate.toDate() : '');
    this.transactionForm.controls['frequencyType'].setValue(tran.frequencyType ? tran.frequencyType : '');
    this.transactionForm.controls['frequencyNumber'].setValue(tran.frequencyNumber ? tran.frequencyNumber : '');
    if (tran.id) {
      this.editId = tran.id;
    }
  }
}