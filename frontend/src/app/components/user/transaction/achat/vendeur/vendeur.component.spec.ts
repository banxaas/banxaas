import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendeurComponent } from './vendeur.component';

describe('VendeurComponent', () => {
  let component: VendeurComponent;
  let fixture: ComponentFixture<VendeurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendeurComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
