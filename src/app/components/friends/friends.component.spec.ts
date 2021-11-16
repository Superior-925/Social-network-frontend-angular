import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendsComponent } from './friends.component';
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientModule} from "@angular/common/http";

describe('FriendsComponent', () => {
  let component: FriendsComponent;
  let fixture: ComponentFixture<FriendsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule],
      declarations: [ FriendsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('there must be a "Go to my page" button', (() => {
    const button = fixture.debugElement.nativeElement.querySelector('#goto-mypage-button');

    expect(button.innerHTML).toBe('My page');
  }));

  it('should search friends form with one controls', () => {
    expect(component.searchFriendsForm.contains('name')).toBeTruthy();
  });

  it('should mark login as invalid if empty value', () => {
    const control = component.searchFriendsForm.get('name');

    control?.setValue('');

    expect(control?.valid).toBeFalsy();
  });

  it('should exist element "facebook-logo"', (() => {
    const element = fixture.debugElement.nativeElement.querySelector('.facebook-logo');
    expect(element).toBeTruthy();
  }));

});
