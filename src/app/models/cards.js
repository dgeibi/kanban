import { model } from 'dva-hot'
import nanoid from 'nanoid'
import { create } from '~/app/services/card'
import commonModel from '~/app/utils/commonModel'

const cardModel = commonModel('cards')({
  state: {},
  reducers: {},
  effects: {
    *create(
      {
        payload: { text, listId, boardId },
      },
      { put, select, call }
    ) {
      const card = {
        id: nanoid(),
        text,
        listId,
      }
      yield put({
        type: 'save',
        payload: {
          [card.id]: card,
        },
      })
      yield put({
        type: 'lists/addCard',
        id: listId,
        cardId: card.id,
      })
      const index = yield select(x => x.lists[listId].cards.indexOf(card.id))
      yield call(create, {
        ...card,
        boardId,
        index,
      })
    },
  },
})

export default model(module)(cardModel)
