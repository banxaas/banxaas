import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PowComponent } from './pow.component';

describe('PowComponent', () => {
  let component: PowComponent;
  let fixture: ComponentFixture<PowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
