import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { PasswordService } from '../../core/services/password/password-service.service';
import { ToastService } from '../../core/services/toast/toast.service';

@Component({
  selector: 'app-add-password',
  templateUrl: './add-password.component.html',
  styleUrls: ['./add-password.component.css'],
  imports: [FormsModule],
})
export class AddPasswordComponent {
  form = {
    website: '',
    userName: '',
    email: '',
    password: '',
    notes: '',
  };

  constructor(
    private passwordService: PasswordService,
    private toastService: ToastService // Optional: swap for PrimeNG Toast if needed
  ) {}

  onSubmit(formRef: NgForm) {
    if (formRef.invalid) {
      this.toastService.showError(
        'Error',
        'Please fill out all required fields'
      );
      return;
    }

    console.log(this.form);
    this.passwordService.createPasswordApi(this.form).subscribe({
      next: (value) => {
        this.toastService.showSuccess(
          'Created',
          'Password created successfully'
        );

        console.log(value);
      },

      error: (err) => {
        this.toastService.showSuccess(
          'Error',
          'There was some error, please try again'
        );
      },
    });
  }
}
