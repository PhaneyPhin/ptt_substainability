import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewOfSmManagementComponent } from './overview-of-sm-management.component';

describe('OverviewOfSmManagementComponent', () => {
  let component: OverviewOfSmManagementComponent;
  let fixture: ComponentFixture<OverviewOfSmManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverviewOfSmManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewOfSmManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
