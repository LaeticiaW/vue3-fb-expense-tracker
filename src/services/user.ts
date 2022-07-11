import { db, doc, collection, getDoc, getDocs, query } from '@/firebase/firebase'
import { User } from '@/types/user'

export default {
  /*
   * Retrieve the user list
   */
  async getUsers(): Promise<User[]> {
    const users: User[] = []

    try {
      const userQuery = query(collection(db, 'users'))
      const querySnapshot = await getDocs(userQuery)
      querySnapshot.forEach((doc) => {
        users.push(doc.data().userId)
      })
      return users
    } catch (e) {
      console.error('Error retrieving users:', e)
      throw e
    }
  },

  /*
   * Retrieve a specific user by user id
   * @param {number} userId - user id
   */
  async getUser(userId: string): Promise<User> {
    const docRef = doc(db, 'users', userId)
    const docSnapshot = await getDoc(docRef)

    if (docSnapshot.exists()) {
      return docSnapshot.data() as User
    } else {
      const msg = `User ${userId} not found`
      console.error(msg)
      throw msg
    }
  },
}
