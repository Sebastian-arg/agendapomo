import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-semana',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './semana.html',
  styleUrls: ['./semana.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SemanaComponent {
    eventos: any[] = [
    
    ];
}
