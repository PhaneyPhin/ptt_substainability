import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutSmComponent } from './about-sm.component';

describe('AboutSmComponent', () => {
  let component: AboutSmComponent;
  let fixture: ComponentFixture<AboutSmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutSmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutSmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
