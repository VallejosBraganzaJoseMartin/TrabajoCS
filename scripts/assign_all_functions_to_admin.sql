-- Script para asignar todas las funciones al rol de Administrador

DO $$
DECLARE
    admin_role_id INT;
BEGIN
    -- Obtener el ID del rol Administrador
    SELECT role_id INTO admin_role_id FROM roles WHERE role_name = 'Administrador' LIMIT 1;
    
    IF admin_role_id IS NULL THEN
        RAISE EXCEPTION 'El rol de Administrador no existe';
    END IF;
    
    -- Eliminar asignaciones existentes para evitar duplicados
    DELETE FROM roles_funciones WHERE role_id = admin_role_id;
    
    -- Asignar todas las funciones al rol Administrador
    INSERT INTO roles_funciones (role_id, funcion_id)
    SELECT admin_role_id, funcion_id FROM funciones;
    
    RAISE NOTICE 'Se han asignado todas las funciones al rol de Administrador (ID: %)', admin_role_id;
END $$;