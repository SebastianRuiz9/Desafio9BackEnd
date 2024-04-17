
export const generarValorAleatorio = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

export function generarCodigo() {
    let codigo = "";
    const letras = "abcdefghijklmnopqrstuvwxyz";
    const numeros = "0123456789";
  
    // Generar 4 letras aleatorias
    for (let i = 0; i < 4; i++) {
      const letraAleatoria = letras.charAt(Math.floor(Math.random() * letras.length));
      codigo += letraAleatoria;
    }
  
    // Generar 4 números aleatorios
    for (let i = 0; i < 4; i++) {
      const numeroAleatorio = numeros.charAt(Math.floor(Math.random() * numeros.length));
      codigo += numeroAleatorio;
    }
  

    return codigo
  }
  
  function generarArrayUniqueCodigos(cantidad) {
    const codigosGenerados = new Set();
  
    while (codigosGenerados.size < cantidad) {
      const nuevoCodigo = generarCodigo();
      codigosGenerados.add(nuevoCodigo);
    }
  
    return Array.from(codigosGenerados);
  }
  
  // Generar un array con 5 códigos únicos
  const arrayDeCodigos = generarArrayUniqueCodigos(10);
  
  // Mostrar resultados en la consola
  console.log(arrayDeCodigos);
  
  
