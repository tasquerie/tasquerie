import assert from 'assert';
import { Egg} from '../src/model/Egg';

describe('GetJson Function', function () {
	describe('getJson', function () {
		it('returns the JSON string for the Egg Object', function () {
			let first = new Egg("eggType");
      const result = first.getJSON();

      assert.strictEqual(result, "{\"eggType\":\"eggType\",\"eggStage\":-1,\"exp\":0,\"equippedAccessories\":{}}");
    });
  });
});
