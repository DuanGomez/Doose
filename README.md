# Doose — Estudio de tatuajes

Plataforma web para un estudio de tatuajes: portafolio de trabajos con favoritos, catálogo de
servicios con carrito y reserva de citas por tatuador, y panel de administración.

Desarrollado por **Duan Gómez** y **Sebastián González** · [Dcodea](https://www.instagram.com/dcod.ea/).

**Demo en vivo:** cada push a `main` publica el frontend en GitHub Pages en **modo demo**: la API
se simula en el navegador con la misma lógica del backend y los datos se guardan en `localStorage`.
En la pantalla de inicio de sesión hay accesos rápidos por rol.

| Usuario | Rol | Contraseña |
|---|---|---|
| duan@gmail.com | Cliente | `duan123` |
| sebastian@tattoo.com | Tatuador | `sebastian123` |
| admin@gmail.com | Administrador | `admin123` |

## Funcionalidades

- **Portafolio** de tatuajes con favoritos por usuario y "más popular de la semana".
- **Servicios** con precio y duración; al reservar se elige tatuador (los especialistas del estilo
  aparecen primero), día y hora. Los horarios respetan la duración del servicio, las citas ya
  confirmadas y un máximo de 3 servicios por tatuador al día.
- **Carrito y reserva**: el carrito se conserva al recargar; al confirmar se generan las citas.
- **Agenda de citas** para tatuadores (sus citas) y administradores (todas).
- **Panel admin**: servicios, portafolio, usuarios y mensajes de contacto.

## Stack

- **Frontend:** Angular 17 (standalone, signals), SCSS.
- **Backend:** Spring Boot, Spring Security + JWT, JPA/Hibernate, PostgreSQL.

## Ejecutar en local

```bash
# Solo frontend (modo demo)
cd frontend && npm install && npm start          # http://localhost:4200

# Backend: define DB_URL, DB_USERNAME, DB_PASSWORD, JWT_SECRET y JWT_EXPIRATION (o un archivo .env)
cd Doose && ./mvnw spring-boot:run               # http://localhost:8080
cd frontend && npm run start:api                 # frontend contra la API local
```

## Despliegue en GitHub Pages

En el repositorio: **Settings → Pages → Source: GitHub Actions** (no uses las plantillas
"Jekyll" ni "Static HTML"). Cada push a `main` ejecuta `.github/workflows/deploy-pages.yml`.
