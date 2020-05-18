import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmFunctionComponent } from './sm-function.component';

describe('SmFunctionComponent', () => {
  let component: SmFunctionComponent;
  let fixture: ComponentFixture<SmFunctionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmFunctionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmFunctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
