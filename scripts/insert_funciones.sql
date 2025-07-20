-- Insertar funciones básicas si no existen
DO $$
BEGIN
  -- Gestionar usuarios
  IF NOT EXISTS (SELECT 1 FROM funciones WHERE funcion_name = 'gestionar_usuarios') THEN
    INSERT INTO funciones (funcion_name, funcion_descripcion, funcion_state)
    VALUES ('gestionar_usuarios', 'Crear, editar y eliminar usuarios del sistema', true);
  ELSE
    UPDATE funciones SET funcion_descripcion = 'Crear, editar y eliminar usuarios del sistema', funcion_state = true 
    WHERE funcion_name = 'gestionar_usuarios';
  END IF;
  
  -- Ver usuarios
  IF NOT EXISTS (SELECT 1 FROM funciones WHERE funcion_name = 'ver_usuarios') THEN
    INSERT INTO funciones (funcion_name, funcion_descripcion, funcion_state)
    VALUES ('ver_usuarios', 'Ver la lista de usuarios registrados en el sistema', true);
  ELSE
    UPDATE funciones SET funcion_descripcion = 'Ver la lista de usuarios registrados en el sistema', funcion_state = true 
    WHERE funcion_name = 'ver_usuarios';
  END IF;
  
  -- Gestionar roles
  IF NOT EXISTS (SELECT 1 FROM funciones WHERE funcion_name = 'gestionar_roles') THEN
    INSERT INTO funciones (funcion_name, funcion_descripcion, funcion_state)
    VALUES ('gestionar_roles', 'Crear, editar y eliminar roles del sistema', true);
  ELSE
    UPDATE funciones SET funcion_descripcion = 'Crear, editar y eliminar roles del sistema', funcion_state = true 
    WHERE funcion_name = 'gestionar_roles';
  END IF;
  
  -- Gestionar funciones
  IF NOT EXISTS (SELECT 1 FROM funciones WHERE funcion_name = 'gestionar_funciones') THEN
    INSERT INTO funciones (funcion_name, funcion_descripcion, funcion_state)
    VALUES ('gestionar_funciones', 'Crear, editar y eliminar funciones del sistema', true);
  ELSE
    UPDATE funciones SET funcion_descripcion = 'Crear, editar y eliminar funciones del sistema', funcion_state = true 
    WHERE funcion_name = 'gestionar_funciones';
  END IF;
  
  -- Gestionar pizzas
  IF NOT EXISTS (SELECT 1 FROM funciones WHERE funcion_name = 'gestionar_pizzas') THEN
    INSERT INTO funciones (funcion_name, funcion_descripcion, funcion_state)
    VALUES ('gestionar_pizzas', 'Crear, editar y eliminar pizzas del menú', true);
  ELSE
    UPDATE funciones SET funcion_descripcion = 'Crear, editar y eliminar pizzas del menú', funcion_state = true 
    WHERE funcion_name = 'gestionar_pizzas';
  END IF;
  
  -- Ver pizzas
  IF NOT EXISTS (SELECT 1 FROM funciones WHERE funcion_name = 'ver_pizzas') THEN
    INSERT INTO funciones (funcion_name, funcion_descripcion, funcion_state)
    VALUES ('ver_pizzas', 'Ver la lista de pizzas disponibles en el menú', true);
  ELSE
    UPDATE funciones SET funcion_descripcion = 'Ver la lista de pizzas disponibles en el menú', funcion_state = true 
    WHERE funcion_name = 'ver_pizzas';
  END IF;
  
  -- Gestionar ingredientes
  IF NOT EXISTS (SELECT 1 FROM funciones WHERE funcion_name = 'gestionar_ingredientes') THEN
    INSERT INTO funciones (funcion_name, funcion_descripcion, funcion_state)
    VALUES ('gestionar_ingredientes', 'Crear, editar y eliminar ingredientes para las pizzas', true);
  ELSE
    UPDATE funciones SET funcion_descripcion = 'Crear, editar y eliminar ingredientes para las pizzas', funcion_state = true 
    WHERE funcion_name = 'gestionar_ingredientes';
  END IF;
  
  -- Ver ingredientes
  IF NOT EXISTS (SELECT 1 FROM funciones WHERE funcion_name = 'ver_ingredientes') THEN
    INSERT INTO funciones (funcion_name, funcion_descripcion, funcion_state)
    VALUES ('ver_ingredientes', 'Ver la lista de ingredientes disponibles para las pizzas', true);
  ELSE
    UPDATE funciones SET funcion_descripcion = 'Ver la lista de ingredientes disponibles para las pizzas', funcion_state = true 
    WHERE funcion_name = 'ver_ingredientes';
  END IF;
  
  -- Eliminar primero las referencias en la tabla intermedia
  DELETE FROM roles_funciones 
  WHERE funcion_id IN (SELECT funcion_id FROM funciones WHERE funcion_name IN (
    'manage_users', 'view_users', 'manage_roles', 'manage_functions', 
    'manage_pizzas', 'view_pizzas', 'manage_ingredients', 'view_ingredients'
  ));
  
  -- Luego eliminar las funciones en inglés
  DELETE FROM funciones WHERE funcion_name IN (
    'manage_users', 'view_users', 'manage_roles', 'manage_functions', 
    'manage_pizzas', 'view_pizzas', 'manage_ingredients', 'view_ingredients'
  );
  
END $$;