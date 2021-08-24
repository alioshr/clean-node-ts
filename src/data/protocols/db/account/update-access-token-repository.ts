export interface UpdateAccessTokenRepository {
  updateToken: (data: { token: string, id: string }) => Promise<void>
}
