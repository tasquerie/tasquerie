import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { BackendWrapper } from './BackendWrapper';

// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });

test('signs up correctly', async () => {
  let loginTest = new BackendWrapper();
  let args = new Map<string, string>();
  args.set("username", "khai");
  args.set("password", "PASSWORD");
  const resp = await loginTest.login('signup', args);
  console.log('Promise resolved with value: ');
  console.log('Promise resolved with value: ' + resp);
});
