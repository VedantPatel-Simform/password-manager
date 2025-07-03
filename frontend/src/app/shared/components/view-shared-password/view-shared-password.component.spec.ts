import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSharedPasswordComponent } from './view-shared-password.component';

describe('ViewSharedPasswordComponent', () => {
  let component: ViewSharedPasswordComponent;
  let fixture: ComponentFixture<ViewSharedPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewSharedPasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewSharedPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
