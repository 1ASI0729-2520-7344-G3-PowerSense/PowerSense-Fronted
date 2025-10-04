import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Device } from '../../../../domain/model/device';

@Component({
  selector: 'app-device',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatCardModule, MatButtonModule, MatSlideToggleModule],
  templateUrl: './device.html',
  styleUrl: './device.css'
})
export class DeviceCardComponent {
  @Input() device!: Device;
  @Output() toggle = new EventEmitter<Device>();
  @Output() configure = new EventEmitter<Device>();

  deviceCategoryIcon(category: Device['category']): string {
    switch (category) {
      case 'light': return 'lightbulb';
      case 'ac': return 'ac_unit';
      case 'tv': return 'tv';
      case 'refrigerator': return 'kitchen';
      case 'heating': return 'heat_pump';
      case 'computer': return 'computer';
      default: return 'power';
    }
  }

  deviceCategoryColor(category: Device['category']): string {
    switch (category) {
      case 'light': return '#FFC107';
      case 'ac': return '#56CCF2';
      case 'tv': return '#BB6BD9';
      case 'refrigerator': return '#27AE60';
      case 'heating': return '#F2994A';
      case 'computer': return '#2F80ED';
      default: return '#EB5757';
    }
  }

  percentWidth(watts: number): string {
    const clamped = Math.max(0, Math.min(100, watts));
    return clamped + '%';
  }

  onToggle(): void {
    this.toggle.emit(this.device);
  }

  onConfigure(): void {
    this.configure.emit(this.device);
  }

  formatPower(watts: number): string {
    if (watts >= 1000) {
      const kw = watts / 1000;
      const display = kw >= 10 ? kw.toFixed(0) : kw.toFixed(1);
      return `${display} kW`;
    }
    return `${watts} W`;
  }
}


