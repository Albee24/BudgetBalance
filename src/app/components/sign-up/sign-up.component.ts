import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})

export class SignUpComponent implements OnInit {
    signupForm!: FormGroup;
    constructor(private authService: AuthService) {}

    ngOnInit(): void {
      this.createForm();
    }

    createForm() {
      this.signupForm = new FormGroup({
        email: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required),
        confirmPassword: new FormControl('', Validators.required)
      });
    }

    signUp() {
      if (this.signupForm) {
       if (this.signupForm.get('password')?.value.equalsIgnoreCase('test')) {
        console.log('test');
       }
        if (this.signupForm.valid) {
          this.authService.SignUp(
            this.signupForm.value.email,
            this.signupForm.value.password
          );
        }
      }
    } 
  }