import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from '@angular/forms'
import {UserProfileService} from "../../../services/user-profile.service";
import {AuthService} from "../../../services/auth.service";
import {PostService} from "../../../services/post.service";
import {SocketService} from "../../../services/socket.service";
import {post} from "../../interfaces";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  postForm : FormGroup;

  commentForm: FormGroup;

  userId: number = Number(localStorage.getItem('userId'));

  userNickname?: string | number;

  userPosts: post[] = [];

  pageOwner?: boolean;

  commentsBlockStatus: boolean = false;

  postId?: number;

  comments: any = [];

  constructor(private userProfileService: UserProfileService, private authService: AuthService, private router: Router,
              private route: ActivatedRoute, private postService: PostService, private socketService: SocketService) {
    this.postForm = new FormGroup({
      post: new FormControl('', [
        Validators.required
      ])
    });
    this.commentForm = new FormGroup({
      comment: new FormControl('', [
        Validators.required
      ])
    });
  }

  ngOnInit(): void {

    if (!localStorage.getItem('token')) {
      this.router.navigate(['/home'])
    }

    let userId: number;

    this.route.params.subscribe((params: Params) => {
     userId = params['id'];
     if (Number(localStorage.getItem('userId')) == userId) {
       this.pageOwner = true;
     }
      this.userProfileService.getUserInfo(userId).subscribe((response) => {
          this.userNickname = response.body.userNickname;
        },error => console.log(error)
      );
      this.postService.getPosts(userId).subscribe((response) => {
          this.userPosts.length = 0;
          response.body.forEach((post: any) => {
            let newPost: post = {postId: post.id, postText: post.postText};
            this.userPosts.push(newPost);
          });
        },error => console.log(error))
    },error => console.log(error));
    this.authService.startRefresh();
    this.initIoConnection();
  }

  logOut() {
    if(confirm("Are you sure you want to log out?")) {
      this.authService.logOut().subscribe((response) => {
        this.authService.stopRefresh();
        if (response.status == 200) {localStorage.clear();
          this.router.navigate(['/home']);}
      },
        error => console.log(error)
      );
    }
  };

  goToMyPage() {
    this.router.navigate(['/profile', localStorage.getItem('userId')]);
  }

  postSubmit() {
    this.postService.createPost(this.postForm.value.post, Number(localStorage.getItem('userId'))).subscribe((response) => {
      this.postForm.reset();
      let newPost: post = {postId: response.body.id, postText: response.body.postText};
      this.userPosts.push(newPost);
    },
      error => console.log(error)
    )
  }

  deletePost(postId: number) {
    if(confirm("Are you sure?")) {
      this.postService.deletePost(postId).subscribe((response) => {
        let newPostsArray = this.userPosts.filter((item) => item.postId != response.body);
        this.userPosts = newPostsArray;
      },
        error => console.log(error)
      )

    }
  }

  changePost(postId: number, postText: string) {
    this.postService.changePostText(postId, postText).subscribe((response) => {
    },
      error => console.log(error)
    )
  }

  getComments(postId: number) {
    this.postId = postId;
    this.commentsBlockStatus = true;
    this.postService.getComments(postId).subscribe((response) => {
      this.comments.length = 0;
      response.body.forEach((item: any) => {
       let date = new Date(item.createdAt);
       let newDate = date.toLocaleString();
       let newComment = {commentId: item.id, commentText: item.commentText, author: item.user.nickname, date: newDate, authorId: item.user.id, postId: item.postId};
       this.comments.push(newComment);
      });
      this.comments.sort(function (a:any, b: any) {
        let aDate: any = a.date;
        let bDate: any = b.date;
        return aDate - bDate;
      });
    },error => console.log(error))
  }

  commentSubmit(postId: number) {
    this.socketService.postComment(this.commentForm.value.comment, postId, this.userId, this.userNickname as string);
  }

  private initIoConnection(): void {
    this.socketService.onComment()
      .subscribe((comment: any) => {
        let date = new Date(comment.createdAt);
        let newDate = date.toLocaleString();
        let newComment = {commentId: comment.id, commentText: comment.commentText, author: comment.user.nickname, date: newDate, authorId: comment.user.id, postId: comment.postId};
        this.comments.push(newComment);
        this.commentForm.reset();
      },error => console.log(error));
    this.socketService.onChangeComment().subscribe((comment) => {
      this.comments.forEach((item: any) => {
        if (item.commentId == comment.id) {
          item.commentText = comment.commentText
        }
      })
    },error => console.log(error))
  }

  closeComments() {
    this.commentsBlockStatus = false;
  }

  changeComment(commentId: number, commentText: string) {
    this.socketService.changeComment(commentId, commentText, this.userId);
  }
}
