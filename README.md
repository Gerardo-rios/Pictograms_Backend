# Servicio Web para Autenticación y Gestión de Pictogramas

Este servicio web permite iniciar sesión y registrar personas, además de crear, listar, modificar y buscar pictogramas.

## Características

- Inicio de sesión y registro de usuarios.
- Gestión de pictogramas: crear, listar, modificar y buscar.

## Autenticación

Para las operaciones que lo requieren, se utiliza autenticación a través de un token JWT.

- Nombre del token para incluir en las cabeceras de las solicitudes: `X-Access-Token`

## Endpoints

### Inicio de Sesión

- **Ruta**: `/inicio_sesion`
- **Método**: POST
- **Body**:
  ```json
  {
    "correo": "fernanda@gmail.com",
    "clave": "1234"
  }
  ```

### Registrar Personas

- **Ruta**: `/persona/usuario/save`
- **Método**: POST
- **Body**:
  ```json
  {
    "nombres": "string",
  "apellidos": "string",
  "dni": "string",
  "tipo": "string",
  "correo": "email",
  "clave": "string"
  }
  ```

### Listar Pictogramas 

- **Ruta**: `/pictogramas`
- **Método**: GET
- **Requiere Token**: Sí

### Guardar Pictograma
- **Ruta**: `/pictograma/save`
- **Método**: POST
- **Body**:
  ```json
  {
  "archivo": "binario",
  "nombre": "string",
  "descripcion": "string"
  }
  ```

### Editar Pictograma
- **Ruta**: `/pictogramas/update`
- **Método**: POST
- **Body**:
  ```json
  {
  "archivo": "binario",
  "nombre": "string",
  "descripcion": "string"
  }
  ```

### Buscar Pictogramas
- **Ruta**: `/pictograma/<external_id>`
- **Método**: GET
- **Requiere Token**: Sí
