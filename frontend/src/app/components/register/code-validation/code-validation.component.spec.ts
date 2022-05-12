import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeValidationComponent } from './code-validation.component';

describe('CodeValidationComponent', () => {
  let component: CodeValidationComponent;
  let fixture: ComponentFixture<CodeValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CodeValidationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
