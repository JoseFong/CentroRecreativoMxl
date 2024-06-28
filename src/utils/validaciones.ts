export function tieneLetras(str: string) {
  if (/[a-z]/.test(str)) return true;
  if (/[A-Z]/.test(str)) return true;
  return false;
}

export function tieneNumeros(str: string) {
  if (/\d/.test(str)) return true;
  return false;
}

export function textoVacio(str: string) {
  if (str.trim().length === 0) return true;
  return false;
}

export function contrasenaInvalida(str: string) {
  if (str.length < 8) return true;
  if (!/[a-z]/.test(str)) return true;
  if (!/[A-Z]/.test(str)) return true;
  if (!/\d/.test(str)) return true;
  return false;
}

export function correoInvalido(str: string) {
  if (!str.includes(".")) return true;
  if (!str.includes("@")) return true;
}

export function tieneCaracteresEspeciales(str: string) {
  const regex = /[^a-zA-Z0-9\s]/;
  return regex.test(str);
}

export function fechaFutura(str: string) {
  const partes = str.split("-");
  const date = new Date(
    parseInt(partes[0]),
    parseInt(partes[1]) - 1,
    parseInt(partes[2])
  );
  const dateHoy = new Date();
  if (date > dateHoy) return true;
  return false;
}

export function telefonoInvalido(str: string) {
  if (str.length !== 10) return true;
  if (/[a-z]/.test(str)) return true;
  if (/[A-Z]/.test(str)) return true;
  if (tieneCaracteresEspeciales(str)) return true;
  return false;
}
