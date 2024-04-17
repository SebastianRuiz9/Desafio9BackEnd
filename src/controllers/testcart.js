import { cartsManager } from "./carts-manager.js";
import { getRandomValue } from "../myfunctions.js";

const generarValorAleatorio = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const myCartsManager = new cartsManager('./miscarros.json')



async function testFunction(){

    //Creo un nuevo carro. Y luego le agrego un producto de id entre 1 y 10  y cantidad 1 y 10.
    const cartNumber = await myCartsManager.createCart()
    console.log('Se creo el carro bajo el ID: ', cartNumber)

    const productId = getRandomValue(1,10)
    const quantity = getRandomValue(1,10)
    //Y esta linea para que no meta en un carro no existente.
    const cartsQuantity = myCartsManager.getCarsQuantity()
    const cartIdWhereToAdd = generarValorAleatorio(1,cartsQuantity)

    console.log(`Se agregaran ${quantity} productos de id ${productId} en el carro de id ${cartIdWhereToAdd}`)

    await myCartsManager.addProductInCart(cartIdWhereToAdd,productId,quantity)
}

testFunction()

