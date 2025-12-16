export interface CreateUserDto {
  username: string;
  email: string;
  passwordHash: string;
  imageUrl?: string;
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  imageUrl?: string;
}