import React, { ChangeEvent, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { SimpleUser, User } from './types/user';
import logo from './logo.svg';
import './App.css';
import { fetchUsers } from './helpers/fetchUsers';
import { List } from './components/List';

type State = {
  users: SimpleUser[];
  error: string;
  isLoading: boolean;
}

type Action = {
  type: 'LOADING' | 'ERROR' | 'DATA';
  payload?: SimpleUser[] | string;
}

const INITIAL_STATE = {
  users: [],
  error: '',
  isLoading: false,
}

const usersReducer = (state: State, action: Action): State => {
  const { type, payload } = action;
  switch (type) {
    case 'LOADING': return { ...state, isLoading: !state.isLoading }
    case 'ERROR': return { ...state, error: '' }
    case 'DATA': {
      if (payload && typeof payload !== 'string') {
        return { ...state, users: payload }
      }
      return state;
    }
    default: return state
  }
}

const App = () => {
  const [{ error, isLoading, users }, dispatch] = useReducer(usersReducer, INITIAL_STATE);
  const [name, setName] = useState('');
  const isMounted = useRef(true);

  useEffect(() => {
    dispatch({ type: 'LOADING' });
    fetchUsers()
      .then((data) => {
        if (!isMounted.current) {
          return
        }
        if (data) {
          const dataUsers = data.map((user: User) => {
            const { id, name, username } = user;
            return { id, name, username };
          });
          dispatch({ type: 'DATA', payload: dataUsers });
        }
      })
      .catch(error => {
        if (!isMounted.current) {
          return
        }
        console.error('error: ', error)
      })
      .finally(() => {
        dispatch({ type: 'LOADING' });
      });

    return () => { isMounted.current = false };
  }, []);

  const memoizedUsers = useMemo(() => {
    return users.filter(user => user.name.toLowerCase().includes(name.toLowerCase()))
  }, [name, users]);

  const onChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setName(e.target.value);
  }
  return (
    <div className="App">
      <h1>Users List</h1>
      <input className="App-input" aria-label="search by name" type="text" onChange={onChange} placeholder="Search by name" />
      {isLoading ? <img src={logo} className="App-logo" alt="logo" /> : null}
      {!error && users.length ?
        <List list={memoizedUsers} />
        : <p>{error}</p>}
    </div>
  );
}

export default App;
