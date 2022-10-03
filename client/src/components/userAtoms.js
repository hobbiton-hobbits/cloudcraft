import { atom } from 'recoil';

export const usernameState = atom({
  key: 'usernameState',
  // Change default when done testing
  default: 10,
});

export const recipientState = atom({
  key: 'recipientState',
  // Change default when done testing
  default: 11,
});

export const groupState = atom({
  key: 'groupState',
  default: null,
});

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

export const usersState = atom({
  key: 'usersState',
  default: []
})

export const groupsState = atom({
  key: 'groupsState',
  default: []
})

export const socketState = atom({
  key: 'socketState',
  default: null,
})