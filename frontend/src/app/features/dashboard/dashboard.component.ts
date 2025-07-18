import {
  AfterContentInit,
  AfterViewInit,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { PanelMenuModule } from 'primeng/panelmenu';
import { Router, RouterModule } from '@angular/router';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { KeyStorageService } from '../../core/services/User/key-storage.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { ToastService } from '../../core/services/toast/toast.service';
import { ToastComponent } from '../../shared/components/toast/toast.component';
import { DrawerModule } from 'primeng/drawer'; // Import Drawer module
import { UserDetailsService } from '../../core/services/User/user-details.service';
import { TitleCasePipe } from '@angular/common';
import { PaginatorComponent } from '../../shared/components/paginator/paginator.component';
@Component({
  selector: 'app-dashboard',
  imports: [
    PanelMenuModule,
    ScrollPanelModule,
    ButtonModule,
    RouterModule,
    AccordionModule,
    ToastComponent,
    DrawerModule, // Add Drawer module here
    TitleCasePipe,
    PaginatorComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  keyService = inject(KeyStorageService);
  authService = inject(AuthService);
  toastService = inject(ToastService);
  router = inject(Router);
  userDetails = inject(UserDetailsService);

  mobileSidebarOpen = false; // This controls the mobile drawer state
  visible: boolean = false; // For controlling the mobile drawer visibility

  // On Init lifecycle hook
  ngOnInit(): void {}

  // Toggle mobile sidebar (drawer)
  toggleSidebar() {
    this.mobileSidebarOpen = !this.mobileSidebarOpen;
    this.visible = this.mobileSidebarOpen;
  }

  // On AfterViewInit lifecycle hook (for showing success toast after login)
  ngAfterViewInit(): void {
    const comingFrom = this.authService.getComingFrom();
    if (comingFrom === 'login') {
      this.toastService.clear();
      this.toastService.showSuccess('Success', 'Successfully Logged in');
    } else if (comingFrom === 'editPassword') {
      this.toastService.showSuccess('Edited', 'Password successfully edited');
    } else if (comingFrom === 'deletePassword') {
      this.toastService.showSuccess('Deleted', 'Password successfully deleted');
    }
  }

  // Logout functionality
  logout() {
    this.keyService.clearAllKeys();
    this.authService.logout().subscribe((res) => {
      if (res.success) {
        this.authService.setComingFrom('dashboard');
        this.router.navigate(['/login']);
      }
    });
  }

  // Define menu items for the sidebar
  menuItems = [
    {
      label: 'Generate Password',
      icon: 'pi pi-key',
      routerLink: ['/dashboard/generate-password'],
    },
    {
      label: 'Add Password',
      icon: 'pi pi-plus-circle',
      routerLink: ['/dashboard/add-password'],
    },
    {
      label: 'Upload CSV',
      icon: 'pi pi-file',
      routerLink: ['/dashboard/upload-csv'],
    },
    {
      label: 'Password Dashboard',
      icon: 'pi pi-lock',
      routerLink: ['/dashboard/passwords'],
    },
    {
      label: 'Shared Passwords',
      icon: 'pi pi-share-alt',
      items: [
        {
          label: 'Share Password',
          icon: 'pi pi-plus-circle',
          routerLink: ['/dashboard/shared/share'],
        },
        {
          label: 'Shared By Me',
          icon: 'pi pi-user-plus',
          routerLink: ['/dashboard/shared/sent'],
        },
        {
          label: 'Shared With Me',
          icon: 'pi pi-users',
          routerLink: ['/dashboard/shared/received'],
        },
      ],
    },
    {
      label: 'Projects',
      icon: 'pi pi-briefcase',
      items: [
        {
          label: 'My Projects',
          icon: 'pi pi-folder',
          routerLink: ['/projects/my'],
        },
        {
          label: 'Joined Projects',
          icon: 'pi pi-users',
          routerLink: ['/projects/joined'],
        },
      ],
    },
    {
      label: 'Recycle Bin',
      icon: 'pi pi-trash',
      routerLink: ['/dashboard/recycle-bin'],
    },
  ];

  // On Destroy lifecycle hook
  ngOnDestroy(): void {
    this.toastService.clear();
  }
}
