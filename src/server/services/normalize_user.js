import { pick } from 'lodash'

const normalizeUser = user => pick(user, ['username', 'email', 'id'])

export default normalizeUser
