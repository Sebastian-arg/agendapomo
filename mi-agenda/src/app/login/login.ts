import { Component } from '@angular/core';
import { Router } from '@angular/router'; 
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http'; 
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: true,
  imports: [ FormsModule],
  
  animations: [
    trigger('loginFadeIn', [
      state('void', style({ opacity: 0, transform: 'translateY(20px)' })),
      transition(':enter', [
        animate('0.6s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})

export class LoginComponent { 

  email: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router) {} 

  login() {

        this.http.post('http://localhost:8000/api/login', { 
            email: this.email, 
            password: this.password 
        }).subscribe({
            next: (res: any) => {
                if (res.success && res.token) {
                    localStorage.setItem('user_token', res.token);
                    console.log('Login exitoso.');
                    this.router.navigate(['/calendario']);
                } else if (res.success) {
                    console.error('Login exitoso pero no se recibió el token.');
                    this.router.navigate(['/calendario']); 
                } else {
                    console.log(res.message);
                }
            },
            error: (err) => {
                console.error('Error al conectar con el backend', err);
                console.log('No se pudo conectar con el servidor');
            }
        });
    }
}
