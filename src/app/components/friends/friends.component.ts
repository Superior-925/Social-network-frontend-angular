import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from '@angular/forms'
import {UserProfileService} from "../../../services/user-profile.service";
import {AuthService} from "../../../services/auth.service";
import {SocketService} from "../../../services/socket.service";
import {friend, candidate, friendCandidate, message} from "../../interfaces";

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit {

  searchFriendsForm : FormGroup;

  chatForm: FormGroup;

  userId: number = Number(localStorage.getItem('userId'));

  userNickname?: string | number;

  friendsCandidates: candidate[] = [];

  friendsRequests: friendCandidate[] = [];

  friendsArray: friend[] = [];

  messages: message[] = [];

  ioConnection: any;

  friendId?: number;

  friendNickname?: string;

  constructor(private userProfileService: UserProfileService, private authService: AuthService, private router: Router,
              private route: ActivatedRoute, private socketService: SocketService) {
    this.searchFriendsForm = new FormGroup({
      name: new FormControl('', [
        Validators.required
      ])
    });
    this.chatForm = new FormGroup({
      messageText: new FormControl('', [
        Validators.required
      ])
    });
  }

  ngOnInit(): void {

    if (!localStorage.getItem('token')) {
      this.router.navigate(['/home'])
    }

    this.route.params.subscribe((params: Params) => {
      let userId = params['id'];
      this.userProfileService.getUserInfo(userId).subscribe((response) => {
          this.userNickname = response.body.userNickname;
        },
        error => console.log(error)
      );
    });
    this.userProfileService.getFriends(this.userId).subscribe((response) => {
      response.body.forEach((item) => {
        let userFriend: friend = {friendId: item.id, friendNickname: item.nickname};
        this.friendsArray.push(userFriend);
      });
    },error => console.log(error)
    );
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

  searchFriends() {
    this.friendsCandidates.length = 0;
    let friendsIdsIgnore = [];
    friendsIdsIgnore.push(this.userId);
    if (this.friendsArray.length != 0) {
      this.friendsArray.forEach((friend) => {
        friendsIdsIgnore.push(friend.friendId);
      });
    }
    this.userProfileService.searchFriends(this.searchFriendsForm.value.name, friendsIdsIgnore).subscribe((response) => {
        response.body.forEach((item) => {
          let candidate: candidate = {userId: item.id, userNickname: item.nickname, userEmail: item.email};
          this.friendsCandidates.push(candidate);
        });
        this.searchFriendsForm.reset();
      }, error => console.log(error)
    )
  }

  addToFriends(friendId: number) {
    let button = document.getElementById(`add-to-friend-${friendId}`);
    button?.setAttribute("disabled", "disabled");
    this.userProfileService.addFriend(this.userId, friendId).subscribe((response: any) => {
    }, error => console.log(error))
  }

  getFriendsRequests() {
    this.userProfileService.getFriendsRequests(this.userId).subscribe((response) => {
      this.friendsRequests.length = 0;
      response.body.forEach((item: any) => {
        let newCandidate: friendCandidate = {candidateId: item.user.id, candidateEmail: item.user.email, candidateNickname: item.user.nickname };
        this.friendsRequests.push(newCandidate);
      })
    }, error => console.log(error)
    )
  }

  acceptFriendRequest(candidateId: number) {
    this.userProfileService.acceptFriendRequest(this.userId, candidateId).subscribe((response) => {
      let userFriend: friend = {friendId: response.body.addedFriend.id, friendNickname: response.body.addedFriend.nickname};
      this.friendsArray.push(userFriend);
      this.friendsRequests = this.friendsRequests.filter((item) => {
        item.candidateId != response.body.reqDestroy.userId;
      });
    },error => console.log(error)
    )
  }

  declineFriendRequest(candidateId: number) {
    this.userProfileService.declineFriendRequest(this.userId, candidateId).subscribe((response) => {
        this.friendsRequests = this.friendsRequests.filter((item) => {
          item.candidateId != response.body.userId;
        });
      },error => console.log(error)
    )
  }

  chatFriend(friendId: number, friendNickname: string) {
    this.messages.length = 0;
    this.friendId = friendId;
    this.friendNickname = friendNickname;
    this.getMessages(this.userId, this.friendId);
  }

  private initIoConnection(): void {
    this.ioConnection = this.socketService.onMessage()
      .subscribe((message: message) => {
        this.messages.push(message);
      },error => console.log(error)
      );
  }

  deleteFriend(friendId: number) {
    if (confirm("Are you sure?")) {
      this.userProfileService.deleteFriend(this.userId, friendId).subscribe((response) => {
        this.friendsArray = this.friendsArray.filter((item) => {
          item.friendId != response.body.friendId;
        })
      },error => console.log(error)
      )
    }
  }

  sendMessage() {
    this.socketService.sendMessage(this.chatForm.value.messageText, this.friendId, this.userId);
    this.chatForm.reset();
  }

  getMessages(userId: number, friendId: number) {
    this.socketService.getMessages(userId, friendId).subscribe((response) => {
      response.body.myMessages.forEach((item) => {
        let myMessage: message = {messageText: item.messageText, userId: item.userId, friendId: item.friendId, createdAt: item.createdAt};
        this.messages.push(myMessage);
      });
      response.body.friendMessages.forEach((item) => {
        let friendMessage: message = {messageText: item.messageText, userId: item.userId, friendId: item.friendId, createdAt: item.createdAt};
        this.messages.push(friendMessage);
      });
      this.messages.sort(function (a, b) {
          let aDate: any = new Date(a.createdAt);
          let bDate: any = new Date(b.createdAt);
          return aDate - bDate;
        });
    },error => console.log(error)
    )
  }
}
