const express = require('express')
const app = express()
const port = 3000


app.get('/', (req, res) => {
  let {turno,estado}=req.query;
  let matriz = estado.split("");
  let fila = 0;
  let columna = 0;
  matriz = matriz.map((value) => {
    const tmp = new Celda(value, fila, columna);
    columna++;
    if (columna == 8) {
      columna = 0;
      fila++;
    }
    return tmp;
  }
  );
  let response=minmax(turno,matriz);
  res.send(`${response.fila}${response.columna}`);
})

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})



class Celda {
  constructor(val, fila, columna) {
      this.tipo = Number.parseInt(val);
      this.fila = fila;
      this.columna = columna;
      this.cantidad = 0;    //cantidad de fichas que se obtienen al caer en esta celda.  
  }
}

const tipoCelda = {
  negra: 0,
  blanca: 1,
  vacio: 2
}

const tipoDireccion = {
  arriba: 0,
  abajo: 1,
  izquierda: 2,
  derecha: 3,
  diag_45: 4,
  diag_135: 5,
  diag_225: 6,
  diag_315: 7
};

/**
2	2	2	2	2	2	2	2
2	2	2	2	2	2	2	2
2	2	2	2	2	2	2	2
2	2	2	0	1	2	2	2
2	2	2	1	0	2	2	2
2	2	2	2	2	2	2	2
2	2	2	2	2	2	2	2
2	2	2	2	2	2	2	2
*/

// console.log("2222222222222222222222222220122222210222222222222222222222222222");


// document.getElementsByTagName('body')[0].innerHTML=`<pre>Hola</pre>`;
/*?turno=1&estado=2222222222222222222222222222221022222201222222222222222222222222*/

/**Gana quien tenga mas piezas en el tablero */

/**
* ¿Cuando se detiene? cuando llegue al nivel 'limite'. Donde 'limite' es el nivel mas bajo que deseo analizar. 
* n es el nivel en el que va analizando
* Movimientos: Vertical, Horizontal, en Diagonal. 
*/

const minmax = (turno, matriz) => {

  const fichas_actuales = matriz.filter(celda => celda.tipo == turno); //obtengo las fichas del turno actual
  const contrincante = turno == tipoCelda.blanca ? tipoCelda.negra : tipoCelda.blanca;
  let candidatos=[];

  fichas_actuales.forEach(element => {
      // console.log("Para: ",element);
      //miramos los contrincantes que tenga en Vertical, horizontal y en diagonal. 
      //1. Verticalmente
      const arriba = matriz.find(celda => celda.columna == element.columna && celda.fila == element.fila - 1 && celda.tipo == contrincante); //si no encuentra ninguno devuelve undefined
      const abajo = matriz.find(celda => celda.columna == element.columna && celda.fila == element.fila + 1 && celda.tipo == contrincante);
      //2. Horizontalmente
      const izquierda = matriz.find(celda => celda.columna == element.columna - 1 && celda.fila == element.fila && celda.tipo == contrincante);
      const derecha = matriz.find(celda => celda.columna == element.columna + 1 && celda.fila == element.fila && celda.tipo == contrincante);
      //En diagonal
      const diag_45 = matriz.find(celda => celda.columna == element.columna + 1 && celda.fila == element.fila - 1 && celda.tipo == contrincante);
      const diag_135 = matriz.find(celda => celda.columna == element.columna - 1 && celda.fila == element.fila - 1 && celda.tipo == contrincante);
      const diag_225 = matriz.find(celda => celda.columna == element.columna - 1 && celda.fila == element.fila + 1 && celda.tipo == contrincante);
      const diag_315 = matriz.find(celda => celda.columna == element.columna + 1 && celda.fila == element.fila + 1 && celda.tipo == contrincante);

      //para los que no sean undefined, vamos a buscar en su misma linea hasta donde haya un tipo.vacio, y ese será el movimiento. 
      if (arriba != undefined) {
          //si encontró un contrincante arriba!!
          //ahora toca buscar la siguiente casilla en blanco. Si hay alguna, tomo encuenta esta ruta junto con la cantidad de fichas que agregaría. 
          arriba.cantidad = 1;
          const vacio = buscarVacio(arriba, matriz, tipoDireccion.arriba);    //con esto vamos a buscar el espacio en blanco más cercano en esa direccion. 
          // console.log(vacio);
          if(vacio!=undefined){
              candidatos=[...candidatos,vacio];
          }
      }
      if (abajo != undefined) {
          abajo.cantidad = 1;
          const vacio = buscarVacio(abajo, matriz, tipoDireccion.abajo);    //con esto vamos a buscar el espacio en blanco más cercano en esa direccion. 
          // console.log(vacio);
          if(vacio!=undefined){
              candidatos=[...candidatos,vacio];
          }
      }
      if (izquierda != undefined) {
          izquierda.cantidad = 1;
          const vacio = buscarVacio(izquierda, matriz, tipoDireccion.izquierda);    //con esto vamos a buscar el espacio en blanco más cercano en esa direccion. 
          // console.log(vacio);
          if(vacio!=undefined){
              candidatos=[...candidatos,vacio];
          }
      }
      if (derecha != undefined) {
          derecha.cantidad = 1;
          const vacio = buscarVacio(derecha, matriz, tipoDireccion.derecha);    //con esto vamos a buscar el espacio en blanco más cercano en esa direccion. 
          // console.log(vacio);
          if(vacio!=undefined){
              candidatos=[...candidatos,vacio];
          }
      }
      if (diag_45 != undefined) {
          diag_45.cantidad = 1;
          const vacio = buscarVacio(diag_45, matriz, tipoDireccion.diag_45);    //con esto vamos a buscar el espacio en blanco más cercano en esa direccion. 
          // console.log(vacio);
          if(vacio!=undefined){
              candidatos=[...candidatos,vacio];
          }
      }
      if (diag_135 != undefined) {
          diag_135.cantidad = 1;
          const vacio = buscarVacio(diag_135, matriz, tipoDireccion.diag_135);    //con esto vamos a buscar el espacio en blanco más cercano en esa direccion. 
          // console.log(vacio);
          if(vacio!=undefined){
              candidatos=[...candidatos,vacio];
          }
      }
      if (diag_225 != undefined) {
          diag_225.cantidad = 1;
          const vacio = buscarVacio(diag_225, matriz, tipoDireccion.diag_225);    //con esto vamos a buscar el espacio en blanco más cercano en esa direccion. 
          // console.log(vacio);
          if(vacio!=undefined){
              candidatos=[...candidatos,vacio];
          }
      }
      if (diag_315 != undefined) {
          diag_315.cantidad = 1;
          const vacio = buscarVacio(diag_315, matriz, tipoDireccion.diag_315);    //con esto vamos a buscar el espacio en blanco más cercano en esa direccion. 
          // console.log(vacio);
          if(vacio!=undefined){
              candidatos=[...candidatos,vacio];
          }
      }

  });

  // console.log(candidatos);

  candidatos.sort((a, b) => a.cantidad - b.cantidad);
  // console.log(candidatos[candidatos.length-1]);
  return candidatos[candidatos.length-1];
}


