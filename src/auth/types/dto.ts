import { UserEntity } from "../../entities/user";

export type RegisterRequestDTO = Pick<UserEntity, "email" | "password">;

export type RegisterResponseDTO = Omit<UserEntity, "password">;

export type LoginRequestDTO = Pick<UserEntity, "email" | "password">;

export type LoginResponseDTO = {
  user: UserEntity;
  token: string;
};

export type UserStoreDTO = Omit<UserEntity, "password">;

export type checkAuthenticationResponseDTO = Omit<UserEntity, "password">;
