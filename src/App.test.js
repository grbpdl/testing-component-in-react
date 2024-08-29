import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import App from './App';

// Mock the global fetch function
global.fetch = jest.fn();

describe('App Component', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear any previous mocks after each test
  });

  test('renders correctly when data is fetched successfully', async () => {
    // Mock users data
    const mockUsers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', website: 'example.com' },
      { id: 2, name: 'Jane Doe', email: 'jane@example.com', phone: '987-654-3210', website: 'example.org' },
    ];

    // Mock the fetch function to return the mockUsers array
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers,
    });

    // Use act to wrap the rendering and state updates
    await act(async () => {
      render(<App />);
    });

    // Wait for the users to be rendered
    await waitFor(() => {
      expect(screen.getByText('Fetched Users List')).toBeInTheDocument();
      mockUsers.forEach(user => {
        expect(screen.getByText(user.name)).toBeInTheDocument();
      });
    });
  });

  test('renders loading state initially', async () => {
    // To keep the loader active, we mock the fetch function to return a pending promise
    fetch.mockImplementation(() => new Promise(() => {}));

    // Use act to wrap the rendering and state updates
    await act(async () => {
      render(<App />);
    });

    // Check that the loader is in the document
    const loader = screen.getByRole('status');
    expect(loader).toBeInTheDocument();
  });

  test('displays an error message when the API call fails', async () => {
    // Mock the fetch function to simulate a failed API call
    fetch.mockRejectedValueOnce(new Error('Failed to fetch data'));

    // Use act to wrap the rendering and state updates
    await act(async () => {
      render(<App />);
    });

    // Wait for the error message to be rendered
    await waitFor(() => {
      expect(screen.getByText(/Error: Failed to fetch data/i)).toBeInTheDocument();
    });
  });
});
