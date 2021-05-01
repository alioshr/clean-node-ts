export interface PasswordMatchValidation {
  isMatch: (password: string, confirmPassword: string) => boolean | Error
}
