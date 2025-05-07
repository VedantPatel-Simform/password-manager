import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordDashboardComponent } from './password-dashboard.component';

describe('PasswordDashboardComponent', () => {
  let component: PasswordDashboardComponent;
  let fixture: ComponentFixture<PasswordDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
