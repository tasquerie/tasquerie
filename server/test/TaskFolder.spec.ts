import assert from 'assert';
import { TaskFolder} from '../src/model/TaskFolder';
import { Egg} from '../src/model/Egg';

describe('GetJson Function', function () {
	describe('getJson', function () {
		it('returns the JSON string for the TaskFolder Object', function () {
			let first = new TaskFolder("testName", "testDescription", "testEggType");
      const result = first.getJSON();
			let firstEgg = new Egg("testEggType");
			let eggString = firstEgg.getJSON();

      assert.strictEqual(result, "{\"name\":\"testName\",\"description\":\"testDescription\",\"egg\":" + eggString + ",\"eggCredits\":0,\"taskIDtoTasks\":{}}");
    });
  });
});
