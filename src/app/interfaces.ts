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

