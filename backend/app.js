const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const sequelize = require('./config/database');
const ingredientRoutes = require('./routes/ingredient.routes');
const pizzaRoutes = require('./routes/pizza.routes');
const pizzaIngredientRoutes = require('./routes/pizzaIngredient.routes');
const userRoutes = require('./routes/user.routes');
const roleRoutes = require('./routes/role.routes');
const authRoutes = require('./routes/auth.routes');
const funcionesRoutes = require('./routes/funciones.routes');
const rolesFuncionesRoutes = require('./routes/rolesFunciones.routes');
const rolesUsuariosRoutes = require('./routes/rolesUsuarios.routes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

sequelize.authenticate()
  .then(() => console.log('Conexion exitosa...'))
  .catch(err => console.error('Error al conectar a la base de datos:', err));

app.get('/', (req, res) => {
  res.send('Si sirve :)');
});

app.use('/api/ingredients', ingredientRoutes);
app.use('/api/pizzas', pizzaRoutes);
app.use('/api/pizza-ingredients', pizzaIngredientRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/funciones', funcionesRoutes);
app.use('/api/roles-funciones', rolesFuncionesRoutes);
app.use('/api/roles-usuarios', rolesUsuariosRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
