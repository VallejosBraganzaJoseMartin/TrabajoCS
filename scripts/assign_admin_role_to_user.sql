-- Script para asignar el rol de Administrador a un usuario específico
-- Reemplaza USER_ID con el ID del usuario al que quieres convertir en administrador

DO $$
DECLARE
    admin_role_id INT;
    target_user_id INT := 1; -- CAMBIA ESTE VALOR al ID del usuario que quieres hacer administrador
BEGIN
    -- Obtener el ID del rol Administrador
    SELECT role_id INTO admin_role_id FROM roles WHERE role_name = 'Administrador' LIMIT 1;
    
    IF admin_role_id IS NULL THEN
        RAISE EXCEPTION 'El rol de Administrador no existe';
    END IF;
    
    -- Verificar que el usuario existe
    IF NOT EXISTS (SELECT 1 FROM users WHERE user_id = target_user_id) THEN
        RAISE EXCEPTION 'El usuario con ID % no existe', target_user_id;
    END IF;
    
    -- Asignar el rol de Administrador al usuario (si no lo tiene ya)
    IF NOT EXISTS (SELECT 1 FROM users_roles WHERE user_id = target_user_id AND role_id = admin_role_id) THEN
        INSERT INTO users_roles (user_id, role_id) VALUES (target_user_id, admin_role_id);
        RAISE NOTICE 'Se ha asignado el rol de Administrador al usuario con ID %', target_user_id;
    ELSE
        RAISE NOTICE 'El usuario con ID % ya tiene el rol de Administrador', target_user_id;
    END IF;
    
    -- Asegurarse de que el usuario esté activo
    UPDATE users SET user_state = true WHERE user_id = target_user_id AND user_state = false;
END $$;