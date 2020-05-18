import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PttAppComponent } from './ptt-app.component';

describe('PttAppComponent', () => {
  let component: PttAppComponent;
  let fixture: ComponentFixture<PttAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PttAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PttAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
