import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  fb=inject(FormBuilder);
  http=inject(HttpClient);
  router=inject(Router);
  authService=inject(AuthService);

  form=this.fb.nonNullable.group({
    username:['',Validators.required],
    email:['',Validators.required],
    password:['',Validators.required],
  });

  onSubmit(): void {
    const rawForm = this.form.getRawValue();
    this.authService.register(rawForm.email, rawForm.username, rawForm.password)
      .subscribe({
        next: () => {
          // Automatski prijavljujemo korisnika nakon uspešne registracije
          this.authService.login(rawForm.email, rawForm.password).subscribe(() => {
            this.router.navigate(['/dashboard']); // Preusmeravanje na dashboard nakon prijave
          });
        },
        error: (err) => {
          this.errorMessage = err.message; // Prikaz greške
        }
      });
  }
  
errorMessage: string | null = null;


}
