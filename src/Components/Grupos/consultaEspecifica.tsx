import {Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader,} from "@nextui-org/react";
import React from "react";

//ESTE ES EL COMPONENTE PRINCIPAL DE ESTE ARCHIVO
function ConsultaEspecificaGrupo({isOpen, onOpenChange, grupo, docente, alumnos}: {
    isOpen: any,
    onOpenChange: any,
    grupo: any,
    docente?: any
    alumnos?: any
}) {
    //CONTENIDO: La información del grupo
    return (
        <>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>
                                Detalles del grupo {grupo.nombre}
                            </ModalHeader>
                            <ModalBody>
                                <table className="min-w-full divide-y divide-gray-200">
                                    <tbody>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap font-bold">
                                            Nombre:
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {grupo.nombre}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap font-bold">
                                            Docente:
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {docente ? docente.nombre : "Sin docente asignado"}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap font-bold">
                                            Alumnos:
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {alumnos ? (
                                                // @ts-ignore
                                                alumnos.map((alumno) => (
                                                    <p key={alumno.id}>
                                                        {alumno.nombre} {alumno.aPaterno} {alumno.aMaterno}
                                                    </p>
                                                ))
                                            ) : (
                                                    <p>Sin alumnos asignados</p>
                                                )
                                            }
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    onPress={onClose}
                                    className=" bg-verdeFuerte text-[#ffffff]"
                                >
                                    Cerrar
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}

export default ConsultaEspecificaGrupo;