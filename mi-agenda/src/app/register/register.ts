import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; 
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
  animations: [
    trigger('registerFadeIn', [
      state('void', style({ opacity: 0, transform: 'translateY(20px)' })),
      transition(':enter', [
        animate('0.6s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  register() {
  if (this.password !== this.confirmPassword) {
    console.error('Las contraseñas no coinciden.');
    alert('Las contraseñas no coinciden.');
    return;
  }

  const payload = {
    name: this.name,
    email: this.email,
    password: this.password,
    password_confirmation: this.confirmPassword
  };

  const apiUrl = 'http://localhost:8000/api/register';

  this.http.post(apiUrl, payload).subscribe({
    next: (response) => {
      console.log('Registro exitoso!', response);
      alert('¡Registro completado con éxito! Sera redirigido al login');
      this.router.navigate(['/login']);
    },
    error: (error) => {
      console.error('Error durante el registro:', error);
      alert('Error: ' + (error.error.message || 'No se pudo completar el registro.'));
    }
  });
}
}
