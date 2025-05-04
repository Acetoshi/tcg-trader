export interface User {
  id: number;
  email: string;
  username: string;
  tcgpId: string;
  bio: string;
  avatarUrl: string;
}

export interface UserUpdate {
  username?: string;
  tcgpId?: string;
  bio?: string;
  avatarUrl?: string;
}

export interface UpdatedUserResponse {
  username: string;
  tcgpId: string;
  bio: string;
  avatarUrl: string;
}
