import {prisma} from "@/utils/prisma"
import bcrypt from "bcryptjs"

export async function obtenerTodosDocentes(){
    return await prisma.docente.findMany()
}

export async function registrarDocente(data:any){

    const docenteTemp = await prisma.docente.findFirst({
        where: {
            usuario: data.usuario
        }
    })
    if(!docenteTemp){
        const hashed = await bcrypt.hash(data.contrasena,10)
        return await prisma.docente.create({
            data: {
                nombre:data.nombre,
                aPaterno:data.aPaterno,
                aMaterno:data.aMaterno,
                telefono:data.telefono,
                fechaNac:data.fechaNac,
                curp:data.curp,
                correo:data.correo,
                usuario:data.usuario,
                contrasena:hashed,
                rol: data.rol
            }
        })
    }else{
        return "usuario_repetido"
    }
}

export async function eliminarDocente(id:number){
    return await prisma.docente.delete({
        where:{
            id: id
        }
    })
}