export interface responseUserDataAuth {
  status: number,
  body: {
    token: string,
    userId: string,
    refresh: {
      token: string
    }
  }
}

export interface responseUserInfo {
  body: {
    userId: number,
    userNickname: string,
    userEmail: string
  }
}

export interface responseRefreshToken {
  body: {
    token: string,
    refresh: {
      token: string
    }
  }
}

export interface responseStatus {
  status: number
}

export interface responseGetFriends {
  body: [{
    id: number,
    nickname: string
  }]
}

export interface friend {
  friendId: number,
  friendNickname: string
}

export interface searchFriends {
  body: [{
    id: number,
    nickname: string,
    email: string
  }]
}

export interface candidate {
  userId: number,
  userNickname: string,
  userEmail: string
}

export interface responseFriendsRequests {
  body: [{
    user: {
      id: number,
      email: string,
      nickname: string
    }
  }]
}

export interface friendCandidate {
  candidateId: number,
  candidateEmail: string,
  candidateNickname: string
}

export interface acceptFriendRequest {
  body: {
    addedFriend: {
      id: number,
      nickname: string
    },
    reqDestroy:{
      userId: number
    }
  }
}

export interface declineFriendRequest {
  body: {
    userId: number
  }
}

export interface responseDeleteFriend {
  body: {
    friendId: number
  }
}

export interface responseGetMessages {
  body: {
    myMessages: [{
      messageText: string,
      userId: number,
      friendId: number,
      createdAt: number | string
    }],
    friendMessages: [{
      messageText: string,
      userId: number,
      friendId: number,
      createdAt: number | string
    }]
  }
}

export interface message {
  messageText: string,
  userId: number,
  friendId: number,
  createdAt: number | string
}

export interface getPosts {
  body: [{
    id: number,
    postText: string
  }]
}

export interface post {
  postId: number,
  postText: string
}

export interface responseCreatePost {
  body: {
    id: number,
    postText: string
  }
}

export interface responseDeletePost {
  body: number
}


