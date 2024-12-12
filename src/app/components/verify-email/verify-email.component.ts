import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.css'
})
export class VerifyEmailComponent implements OnInit {
  constructor(private router: Router){}
  ngOnInit(): void {
    setTimeout(() => {
      this.router.navigate(['/sign-in']);
    }, 5000)
  }
  
}
