//Bcrypt es una librería de hashing de contraseñas. 

//1) Instalamos: npm i bcrypt
//2) Importamos el módulo

//const bcrypt = require("bcrypt");
import bcrypt from 'bcrypt'

//Se crearan dos funciones: 
//FUNCION 1) createHash: aplicar el hash al password. 

const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
//hashSync: toma el password que le pasamos y aplica el proceso de hasheo a partir de un "salt". 
//Un "salt" es un string random que hace que el proceso de h aseho se realice de forma impredecible.
//genSaltSync(10): generar un salt de 10 caracteres. 

 
//FUNCION 2) isValidPassword: comparar el password proporcionado por la base de datos. 


const isValidPassword = (password, userPassword) => bcrypt.compareSync(password, userPassword);
//Compara los password, retorna true o falsete segun corresponda. 

export {createHash,isValidPassword}