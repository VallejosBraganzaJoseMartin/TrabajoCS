import React from 'react';

const PizzaCard = ({ pizza, onDetails, getDefaultImage }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden group">
      <div className="relative">
        <img
          src={pizza.url_image || getDefaultImage()}
          alt={`Pizza ${pizza.piz_name}`}
          className="w-full h-56 object-cover"
          onError={e => {
            e.target.src = getDefaultImage();
          }}
        />
        <div className="absolute top-2 right-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            pizza.piz_state === true || pizza.piz_state === 'true'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {pizza.piz_state === true || pizza.piz_state === 'true' ? 'Activo' : 'Inactivo'}
          </span>
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
          <button
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-gray-800 font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 shadow-md"
            onClick={onDetails}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>Ver Detalles</span>
          </button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-md font-bold text-gray-800">{pizza.piz_name}</h3>
        <p className="text-sm text-gray-500 mt-1 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          {pizza.piz_origin || 'Local'}
        </p>
      </div>
    </div>
  );
};

export default PizzaCard;
