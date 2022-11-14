import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarControlsComponent } from './controls.component';

describe('NavbarControlsComponent', () => {
  let component: NavbarControlsComponent;
  let fixture: ComponentFixture<NavbarControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavbarControlsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
