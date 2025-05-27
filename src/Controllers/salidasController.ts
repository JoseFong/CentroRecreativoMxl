import {prisma} from "@/utils/prisma";
import { Salida } from "@prisma/client";


/**
 * Función para obtener todas las salidas
 *  @autor Jesus
 *  @returns array de todas las salidas
 */
export async function obtenerSalidas() {
    await eliminarSalidasDelMesPasado() //agregado por Fong, solo elimina las salidas del mes pasado

    return prisma.salida.findMany();
}

/**
 * Función para registrar una salida
 * @autor Jesus
 * @param data información de la salida
 * @returns mensaje de error o éxito
 */
export async function registrarSalida(data:any) {
    const grupoId:number = parseInt(data.grupoId)
    const docenteId:number = parseInt(data.docenteId)
    const fecha = data.fecha
    const hora = data.hora
    const nombre = data.nombre

    //Validaciones
    const partes = fecha.split("-")
    const fechaSalida = new Date(parseInt(partes[0]),(parseInt(partes[1])-1),parseInt(partes[2]))
    const fechaHoy = new Date()

    if(fechaHoy>fechaSalida) return "La fecha no puede ser anterior a la actual"

    await prisma.salida.create({
        data: {
            grupoId: grupoId,
            docenteId: docenteId,
            fecha: fecha,
            horaDeSalida: hora,
            nombre: nombre
        }
    });

    return "registrado";
}

/**
 * Función para modificar una salida
 * @autor Jesus
 * @param data información de la salida
 * @param id id de la salida
 * @returns mensaje de error o éxito
 */
export async function modificarSalida(data:any, id:number) {
    const grupoId:number = parseInt(data.grupoId)
    const docenteId:number = parseInt(data.docenteId)
    const fecha = data.fecha
    const hora = data.hora
    const nombre = data.nombre

    //Validaciones
    if(Date.now() > Date.parse(fecha)) return "La fecha no puede ser anterior a la actual"

    await prisma.salida.update({
        where: {
            id: id
        },
        data: {
            grupoId: grupoId,
            docenteId: docenteId,
            fecha: fecha,
            horaDeSalida: hora,
            nombre: nombre
        }
    })

    return "modificado";
}

/**
 * Función para eliminar una salida
 * @autor Jesus
 * @param id id de la salida
 * @returns mensaje de error o éxito
 */
export async function eliminarSalida(id:number) {
    await prisma.salida.delete({
        where: {
            id: id
        }
    })

    return "eliminado"
}

/**
 * Función para eliminar las salidas que sean de meses o años pasados al mes y año actuales
 * @author Fong
 */
export async function eliminarSalidasDelMesPasado(){
    const salidas = await prisma.salida.findMany()

    let ids:number[] = []
    const fechaDeHoy = new Date();

    salidas.forEach((s:Salida)=>{
        const [year,month,day] = s.fecha.split("-").map(Number)
        const fechaDeSalida = new Date(Date.UTC(year,month-1,day))

        if(fechaDeSalida.getFullYear()<fechaDeHoy.getFullYear()){
            ids.push(s.id)
        }else{
            if(fechaDeSalida.getFullYear()===fechaDeHoy.getFullYear()){
                if(fechaDeSalida.getMonth()<fechaDeHoy.getMonth()){
                    ids.push(s.id)
                }
            }
        }
    })

    if(ids.length>0){
        await prisma.salida.deleteMany({
                where:{
                    id: {
                        in: ids
                    }
                }
            })
    }
}