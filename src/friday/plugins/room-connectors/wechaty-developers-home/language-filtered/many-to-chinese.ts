import { Message } from 'wechaty'
import {
  ManyToOneRoomConnector,
  matchers,
}                                     from 'wechaty-plugin-contrib'

import {
  DEVELOPERS_ROOM_ID_LIST,
  MIKE_CONTACT_ID,
  DEVELOPERS_ROOM_ID_WXWORK,
  DEVELOPERS_ROOM_ID_CHINESE,
  HEADQUARTERS_ROOM_ID,
}                             from '../../../../../database'

import { bidirectionalMapper }  from '../../bidirectional-mapper'
import { unidirectionalMapper } from '../../unidirectional-mapper'

const matchChinese = matchers.languageMatcher('chinese')

/**
 *
 * Many to One
 *
 */
const ManyToChinesePlugin = ManyToOneRoomConnector({
  blacklist: [
    MIKE_CONTACT_ID,
  ],
  many: [
    ...DEVELOPERS_ROOM_ID_LIST,
    DEVELOPERS_ROOM_ID_WXWORK,
    HEADQUARTERS_ROOM_ID,
  ],
  map: async (message: Message) => {
    if (message.type() === Message.Type.Text) {
      if (!matchChinese(message.text())) {
        return undefined
      }
    } else if (message.type() === Message.Type.Url) {
      const urlLink = await message.toUrlLink()
      const text = urlLink.description() ?? urlLink.title()
      if (!matchChinese(text)) {
        return undefined
      }
    }

    if (message.room()?.id === HEADQUARTERS_ROOM_ID) {
      return unidirectionalMapper(message)
    } else {
      return bidirectionalMapper(message)
    }
  },
  one: DEVELOPERS_ROOM_ID_CHINESE,
})

export {
  ManyToChinesePlugin,
}
