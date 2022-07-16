import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HowSellComponent } from './how-sell.component';

describe('HowSellComponent', () => {
  let component: HowSellComponent;
  let fixture: ComponentFixture<HowSellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HowSellComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HowSellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
