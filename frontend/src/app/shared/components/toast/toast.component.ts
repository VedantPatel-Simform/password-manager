import { Component } from '@angular/core';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-toast',
  imports: [ToastModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
})
export class ToastComponent {
  breakpoints = {
    '640px': { width: '100%', right: '0', left: '0', top: '10px' },
    '768px': { width: '100%', right: '0', left: '0', top: '20px' },
    '1024px': { width: 'auto', right: '30px', left: 'auto', top: '30px' },
  };
}
