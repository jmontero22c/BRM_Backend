const registroValidacion = (data) => {
  const errors = [];

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("El email es inválido o está vacío.");
  }

  if (!data.password || data.password.length < 6) {
    errors.push("La contraseña debe tener al menos 6 caracteres.");
  }

  if (data.rol && !["Administrador", "Cliente"].includes(data.rol)) {
    errors.push("El rol debe ser 'Administrador' o 'Cliente'.");
  }

  return {
    error: errors.length > 0 ? errors.join(" ") : null,
  };
};

const loginValidacion = (data) => {
  const errors = [];

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("El email es inválido o está vacío.");
  }

  if (!data.password) {
    errors.push("La contraseña es requerida.");
  }

  return {
    error: errors.length > 0 ? errors.join(" ") : null,
  };
};

const productoValidacion = (data) => {
  const errors = [];

  if (!data.numero_lote) errors.push("El número de lote es obligatorio.");
  if (!data.nombre) errors.push("El nombre del producto es obligatorio.");
  if (data.precio == null || isNaN(data.precio) || data.precio < 0)
    errors.push("El precio debe ser un número mayor o igual a 0.");
  if (
    data.cantidad_disponible == null ||
    isNaN(data.cantidad_disponible) ||
    data.cantidad_disponible < 0
  )
    errors.push("La cantidad disponible debe ser un número mayor o igual a 0.");
  if (!data.fecha_ingreso || isNaN(Date.parse(data.fecha_ingreso)))
    errors.push("La fecha de ingreso no es válida.");

  return {
    error: errors.length > 0 ? errors.join(" ") : null,
  };
};

const compraValidacion = (data) => {
  const errors = [];

  if (!Array.isArray(data.items) || data.items.length === 0) {
    errors.push("Debe agregar al menos un producto a la compra.");
  } else {
    data.items.forEach((item, index) => {
      if (!item.id_producto || isNaN(item.id_producto)) {
        errors.push(`El producto #${index + 1} no tiene un ID válido.`);
      }
      if (!item.cantidad || isNaN(item.cantidad) || item.cantidad < 1) {
        errors.push(
          `La cantidad del producto #${index + 1} debe ser al menos 1.`
        );
      }
    });
  }

  return {
    error: errors.length > 0 ? errors.join(" ") : null,
  };
};

module.exports = {
  registroValidacion,
  loginValidacion,
  productoValidacion,
  compraValidacion,
};
