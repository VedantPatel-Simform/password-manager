import { Component } from '@angular/core';
import { Dropdown, DropdownItem, DropdownModule } from 'primeng/dropdown';
@Component({
  selector: 'app-password-dashboard',
  imports: [DropdownModule],
  templateUrl: './password-dashboard.component.html',
  styleUrl: './password-dashboard.component.css',
})
export class PasswordDashboardComponent {}
