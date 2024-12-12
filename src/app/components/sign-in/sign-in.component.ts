import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { Validators, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent implements OnInit {
      loginForm!: FormGroup;
      constructor(private router: Router, private authService: AuthService){}

      ngOnInit(): void {
        this.createLoginForm();
      }

      createLoginForm(){
        this.loginForm = new FormGroup({
          email: new FormControl('', [Validators.required, Validators.email]),
          password: new FormControl('', Validators.required)
        })
      }
    
      logIn(){
        if (this.loginForm) {
          if(this.loginForm.valid){
            this.authService.SignIn(this.loginForm.value.email, this.loginForm.value.password)
          }
        }
      }
  }