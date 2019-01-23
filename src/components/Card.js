import React from 'react';
import './card.css';

function Card(props) {
  function onClick() {
    props.onClickCard(props.name);
  }

  return (
    <div className="card">
      <img onClick={onClick} src={props.image} alt={props.name} />
    </div>
  );
}

export default Card;
