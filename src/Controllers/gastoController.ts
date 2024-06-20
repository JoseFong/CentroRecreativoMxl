import {prisma} from "@/utils/prisma"

/**
 * Función para eliminar los gastos de otro mes que no sea el actual
 * @author Fong
 */
export async function eliminarGastosDeOtroMes() {
    const fechaActual = new Date() //Se obtiene la fecha actual
    const mesActual = fechaActual.getMonth()+1 //Se extrae el mes de la fecha actual en int
    const anoActual = fechaActual.getFullYear() //Se extrae el año de la fecha actual en int

    
    const gastos = await prisma.gasto.findMany() //Se obtienen todos los gastos
    gastos.map(async (gasto:any)=>{ //Se itera por cada gasto
        const fecha = gasto.fecha //Se obtiene la fecha de cada gasto

        //Se parte la fecha y se obtiene el mes y el año del gasto en int
        const partes = fecha.split("/")
        const mes = parseInt(partes[1])
        const ano = parseInt(partes[2])

        //Si el año no es el mismo al actual o el mes no es el mismo al actual se elimina el gasto
        if(ano!==anoActual || mes!==mesActual){
            await prisma.gasto.delete({
                where: {
                    id: gasto.id
                }
            })
        }
    })

    return "exito" //se regresa mensaje de éxito.
}