import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradehistorylistComponent } from './tradehistorylist.component';

describe('TradehistorylistComponent', () => {
  let component: TradehistorylistComponent;
  let fixture: ComponentFixture<TradehistorylistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradehistorylistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradehistorylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
