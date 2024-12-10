import { AfterViewInit, Component, ElementRef, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Budget } from '../../shared/models/budget';
import { TransactionService } from '../../shared/services/transaction.service';

@Component({
  selector: 'app-manage-transactions-dialog',
  templateUrl: './manage-transactions-dialog.component.html',
  styleUrl: './manage-transactions-dialog.component.css'
})
export class ManageTransactionsDialogComponent  implements OnInit, AfterViewInit {
    transactionForm!: FormGroup;
    budget!: Budget;

  constructor(
    public dialogRef: MatDialogRef<ManageTransactionsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private elementRef: ElementRef,
    private transactionService: TransactionService
  ) {}

    ngOnInit(): void {
        this.budget = this.data.budget;
        if (!this.budget.transactions && this.budget.id) {
          this.transactionService.getAllTransactions(this.budget.id).subscribe(result => {
            if (result)
              this.budget.transactions = result;
          })
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
        frequencyType: new FormControl('',Validators.required),
        frequencyNumber: new FormControl('',Validators.required),
        recurring: new FormControl('',Validators.required)
      })
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
          }
          this.budget.transactions?.push(transaction);
          this.transactionForm.controls['name'].setValue('');
          this.transactionForm.controls['amount'].setValue('');
          this.transactionForm.controls['frequencyType'].setValue('');
          this.transactionForm.controls['frequencyNumber'].setValue('');
          this.transactionForm.controls['recurring'].setValue('');
        }
      }
    }

    save() {
      this.dialogRef.close(this.budget);
    }

    cancel() {
      this.dialogRef.close();
    }
  }