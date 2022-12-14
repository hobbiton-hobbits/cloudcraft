import { atom } from 'recoil';

export const userState = atom({
  key: 'userState',
  default: {
    username: null,
    firstName: null,
    lastName: null,
    img: null,
  },
});

export const userIdState = atom({
  key: 'userIdState',
  // change default to null when done testing
  default: null,
});

export const recipientIdState = atom({
  key: 'recipientIdState',
  // Change default when done testing
  default: null,
});

export const groupIdState = atom({
  key: 'groupIdState',
  default: null,
});

export const groupState = atom({
  key: 'groupState',
  default: {
    user_ids: [],
    user_names: [],
    name: null
  }
})

export const messageState = atom({
  key: 'messageState',
  // Change default when done testing
  default: [],
});

export const sendMsgState = atom({
  key: 'sendMsgState',
  // Change default when done testing
  default: '',
});

export const recipientListState = atom({
  key: 'recipientListState',
  default: [],
});

export const groupListState = atom({
  key: 'groupListState',
  default: [],
});

export const socketState = atom({
  key: 'socketState',
  default: null,
});

export const isTypingState = atom({
  key: 'isTypingState',
  default: false,
});

export const pendingMsgState = atom({
  key: 'pendingMsgState',
  default: {},
});

export const taskListUpdate = atom({
  key: 'taskListUpdate',
  default: 0,
})