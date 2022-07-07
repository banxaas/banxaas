import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AchateurComponent } from './achateur.component';

describe('AchateurComponent', () => {
  let component: AchateurComponent;
  let fixture: ComponentFixture<AchateurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AchateurComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AchateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
