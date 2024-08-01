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

export function ceroNegativo(str:string){
  try{
    const n : number = parseFloat(str)
    if(n<=0) return true
    return false
  }catch(e:any){
    return true
  } 
}

export function pagoDeOtroAno(str:string){
  const partes  = str.split("-")
  const fechaAct = new Date()
  const anoActual = fechaAct.getFullYear()
  const ano = parseInt(partes[0])
  if(ano!==anoActual) return true
  return false
}

export function validarHoras(a:any,b:any){
  const hi:string = a.toString()
  const hf:string = b.toString()
  const i = hi.split(":")
  const f = hf.split(":")
  if(f[0]<i[0]) return true
  if(i[0]===f[0]){
    if(i[1]>f[1]) return true
    if(i[1]===f[1]) return true
  }
  return false
}

export function primerLetra(str:string){
  return str.charAt(0).toUpperCase()+str.slice(1)
}