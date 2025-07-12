import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { pizzasApi } from '../api/pizzas';
import PizzaDetailsModal from '../components/DetailsModal';
import PizzaCard from '../components/PizzaCard';

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
      const pizzasArray = Array.isArray(data) ? data : (data.pizzas || data.data || []);
      setPizzas(pizzasArray);
    } catch (error) {
      setPizzas([]);
    } finally {
      setLoading(false);
    }
  };

  const getDefaultImage = () => {
    return "https://dynamoprojects.com/wp-content/uploads/2022/12/no-image.jpg";
  };

  const mapPizzaToModal = (pizza) => {
    return {
      piz_id: pizza.piz_id,
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
                      <PizzaCard
                        key={pizza.piz_id || pizza.id}
                        pizza={pizza}
                        getDefaultImage={getDefaultImage}
                        onDetails={() => {
                          setSelectedPizza(mapPizzaToModal(pizza));
                          setModalOpen(true);
                        }}
                      />
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
