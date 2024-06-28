import {prisma} from "@/utils/prisma"

/**
 * Función para obtener todos los pagos
 * @author Fong
 * @returns todos los pagos
 */
export async function obtenerPagos() {
    return await prisma.pago.findMany()
}

/**
 * Función para obtener los pagos de cierto alumno
 * @author Fong
 * @param id id del alumno
 * @returns Pagos de cierto alumno
 */
export async function obtenerPagosDeAlumno(id:number){
    return await prisma.pago.findMany({
        where: {
            alumnoId: id
        }
    })
}

/**
 * Función para registrar un pago
 * @author Fong
 * @param data información del pago
 * @returns mensaje de error o éxito
 */
export async function registrarPago(data:any){
    const tipo = data.categoria //Se extrae la categoría del pago
    const alId:number = parseInt(data.alumnoId) //Se extrae la id del alumno que hará el pago

    const pagosDeAlumno = await obtenerPagosDeAlumno(alId) //Se obtienen todos los pagos que ya ha hecho el alumno

    //Si el pago es mensualidad se verifica que el alumno no haya hecho ya sus 12 mensualidades.
    if(tipo==="Mensualidad"){
        const pagos = pagosDeAlumno.filter((pag:any)=>pag.categoria==="Mensualidad") //Se filtran los pagos del alumno
        if(pagos.length===12){
            return "El alumno ya pagó sus 12 mensualidades."
        }
    }

    //Si el pago es inscripción se verifica que el alumno no haya pagado ya su inscripcion
    if(tipo==="Inscripcion"){
        const pago = pagosDeAlumno.find((pag:any)=>pag.categoria==="Inscripcion")
        if(pago) return "El alumno ya pagó su inscripcion."
    }

    //Si el pago es de materiales se verifica que el alumno no haya pagado ya sus 2 pagos de mensualidades
    if(tipo==="Materiales"){
        const pagos = pagosDeAlumno.filter((pag:any)=>pag.categoria==="Materiales")
        if(pagos.length===2) return "El alumno ya realizó sus 2 pagos de materiales."
    }

    //Validación para que no se repita el folio
    const pago = await prisma.pago.findFirst({
        where: {
            folio:data.folio
        }
    })
    if(pago) return "Ya existe otro pago con este folio."

    //Se registra el pago
    const pagoRegistrado = await prisma.pago.create({
        data: {
            cantidad: data.monto,
            folio: data.folio,
            fecha: data.fecha,
            categoria: data.categoria,
            descripcion: data.descripcion,
            alumnoId: data.alumnoId
        }
    })

    if(!pagoRegistrado) return "Error al registrar el pago."

    return "registrado"
}

/**
 * Función para eliminar los pagos que no sean de este año
 * @author Fong
 */
export async function eliminarPagosDeOtrosAnos(){

    const dateHoy = new Date() //Se obtiene la fecha de hoy
    const anoHoy = dateHoy.getFullYear() //Se obtiene el año de la fecha de hoy

    const pagos = await obtenerPagos() //Se obtienen todos los pagos
    let ids:number[] = [] //Se crea un arreglo de numeros para guardar la id de los pagos a eliminar
    
    //se itera por todos los pagos
    pagos.forEach((pag:any)=>{
        const fecha = pag.fecha //Se obtiene la fecha del pago

        const partes = fecha.split("/") //Se parte la fecha por partes

        //Si el año es distinto al año actual se agrega su id al arreglo de ids a eliminar.
        if(parseInt(partes[2])!==anoHoy){
            ids.push(pag.id)
        }
    })

    //Usando el arreglo de ids se eliminan todos los pagos que coincidan.
    if(ids.length>0){
        await prisma.pago.deleteMany({
            where: {
                id: {
                    in: ids
                }
            }
        })
    }
}

/**
 * Función para eliminar un pago
 * @author Fong
 * @param id id del pago a eliminar
 * @returns el pago eliminado
 */
export async function eliminarPago(id:number){
    return await prisma.pago.delete({
        where: {
            id: id
        }
    })
}