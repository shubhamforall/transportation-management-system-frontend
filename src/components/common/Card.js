import React from 'react';

const Card = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow text-center">
      <img src={icon} alt={title} className="mx-auto mb-4 w-12 h-12" />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default Card;
