import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePassPhraseComponent } from './create-pass-phrase.component';

describe('CreatePassPhraseComponent', () => {
  let component: CreatePassPhraseComponent;
  let fixture: ComponentFixture<CreatePassPhraseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePassPhraseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePassPhraseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
