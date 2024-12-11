import { AfterViewInit, Component, ElementRef, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Budget } from '../../shared/models/budget';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-manage-budget-dialog',
  templateUrl: './manage-budget-dialog.component.html',
  styleUrl: './manage-budget-dialog.component.css'
})
export class ManageBudgetDialogComponent implements OnInit, AfterViewInit {
    budgetForm!: FormGroup;
    budget!: Budget;

  constructor(
    public dialogRef: MatDialogRef<ManageBudgetDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private elementRef: ElementRef
  ) {}

    ngOnInit(): void {
        this.budget = this.data.budget;
        if (!this.budget) {
          this.budget = {
            name: '',
            balance: '0',
            description: '',
            lastUpdated: Timestamp.fromDate(new Date()),
            transactions: []
          };
        }
        this.createBudgetForm();
    }

  ngAfterViewInit() {
    setTimeout(() => {
      const firstFocusable = this.elementRef.nativeElement.querySelector('button, [href], input, mat-input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (firstFocusable && firstFocusable instanceof HTMLElement) {
        firstFocusable.focus();
      }
    }, 0);
  }

    createBudgetForm(){
      this.budgetForm = new FormGroup({
        name: new FormControl(this.budget ? this.budget.name : '',Validators.required),
        description: new FormControl(this.budget ? this.budget.description : '',Validators.required),
        balance: new FormControl(this.budget ? this.budget.balance : '',Validators.required)
      })
    }
  
    submit(){
      if (this.budgetForm) {
        if(this.budgetForm.valid){
          this.budget.name = this.budgetForm.controls['name'].value;
          this.budget.balance = this.budgetForm.controls['balance'].value;
          this.budget.description = this.budgetForm.controls['description'].value;
          this.dialogRef.close(this.budget);
        }
      }
    }

    cancelClick() {
      this.dialogRef.close();
    }
  }