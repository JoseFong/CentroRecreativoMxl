import {prisma} from "@/utils/prisma"

/**
 * Función para regresar alumnos
 * @author Fong
 * @returns todos los alumnos en la base de datos
 */
export async function obtenerAlumnos(){
    return await prisma.alumno.findMany()
}

/**
 * Función que registra a un nuevo alumno
 * @author Fong
 * @param data datos del alumno a registrar
 * @returns mensaje de error o confirmación
 */
export async function registrarAlumno(data:any){
    //Se busca si un alumno ya existe con esa CURP
    const alumno = await prisma.alumno.findFirst({
        where: {
            curp: data.curp
        }
    })
    //Si existe uno se avisa
    if(alumno) return "Ya existe un alumno con esa CURP"

    //Se formatea la fecha al formato correcto
    const partes = data.fechaNac.split("-")
    const fecha = partes[2]+"/"+partes[1]+"/"+partes[0]

    //Se crea el alumno
    await prisma.alumno.create({
        data: {
            nombre: data.nombre,
            aPaterno: data.aPaterno,
            aMaterno: data.aMaterno,
            genero: data.genero,
            fechaNac: fecha,
            telefono: data.telefono,
            telefonoAlumno: data.telefonoAl,
            direccion: data.direccion,
            curp: data.curp
        }
    })

    //Se obtiene el alumno ya registrado por medio del curp
    const alumnoARegistrar = await prisma.alumno.findFirst({
        where: {
            curp: data.curp
        }
    })

    //Si no está registrado es que algo salió mal
    if(!alumnoARegistrar) return "Hubo un error al registrar el alumno."

    //Se dividen las ids de las neurodivergencias que se le van a "asignar" al alumno con split
    const ids = data.nee.split(",")
    
    /*Por cada neurodivergencia obtenida del split se crea el registro
    alumnoNEE usando la id de la neurodivergencia y la id del alumno*/
    ids.map(async (id:string)=>{
        await prisma.alumnoNEE.create({
            data: {
                alumnoId: alumnoARegistrar?.id,
                neurodivergenciaId: parseInt(id)
            }
        })
    })

    return "registrado" //Si llega hasta aqui es que todo está bien
}

/**
 * Función para eliminar un alumno
 * @author Fong
 * @param id id del alumno 
 * @returns el alumno eliminado
 */
export async function eliminarAlumno(id:number){
    //Primero se eliminan los registros alumnoNEE para que no haya error de llave foranea
    await prisma.alumnoNEE.deleteMany({
        where: {
            alumnoId: id
        }
    })

    //Se elimina el alumno
    return await prisma.alumno.delete({
        where: {
            id:id
        }
    })
}