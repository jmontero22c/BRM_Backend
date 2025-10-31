
# BRM Desarrollador - Backend

API REST para un sistema de inventario y compras, desarrollada con Node.j + Expresss, Sequelize (ORM) y MySQL. Incluye autenticación con JWT, manejo de roles (Administrador / Cliente), endpoints para productos, órdenes e historial de compras.

## ✨ Características

- Registro y autenticación de usuarios (Administrador y Cliente).
- CRUD de productos (solo Administrador).
- Módulo de compras para clientes.
- Visualización de historial de compras.
- Facturación de compras.
- Validaciones de datos y manejo de errores.
- Base de datos MySQL con Sequelize ORM
-  Documentación de API con  [apiDoc](https://apidocjs.com/)

## 🧩 Requisitos previos
- Node.js (versión 14 o superior)
- MySQL (versión 5.7 o superior)

## ⚙️ Instalación

#### 1. Clonar el repositorio:
```bash
git clone https://github.com/jmontero22c/BRM_Backend
cd API_BRM
```
  
  #### 2. Instalar dependencias:
``` bash 
npm install
```

#### 3.  Configurar Base de Datos
 Crear base de datos en MySQL:
``` sql
CREATE DATABASE db_brm;
```
	
#### 4. Configurar variables de entorno:  
Crear un archivo `.env` en la raíz del proyecto con el siguiente contenido:
```
DB_NAME=db_brm
DB_USER=root
DB_PASS=tu_contraseña_mysql
DB_HOST=localhost
DB_PORT=3306
PORT=3000
JWT_SECRET=tu_clave_secreta_para_sesiones
```

#### 5.  Ejecuta la app en modo desarrollo
``` bash 
# El sistema creará automáticamente las tablas al iniciar
npm run dev
```

## 🔗 Endpoints principales

| Módulo    | Método  | Ruta                         | Descripción                     |
|-----------|---------|------------------------------|---------------------------------|
| **Auth**      | POST    | `/api/v1/auth/register`  | Registrar un nuevo usuario                    |
|               | POST    | `/api/v1/auth/login`     | Iniciar sesión                                |
| **Products**  | GET     | `/api/v1/products`       | Listar todos los productos                              |
|               | GET			| `/api/v1/products/:id`   | Listar un solo producto                      |
|               | POST    | `/api/v1/products`       | Crear producto *(admin)*                      |
|               | PUT     | `/api/v1/products/:id`   | Actualizar producto *(admin)*                 |
|               | DELETE  | `/api/v1/products/:id`   | Eliminar producto *(admin)*                   |
| **Purchase**  | GET     | `/api/v1/purchases`         | Ver todas las compras *(admin)*                       |
|               | GET     | `/api/v1/purchases/:id`     | Ver detalle de una compra                      |
|               | POST    | `/api/v1/purchases`         | Crear una nueva compra                         |
|							  | GET     | `/api/v1/purchases/history` | Ver historial de productos comprados          |

## 🗃️ Estructura de la Base de Datos

###  Tablas Principales
- **usuarios**: Usuarios del sistema  
- **productos**: Catálogo de productos  
- **compras**: Cabecera de compras  
- **detallecompras**: Detalle de compras  

---

###  Relaciones

- **usuarios(1) → compras(N)**  
  Un usuario puede tener muchas compras.

- **compras(1) → detallecompras(N)**  
  Una compra puede tener varios detalles asociados.

- **productos(1) → detallecompras(N)**  
  Un producto puede aparecer en varios detalles de compra.
![ER Diagram](https://imgur.com/fzQwqOG.png)

## 👨‍💻 Autor

**Jesús Montero**  
Ingeniero de Sistemas y Computación  
 **jesusda71.2@gmail.com**
