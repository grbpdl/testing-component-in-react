import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import App from './App';


//unit test 1
// check if it renders the fetched data correctly
global.fetch = jest.fn();
describe('App Component', () => {
  afterEach(() => {
    jest.clearAllMocks(); 
  });


  test('renders correctly when data is fetched successfully', async () => {
    // sample data that the api would return
    const sampleData = [
      { id: 1, name: 'Gaurab Paudyal', email: 'gaurab@xyz.com', phone: '9812905882', website: 'gaurab.com' },
      { id: 2, name: 'Virt Tech', email: 'virt.exampleemail.com', phone: '9800000000', website: 'virt.com' },
    ];

 // a sucessful api call that returns data
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => sampleData,
    });

    await act(async () => {
      render(<App />);
    });

    // testing if its rendered the same data
    await waitFor(() => {
      expect(screen.getByText('Fetched Users List')).toBeInTheDocument();
      sampleData.forEach(user => {
        expect(screen.getByText(user.name)).toBeInTheDocument();
      });
    });
  });


  //Unit Test 2
  //test if loading is shown before data is fetched
  test('loader renders initially', async () => {
    fetch.mockImplementation(() => new Promise(() => {})); //keeps loader active
    await act(async () => {
      render(<App />);
    });

    const loader = screen.getByRole('status');
    expect(loader).toBeInTheDocument();
  });

//Unit test 3
  //to test if it displays an error message for failed API call
  test('error for failed API call', async () => {
    fetch.mockRejectedValueOnce(new Error('Failed to fetch data')); //failed API call
    await act(async () => {
      render(<App />);
    });
    await waitFor(() => {
      expect(screen.getByText(/Error: Failed to fetch data/i)).toBeInTheDocument();
    });
  });
});