//funcion para obtener la celda vacía en la direccion solicitada apartir de un nodo determinado (element).
//si retorna undefined es porque no hay ninguno en esa direccion. 
const buscarVacio = (element, matriz, direccion) => {
  
  let tm = undefined;
  if (direccion == tipoDireccion.arriba) {
      tm = matriz.find(celda => celda.columna == element.columna && celda.fila == element.fila - 1);//aqui solo quiero jalar el que tenga arriba
  } else if (direccion == tipoDireccion.abajo) {
      tm = matriz.find(celda => celda.columna == element.columna && celda.fila == element.fila + 1);//aqui solo quiero jalar el que tenga arriba
  } else if (direccion == tipoDireccion.izquierda) {
      tm = matriz.find(celda => celda.columna == element.columna - 1 && celda.fila == element.fila);//aqui solo quiero jalar el que tenga arriba
  } else if (direccion == tipoDireccion.derecha) {
      tm = matriz.find(celda => celda.columna == element.columna + 1 && celda.fila == element.fila);//aqui solo quiero jalar el que tenga arriba
  } else if (direccion == tipoDireccion.diag_45) {
      tm = matriz.find(celda => celda.columna == element.columna + 1 && celda.fila == element.fila - 1);//aqui solo quiero jalar el que tenga arriba
  } else if (direccion == tipoDireccion.diag_135) {
      tm = matriz.find(celda => celda.columna == element.columna - 1 && celda.fila == element.fila - 1);//aqui solo quiero jalar el que tenga arriba
  } else if (direccion == tipoDireccion.diag_225) {
      tm = matriz.find(celda => celda.columna == element.columna - 1 && celda.fila == element.fila + 1);//aqui solo quiero jalar el que tenga arriba
  } else if (direccion == tipoDireccion.diag_315) {
      tm = matriz.find(celda => celda.columna == element.columna + 1 && celda.fila == element.fila + 1);//aqui solo quiero jalar el que tenga arriba
  }


  if (tm == undefined) {
      return undefined;

  } else if (tm.tipo == element.tipo) {
      //encontramos más del mismo tipo!!
      let tmp={...tm};
      tmp.cantidad = element.cantidad + 1;
      return buscarVacio(tmp, matriz, direccion);

  } else if (tm.tipo == tipoCelda.vacio) {
      //eureka!!
      let tmp={...tm};
      tmp.cantidad = element.cantidad;//jalamos la cantidad que lleve el ultimo elemento contrincante
      return tmp; //retornamos ese espacio!!
  } else {
      return undefined;       //en cualquier otro caso, no se cumple la regla y retornamos undefined
  }
}



/** ALGORITMO
* Busco las fichas del turno actual.
* Para cada ficha, genero los posibles movimientos según las fichas del otro turno que tenga alrededor.
*
*/


// console.log(matriz.filter(celda=>celda.tipo ==tipo.blanca));
//console.log(matriz);






/*
22222222
22122222
22121112
22111022
22100122
22122010
22222220
22222220
*/

/*2222222222122222221211122211102222100122221220102222222022222220*/