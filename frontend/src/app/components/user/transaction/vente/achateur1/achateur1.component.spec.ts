import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Achateur1Component } from './achateur1.component';

describe('Achateur1Component', () => {
  let component: Achateur1Component;
  let fixture: ComponentFixture<Achateur1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Achateur1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Achateur1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
