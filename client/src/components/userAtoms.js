import { atom } from 'recoil';

export const usernameState = atom({
  key: 'usernameState',
  // Change default when done testing
  default: 'Yong',
});

export const groupState = atom({
  key: 'groupState',
  default: 'general',
});

export const messageState = atom({
  key: 'messageState',
  // Change default when done testing
  default: [],
});

