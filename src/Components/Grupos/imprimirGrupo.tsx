import React from "react";
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
  tableCol: {
    width: "33.33%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: "auto",
    marginTop: 5,
    fontSize: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerImage: {
    width: 80,
    height: 60,
  },
});

// Componente PDF
const MyDocument = ({ grupo, alumnos }: any) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Image src={logo} style={styles.headerImage} />
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>Lista de alumnos</Text>
        <Text style={styles.subtitle}>Grupo: {grupo.nombre}</Text>
      </View>
      <View style={styles.table}>
        <View
          style={[
            styles.tableRow,
            { backgroundColor: "#467351", color: "white" },
          ]}
        >
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Nombre(s)</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Apellido Paterno</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Apellido Materno</Text>
          </View>
        </View>
        {alumnos.map((alumno: any, index: any) => (
          <View style={styles.tableRow} key={index}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                {alumno.nombre.toUpperCase()}
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                {alumno.aPaterno.toUpperCase()}
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                {alumno.aMaterno
                  ? alumno.aMaterno.toUpperCase()
                  : "No registrado"}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

function ImprimirGrupo({ grupo, alumnos, isOpen, onOpenChange }: any) {
  const handlePrint = async () => {
    const blob = await pdf(
      <MyDocument grupo={grupo} alumnos={alumnos} />
    ).toBlob();
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="4xl"
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
                  <MyDocument grupo={grupo} alumnos={alumnos} />
                </PDFViewer>
              </ModalBody>
              <ModalFooter>
                <Button className="bg-verde" variant="light" onPress={onClose}>
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

export default ImprimirGrupo;
