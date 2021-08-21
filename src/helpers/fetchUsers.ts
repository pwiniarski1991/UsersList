import { User } from "../types/user";

export const fetchUsers = async (): Promise<User[] | undefined> => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('error: ', error.message);
  }
}