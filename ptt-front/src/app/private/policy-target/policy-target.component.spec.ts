import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyTargetComponent } from './policy-target.component';

describe('PolicyTargetComponent', () => {
  let component: PolicyTargetComponent;
  let fixture: ComponentFixture<PolicyTargetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyTargetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
