import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'; // You don't need to use '/extend-expect'
import App from './App';

global.fetch = jest.fn();

beforeEach(() => {
  fetch.mockClear();
});

test('renders loading state initially', () => {
  render(<App />);
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
});

test('renders user list successfully', async () => {
  const mockUsers = [
    { id: 1, name: 'Leanne Graham' },
    { id: 2, name: 'Ervin Howell' },
  ];

  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => mockUsers,
  });

  render(<App />);

  await waitFor(() => expect(screen.getByText('Leanne Graham')).toBeInTheDocument());
  expect(screen.getByText('Ervin Howell')).toBeInTheDocument();
});

test('renders error message on API failure', async () => {
  fetch.mockRejectedValueOnce(new Error('API is down'));

  render(<App />);

  await waitFor(() => expect(screen.getByText(/error/i)).toBeInTheDocument());
  expect(screen.getByText(/api is down/i)).toBeInTheDocument();
});
