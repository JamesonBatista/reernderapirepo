import admin from "firebase-admin";
import { readFile } from "fs/promises";

const serviceAccount = JSON.parse(
  await readFile(new URL("./restapi.json", import.meta.url))
);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://restapiswagger-default-rtdb.firebaseio.com",
});
export const db = admin.database();
import germany_json, {
  animes,
  codeemprestimo,
  company,
  complicated,
  eventos,
  herois,
  heroisInuteis,
  level2,
  productsGamers,
  simpleUsers,
} from "./swagger_jsons.js";
import {
  json_1,
  json_2,
  json_3,
  json_4,
  json_5,
  json_6,
  json_7,
  json_8,
  json_9,
  json_10,
  json_11,
  json_12,
  json_13,
  json_14,
  independent,
  brasil,
  big_json,
  crud_get,
  loja,
  usuarios,
  produtosDeLuxo,
  projects,
  membersProjet,
  clients,
  encryptedDataUser,
  mercado,
} from "./swagger_jsons.js";
const initialData = {
  "json-1": {
    ...json_1,
  },
  "json-2": {
    ...json_2,
  },
  "json-3": {
    ...json_3,
  },
  "json-4": {
    ...json_4,
  },
  "json-5": {
    ...json_5,
  },
  "json-6": {
    ...json_6,
  },
  "json-7": {
    ...json_7,
  },
  "json-8": {
    ...json_8,
  },
  "json-9": {
    ...json_9,
  },
  "json-10": {
    ...json_10,
  },
  "json-11": {
    ...json_11,
  },
  "json-12": {
    ...json_12,
  },
  "json-13": {
    ...json_13,
  },
  "json-14": {
    ...json_14,
  },
  "germany-api": {
    ...germany_json,
  },
  independent: {
    ...independent,
  },
  brasil: {
    ...brasil,
  },
  "big-json": {
    ...big_json,
  },
  crud_get: {
    ...crud_get,
  },
  produtos: {
    ...loja,
  },
  bank: {
    clientes: {
      ...usuarios,
    },
    produtosdeluxo: {
      ...produtosDeLuxo.produtosDeLuxo,
    },
    codeemprestimo: {
      ...codeemprestimo,
    },
  },
  projects: {
    ...projects,
  },
  payments: {
    clients: {
      ...clients,
    },
    productsgamers: {
      ...productsGamers,
    },
  },
  company: {
    ...company,
  },
  mercado: {
    ...mercado,
  },
  eventos: {
    ...eventos,
  },
  heroes: {
    herois: {
      ...herois,
    },
    "herois-inuteis": {
      ...heroisInuteis,
    },
  },
  simpleCrud: {
    ...simpleUsers,
  },
  animes: {
    ...animes,
  },
};
export const inicializeJSOns = async () => {
  try {
    const ref = db.ref();
    await ref.set(initialData, (errors) => {
      if (errors) console.log(errors);
    });
  } catch (errors) {}
};
