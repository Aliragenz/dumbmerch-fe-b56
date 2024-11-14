
export interface UserEntity {
    id: number;
    email: string;
    password: string;
    role: string;
    profile: Profile;
  }
  
  export interface Profile {
    id: number;
    fullName?: string;
    image?: string;
    phone?: string;
    gender?: string;
    address?: string;
    userId: number;
  }