import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryTradeComponent } from './history-trade.component';

describe('HistoryTradeComponent', () => {
  let component: HistoryTradeComponent;
  let fixture: ComponentFixture<HistoryTradeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoryTradeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryTradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
