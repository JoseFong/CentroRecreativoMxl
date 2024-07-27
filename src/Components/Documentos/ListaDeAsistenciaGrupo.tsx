import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  Image,
} from "@react-pdf/renderer";
import { Select, SelectItem } from "@nextui-org/select";

import { pdf } from "@react-pdf/renderer";

const logo = "https://i.imgur.com/6hTa0ZR.png";

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 10,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
  },
  table: {
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableColName: {
    width: "30%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableColDay: {
    width: "2.258%", // (100% - 30%) / 31
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: "auto",
    marginTop: 5,
    marginBottom: 5,
    fontSize: 9,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    marginTop: 10,
  },
  headerImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 80,
    height: 60,
  },
  headerTextContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  headerText2: {
    fontSize: 8,
    fontWeight: "bold",
    textAlign: "center",
  },
});

// Componente PDF
const MyDocument = ({ docente, grupos, grupo, alumnos }: any) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Image src={logo} style={styles.headerImage} />
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>Centros de Atención Múltiple</Text>
          <Text style={styles.headerText2}>
            Ana García #3899, Residencias, 21280 Imperiales, B.C.
          </Text>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>Lista de asistencia</Text>
        <Text style={styles.subtitle}>
          {grupo
            ? `Grupo: ${grupos.find((g: any) => g.id == grupo)?.nombre}`
            : "Todos los grupos"}
        </Text>
        <Text style={styles.subtitle}>
          {docente ? docente.nombre : "Docente no asignado"}
        </Text>
      </View>
      <View style={styles.table}>
        <View
          style={[
            styles.tableRow,
            { backgroundColor: "#467351", color: "white" },
          ]}
        >
          <View style={styles.tableColName}>
            <Text style={styles.tableCell}>Nombre completo</Text>
          </View>
          {[...Array(31)].map((_, index) => (
            <View style={styles.tableColDay} key={index}>
              <Text style={styles.tableCell}>{index + 1}</Text>
            </View>
          ))}
        </View>
        {alumnos.map((alumno: any, index: any) => (
          <View style={styles.tableRow} key={index}>
            <View style={styles.tableColName}>
              <Text style={styles.tableCell}>
                {`${alumno.nombre.toUpperCase()} ${alumno.aPaterno.toUpperCase()} ${
                  alumno.aMaterno ? alumno.aMaterno.toUpperCase() : ""
                }`.trim()}
              </Text>
            </View>
            {[...Array(31)].map((_, dayIndex) => (
              <View style={styles.tableColDay} key={dayIndex}>
                <Text style={styles.tableCell}></Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

function ListaDeAsistenciaGrupo({
  docentes,
  grupos,
  alumnos,
  isOpen,
  onOpenChange,
}: any) {
  const [grupoId, setGrupoId] = useState<string>("");

  const handlePrint = async () => {
    const blob = await pdf(
      <MyDocument
        docente={docentePorGrupo()}
        grupos={grupos}
        grupo={grupoId}
        alumnos={alumnosPorGrupo()}
      />
    ).toBlob();
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGrupoId(e.target.value);
  };

  const docentePorGrupo = () => {
    const grupo = grupos.find((g: any) => g.id == grupoId);
    if (grupo) {
      return docentes.find((d: any) => d.id == grupo.docenteId) || null;
    }
    return null;
  };

  const alumnosPorGrupo = () => {
    if (!grupoId) return alumnos;
    return alumnos.filter((alumno: any) => alumno.grupoId == grupoId);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="xl"
        placement="center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Grupo a imprimir
              </ModalHeader>
              <ModalBody className="overflow-auto">
                <PDFViewer width="100%" height="500px">
                  <MyDocument
                    docente={docentePorGrupo()}
                    grupos={grupos}
                    grupo={grupoId}
                    alumnos={alumnosPorGrupo()}
                  />
                </PDFViewer>
                <Select
                  label="Selecciona el grupo"
                  className="w-full"
                  onChange={handleSelectionChange}
                >
                  {grupos.map((grupo: any) => (
                    <SelectItem key={grupo.id} value={grupo.id}>
                      {grupo.nombre}
                    </SelectItem>
                  ))}
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button
                  className="bg-verde"
                  variant="light"
                  onPress={() => {
                    onClose();
                    setGrupoId("");
                  }}
                >
                  Cerrar
                </Button>
                <Button
                  className="bg-verdeFuerte text-[#ffffff]"
                  onPress={handlePrint}
                >
                  Imprimir
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default ListaDeAsistenciaGrupo;
