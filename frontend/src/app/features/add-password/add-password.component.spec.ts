import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPasswordComponent } from './add-password.component';

describe('AddPasswordComponent', () => {
  let component: AddPasswordComponent;
  let fixture: ComponentFixture<AddPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
