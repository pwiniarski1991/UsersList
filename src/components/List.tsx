import React, { FC } from 'react'
import { SimpleUser } from '../types/user';
import './List.css';

interface Props {
  list: SimpleUser[]
}

export const List: FC<Props> = ({ list }) => {
  return (
    <ol className="list">
      {list.map(item => (
        <li className="list__item" key={item.id}>
          <span className="name">{item.name}</span>
          {`@${item.username}`}
        </li>
      ))}
    </ol>
  )
}