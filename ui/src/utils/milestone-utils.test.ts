import { removeMilestoneBotPrefix } from './milestone-utils';

describe('removeMilestoneBotPrefix', () => {
  it('should remove the prefix com.scottlogic.hackathon.bots. from milestone bot name', () => {
    const input = 'com.scottlogic.hackathon.bots.Milestone1Bot';
    const expectedOutput = 'Milestone1Bot';
    expect(removeMilestoneBotPrefix(input)).toEqual(expectedOutput);
  });
});
