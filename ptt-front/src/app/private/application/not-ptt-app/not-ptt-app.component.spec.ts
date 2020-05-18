import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotPttAppComponent } from './not-ptt-app.component';

describe('NotPttAppComponent', () => {
  let component: NotPttAppComponent;
  let fixture: ComponentFixture<NotPttAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotPttAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotPttAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
