import { getDatabase, ref, child, get } from 'firebase/database'
import { User } from '../models'

export async function getUserById({
  userId,
}: {
  userId: string
}): Promise<string> {
  const db = getDatabase()
  const userRef = ref(db, `users/${userId}`)
  const snapshot = await get(userRef)
  const user = snapshot.val() as User
  return user.name
}
