import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {Observer} from "rxjs";
import { io } from "socket.io-client";
import {configDev} from "../environments/environment.dev";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {responseGetMessages} from "../app/interfaces";

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(private http: HttpClient) { }

  private socket: any;

  userId: string = localStorage.getItem("userId") as string;

  public initSocket(): void {
    this.socket = io(`${configDev.host}:${configDev.port}`, {
      extraHeaders: {
        Authorization: localStorage.getItem('token') as string,
      },
      query: {
        userId: localStorage.getItem("userId") as string
      }
    });
  }

  public sendMessage(message: string, friendId: any, userId: any): void {
    let newMessage = {friendId: friendId, userId: userId, messageText: message};
    this.socket.emit('message', newMessage);
  }

  public onMessage(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('message', (data: any) => observer.next(data));
    });
  }

  getMessages(userId: number, friendId: number): Observable<responseGetMessages> {
    let httpOptionsGet: {} = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}), params: {userId: userId, friendId: friendId},
      observe: 'response'};
    return this.http.get<responseGetMessages>(`http://${configDev.host}:${configDev.port}/messages/`, httpOptionsGet);
  }

  postComment(commentText: string, postId: number, userId: number, userNickname: string) {
    let newComment = {commentText: commentText, postId: postId, userId: userId, nickname: userNickname};
    this.socket.emit('comment', newComment);
  }

  public onComment(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('comment', (data: any) => observer.next(data));
    });
  }

  changeComment(commentId: number, commentText: string, userId: number) {
    let changeComment = {commentId: commentId, commentText: commentText, userId: userId};
    this.socket.emit('comment-change', changeComment);
  }

  public onChangeComment(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('comment-change', (data: any) => observer.next(data));
    });
  }
}
