export interface UserInfo {
  username?: string;
  email?: string;
  profilePic?: string;
}

export interface MenuState {
  anchorEl: HTMLElement | null;
  open: boolean;
}

export interface Feature {
  image: string;
  text: string;
  linkGoto: string;
}

export type IndexState = number | null;
