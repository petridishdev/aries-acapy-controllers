import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NavCardListComponent } from './nav-card-list.component';

describe('CardListComponent', () => {
  let component: NavCardListComponent;
  let fixture: ComponentFixture<NavCardListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NavCardListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavCardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
