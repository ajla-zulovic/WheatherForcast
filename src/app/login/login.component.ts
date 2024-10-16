import { Component, inject } from '@angular/core';
import { Route, Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { environment } from '../environments/environment';
import { Auth, signInWithEmailAndPassword } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { User } from '../Models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  router = inject(Router);
  authService=inject(AuthService);

  form = this.fb.nonNullable.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });
  errorMessage: string | null = null;

 
  onSubmit(): void {
    const email = this.form.value.email || ''; 
    const password = this.form.value.password || '';  

    this.authService.login(email, password).subscribe({
        next: (user: User) => {
            if (user.role.roleName === 'admin') {
                this.router.navigate(['/dashboard']);
            } else if (user.role.roleName === 'user') {
                this.router.navigate(['/dashboard']); 
            }
        },
        error: (err) => {
            this.errorMessage = err.message; 
        }
    });
}

 
}
