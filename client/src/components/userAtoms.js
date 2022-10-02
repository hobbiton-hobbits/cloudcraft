import { atom } from 'recoil';

export const usernameState = atom({
  key: 'usernameState',
  // Change default when done testing
  default: 1,
});

export const groupState = atom({
  key: 'groupState',
  default: 2,
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
