import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowuplistComponent } from './followuplist.component';

describe('FollowuplistComponent', () => {
  let component: FollowuplistComponent;
  let fixture: ComponentFixture<FollowuplistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FollowuplistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowuplistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
