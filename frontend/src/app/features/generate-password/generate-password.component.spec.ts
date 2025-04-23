import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratePasswordComponent } from './generate-password.component';

describe('GeneratePasswordComponent', () => {
  let component: GeneratePasswordComponent;
  let fixture: ComponentFixture<GeneratePasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneratePasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneratePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
