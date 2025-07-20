-- Crear la tabla roles_funciones si no existe
CREATE TABLE IF NOT EXISTS roles_funciones (
    role_id INT NOT NULL,
    funcion_id INT NOT NULL,
    PRIMARY KEY (role_id, funcion_id),
    FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE,
    FOREIGN KEY (funcion_id) REFERENCES funciones(funcion_id) ON DELETE CASCADE
);

DO $$
DECLARE
    admin_role_id INT;
    gerente_role_id INT;
    empleado_role_id INT;
BEGIN
    -- Obtener el ID del rol Administrador
    SELECT role_id INTO admin_role_id FROM roles WHERE role_name = 'Administrador' LIMIT 1;
    
    -- Asignar todas las funciones al rol Administrador
    IF admin_role_id IS NOT NULL THEN
        INSERT INTO roles_funciones (role_id, funcion_id)
        SELECT admin_role_id, funcion_id FROM funciones
        WHERE NOT EXISTS (
            SELECT 1 FROM roles_funciones 
            WHERE role_id = admin_role_id AND funcion_id = funciones.funcion_id
        );
    END IF;
    
    -- Obtener el ID del rol Gerente
    SELECT role_id INTO gerente_role_id FROM roles WHERE role_name = 'Gerente' LIMIT 1;
    
    -- Asignar funciones específicas al rol Gerente
    IF gerente_role_id IS NOT NULL THEN
        INSERT INTO roles_funciones (role_id, funcion_id)
        SELECT gerente_role_id, funcion_id FROM funciones
        WHERE funcion_name IN ('ver_usuarios', 'gestionar_pizzas', 'ver_pizzas', 'gestionar_ingredientes', 'ver_ingredientes')
        AND NOT EXISTS (
            SELECT 1 FROM roles_funciones 
            WHERE role_id = gerente_role_id AND funcion_id = funciones.funcion_id
        );
    END IF;
    
    -- Obtener el ID del rol Empleado
    SELECT role_id INTO empleado_role_id FROM roles WHERE role_name = 'Empleado' LIMIT 1;
    
    -- Asignar funciones específicas al rol Empleado
    IF empleado_role_id IS NOT NULL THEN
        INSERT INTO roles_funciones (role_id, funcion_id)
        SELECT empleado_role_id, funcion_id FROM funciones
        WHERE funcion_name IN ('ver_pizzas', 'ver_ingredientes')
        AND NOT EXISTS (
            SELECT 1 FROM roles_funciones 
            WHERE role_id = empleado_role_id AND funcion_id = funciones.funcion_id
        );
    END IF;
END $$;