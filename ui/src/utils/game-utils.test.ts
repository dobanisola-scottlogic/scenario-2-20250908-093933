import { getGameTimeString } from './game-utils';

describe('getGameTimeString', () => {
  it('should return an empty string for null input', () => {
    const input = null;
    const expectedOutput = '';
    expect(getGameTimeString(input)).toEqual(expectedOutput);
  });

  it('should format the game time correctly', () => {
    const input = Date.parse('13 Oct 2023 09:12:34');
    const expectedOutput = 'Fri, 09:12:34';
    expect(getGameTimeString(input)).toEqual(expectedOutput);
  });
});
