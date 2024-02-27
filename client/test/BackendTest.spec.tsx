import {BackendWrapper} from '../src/BackendWrapper';

test('signs up correctly', () => {
  let loginTest = new BackendWrapper();
  let args = new Map<string, string>();
  args.set("username", "khai");
  args.set("password", "PASSWORD");
  const resp = loginTest.login('signup', args);
  resp.then((value) => {
    console.log('Promise resolved with value: ' + value);
  })
  .catch((error) => {
    console.error('Promise rejected with error: ' + error);
  });
});
