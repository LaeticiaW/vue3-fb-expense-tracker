import { defineStore } from 'pinia'
import UserService from '@/services/user'
import { User } from '@/types/user'

export type UserState = {
  loggedInUserId: string | null
  currentUser: User | null
}

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      loggedInUserId: localStorage.getItem('etLoginToken'),
      currentUser: null,
    } as UserState
  },
  getters: {},
  actions: {
    async login(userId: string) {
      const user: User = await UserService.getUser(userId)
      localStorage.setItem('etLoginToken', user.userId)
      this.currentUser = user
      this.loggedInUserId = userId
    },
    logout() {
      localStorage.removeItem('etLoginToken')
      this.loggedInUserId = null
      this.currentUser = null
    },
    setCurrentUser(user: User) {
      this.currentUser = user
    },
  },
})
