import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DifferenceBetweenBtcAndOtherCryptoComponent } from './difference-between-btc-and-other-crypto.component';

describe('DifferenceBetweenBtcAndOtherCryptoComponent', () => {
  let component: DifferenceBetweenBtcAndOtherCryptoComponent;
  let fixture: ComponentFixture<DifferenceBetweenBtcAndOtherCryptoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DifferenceBetweenBtcAndOtherCryptoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DifferenceBetweenBtcAndOtherCryptoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
