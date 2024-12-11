import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AppComponent } from './app.component';
import { firebaseConfig } from '../environments/environment';
import { RouterModule, RouterOutlet } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ReactiveFormsModule } from '@angular/forms';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from './shared/services/auth.service';
import { ManageBudgetDialogComponent } from './components/manage-budget-dialog/manage-budget-dialog.component';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { ManageTransactionsDialogComponent } from './components/manage-transactions-dialog/manage-transactions-dialog.component';
import { authGuard } from './shared/guard/auth.guard';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {provideNativeDateAdapter} from '@angular/material/core';
import { RecurringTextPipe } from './shared/utils/recurring.pipe';
import { DatePipe } from '@angular/common'; // Import DatePipe


@NgModule({
  declarations: [
    AppComponent, 
    SignInComponent, 
    SignUpComponent, 
    ForgotPasswordComponent, 
    DashboardComponent, 
    VerifyEmailComponent,
    ManageBudgetDialogComponent,
    ConfirmDialogComponent,
    ManageTransactionsDialogComponent,
    RecurringTextPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterOutlet,
    RouterModule.forRoot([
      { path: '', redirectTo: '/sign-in', pathMatch: 'full' },
      { path: 'sign-in', component: SignInComponent },
      { path: 'sign-up', component: SignUpComponent },
      { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'verify-email-address', component: VerifyEmailComponent }, 
      ]),
    ReactiveFormsModule,
    AngularFireModule.initializeApp(firebaseConfig),  // Initialize Firebase with config
    AngularFirestoreModule,
    AngularFireAuthModule,  // Firebase Authentication module
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    MatExpansionModule,
    MatDialogModule,
    MatOptionModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  bootstrap: [AppComponent],
  providers: [AuthService, provideNativeDateAdapter(), DatePipe]
})
export class AppModule {}