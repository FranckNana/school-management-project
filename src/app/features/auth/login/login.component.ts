import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ErrorService } from '../../../core/services/error.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy{
  loginForm: FormGroup;
  hidePassword = true;
  isLoading = false;
  copyRightDate : number = new Date().getFullYear();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private errorService: ErrorService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password)
      .then(() => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      })
      .catch((error) => {
        this.isLoading = false;
        this.errorService.handleError(error);
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  logout(): void {

  }



  getErrorMessage(controlName: string): string {
    const control = this.loginForm.get(controlName);
    if (control?.hasError('required')) {
      return 'Ce champ est requis';
    }
    if (control?.hasError('email')) {
      return 'Email invalide';
    }
    if (control?.hasError('minlength')) {
      return 'Le mot de passe doit contenir au moins 6 caractères';
    }
    return '';
  }

  ngOnInit(): void {
    // Désactiver le défilement
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy(): void {
    // Réactiver le défilement
    document.body.style.overflow = '';
  }
}