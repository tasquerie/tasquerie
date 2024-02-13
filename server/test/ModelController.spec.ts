// Unit tests for ModelController

import assert from 'assert';
import { IDManager } from '../src/model/IDManager';

const MAX_CASES = 100000

describe('Next UserID Function', function () {
  describe('unique', function () {
    it('should always return a uniqueID', function () {
      let ids = new Set<string>();
      let man = new IDManager();
      for (let i = 0; i < MAX_CASES; i++) {
        let nextID = man.nextUserID(undefined);
        assert(!ids.has(nextID.id));
        ids.add(nextID.id);
      }
    });
  });
});