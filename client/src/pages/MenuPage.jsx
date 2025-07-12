import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { pizzasApi } from '../api/pizzas';
import PizzaDetailsModal from '../components/DetailsModal';

const MenuPage = () => {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPizza, setSelectedPizza] = useState(null);

  useEffect(() => {
    loadPizzas();
  }, []);

  const loadPizzas = async () => {
    try {
      setLoading(true);
      const data = await pizzasApi.getAll();
      
      // Verificar si data es un array o si está dentro de otra propiedad
      const pizzasArray = Array.isArray(data) ? data : (data.pizzas || data.data || []);
      setPizzas(pizzasArray);
    } catch (error) {
      setPizzas([]); // Asegurar que siempre sea un array
    } finally {
      setLoading(false);
    }
  };

  const getDefaultImage = () => {
    return "https://dynamoprojects.com/wp-content/uploads/2022/12/no-image.jpg";
  };

  // Adaptar los datos de la pizza a lo que espera el modal
  const mapPizzaToModal = (pizza) => {
    return {
      piz_id: pizza.piz_id, // ¡Clave para que el modal funcione!
      name: pizza.piz_name,
      origin: pizza.piz_origin || 'Local',
      state: pizza.piz_state === true || pizza.piz_state === 'true',
      imageUrl: pizza.url_image || getDefaultImage(),
      ingredients: pizza.ingredients || [],
    };
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <PizzaDetailsModal open={modalOpen} onClose={() => setModalOpen(false)} pizza={selectedPizza} />
      <div className="flex flex-col flex-1 overflow-y-auto">
        <Header currentPage="Menú" />
        
        <main className="p-8">
          {/* VISTA DE MENÚ (TARJETAS) */}
          <div id="menu-view">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Menú</h1>
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-600 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                Catálogo de Pizzas
              </h2>
              
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="text-gray-500">Cargando pizzas...</div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {Array.isArray(pizzas) && pizzas
                    .filter(pizza => pizza.piz_state === true || pizza.piz_state === 'true')
                    .map((pizza) => (
                    <div key={pizza.piz_id || pizza.id} className="bg-white rounded-lg shadow-md overflow-hidden group">
                      <div className="relative">
                        <img 
                          src={pizza.url_image || getDefaultImage()} 
                          alt={`Pizza ${pizza.piz_name}`} 
                          className="w-full h-56 object-cover"
                          onError={(e) => {
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
                            onClick={() => {
                              setSelectedPizza(mapPizzaToModal(pizza));
                              setModalOpen(true);
                            }}
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
                  ))}
                </div>
              )}
              
              {!loading && (!Array.isArray(pizzas) || pizzas.length === 0) && (
                <div className="text-center py-16">
                  <div className="text-gray-500 text-lg">No hay pizzas disponibles</div>
                  <div className="text-gray-400 text-sm mt-2">Agrega algunas pizzas en la sección de gestión</div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MenuPage;
