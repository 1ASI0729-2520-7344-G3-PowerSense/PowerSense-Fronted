import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-devices-toolbar',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.css'
})
export class DevicesToolbarComponent {
  @Input() search = '';
  @Input() categories: { value: any; label: string }[] = [];
  @Input() statuses: { value: any; label: string }[] = [];
  @Input() sortFields: { value: any; label: string }[] = [];
  @Input() selectedCategory: any = '';
  @Input() selectedStatus: any = '';
  @Input() sortBy: any = '';
  @Input() sortDir: 'asc' | 'desc' = 'asc';

  @Output() searchChange = new EventEmitter<string>();
  @Output() selectedCategoryChange = new EventEmitter<any>();
  @Output() selectedStatusChange = new EventEmitter<any>();
  @Output() sortByChange = new EventEmitter<any>();
  @Output() sortDirChange = new EventEmitter<'asc' | 'desc'>();
  @Output() export = new EventEmitter<void>();
  @Output() import = new EventEmitter<Event>();
  @Output() setAllActive = new EventEmitter<void>();
  @Output() setAllInactive = new EventEmitter<void>();
}


