import crypto from "crypto";
const algorithm = "aes-256-cbc"; // Algoritmo de criptografia
const key = crypto.randomBytes(32); // Chave de criptografia de 256 bits
const iv = crypto.randomBytes(16);

function isValidCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, "");
  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = 11 - (soma % 11);
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = 11 - (soma % 11);
  if (resto === 10 || resto === 11) resto = 0;
  return resto === parseInt(cpf.charAt(10));
}

export function encrypt(jsonData) {
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(JSON.stringify(jsonData), "utf8", "hex");
  encrypted += cipher.final("hex");
  return { iv: iv.toString("hex"), encryptedData: encrypted };
}

// Função para descriptografar dados
export function decrypt(encryptedData) {
  const ivBuffer = Buffer.from(encryptedData.iv, "hex");
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(key),
    ivBuffer
  );
  let decrypted = decipher.update(encryptedData.encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return JSON.parse(decrypted);
}
export function removeSliceQuantify(param) {
  if (param.length > 10) param.slice(0, 5);
}

export default isValidCPF;
