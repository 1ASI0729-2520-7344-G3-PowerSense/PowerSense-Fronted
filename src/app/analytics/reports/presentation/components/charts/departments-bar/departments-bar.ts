import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule, Color } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-reports-departments-bar',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './departments-bar.html',
  styleUrl: './departments-bar.css'
})
export class ReportsDepartmentsBarChart {
  @Input() results: any[] = [];
  @Input() scheme!: Color | string;
}


