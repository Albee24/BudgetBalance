import { Pipe, PipeTransform } from '@angular/core';
import { Transaction } from '../models/transaction';
import { DatePipe } from '@angular/common';
import { Timestamp } from 'firebase/firestore';

@Pipe({
  name: 'recurringText',
  pure: true
})
export class RecurringTextPipe implements PipeTransform {
    
  constructor(private datePipe: DatePipe) {}

  transform(transaction: Transaction): string {
    console.log(typeof(transaction.untilDate) + ' ' + transaction.untilDate);

    let formattedStartDate;
    if (transaction.startDate && transaction.startDate instanceof Timestamp) {
        formattedStartDate = this.datePipe.transform(transaction.startDate.toDate(), 'MMM dd, yyyy');
    } else {
        formattedStartDate = this.datePipe.transform(transaction.startDate, 'MMM dd yyyy');
    }

    let formattedDate;
    if (transaction.untilDate && transaction.untilDate instanceof Timestamp) {
        formattedDate = this.datePipe.transform(transaction.untilDate.toDate(), 'MMM dd, yyyy');
    } else {
        formattedDate = this.datePipe.transform(transaction.untilDate, 'MMM dd yyyy');
    }
    if (transaction.recurring === 'Yes') {
        return `every ${transaction.frequencyNumber} ${transaction.frequencyType.toLowerCase()} from ${formattedStartDate} until ${formattedDate}`;
    }

    if (transaction.startDate && transaction.startDate instanceof Timestamp) {
        if (transaction.startDate.toDate() > new Date()) {
            return `on ${formattedStartDate}`;
        }
    } else {
        return `on ${formattedStartDate}`;
    }
    return '';
  }
}