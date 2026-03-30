/**
 * Copyright (c) 2024-2026 Kalam. All Rights Reserved.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

import { KalamService } from '../kalam.service';
import { LoaderService } from '../loader.service';
import { RegistrationDetails } from '../sign-up/sign-up.component';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  standalone: false,
})
export class AccountComponent implements OnInit {
  signInForm!: UntypedFormGroup;
  resetForm!: UntypedFormGroup;
  forgotMode = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private snackBar: MatSnackBar,
    private kalamService: KalamService
  ) {}

  ngOnInit(): void {
    this.signInForm = new UntypedFormGroup({
      email: new UntypedFormControl('', [
        Validators.required,
        Validators.email,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'),
      ]),
      password: new UntypedFormControl('', [Validators.required]),
    });

    this.resetForm = new UntypedFormGroup({
      resetEmail: new UntypedFormControl('', [
        Validators.required,
        Validators.email,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'),
      ]),
    });

    this.kalamService.setCoachData({} as RegistrationDetails);

    this.route.queryParams.subscribe((params) => {
      if (params?.['signup'] === 'success') {
        this.openSnackBar(
          'Account created successfully. Please verify your email, then sign in.',
          '',
          7000
        );
      }
    });
  }

  async onSubmit(): Promise<void> {
    if (this.signInForm.invalid) {
      this.markFormTouched(this.signInForm);
      return;
    }

    const email = this.signInForm.value.email;
    const password = this.signInForm.value.password;

    this.loaderService.show();
    try {
      if (true) {
        await this.kalamService.loginWithFirebase(email, password);
        const currentUser = await this.kalamService.reloadCurrentFirebaseUser();
        if (!currentUser?.emailVerified) {
          try {
            await this.kalamService.sendEmailVerification();
          } catch {
          }

          await this.kalamService.logoutFromFirebase();
          this.loaderService.hide();
          this.openSnackBar(
            'Please verify your email before login. We have sent a verification email to your inbox.',
            'red-snackbar',
            8000
          );
          return;
        }
      }

      this.kalamService.getCoachByEmail(email).pipe(take(1)).subscribe({
        next: (res: any) => {
          this.loaderService.hide();
          const data = res.map((document: any) => ({
            id: document.payload.doc.id,
            ...(document.payload.doc.data() as {}),
          }));

          if (!data.length) {
            this.openSnackBar('No coach profile found for this account. Please contact admin.');
            return;
          }

          if (!data[0].approved) {
            const pendingMsg =
              data[0].academyOwned === 'N'
                ? `Your account is not yet approved. Please contact ${data[0].academyName} admin.`
                : 'Your account is pending approval.';
            this.openSnackBar(pendingMsg, 'red-snackbar', 8000);
            return;
          }

          this.kalamService.cacheCoachData(data[0]);
          this.router.navigate(['/home']);
        },
        error: () => {
          this.loaderService.hide();
          this.openSnackBar('Unable to load account profile. Please try again.');
        },
      });
    } catch (error: any) {
      this.loaderService.hide();
      const msg = this.getFirebaseErrorMessage(error?.code);
      this.openSnackBar(msg, 'red-snackbar');
    }
  }

  async sendResetLink(): Promise<void> {
    if (this.resetForm.invalid) {
      this.markFormTouched(this.resetForm);
      return;
    }

    this.loaderService.show();
    try {
      await this.kalamService.sendPasswordReset(this.resetForm.value.resetEmail);
      this.loaderService.hide();
      this.openSnackBar('Password reset link sent to your email. Please check your inbox.');
      this.forgotMode = false;
      this.resetForm.reset();
    } catch (error: any) {
      this.loaderService.hide();
      const msg = this.getFirebaseErrorMessage(error?.code);
      this.openSnackBar(msg, 'red-snackbar');
    }
  }

  signUp(): void {
    this.router.navigate(['/sign-up']);
  }

  toggleForgot(): void {
    this.forgotMode = !this.forgotMode;
  }

  private markFormTouched(form: UntypedFormGroup): void {
    Object.keys(form.controls).forEach((control) => form.controls[control].markAsTouched());
  }

  private openSnackBar(
    message: string,
    panelClass = '',
    duration = 5000,
    horizontalPosition: MatSnackBarHorizontalPosition = 'center',
    verticalPosition: MatSnackBarVerticalPosition = 'top'
  ): void {
    this.snackBar.open(message, '', {
      horizontalPosition,
      verticalPosition,
      duration,
      panelClass: panelClass ? [panelClass] : undefined,
    });
  }

  private getFirebaseErrorMessage(code?: string): string {
    switch (code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'Invalid email or password.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network issue detected. Please check your internet connection.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      default:
        return 'Authentication failed. Please try again.';
    }
  }
}
