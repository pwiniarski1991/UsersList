import React from 'react';
import users from './mocks/users.json';
import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {

  const mockFetchUsers = jest.fn().mockResolvedValue(users);

  beforeAll(() => {
    jest.mock('./helpers/fetchUsers', () => ({
      fetchUsers: mockFetchUsers
    }));
  });

  afterAll(() => {
    jest.requireActual('./helpers/fetchUsers');
  })
  it('renders properly', () => {
    render(<App />);
    const headingElement = screen.getByText('Users List');
    const input = screen.getByRole('textbox');
    expect(headingElement).toBeInTheDocument();
    expect(input.getAttribute('aria-label')).toEqual('search by name');
  });

  it('renders properly initial users list', async () => {
    render(<App />);
    const list = await screen.findAllByRole('listitem');
    expect(list.length).toEqual(10);
  });

  it('filters users list by searched name typed in input', async () => {
    render(<App />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'K' } });
    const list = await screen.findAllByRole('listitem');
    expect(list.length).toEqual(2);
    list.forEach((user) => {
      expect(user).toHaveTextContent(/k/);
    })
  });

  it('display user when name matches searched text typed in input', async () => {
    render(<App />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Kurtis' } });
    const user = await screen.findByRole('listitem');
    expect(user).toHaveTextContent(/Kurtis/);
  });

});
