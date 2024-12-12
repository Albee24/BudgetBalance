import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({ 
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent implements OnInit {
      resetForm!: FormGroup;
      constructor(private authService: AuthService, private router: Router) {}

      ngOnInit(): void {
        this.resetForm = new FormGroup({
          email: new FormControl('', [Validators.required, Validators.email]),
        });
      }
    
      sendResetLink() {
        if (this.resetForm) {
          if (this.resetForm.valid) {
            this.authService.ForgotPassword(this.resetForm.value.email).then(() => {
              this.router.navigate(['/sign-in']);
             });
          }
        }
      }
    }