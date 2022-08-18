import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AcceptConnectionComponent } from './accept-connection.component';

describe('AcceptConnectionComponent', () => {
  let component: AcceptConnectionComponent;
  let fixture: ComponentFixture<AcceptConnectionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AcceptConnectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptConnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
