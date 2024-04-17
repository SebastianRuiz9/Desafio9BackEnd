import mongoose from "mongoose";
import { configObject } from "./config.js";

const {mongo_url} = configObject

//Me conecto a la BD
//console.log('VIno del env: ', configObject)
function initDataBaseConnection(){

   
  /*  mongoose.connect('mongodb+srv://gui24xrdev:2485javiersolis@cluster0.a6zgcio.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0')
    .then(console.log('Conexion con BD OK !'))
    .catch((error)=>console.log(error))
  */

    mongoose.connect(mongo_url)
    .then(console.log('Conexion con BD OK !'))
    .catch((error)=>console.log(error))

}

export {initDataBaseConnection}