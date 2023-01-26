Hola, que tal? Soy Tomas, muchas gracias por leer el README

Ejecutar los siguiente comando para levantar la app

* `npm install`
* `cp .env.sample .env`
* `npm run start`


Ante todo agradecerles por tomarse el tiempo, trate de mantener todo _lo mas simple posible_, ademas queria contarles que actualmente estoy de vacaciones y tuve dificultades con el internet con lo que trabajaba con la minima cantidad de paquetes posibles y sumado a la falta de tiempo escribo mas abajo diferentes cambios que le vendrian bien al codigo


1. En el primer endpoint se deberia trabajar con el array de primeros datos que me da el libro, actualmente se esta ignorando

2. Agregar el maximo de compra que se puede tener en el segundo endpoint, no solo un limite de dinero seteado por el usuario sino que tambien se podria almacenar una variable con la cantidad de tokens que se tienen disponibles

3. Si el amount de querer comprar/vender es mayor a la sumatoria de amount de los ultimos 25 ordenes del order book va a dar error, esto se soluciona volviendo a buscar mas ordenes

4. Agregar paquetes: validaciones de tipado para los DTOs, swagger para la documentacion, etc

5. Se podria facilmente dockerizar para levantar la app con una base de datos en un futuro mas facil


Personalmente me siento mucho mas comodo trabajando dentro del ambiente de Nest.js, pero hacerlo en express puro fue lindo ya que hace mucho que no lo usaba

Por otro lado se agrego la implementación del websocket ya que un punto de la consigna era generar nuestro propio engine para el servidor