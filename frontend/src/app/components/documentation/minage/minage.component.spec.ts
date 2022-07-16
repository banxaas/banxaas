import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinageComponent } from './minage.component';

describe('MinageComponent', () => {
  let component: MinageComponent;
  let fixture: ComponentFixture<MinageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MinageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MinageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
