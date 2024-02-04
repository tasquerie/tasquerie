import assert from 'assert';
import { add } from '../src/model/Task';

describe('Add Function', function () {
  describe('add', function () {
    it('should return the sum of two numbers', function () {

      const num1 = 1;
      const num2 = 2;

      const result = add(num1, num2);

      assert.strictEqual(result, num1 + num2);
    });
  });
});
