import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmVisionAndMissionComponent } from './sm-vision-and-mission.component';

describe('SmVisionAndMissionComponent', () => {
  let component: SmVisionAndMissionComponent;
  let fixture: ComponentFixture<SmVisionAndMissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmVisionAndMissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmVisionAndMissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
