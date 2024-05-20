export interface IUserDTO {
  id: number,
  username: string,
  gender: "MALE" | "FEMALE" | "OTHER"
  email?: string,
  avatar?: string
}