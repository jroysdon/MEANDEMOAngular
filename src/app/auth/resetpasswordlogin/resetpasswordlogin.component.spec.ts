import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetpasswordloginComponent } from './resetpasswordlogin.component';

describe('ResetpasswordloginComponent', () => {
  let component: ResetpasswordloginComponent;
  let fixture: ComponentFixture<ResetpasswordloginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetpasswordloginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetpasswordloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
