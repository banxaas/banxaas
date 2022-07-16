import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HowPublishComponent } from './how-publish.component';

describe('HowPublishComponent', () => {
  let component: HowPublishComponent;
  let fixture: ComponentFixture<HowPublishComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HowPublishComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HowPublishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
