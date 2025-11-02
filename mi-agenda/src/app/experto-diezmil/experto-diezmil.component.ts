import { Component, computed, signal, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-experto-diezmil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experto-diezmil.component.html',
  styleUrls: ['./experto-diezmil.component.css']
})
export class ExpertoDiezmilComponent implements OnChanges {

  @Input() pomodoroCount: number = 0;

  // Señal para almacenar las horas acumuladas
  horasAcumuladas = signal(0);

  // Señal computada para calcular el progreso en porcentaje
  progreso = computed(() => {
    const totalHoras = 10000;
    const porcentaje = Math.min((this.horasAcumuladas() / totalHoras) * 100, 100);
    return porcentaje;
  });

  // Se ejecuta cada vez que un @Input cambia
  ngOnChanges(changes: SimpleChanges): void {
    // Verificamos si el input que cambió es 'pomodoroCount'
    if (changes['pomodoroCount']) {
      const nuevosPomodoros = changes['pomodoroCount'].currentValue;
      // Cada pomodoro dura 25 minutos. Lo convertimos a horas.
      const nuevasHoras = (nuevosPomodoros * 25) / 60;
      // Actualizamos la señal con las nuevas horas calculadas
      this.horasAcumuladas.set(parseFloat(nuevasHoras.toFixed(2)));
    }
  }
}
