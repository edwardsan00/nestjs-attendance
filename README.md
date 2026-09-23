# Sistema de Control de Asistencia Laboral

Sistema de control de asistencia laboral desarrollado con NestJS y SQL Server.

## Reto Técnico

El objetivo de este reto es desarrollar una API RESTful para gestionar la asistencia de los empleados en una empresa. La API debe permitir registrar entradas y salidas, así como consultar los registros de asistencia.

# Crea las variables de entorno

- Crea un .env con las variables del example

# Construir imágenes e iniciar todos los servicios

`docker compose up --build`

# Detener los contenedores sin borrar la base de datos

`docker compose down`

# Reiniciar desde cero eliminando datos de MySQL (para ejecutar init.sql)

docker compose down -v
