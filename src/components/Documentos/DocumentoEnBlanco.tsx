import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
  Input,
} from "@nextui-org/react";
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
import toast from "react-hot-toast";

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
});
const logo = "https://i.imgur.com/6hTa0ZR.png";

const MyDocument = () => (
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
    </Page>
  </Document>
);

function DocumentoEnBlanco({ isOpen, onOpenChange }: any) {
  const handlePrint = async () => {
    const blob = await pdf(<MyDocument />).toBlob();
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  const handleOnClose = () => {
    onOpenChange(false);
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
                <MyDocument />
              </PDFViewer>{" "}
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

export default DocumentoEnBlanco;
