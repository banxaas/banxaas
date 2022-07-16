import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HowBuyComponent } from './how-buy.component';

describe('HowBuyComponent', () => {
  let component: HowBuyComponent;
  let fixture: ComponentFixture<HowBuyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HowBuyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HowBuyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
