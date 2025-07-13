import React, { useState, useEffect } from 'react';
import { authApi } from '../api/auth';
import { usersApi } from '../api/users';

export default function UserModal({
  isOpen,
  onClose,
  onSave,
  user,
  roles,
  mode
}) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    roleId: '',
    isActive: true
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && user) {
      setFormData({
        firstName: user.firstName || user.user_names || '',
        lastName: user.lastName || user.user_surenames || '',
        email: user.email || user.user_email || '',
        password: '',
        confirmPassword: '',
        roleId: user.roleId || user.role_id || '',
        isActive: user.isActive !== undefined ? user.isActive : (user.user_status !== undefined ? user.user_status : true)
      });
    } else {
      // Resetear formulario para modo crear
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        roleId: '',
        isActive: true
      });
    }
    setErrors({});
  }, [mode, user, isOpen]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Mapear nombres de campos del formulario a estructura interna
    let fieldName = name;
    if (name === 'user_names') fieldName = 'firstName';
    if (name === 'user_surenames') fieldName = 'lastName';
    if (name === 'user_email') fieldName = 'email';
    if (name === 'user_password') fieldName = 'password';
    if (name === 'role_id') fieldName = 'roleId';
    if (name === 'user_status') fieldName = 'isActive';

    setFormData(prev => ({
      ...prev,
      [fieldName]: type === 'checkbox' ? checked : value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.roleId) {
      newErrors.roleId = 'El rol es requerido';
    }

    if (mode === 'create') {
      if (!formData.password) {
        newErrors.password = 'La contraseña es requerida';
      } else if (formData.password.length < 6) {
        newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Confirma la contraseña';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
    } else if (mode === 'edit') {
      // En modo edición, la contraseña es opcional
      if (formData.password && formData.password.length < 6) {
        newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      }

      if (formData.password && formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const userData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        roleId: parseInt(formData.roleId),
        isActive: formData.isActive
      };

      if (mode === 'create') {
        // Para crear usuarios, usar el endpoint de registro
        const registerData = {
          user_names: formData.firstName.trim(),
          user_surenames: formData.lastName.trim(),
          user_email: formData.email.trim(),
          user_password: formData.password,
          role_id: parseInt(formData.roleId),
          user_state: formData.isActive
        };
        await authApi.register(registerData);
      } else {
        // Para editar usuarios, usar el endpoint de actualización
        // Usar el id correcto (user.id o user.user_id)
        const userId = user.id || user.user_id;
        // Mapear los campos al formato esperado por el backend
        const updateData = {
          user_names: formData.firstName.trim(),
          user_surenames: formData.lastName.trim(),
          user_email: formData.email.trim(),
          role_id: parseInt(formData.roleId),
          user_state: formData.isActive
        };
        if (formData.password) {
          updateData.user_password = formData.password;
        }
        await usersApi.update(userId, updateData);
      }
      
      onClose();
      // Recargar la página para reflejar los cambios
      window.location.reload();
    } catch (error) {
      console.error('Error saving user:', error);
      
      // Manejar errores específicos del servidor
      if (error.response?.data?.message) {
        if (error.response.data.message.includes('email')) {
          setErrors({ email: 'Este email ya está registrado' });
        } else {
          setErrors({ general: error.response.data.message });
        }
      } else {
        setErrors({ general: 'Error al guardar el usuario' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300"
        onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-md flex flex-col transform transition-all duration-300 scale-95 opacity-0"
        ref={node => node && requestAnimationFrame(() => node.classList.remove('scale-95', 'opacity-0'))}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera del Modal */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {mode === 'edit' ? 'Editar Usuario' : 'Añadir Nuevo Usuario'}
            </h2>
            <button
              className="text-gray-400 hover:text-gray-600 transition-colors"
              onClick={onClose}
              aria-label="Cerrar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
        </div>

        {/* Error general */}
        {errors.general && (
          <div className="mx-4 mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {errors.general}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} autoComplete="off">
            <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombres *</label>
                        <input 
                          type="text" 
                          name="user_names" 
                          value={formData.firstName} 
                          onChange={handleInputChange} 
                          placeholder="Ej: Juan" 
                          className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-transparent ${
                            errors.firstName ? 'border-red-300' : 'border-gray-300'
                          }`}
                          required 
                        />
                        {errors.firstName && (
                          <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos *</label>
                        <input 
                          type="text" 
                          name="user_surenames" 
                          value={formData.lastName} 
                          onChange={handleInputChange} 
                          placeholder="Ej: Pérez" 
                          className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-transparent ${
                            errors.lastName ? 'border-red-300' : 'border-gray-300'
                          }`}
                          required 
                        />
                        {errors.lastName && (
                          <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input 
                      type="email" 
                      name="user_email" 
                      value={formData.email} 
                      onChange={handleInputChange} 
                      placeholder="ejemplo@email.com" 
                      className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-transparent ${
                        errors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                      required 
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contraseña {mode === 'create' ? '*' : '(opcional)'}
                    </label>
                    <input 
                      type="password" 
                      name="user_password" 
                      value={formData.password} 
                      onChange={handleInputChange} 
                      placeholder={mode === 'edit' ? 'Dejar en blanco para no cambiar' : '••••••••'} 
                      className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-transparent ${
                        errors.password ? 'border-red-300' : 'border-gray-300'
                      }`}
                      required={mode === 'create'} 
                      autoComplete="new-password" 
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                    )}
                </div>

                {/* Campo para confirmar contraseña */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirmar Contraseña {mode === 'create' ? '*' : ''}
                    </label>
                    <input 
                      type="password" 
                      name="confirm_password" 
                      value={formData.confirmPassword} 
                      onChange={(e) => setFormData(prev => ({...prev, confirmPassword: e.target.value}))} 
                      placeholder="Confirma la contraseña" 
                      className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-transparent ${
                        errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                      }`}
                      required={mode === 'create'} 
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rol *</label>
                    <select 
                      name="role_id" 
                      value={formData.roleId} 
                      onChange={handleInputChange} 
                      className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-transparent ${
                        errors.roleId ? 'border-red-300' : 'border-gray-300'
                      }`}
                      required
                    >
                        <option value="">Selecciona un rol</option>
                        {roles.map((role) => (
                          <option key={role.role_id || role.id} value={role.role_id || role.id}>
                            {role.role_name || role.name}
                          </option>
                        ))}
                    </select>
                    {errors.roleId && (
                      <p className="mt-1 text-sm text-red-600">{errors.roleId}</p>
                    )}
                </div>
                
                <div className="flex items-center pt-2">
                    <input 
                      id="user_status" 
                      type="checkbox" 
                      name="user_status" 
                      checked={formData.isActive} 
                      onChange={handleInputChange} 
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded" 
                    />
                    <label htmlFor="user_status" className="ml-2 block text-sm text-gray-900">Usuario Activo</label>
                </div>
            </div>
            
            {/* Pie del Modal */}
            <div className="flex justify-end p-4 bg-gray-50 border-t border-gray-200 rounded-b-lg space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-md bg-white border border-gray-300 text-gray-800 hover:bg-gray-100 font-semibold transition-colors"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 font-semibold shadow-sm hover:shadow-md transition-all disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Guardando...' : (mode === 'edit' ? 'Guardar Cambios' : 'Crear Usuario')}
              </button>
            </div>
        </form>
      </div>
    </div>
  );
}
