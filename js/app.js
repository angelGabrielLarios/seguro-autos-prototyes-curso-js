/* crear la variables */

const formulario = document.getElementById('formulario')
const selectYear = document.getElementById('year')
const btnCotizarSeguro = document.getElementById('btn-cotizar-seguro')
const yearActual = new Date().getFullYear()
/* 
la variable resultado, es donde se incrusta la card de los
datos y precio total del la cotizacion del seguro
*/
const resultado = document.getElementById('resultado')

/* crear el constructor para el seguro */
function Seguro(marca, year, tipo) {
    this.marca = marca
    this.year = year
    this.tipo = tipo
}

/* metodo para calcular la cantidad a pagar del seguro */
Seguro.prototype.calcularPrecioSeguro = function() {
    /*
    1 = americano 1.15
    2 = asiatico 1.05
    3 = europeo 1.35
    */

    // Cada año de diferencia hay que reducir 3% el valor del seguro    

    /*
    Si el seguro es básico se múltiplica por 30% mas
    Si el seguro es completo 50% mas
    */

    let cantidad
    const base = 2000

    const operacionesMarca = {
        Americano: base * 1.15,
        Asiatico: base * 1.05,
        Europeo: base * 1.35
    }

    /* asignar la operacion dependiendo de la marca que se escogio */
    cantidad = operacionesMarca[this.marca]


    /* caluclar la cantidad de años que selecciono el usuario con la actual */
    const diferencia = yearActual - this.year

    // Cada año de diferencia hay que reducir 3% el valor del seguro
    /* calcular la cantidad a descontar */
    const descuentoYears = (diferencia * 0.03) * cantidad

    /* aplocarle el descuento */
    cantidad -= descuentoYears

    
    
    /*
    Si el seguro es básico se múltiplica por 30% mas
    Si el seguro es completo 50% mas
    */
    const operacionesTipo = {
        basico: 1.30, 
        completo: 1.50
    }
    cantidad *= operacionesTipo[this.tipo]

    return cantidad
}

/* crear una funcion para formatear el dnero */
const formatearDinero = numero => {
    const formateado = numero.toLocaleString("en", {
        style: "currency",
        currency: "MXN"
    });

    return formateado
}



/* 
crear el contructor de UI, que tiene todos los metodos como:
mostrarMensajes en el html, esta funcion constructora no se definen parametros
*/

function UI(){}

/* agregar metodos a UI */

/* metodo para llenar el select de year */
UI.prototype.llenarSelectYear = function() {
    
    const yearMin = yearActual - 22

    for(let i = yearActual; i > yearMin; i--) {
        const optionStr = 
        `
            <option value="${i}">${i}</option>
        `
        selectYear.insertAdjacentHTML('beforeend', optionStr)
    }
}

/* metodo para insertar alertas */
UI.prototype.mostrarAlerta = function(mensaje, tipo) {
    

    /* 
    condicion para validar si ya existe una alerta, si es que existe,
    detiene la ejecucion del codigo posterior

    esta condicion la realizo para evitar que se vuelva a mostrar varias alertas a la vez
    */
    /* if(document.querySelector(`.alert-${tipo}`)) {
        return
    } */


    /* crear el template html para alerta, y se pasa los parametros tipo y mensaje */

    /* 
    tipo => es la clases que se le va asignar a la alerta
    mensaje => es el texto de la alerta
    */
    const alertaStr = 
    `
    <div class="alert alert-${tipo} p-2 text-center mb-0">
        ${mensaje}
    </div>
    `
    resultado.insertAdjacentHTML('beforeend', alertaStr)
    btnCotizarSeguro.disabled = true
    setTimeout(() => {
        btnCotizarSeguro.disabled = false
        const alertaHTML = document.querySelector(`.alert-${tipo}`)
        alertaHTML.remove()
    }, 3000);

}


/* limpiar el div de resultado */
UI.prototype.limpiarInfoSeguro = function() {
    
    /*
    si ya existe una card de info-seguro la borra
    */
    const infoSeguro = document.querySelector('.info-seguro')
    if(infoSeguro) {
        infoSeguro.remove()
    }

}



/* mostrar la informacion del seguro */
UI.prototype.mostrarInfoSeguro= function(seguro, total) {

    /* ejecutar el metodo para limpiar la info card previa */
    this.limpiarInfoSeguro()
    
    /* aplicar el destructuring al objeto seguro */
    const {marca, year, tipo} = seguro



    /* crear el template html, para mostrar el resultado de la cotizacion del seguro */
    const seguroInfoStr = 
    `
    <div class="border border-info rounded-3 text-center mb-3 info-seguro">
        <p class="bg-info text-white text-uppercase fw-bold text-center py-2 mb-0">
            Tu resumen:
        </p>
        <div class="py-2">
            <p>
                <b>Marca:</b> ${marca}
            </p>
            <p>
                <b>Año:</b> ${year}
            </p>
            <p>
                <b>Tipo:</b> ${tipo}
            </p>
            <p>
                <b>Precio:</b> ${formatearDinero(total)}
            </p>
        </div>
    </div>
    `

    /* seleccionar el loader */
    const loader = document.getElementById('loader')

    /* quitar la clase, para que el spinner sea visible */
    loader.classList.remove('visually-hidden')
    

    setTimeout(() => {
        /* despues de 3 segundos */

        /* ocultar otra vez el spinner */
        loader.classList.add(`visually-hidden`)

        /* insertar la card de info resultado */
        resultado.insertAdjacentHTML('beforeend', seguroInfoStr)
    }, 3000);
}

/* instanciar un objeto de la funcion contructora UI */
const ui = new UI()








cargarEventListener()

/* funcion para cargar los events listener de nustros elementos */
function cargarEventListener() {

    /* ejecutar la funcion llenar select */
    document.addEventListener('DOMContentLoaded', () => {
        ui.llenarSelectYear()
    })

    /* cotizar el seguro */
    formulario.addEventListener('submit', cotizarSeguro)
}


function cotizarSeguro(event) {

    event.preventDefault()
    /* leer el valor de cada input(select y radiobutton) */

    /* leer el valor de select marca */
    const marca = document.getElementById('marca').value

    /* leer el valor de select  */
    const year = parseInt(selectYear.value)

    /* leer el valor de tipo, como es un input de tipo radio, es peculiar como seleccionar su valor */
    const tipo = document.querySelector('input[name="tipo"]:checked').value
    /* si los campos no han sido contestados */
    if(!marca || !year || !tipo) {
        
        /* ejecutar el siguiente metido */
        ui.mostrarAlerta('Todos los campos son obligatorios', 'danger')
        return
    }

    /* si no se cumple el if, entonces que se realize lo siguiente lo siguiente */
    ui.mostrarAlerta('Cotizando...', 'success')


    /* instanciar el objeto seguro, con los valores leido en el formulario */
    const seguro = new Seguro(marca, year, tipo)
    
    const total = seguro.calcularPrecioSeguro()
    /* cargar el html para mostrar info del seguro */
    ui.mostrarInfoSeguro(seguro, total)


}