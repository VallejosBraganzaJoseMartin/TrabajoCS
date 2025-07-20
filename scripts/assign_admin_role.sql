-- Script para asignar rol de Administrador a Cris Stiven Pusda Hernandez

-- Primero, obtener el ID del usuario y del rol
DO $$
DECLARE
    user_id_var INT;
    admin_role_id INT;
BEGIN
    -- Obtener el ID del usuario Cris Stiven Pusda Hernandez
    SELECT user_id INTO user_id_var 
    FROM users 
    WHERE user_names = 'Cris Stiven' AND user_surenames = 'Pusda Hernandez';
    
    -- Obtener el ID del rol Administrador
    SELECT role_id INTO admin_role_id 
    FROM roles 
    WHERE role_name = 'Administrador';
    
    -- Verificar que ambos IDs existen
    IF user_id_var IS NULL THEN
        RAISE EXCEPTION 'Usuario no encontrado';
    END IF;
    
    IF admin_role_id IS NULL THEN
        RAISE EXCEPTION 'Rol Administrador no encontrado';
    END IF;
    
    -- Insertar en la tabla users_roles si no existe ya
    INSERT INTO users_roles (user_id, role_id)
    SELECT user_id_var, admin_role_id
    WHERE NOT EXISTS (
        SELECT 1 FROM users_roles 
        WHERE user_id = user_id_var AND role_id = admin_role_id
    );
    
    RAISE NOTICE 'Rol Administrador asignado correctamente al usuario ID: %', user_id_var;
END $$;