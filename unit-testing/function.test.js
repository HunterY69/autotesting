import { getMilliseconds, getTime, getTimezoneOffset } from './functions.js';

describe('Тести для getMilliseconds', () => {

    test('getMilliseconds має повертати правильні мілісекунди', () => {
      const date = new Date('2025-03-31T12:00:00.123Z');
      expect(getMilliseconds(date)).toBe(123);
    });
  
    test('getMilliseconds має повертати 0 для нового об’єкта Date без мілісекунд', () => {
      const date = new Date('2025-03-31T12:00:00Z');
      expect(getMilliseconds(date)).toBe(0);
    });
  
    test('getMilliseconds має повертати правильні мілісекунди для малих значень', () => {
      const date = new Date('2025-03-31T12:00:00.001Z');
      expect(getMilliseconds(date)).toBe(1);
    });
  
    test('getMilliseconds має повертати правильні мілісекунди для великих значень', () => {
      const date = new Date('2025-03-31T12:00:00.999Z');
      expect(getMilliseconds(date)).toBe(999);
    });
  
    test('getMilliseconds працює для дуже старої дати', () => {
      const date = new Date('1970-01-01T00:00:00.500Z');
      expect(getMilliseconds(date)).toBe(500);
    });
  
  });


describe('Тести для getTime', () => {

    test('getTime має повертати правильний час в мілісекундах від Unix epoch', () => {
      const date = new Date('2025-03-31T12:00:00Z');
      expect(getTime(date)).toBe(1743422400000);
    });
  
    test('getTime має працювати для поточного часу', () => {
      const date = new Date();
      expect(getTime(date)).toBeGreaterThan(0);
    });
  
    test('getTime має працювати для дуже старої дати', () => {
      const date = new Date('1900-01-01T00:00:00Z');
      expect(getTime(date)).toBe(-2208988800000);
    });
  
    test('getTime має працювати для майбутньої дати', () => {
      const date = new Date('2100-01-01T00:00:00Z');
      expect(getTime(date)).toBeGreaterThan(0);
    });
  
    test('getTime має повертати правильний час для відомої дати', () => {
      const date = new Date('2020-01-01T00:00:00Z');
      expect(getTime(date)).toBe(1577836800000);
    });
  
  });

describe('Тести для getTimezoneOffset', () => {

    test('getTimezoneOffset для зони UTC+3 Київ поверне 180', () => {
        const date = new Date('2025-03-31T00:00:00+03:00'); // дата з часовим поясом UTC+3
        expect(getTimezoneOffset(date)).toBe(-180); // різниця між UTC+3 та UTC = -180 хвилин
    });
      
});