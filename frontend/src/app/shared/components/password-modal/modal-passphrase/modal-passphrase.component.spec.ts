import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPassphraseComponent } from './modal-passphrase.component';

describe('ModalPassphraseComponent', () => {
  let component: ModalPassphraseComponent;
  let fixture: ComponentFixture<ModalPassphraseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalPassphraseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalPassphraseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
