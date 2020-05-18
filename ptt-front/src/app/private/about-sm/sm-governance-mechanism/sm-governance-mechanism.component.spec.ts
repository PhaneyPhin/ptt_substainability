import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmGovernanceMechanismComponent } from './sm-governance-mechanism.component';

describe('SmGovernanceMechanismComponent', () => {
  let component: SmGovernanceMechanismComponent;
  let fixture: ComponentFixture<SmGovernanceMechanismComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmGovernanceMechanismComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmGovernanceMechanismComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
