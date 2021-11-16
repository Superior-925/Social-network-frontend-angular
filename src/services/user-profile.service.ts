import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {configDev} from "../environments/environment.dev";
import {
  responseUserInfo,
  responseGetFriends,
  searchFriends,
  responseFriendsRequests,
  acceptFriendRequest,
  declineFriendRequest,
  responseDeleteFriend
} from "../app/interfaces";
import {Observable, Subject} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  userNickname?: string | number;

  constructor(private http: HttpClient) { }

  getUserInfo(userId: number): Observable<responseUserInfo> {
    let httpOptionsGet: {} = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      observe: 'response'};
    return this.http.get<responseUserInfo>(`http://${configDev.host}:${configDev.port}/user/info/`+userId, httpOptionsGet);
  }

  searchFriends(name: string): Observable<searchFriends> {
    let httpOptionsGet: {} = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      observe: 'response', params: {param: name}};
    return this.http.get<searchFriends>(`http://${configDev.host}:${configDev.port}/friends/search/`, httpOptionsGet);
  }

  addFriend(userId: number ,friendId: number) {

    let httpOptions: {} = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }), observe: 'response'
    };

    let body: {} = {friendId: friendId, userId: userId};

    let jsonBody = JSON.stringify(body);

    return this.http.post(`http://${configDev.host}:${configDev.port}/friend/candidate`, jsonBody, httpOptions);
  }

  getFriendsRequests(userId: number): Observable<responseFriendsRequests> {
    let httpOptionsGet: {} = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      observe: 'response'};
    return this.http.get<responseFriendsRequests>(`http://${configDev.host}:${configDev.port}/friend/candidate/`+userId, httpOptionsGet);
  }

  acceptFriendRequest(userId: number, candidateId: number): Observable<acceptFriendRequest> {
    let httpOptions: {} = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }), observe: 'response'
    };

    let body: {} = {userId: userId, candidateId: candidateId};

    let jsonBody = JSON.stringify(body);

    return this.http.post<acceptFriendRequest>(`http://${configDev.host}:${configDev.port}/friend/`, jsonBody, httpOptions);
  }

  declineFriendRequest(userId: number, candidateId: number): Observable<declineFriendRequest> {
    let httpOptions: {} = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }), observe: 'response'
    };

    let body: {} = {userId: userId, candidateId: candidateId};

    let jsonBody = JSON.stringify(body);

    return this.http.put<declineFriendRequest>(`http://${configDev.host}:${configDev.port}/friend/`, jsonBody, httpOptions);
  }

  getFriends(userId: number): Observable<responseGetFriends> {
    let httpOptionsGet: {} = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      observe: 'response'};
    return this.http.get<responseGetFriends>(`http://${configDev.host}:${configDev.port}/friends/` + userId, httpOptionsGet);
  }

  deleteFriend(userId: number, friendId: number): Observable<responseDeleteFriend> {
    let httpOptionsDelete: {} = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}),
      observe: 'response',params: {userId: userId, friendId: friendId}};

    return this.http.delete<responseDeleteFriend>(`http://${configDev.host}:${configDev.port}/friend/`, httpOptionsDelete);

  }
}
