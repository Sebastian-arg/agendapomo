import { Component, signal, computed, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Importación corregida para el componente de la sidebar derecha
// Ajustá la ruta si tu archivo se llama diferente o está en otra ubicación (ej: '../semana/semana')
import { SemanaComponent } from '../semana/semana';

type ViewMode = 'month' | 'week';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
}

interface CalendarEvent {
  id: number;
  titulo: string;
  fecha: string; // ISO date string 'YYYY-MM-DD'
  descripcion?: string;
}

@Component({
  selector: 'app-calendario',
  standalone: true,
  // Importaciones: CommonModule, DatePipe, FormsModule, y SemanaComponent
  imports: [CommonModule, DatePipe, SemanaComponent, FormsModule],
  providers: [DatePipe],  
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendario.html',
  styleUrls: ['./calendario.css']
})
export class CalendarioComponent implements OnInit {

  // Vista y fecha actual
  viewMode = signal<ViewMode>('month');
  current = signal<Date>(new Date());
  readonly dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  // --- Lógica del Grid Mensual ---
  monthGrid = computed<CalendarDay[]>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const currentDate = this.current();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    let startDayOfWeek = firstDayOfMonth.getDay();

    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(firstDayOfMonth.getDate() - startDayOfWeek);

    const days: CalendarDay[] = [];
    const numDaysToShow = 42; 

    for (let i = 0; i < numDaysToShow; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const isCurrentMonth = date.getMonth() === month;
      const isToday = date.getTime() === today.getTime();
      days.push({ date, isCurrentMonth, isToday });
    }
    return days;
  });

  // Navegación
  setViewMode(mode: ViewMode): void { this.viewMode.set(mode); }
  navigate(amount: number): void {
    this.current.update(currentDate => {
      const newDate = new Date(currentDate.getTime());
      if (this.viewMode() === 'month') newDate.setMonth(newDate.getMonth() + amount);
      else newDate.setDate(newDate.getDate() + (amount * 7)); 
      return newDate;
    });
  }
  setToday(): void { this.current.set(new Date()); }

  // -----------------------
  // 🟣 MODAL / CRUD EVENTOS
  // -----------------------
  modalEventosOpen = signal(false);
  eventos = signal<CalendarEvent[]>([]);
  agregando = signal(false);
  editando = signal<number | null>(null);

  eventoTitulo = '';
  eventoFecha = ''; 
  eventoDescripcion = '';
  private nextId = 1;

  constructor(private datePipe: DatePipe) {}

  ngOnInit(): void {
    // Ejemplo de evento (simula la tarea del día 5)
    const currentMonth = this.current().getMonth() + 1; // 1-12
    const currentYear = this.current().getFullYear();
    
    this.eventos.set([
      { 
        id: this.nextId++, 
        titulo: 'Reunión de proyecto', 
        fecha: `${currentYear}-${String(currentMonth).padStart(2, '0')}-05`, 
        descripcion: 'Preparar presentación final.' 
      }
    ]);
  }

  openEventosModal(event?: Event) {
    if (event) event.preventDefault();
    this.modalEventosOpen.set(true);
    this.cancelForm(false);
  }

  closeEventosModal() {
    this.modalEventosOpen.set(false);
    this.cancelForm(false);
  }

  startAgregar() {
    this.agregando.set(true);
    this.editando.set(null);
    this.eventoTitulo = '';
    this.eventoFecha = this.datePipe.transform(new Date(), 'yyyy-MM-dd') || '';
    this.eventoDescripcion = '';
  }

  startEditar(id: number) {
    const found = this.eventos().find(e => e.id === id);
    if (!found) return;
    this.editando.set(id);
    this.agregando.set(false);
    this.eventoTitulo = found.titulo;
    this.eventoFecha = found.fecha;
    this.eventoDescripcion = found.descripcion || '';
  }

  cancelForm(closeForm = true) {
    this.agregando.set(false);
    this.editando.set(null);
    this.eventoTitulo = '';
    this.eventoFecha = '';
    this.eventoDescripcion = '';
  }

  guardarEvento() {
    const titulo = this.eventoTitulo?.trim();
    const fecha = this.eventoFecha; 
    if (!titulo || !fecha) {
      console.error('ERROR: Completá al menos Título y Fecha.');
      return;
    }

    if (this.editando() !== null) {
      const id = this.editando() as number;
      const updated = this.eventos().map(e => {
        if (e.id === id) {
          return { ...e, titulo, fecha, descripcion: this.eventoDescripcion };
        }
        return e;
      });
      this.eventos.set(updated);
      this.cancelForm();
      return;
    }

    const nuevo: CalendarEvent = {
      id: this.nextId++,
      titulo,
      fecha,
      descripcion: this.eventoDescripcion
    };
    this.eventos.update(prev => [...prev, nuevo]);
    this.cancelForm();
  }

  eliminarEvento(id: number) {
    console.warn(`Simulando confirmación: Eliminando evento con ID ${id}`);
    
    this.eventos.update(prev => prev.filter(e => e.id !== id));
    if (this.editando() === id) this.cancelForm();
  }

  hasEvents(date: Date): boolean {
    const dateStr = this.datePipe.transform(date, 'yyyy-MM-dd');
    return this.eventos().some(e => e.fecha === dateStr);
  }

}
