import { Component, inject, OnInit, signal } from '@angular/core';
import { IPasswordShare } from '../../shared/interfaces/PasswordShare.interface';
import { PasswordSentService } from '../../core/services/password/password-sent.service';

@Component({
  selector: 'app-sent-by-me',
  imports: [],
  templateUrl: './sent-by-me.component.html',
  styleUrl: './sent-by-me.component.css',
})
export class SentByMeComponent implements OnInit {
  sharedPasswordList = signal<IPasswordShare[]>([]);
  sharedPasswordService = inject(PasswordSentService);
  $sharedPasswordObs = this.sharedPasswordService.$sentPasswordsObs;
  ngOnInit(): void {
    this.sharedPasswordService.getSentByMePasswords().subscribe({
      next: (res) => {
        this.sharedPasswordService.setPasswords(res.passwords);
      },
    });
    this.$sharedPasswordObs.subscribe({
      next: (res) => {
        this.sharedPasswordList.set(res);
        console.log(this.sharedPasswordList());
      },
    });
  }
}
