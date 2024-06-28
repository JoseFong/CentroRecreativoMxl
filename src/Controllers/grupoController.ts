import {prisma} from "@/utils/prisma"

/**
 * Función para obtener todos los grupo
 * @autor Jesus
 * @returns todos los grupo en la base de datos
 */
export async function obtenerGrupos(){
    return prisma.grupo.findMany();
}

/**
 * Función para registrar un nuevo grupo
 * @autor Jesus
 * @param data del grupo a registrar
 * @returns mensaje de error o confirmación
 */
export async function registrarGrupo(data:any){
    const nombre = data.nombre
    const docenteId = data.docenteId ? parseInt(data.docenteId) : null;

    //Validación para que no se repita el nombre del grupo
    const grupo = await prisma.grupo.findFirst({
        where: {
            nombre: nombre
        }
    })
    if(grupo) return "Ya existe otro grupo con ese nombre"

    await prisma.grupo.create({
        data:{
            nombre:nombre
        }
    })

    const grupoRegistrado = await prisma.grupo.findFirst({
        where:{
            nombre: nombre
        }
    })

    if(!grupoRegistrado) return "Hubo un error al registrar el grupo"

    if(docenteId){
        await prisma.grupo.update({
            where:{
                id: grupoRegistrado.id
            },
            data:{
                docenteId: docenteId
            }
        })
    }
    return "registrado"
}
