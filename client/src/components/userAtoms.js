import { atom } from 'recoil';

export const usernameState = atom({
  key: 'usernameState',
  // Change default when done testing
  default: 'Yong',
});

export const groupState = atom({
  key: 'gropState',
  // Change default when done testing
  default: null,
})

