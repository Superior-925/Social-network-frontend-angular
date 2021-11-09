import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {configDev} from "../environments/environment.dev";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient) { }

  createPost(postText: string, userId: number): Observable<any> {

    let httpOptions: {} = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }), observe: 'response'
    };

    let body: {} = {postText: postText, userId: userId};

    let jsonBody = JSON.stringify(body);

    return this.http.post(`http://${configDev.host}:${configDev.port}/post`, jsonBody, httpOptions);
  }

  getPosts(userId:number): Observable<any> {
    let httpOptionsGet: {} = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      observe: 'response'};
    return this.http.get<any>(`http://${configDev.host}:${configDev.port}/post/`+userId, httpOptionsGet);
  }

  deletePost(postId: number): Observable<any> {
    let httpOptionsDelete: {} = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}),
      observe: 'response'};

    return this.http.delete<any>(`http://${configDev.host}:${configDev.port}/post/`+postId, httpOptionsDelete);
  }

  changePostText(postId: number, postText: string): Observable<any> {

    let body: {} = {postId: postId, postText: postText};

    let jsonBody = JSON.stringify(body);

    let httpOptions: {} = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}), observe: 'response'};

    return this.http.put<any>(`http://${configDev.host}:${configDev.port}/post/`+postId, jsonBody, httpOptions);
  }

  getComments(postId: number): Observable<any> {
    let httpOptionsGet: {} = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      observe: 'response'};
    return this.http.get<any>(`http://${configDev.host}:${configDev.port}/comment/`+postId, httpOptionsGet);
  }

}
