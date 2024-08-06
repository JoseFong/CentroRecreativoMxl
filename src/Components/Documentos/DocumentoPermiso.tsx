import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Textarea,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { pdf, PDFViewer } from "@react-pdf/renderer";
import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 90,
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
    paddingTop: 20,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  headerText2: {
    paddingTop: 4,

    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  cuerpo: {
    flex: 1,
    padding: 20,
  },
  textoCuerpo: {
    fontSize: 15,
    lineHeight: 2,
  },
  pie: { marginTop: "auto" },
  firma: { marginTop: "auto" },
});
const logo = "https://i.imgur.com/6hTa0ZR.png";
const hoy = new Date();
const ano = hoy.getFullYear();
const mes = hoy.getMonth();
const dia = hoy.getDate();
const meses = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const MyDocument = ({ descripcion, encargado, numero }: any) => (
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
      <View style={{ marginLeft: "auto" }}>
        <Text style={{ fontSize: "12" }}>
          Mexicali, B.C. a {dia} de {meses[mes]} del {ano}
        </Text>
      </View>
      <View style={styles.cuerpo}>
        <View style={styles.textoCuerpo}>
          <Text>{descripcion}</Text>
        </View>

        <View style={styles.pie}>
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Text>________________________________________</Text>
            <Text style={{ paddingTop: 10 }}>Firma de enterado</Text>
          </View>
          <Text style={{ fontSize: 18, paddingBottom: 10, paddingTop: 20 }}>
            A T E N T A M E N T E
          </Text>
          <Text style={{ fontSize: 15, paddingBottom: 8 }}>{encargado}</Text>
          <Text style={{ fontSize: 15, paddingBottom: 8 }}>
            Encargado/a del centro Recreativo
          </Text>
          <Text style={{ fontSize: 15, paddingBottom: 8 }}>{numero}</Text>
        </View>
      </View>
    </Page>
  </Document>
);

function DocumentoPermiso({ isOpen, onOpenChange }: any) {
  const [descripcion, setDescripcion] = useState("");
  const [encargado, setEncargado] = useState("");
  const [numero, setNumero] = useState("");

  const handlePrint = async () => {
    if (!encargado || !numero || !descripcion) {
      toast.error("No deje campos vacios");
      return;
    } else {
      const blob = await pdf(
        <MyDocument
          descripcion={descripcion}
          encargado={encargado}
          numero={numero}
        />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      setDescripcion("");
      setEncargado("");
      setNumero("");
    }
  };

  const handleOnClose = () => {
    setDescripcion("");
    setEncargado("");
    setNumero("");
    onOpenChange(false);
  };

  const handleNumeroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const regex = /^[0-9-]*$/;
    if (regex.test(value)) {
      setNumero(value);
    }
  };

  return (
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
              Documento vacio (Logo y firma)
            </ModalHeader>
            <ModalBody>
              <PDFViewer width="100%" height="500px">
                <MyDocument
                  descripcion={descripcion}
                  encargado={encargado}
                  numero={numero}
                />
              </PDFViewer>{" "}
              <div className="flex flex-row gap-2">
                <Input
                  isRequired
                  label="Encargado"
                  placeholder="Encargado"
                  className="pr-2"
                  value={encargado}
                  onChange={(e) => setEncargado(e.target.value)}
                ></Input>
                <Input
                  isRequired
                  label="Numero"
                  placeholder="Número telefónico"
                  value={numero}
                  onChange={handleNumeroChange}
                ></Input>
              </div>
              <Textarea
                isRequired
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                label="Descripción"
                placeholder="Ingrese la descripción del documento"
              ></Textarea>
            </ModalBody>
            <ModalFooter>
              <Button
                className="bg-verde"
                variant="light"
                onPress={() => {
                  handleOnClose();
                  onClose();
                }}
              >
                Cerrar
              </Button>
              <Button
                className="bg-verdeFuerte text-[#ffffff]"
                onPress={() => {
                  handlePrint();
                }}
              >
                Imprimir
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default DocumentoPermiso;
