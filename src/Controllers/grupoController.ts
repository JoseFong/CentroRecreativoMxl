import {prisma} from "@/utils/prisma";

/**
 * Función para obtener todos los grupo
 * @autor Jesus
 * @returns todos los grupo en la base de datos
 */
export async function obtenerGrupos() {
    return prisma.grupo.findMany();
}

/**
 * Función para registrar un nuevo grupo
 * @autor Jesus
 * @param data del grupo a registrar
 * @returns mensaje de error o confirmación
 */
export async function registrarGrupo(data: any) {
    const nombre = data.nombre.toUpperCase();
    const docenteId = data.docenteId ? parseInt(data.docenteId) : null;

    // Validación para que no se repita el nombre del grupo
    const grupo = await prisma.grupo.findFirst({
        where: {
            nombre: nombre,
        },
    });
    if (grupo) return "Ya existe otro grupo con ese nombre";

    // Crear el nuevo grupo
    const grupoRegistrado = await prisma.grupo.create({
        data: {
            nombre: nombre,
        },
    });

    if (!grupoRegistrado) return "Hubo un error al registrar el grupo";

    const grupoId = grupoRegistrado.id;

    if (docenteId) {
        await prisma.grupo.update({
            where: {
                id: grupoId,
            },
            data: {
                docenteId: docenteId,
            },
        });
    }

    if (data.selectedAlumnosIds) {
        const alumnos = await prisma.alumno.findMany({
            where: {
                id: {
                    in: data.selectedAlumnosIds,
                },
            },
        });
        for (const alumno of alumnos) {
            await prisma.alumno.update({
                where: {
                    id: alumno.id,
                },
                data: {
                    grupoId: grupoId,
                },
            });
        }
    }

    return "registrado";
}

/**
 * Función para actualizar un grupo
 * @autor Jesus
 * @param data del grupo a actualizar
 * @returns mensaje de error o confirmación
 */
export async function actualizarGrupo(data: any) {
    const id = parseInt(data.id);
    const nombre = data.nombre.toUpperCase();
    const docenteId = data.docenteId ? parseInt(data.docenteId) : null;

    //Validación para que no se repita el nombre del grupo
    const grupo = await prisma.grupo.findFirst({
        where: {
            nombre: nombre,
        },
    });
    if (grupo && grupo.id !== id) return "Ya existe otro grupo con ese nombre";

    await prisma.grupo.update({
        where: {
            id: id,
        },
        data: {
            nombre: nombre,
        },
    });

    // Desasignar el docente
    await prisma.grupo.update({
        where: {
            id: id,
        },
        data: {
            docenteId: null,
        },
    });

    // Volvemos a asignar al docente o al nuevo docente
    if (docenteId && docenteId > 0) {
        await prisma.grupo.update({
            where: {
                id: id,
            },
            data: {
                docenteId: docenteId,
            },
        });
    }

    // Quitar a todos los alumnos
    await prisma.alumno.updateMany({
        where: {
            grupoId: id,
        },
        data: {
            grupoId: null,
        },
    });

    // Asignar a los alumnos seleccionados
    if (data.alumnosIds) {
        const alumnos = await prisma.alumno.findMany({
            where: {
                id: {
                    in: data.alumnosIds,
                },
            },
        });
        for (const alumno of alumnos) {
            await prisma.alumno.update({
                where: {
                    id: alumno.id,
                },
                data: {
                    grupoId: id,
                },
            });
        }
    }

    return "actualizado";
}

/**
 * Función para encontrar los grupos inscritos en una actividad
 * @author Fong
 * @param id id de la actividad
 * @returns los grupos que están registrados en esa actividad
 */
export async function obtenerGruposDeActividad(id: number) {
    const registros = await prisma.grupoActividad.findMany({
        where: {
            actividadId: id
        }
    })

    let ids: number[] = []
    registros.map((r: any) => ids.push(r.grupoId))

    return prisma.grupo.findMany({
        where: {
            id: {
                in: ids
            }
        }
    });
}

export async function obtenerGruposDisponibles(id: number) {
    const registros = await prisma.grupoActividad.findMany({
        where: {
            actividadId: id
        }
    })

    let ids: number[] = []
    registros.map((reg: any) => {
        ids.push(reg.grupoId)
    })

    const grupos = await prisma.grupo.findMany()
    let gruposIds: number[] = []
    grupos.map((gr: any) => {
        gruposIds.push(gr.id)
    })

    const gruposAObtenerId: number[] = gruposIds.filter(item => !ids.includes(item))

    return prisma.grupo.findMany({
        where: {
            id: {
                in: gruposAObtenerId
            }
        }
    });
}

export async function asignarActAGrupo(data: any) {
    const traslape = await verificarTraslape(data.horario, data.grupoId, -1)

    if (traslape) return "Este grupo ya tiene una actividad a esta hora."

    await prisma.grupoActividad.create({
        data: {
            horario: data.horario,
            grupoId: data.grupoId,
            actividadId: data.actividadId
        }
    })

    return "registrado"
}

export async function verificarTraslape(horario: string, grupoId: number, modificar: number) {

    const registros = await prisma.grupoActividad.findMany({
        where: {
            grupoId: grupoId
        }
    })


    let traslape = false

    registros.map((registro: any) => {
        if (registro.id !== modificar) {
            const horarioRegistrado = registro.horario
            const t = verificarTraslapeEntreDosHorarios(horario, horarioRegistrado)
            if (t) traslape = true
        }
    })

    if (traslape) return true
    return false
}

const verificarTraslapeEntreDosHorarios = (horario1: string, horario2: string) => {
    const h1 = JSON.parse(horario1)
    const h2 = JSON.parse(horario2)
    const diasSemana = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];

    for (const dia of diasSemana) {
        if (h1[dia] && h2[dia]) {
            const inicio1 = parseInt(h1[dia].inicio.replace(":", ""));
            const fin1 = parseInt(h1[dia].fin.replace(":", ""));
            const inicio2 = parseInt(h2[dia].inicio.replace(":", ""));
            const fin2 = parseInt(h2[dia].fin.replace(":", ""));

            if (inicio1 === inicio2) return true;
            if (inicio1 < inicio2) {
                if (fin1 > inicio2) return true;
            }
            if (inicio1 > inicio2) {
                if (inicio1 < fin2) return true;
            }
        }
    }
    return false
}

export const eliminarGrupo = async (id: number) => {
    // Desasignar el docente
    await prisma.grupo.update({
        where: {
            id: id,
        },
        data: {
            docenteId: null,
        },
    });

    // Quitar a todos los alumnos
    await prisma.alumno.updateMany({
        where: {
            grupoId: id,
        },
        data: {
            grupoId: null,
        },
    });

    // Eliminar salidas del grupo
    await prisma.salida.deleteMany({
        where: {
            grupoId: id,
        },
    });

    // Eliminar actividades del grupo
    await prisma.grupoActividad.deleteMany({
        where: {
            grupoId: id,
        },
    });

    // Eliminar grupo
    return prisma.grupo.delete({
        where: {
            id: id,
        },
    });
};
