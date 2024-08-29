import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

// Mocking fetch to control the API responses
global.fetch = jest.fn();

describe('App Component', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear any previous mocks after each test
  });

  test('renders loading state initially', () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<App />);

    const loader = screen.getByRole('status'); // Assuming the loader has a role
    expect(loader).toBeInTheDocument();
  });

  test('renders user list when data is fetched successfully', async () => {
    const mockUsers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', website: 'example.com' },
      { id: 2, name: 'Jane Doe', email: 'jane@example.com', phone: '987-654-3210', website: 'example.org' },
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers,
    });

    render(<App />);

    // Wait for users to be rendered
    await waitFor(() => {
      expect(screen.getByText('Fetched Users List')).toBeInTheDocument();
      mockUsers.forEach(user => {
        expect(screen.getByText(user.name)).toBeInTheDocument();
        expect(screen.getByText(user.email)).toBeInTheDocument();
        expect(screen.getByText(user.phone)).toBeInTheDocument();
        expect(screen.getByText(user.website)).toBeInTheDocument();
      });
    });
  });

  test('displays an error message when the API call fails', async () => {
    const errorMessage = 'Network response was not ok';

    fetch.mockRejectedValueOnce(new Error(errorMessage));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
    });
  });
});
