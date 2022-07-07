import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Vendeur1Component } from './vendeur1.component';

describe('Vendeur1Component', () => {
  let component: Vendeur1Component;
  let fixture: ComponentFixture<Vendeur1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Vendeur1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Vendeur1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
