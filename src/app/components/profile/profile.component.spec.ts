import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileComponent } from './profile.component';
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientModule} from "@angular/common/http";

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule],
      declarations: [ ProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should click on button "Publish"', (() => {
    spyOn(component, 'postSubmit');

    let publishButton = fixture.debugElement.nativeElement.querySelector('#submit-button-login');
    publishButton.click();

    fixture.whenStable().then(() => {
      expect(component.postSubmit).toHaveBeenCalled();
    });
  }));

  it('should exist element "form-post"', (() => {
    const element = fixture.debugElement.nativeElement.querySelector('#form-post');
    expect(element).toBeTruthy();
  }));
});
