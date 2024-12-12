import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { passwordMatchValidator } from '../../shared/utils/password.validator';

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
        email: new FormControl('', [Validators.required,  Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(6)]),
        confirmPassword: new FormControl('', Validators.required)
      }, { validators: passwordMatchValidator });
    }

    signUp() {
      if (this.signupForm) {
        if (this.signupForm.valid) {
          this.authService.SignUp(
            this.signupForm.value.email,
            this.signupForm.value.password
          );
        }
      }
    } 
  }