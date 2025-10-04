import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './rooms.html',
  styleUrl: './rooms.css'
})
export class RoomsCardComponent {
  @Input() rooms: { roomId: string; roomName: string; devices: any[]; totalWatts: number; active: number }[] = [];
  @Output() setRoomActive = new EventEmitter<string>();
  @Output() setRoomInactive = new EventEmitter<string>();

  formatPower(watts: number): string {
    if (watts >= 1000) {
      const kw = watts / 1000;
      const display = kw >= 10 ? kw.toFixed(0) : kw.toFixed(1);
      return `${display} kW`;
    }
    return `${watts} W`;
  }

  roomIcon(roomName: string): string {
    const name = (roomName || '').toLowerCase();
    if (name.includes('cocina')) return 'kitchen';
    if (name.includes('dorm') || name.includes('habitación') || name.includes('habitacion')) return 'bed';
    if (name.includes('oficina') || name.includes('office')) return 'work';
    if (name.includes('sala') || name.includes('living')) return 'weekend';
    return 'home';
  }

  roomColor(roomName: string): string {
    const name = (roomName || '').toLowerCase();
    if (name.includes('cocina')) return 'var(--ps-cat-refrigerator)';
    if (name.includes('dorm') || name.includes('habitación') || name.includes('habitacion')) return 'var(--ps-cat-heating)';
    if (name.includes('oficina') || name.includes('office')) return 'var(--ps-cat-computer)';
    if (name.includes('sala') || name.includes('living')) return 'var(--ps-cat-tv)';
    return '#BB6BD9';
  }
}


