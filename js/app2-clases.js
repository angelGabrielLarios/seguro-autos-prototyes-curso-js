/* recrear el ejercioc anterior pero con clases */


/* crear las variables */

/* el formulario para asignar el evento submit */
const formulario = document.getElementById('formulario')

/* selectYear para llenar las opciones del select dinamicamente */
const selectYear = document.getElementById('year')

/* seleccionar el boton para habilitarlo o deshabilitarlo */
const btnCotizarSeguro = document.getElementById
('btn-cotizar-seguro')

/* 
la variable resultado, es donde se incrusta la card de los
datos y precio total del la cotizacion del seguro
*/
const resultado = document.getElementById('resultado')


/* obtener el año actual */
const yearActual = new Date().getFullYear()

/* crear la clase Seguro*/
class Seguro {
    constructor(marca, year, tipo) {
        this.marca = marca
        this.year = year
        this.tipo = tipo
    }

    /* crear los metodos */

    calcularTotalSeguro() {
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
}

/* crear una funcion para formatear el dinero */
const formatearDinero = numero => numero.toLocaleString('en', {style: 'currency', currency: 'MXN'})


/* crear la clases para la interfaz */

class UI {


    /* crear un metodo pra llenear el select */
    llenarSelect() {

        /* obtener el año minimo */
        const yearMin = yearActual - 22

        /* hacer un bucle entre los numeros que hay de yearActual a yearMIn */
        for(let index = yearActual; index > yearMin; index-- ) {

            /* 
            crear el template string para crear el option 
            para despues agregarlo al select
            */
            const option = `
                <option value="${index}">${index}</option>
            `


            /* insertar en el select */
            selectYear.insertAdjacentHTML('beforeend', option)
        }
    }


    /* crear un metodo para mostrar la alerta de error */
    mostrarAlerta(mensaje, tipo) {
        /* 
        mensaje => el texto que va tener la alerta a mostrar
        */

        /*
        tipo => la clases que se va asignar a alerta, va cambiar su color
        */


        /* crear el template sttring para alerta */


        const alertaTemplate = `  
        <div class="alert alert-${tipo} p-2 text-center mb-0">
            ${mensaje}
        </div>
        `

        /* insertar la alerta */
        resultado.insertAdjacentHTML('beforeend', alertaTemplate)

        /* deshabilitar el boton para evitar el insertar multiples alertas */
        btnCotizarSeguro.setAttribute('disabled', true) 


        setTimeout(() => {
            /* al pasar tres segundos realizar lo siguiente */
            
            btnCotizarSeguro.removeAttribute('disabled')
            const alertaHTML = document.querySelector(`.alert-${tipo}`)
            alertaHTML.remove()
        }, 3000);


    }

    limpiarInfoSeguro() {
        /*
        si ya existe un card info-seguro se tienne que borrar
        */

        const infoSeguro = document.querySelector(`.info-seguro`)

        /* si el elemento existe en el DOM */
        if(infoSeguro) {
            /* eliminarlo */
            infoSeguro.remove()
        }
    }

    mostrarInfoSeguro(seguro, total) {

        /* limpiar el htm previo */
        this.limpiarInfoSeguro()


        /* extraer la propiedades del objeto seguro, con destructuring */
        const {marca, year, tipo} = seguro


        /*
        crear el template para mostrar el elemento html con informacion del seguro
        */
        const templateSeguro = 
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

        /* seleccioanr el loader */
        const loader = document.getElementById('loader')


        /* quitar la clase, para ser visible el spiner */
        loader.classList.remove('visually-hidden')

        setTimeout(() => {
            /* despues de 3 segundos ejecutar lo siguiente */

            /* agregar la clases, para ocultar de nuevo el loader */
            loader.classList.add(`visually-hidden`)

            /* ahora insertar el template de seguro */
            resultado.insertAdjacentHTML('beforeend', templateSeguro)
        }, 3000);


    }
}


/* instaciar la clases UI */

const ui = new UI()



/* 
la funcion app al ser ejecuta activa los eventListener que existen en mi aplicacion web
*/
app()


function app() {

    /* al cargar el documento, llenar las opciones del select year, dinamicamente */
    document.addEventListener('DOMContentLoaded', () => {
        ui.llenarSelect()
    })


    /* al dar click, en cotizar seguro, realizar las acciones pertinentes */
    formulario.addEventListener('submit', cotizarSeguro)

}


/* funciones */

function cotizarSeguro(event) {
    /* prevenir el evento */
    event.preventDefault()


    /* leer el valor de cada select y radio button */

    /* leer el valor del select marca */
    const marca = document.getElementById('marca').value


    /* leer el valor de selectyear */
    const year = document.getElementById('year').value


    /* leer el valor del radibutton seleccionado */
    /* este se realiza de manera peculiar */

    const tipo = document.querySelector('input[name="tipo"]:checked').value

    /* realizar la validacio */
    if([marca, year, tipo].includes('')) {
        ui.mostrarAlerta('Todos los campos son obligatorios', 'danger')
        return
    }

    ui.mostrarAlerta('Cotizando...', 'success')

    /* instanciar la clase Seguro, con los values del formulario */
    const seguro = new Seguro(marca, year, tipo)

    /* calcular el total a pagar  */
    const total = seguro.calcularTotalSeguro()

    /* cargar el html para mostra info del seguro */
    ui.mostrarInfoSeguro(seguro, total)




}