import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule, Color } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-reports-monthly-line',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './monthly-line.html',
  styleUrl: './monthly-line.css'
})
export class ReportsMonthlyLineChart {
  @Input() results: any[] = [];
  @Input() scheme!: Color | string;
}


