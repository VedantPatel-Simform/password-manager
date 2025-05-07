import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPasswordComponent } from './view-password.component';

describe('ViewPasswordComponent', () => {
  let component: ViewPasswordComponent;
  let fixture: ComponentFixture<ViewPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewPasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
