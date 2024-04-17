
//Este middleware lo utilizare para enviar a handlebars siempre los datos de sesion
//Y no tener que enviarlos plantilla por plantilla

import { CartsManager} from "../controllers/carts-manager-db.js";
const cartsManager = new CartsManager()
import passport from "passport";



  //el middleware ahora tiene que tomar datos del token a travez de passport jhwt
  // Middleware para agregar datos de sesión a req.sessionData utilizando Passport
export async function addSessionData(req, res, next) {
  // Llamada a Passport para autenticar con la estrategia 'jwt'
  passport.authenticate('jwt', { session: false }, async (err, user, info) => {
      if (err) { return next(err); }
      if (!user) { return next(); }

      //Si hay user autenticado entonces genero la variable que alimenta la barra de cesion  y lo mando en cada solictud
      res.locals.sessionData  = {
        login: true,
        user: user.user,
        admin: user.role == 'admin' ? true : false, //Para saber si se trata de un admin
        productsQuantityInUserCart : await cartsManager.countProductsInCart(user.cart)
      }//console.log('sessionInfo: ', res.locals.sessionData)
        next();
  })(req, res, next)
}





