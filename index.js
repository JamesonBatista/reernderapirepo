import swaggerDocument from "./swaggerConfig.js";
import express from "express";
import swaggerUi from "swagger-ui-express";
// const admin = require("firebase-admin");

import { param, body, validationResult } from "express-validator";
import isValidCPF, { decrypt, encrypt } from "./functions.js";
// const serviceAccount = require("./restapi.json");

import enviarEmail from "./email.js";
const app = express();
import bodyParser from "body-parser";
import Joi from "joi";
import jwt from "jsonwebtoken";

import { db, inicializeJSOns } from "./firebase.js";
import { complicated, level2, simpleUsers } from "./swagger_jsons.js";
app.use(bodyParser.json());
app.use(express.static("public"));
const users = [
  { id: 1, username: "admin", password: "password" }, // Usuário exemplo
];
const secretKey = "your_secret_key"; // Mantenha esta chave segura
let code_emprestimo_bank = null;
// Função para gerar token JWT
function generateToken(user) {
  const payload = {
    id: user.id,
    username: user.username,
  };
  return jwt.sign(payload, secretKey, { expiresIn: "1h" });
}

inicializeJSOns();

const dbJSONget = async (res, endpoint) => {
  try {
    const ref = db.ref(endpoint);
    await ref.once("value", (snapshot) => {
      const path = snapshot.val();
      res.status(200).json(path);
    });
  } catch (error) {
    res.status(500).json({ message: "Erro, não foi possível obter o JSON." });
  }
};
const buscar = async (endpoint) => {
  const ref = await db.ref(endpoint).once("value");
  const snapshot = ref.val() ? Object.values(ref.val()) : [];
  return snapshot;
};
// Rota de login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Simulação de validação de usuário
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    const token = `Bearer ${generateToken(user)}`;
    res.status(201).json({ token });
  } else {
    res.status(401).send({ error: "Credenciais inválidas" });
  }
});
app.post("/login-hard", (req, res) => {
  const { username, password } = req.body;

  // Simulação de validação de usuário
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    const token = `Bearer ${generateToken(user)}`;
    const _token = {
      data: [
        {
          form: [
            {
              cam: [
                {
                  in: [
                    {
                      gen: [
                        {
                          form_token: [
                            {
                              in_token: [
                                {
                                  gen_token: [
                                    {
                                      refresh: [
                                        {
                                          bearer: [
                                            {
                                              refresh_token: [
                                                {
                                                  show: {
                                                    token: token,
                                                    message:
                                                      "Achou que seria fácil né chegar no token ..hahaha",
                                                  },
                                                },
                                              ],
                                            },
                                          ],
                                        },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };
    res.status(201).json(_token);
  } else {
    res.status(401).send({ error: "Credenciais inválidas" });
  }
});
app.get("/users", (req, res) => {
  dbJSONget(res, "simpleCrud");
});
app.get("/users/:id", async (req, res) => {
  const users = await buscar("simpleCrud");
  const user = users.find((u) => u.id === parseInt(req.params.id));

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

app.post("/users", async (req, res) => {
  const users = await buscar("simpleCrud");

  const newUser = req.body;
  newUser.id = users.length ? users[users.length - 1].id + 1 : 1;

  newUser.created = new Date().toISOString();

  users.push(newUser);
  db.ref("simpleCrud").set(users);
  res.status(201).json(newUser);
});
app.put("/users/:id", async (req, res) => {
  const users = await buscar("simpleCrud");
  const index = users.findIndex((u) => u.id === parseInt(req.params.id));

  if (index !== -1) {
    const updatedUser = { ...users[index], ...req.body };
    users[index] = updatedUser;

    await db.ref("simpleCrud").set(users);
    res.json(updatedUser);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});
app.delete("/users/:id", async (req, res) => {
  let users = await buscar("simpleCrud");
  const index = users.findIndex((u) => u.id === parseInt(req.params.id));

  if (index !== -1) {
    const deletedUser = users.splice(index, 1)[0];

    await db.ref("simpleCrud").set(users);
    res.json({ message: `User id ${parseInt(req.params.id)} deleted.` });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// animes
app.get("/animes", (req, res) => {
  dbJSONget(res, "animes");
});

app.get(
  "/animes/:id",
  [param("id").isInt().withMessage("O ID deve ser um número inteiro")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const id = parseInt(req.params.id);
    const ref = db.ref(`animes/${id - 1}`);
    const snapshot = await ref.once("value");
    const anime = snapshot.val();

    if (!anime) {
      return res.status(404).send({ message: "Anime not found" });
    }
    res.status(200).json(anime);
  }
);
app.post(
  "/animes",
  [
    body("name").isString().withMessage("Name must be a string"),
    body("yearOfCreation")
      .isInt({ min: 1900, max: new Date().getFullYear() })
      .withMessage("Year of creation must be a valid year"),
    body("topCharacters")
      .isArray({ min: 5, max: 5 })
      .withMessage("Top characters must be an array of exactly 5 items"),
    body("topCharacters.*")
      .isString()
      .withMessage("Each character must be a string"),
  ],
  async (req, res) => {
    // Validate the request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, yearOfCreation, topCharacters } = req.body;

      // Generate a new ID
      const newAnimeRef = db.ref("animes").push();

      // Save the new anime
      await newAnimeRef.set({
        id: newAnimeRef.key, // Firebase automatically generates a unique key
        name,
        yearOfCreation,
        topCharacters,
      });

      res.status(201).json({
        message: "Anime added successfully!",
        anime: { id: newAnimeRef.key, name, yearOfCreation, topCharacters },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);
app.put(
  "/animes/:id",
  [
    param("id").isString().withMessage("ID must be a valid string"),
    body("name").optional().isString().withMessage("Name must be a string"),
    body("yearOfCreation")
      .optional()
      .isInt({ min: 1900, max: new Date().getFullYear() })
      .withMessage("Year of creation must be a valid year"),
    body("topCharacters")
      .optional()
      .isArray({ min: 5, max: 5 })
      .withMessage("Top characters must be an array of exactly 5 items"),
    body("topCharacters.*")
      .optional()
      .isString()
      .withMessage("Each character must be a string"),
  ],
  async (req, res) => {
    // Validate the request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { id } = req.params;
      const updates = req.body;

      // Access the specific anime in the database
      const ref = db.ref(`animes/${id}`);
      const snapshot = await ref.once("value");
      const anime = snapshot.val();

      if (!anime) {
        return res.status(404).json({ message: "Anime not found" });
      }

      // Update the anime
      await ref.update(updates);

      res
        .status(200)
        .json({
          message: "Anime updated successfully!",
          anime: { id, ...updates },
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);
app.delete(
  '/animes/:id',
  [
    param('id').isString().withMessage('ID must be a valid string'),
  ],
  async (req, res) => {
    // Validate the request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { id } = req.params;

      // Access the specific anime in the database
      const ref = db.ref(`animes/${id}`);
      const snapshot = await ref.once('value');
      const anime = snapshot.val();

      if (!anime) {
        return res.status(404).json({ message: 'Anime not found' });
      }

      // Delete the anime
      await ref.remove();

      res.status(200).json({ message: 'Anime deleted successfully!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
);
//

//

//

app.get("/json_1", async (req, res) => {
  dbJSONget(res, "json-1");
});
app.get("/json_2", (req, res) => {
  dbJSONget(res, "json-2");
});
app.get("/json_3", (req, res) => {
  dbJSONget(res, "json-3");
});

app.get("/json_4", (req, res) => {
  dbJSONget(res, "json-4");
});
app.get("/json_5", (req, res) => {
  dbJSONget(res, "json-5");
});
app.get("/json_6", (req, res) => {
  dbJSONget(res, "json-6");
});
app.get("/json_7", (req, res) => {
  dbJSONget(res, "json-7");
});
app.get("/json_8", (req, res) => {
  dbJSONget(res, "json-8");
});
app.get("/json_9", (req, res) => {
  dbJSONget(res, "json-9");
});
app.get("/json_12", (req, res) => {
  dbJSONget(res, "json-12");
});

const dados = {
  produtos: [{ id: 1 }, { id: 2 }, { id: 3 }],
  usuarios: ["joaosilva@example.com", "joao.silva@outlook.com"],
  eventos: ["Conferência de Tecnologia 2024"],
  linguagens: ["Python", "JavaScript"],
  projetos: [101, 102],
  veiculosLancadores: ["VL01", "VL02"],
  copasDoMundo: [2018, 2022],
  voos: ["V001", "V002"],
  jogosDoBrasil: [1, 2, 3, 4, 5, 6],
};

const schema = Joi.object({
  produtoId: Joi.number()
    .valid(...dados.produtos.map((p) => p.id))
    .required(),
  usuarioEmail: Joi.string()
    .email()
    .valid(...dados.usuarios)
    .required(),
  eventoNome: Joi.string()
    .valid(...dados.eventos)
    .required(),
  linguagemNome: Joi.string()
    .valid(...dados.linguagens)
    .required(),
  empresaProjetoId: Joi.number()
    .valid(...dados.projetos)
    .required(),
  agenciaVeiculoId: Joi.string()
    .valid(...dados.veiculosLancadores)
    .required(),
  copaAno: Joi.number()
    .valid(...dados.copasDoMundo)
    .required(),
  vooId: Joi.string()
    .valid(...dados.voos)
    .required(),
  jogoId: Joi.number()
    .valid(...dados.jogosDoBrasil)
    .required(),
});

app.post("/all-jsons-data", (req, res) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .send({ errors: `Erro de validação: ${error.details[0].message}` });
  }

  res.send({
    json: req.body,
    message:
      "Todos os dados informados são válidos e foram verificados com sucesso.",
  });
});
app.get("/infinity-array", (req, res) => {
  dbJSONget(res, "json-10");
});
app.get("/deep-validation", (req, res) => {
  dbJSONget(res, "json-11");
});
// // Others
app.get("/germany-api", (req, res) => {
  dbJSONget(res, "germany-api");
});
app.get("/independent", (req, res) => {
  dbJSONget(res, "independent");
});
app.get("/brasil", (req, res) => {
  dbJSONget(res, "brasil");
});
app.get("/big-json", (req, res) => {
  dbJSONget(res, "big-json");
});
// // CRUD
app.get("/crud", async (req, res) => {
  dbJSONget(res, "crud_get/users");
});
function generateId(param) {
  let newId =
    param.length > 0
      ? Math.max(...param.map((user) => user.id || user.id_member)) + 1
      : 1;

  while (param.some((user) => user.id || user.id_member === newId)) {
    newId++;
  }

  return newId;
}
app.post(
  "/crud",
  [
    body("nome")
      .notEmpty()
      .withMessage("O campo nome é obrigatório")
      .custom(async (value) => {
        const get = await buscar("crud_get/users");
        const userExists = get.find(
          (user) => user.nome.trim() === value.trim()
        );
        if (userExists) {
          throw new Error("Nome já existe");
        }
        return true;
      }),
    body("email")
      .isEmail()
      .withMessage("Deve ser um email válido")
      .notEmpty()
      .withMessage("O campo email é obrigatório"),
    body("idade")
      .isInt({ min: 18 })
      .withMessage("A idade deve ser um número inteiro válido e maior que 18")
      .notEmpty()
      .withMessage("O campo idade é obrigatório"),
    body("telefone").notEmpty().withMessage("O campo telefone é obrigatório"),
    body("endereco").notEmpty().withMessage("O campo endereço é obrigatório"),
    body("profissao").notEmpty().withMessage("O campo profissão é obrigatório"),
    body("empresa").notEmpty().withMessage("O campo empresa é obrigatório"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const search = await buscar("crud_get/users");
    let get = search;
    // Atribuição automática de 'status' como 'ativo' e 'dataCadastro' para a data atual
    const newUser = {
      id: search.length + 1,
      nome: req.body.nome,
      email: req.body.email,
      idade: req.body.idade,
      telefone: req.body.telefone,
      endereco: req.body.endereco,
      profissao: req.body.profissao,
      empresa: req.body.empresa,
      status: "ativo", // Status definido automaticamente como 'ativo'
      dataCadastro: new Date().toISOString().split("T")[0], // Data de cadastro definida como a data atual
    };

    if (get.length > 50) {
      get.splice(0, 10);
    }
    // Adiciona o novo usuário ao array
    get.push(newUser);
    const ref = db.ref("crud_get/users");
    await ref.set(get);

    if (get.length > 50) {
      get.splice(0, 10); // Remove os 10 primeiros
    }

    res.status(201).json(newUser);
  }
);
app.put(
  "/crud/:id",
  [
    body("nome")
      .notEmpty()
      .withMessage("O campo nome é obrigatório")
      .custom(async (value, { req }) => {
        const get = await buscar("crud_get/users");
        const userExists = get.find(
          (user) =>
            user.nome.trim() === value.trim() &&
            user.id !== parseInt(req.params.id)
        );
        if (userExists) {
          throw new Error("Nome já existe");
        }
        return true;
      }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const search = await buscar("crud_get/users");
    const userId = parseInt(req.params.id);
    const userIndex = search.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // Atualiza apenas os campos enviados
    const updatedUser = {
      ...search[userIndex],
      id: userId,
      nome: req.body.nome,
      email: req.body.email || search[userIndex].email,
      idade: req.body.idade || search[userIndex].idade,
      telefone: req.body.telefone || search[userIndex].telefone,
      endereco: req.body.endereco || search[userIndex].endereco,
      profissao: req.body.profissao || search[userIndex].profissao,
      empresa: req.body.empresa || search[userIndex].empresa,
      status: search[userIndex].status || "ativo",
      dataCadastro:
        search[userIndex].dataCadastro ||
        new Date().toISOString().split("T")[0],
    };

    // Atualiza o usuário no array
    search[userIndex] = updatedUser;

    const ref = db.ref("crud_get/users");
    await ref.set(search);

    res.status(200).json(updatedUser);
  }
);

app.get(
  "/crud/:id",
  [param("id").isInt().withMessage("O ID deve ser um número inteiro")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const id = parseInt(req.params.id);

    try {
      const user = await buscar(`crud_get/users`);
      const users = user.find((p) => p.id === id);
      if (!users) {
        return res.status(404).send({ message: "Usuário não encontrado" });
      }

      res.status(200).json(users);
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      res.status(500).send({ message: "Erro ao buscar usuário" });
    }
  }
);
app.delete(
  "/crud/:id",
  [param("id").isInt().withMessage("O ID deve ser um número inteiro")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const id = parseInt(req.params.id);

    try {
      const ref = db.ref(`crud_get/users/${id - 1}`);
      const snapshot = await ref.once("value");
      const user = snapshot.val();

      if (!user) {
        return res.status(404).send({ message: "Usuário não encontrado" });
      }

      await ref.remove();

      res
        .status(200)
        .json({ message: `Usuário com ID ${id} foi removido com sucesso.` });
    } catch (error) {
      console.error("Erro ao remover usuário:", error);
      res.status(500).send({ message: "Erro ao remover usuário" });
    }
  }
);

app.get("/produtos", (req, res) => {
  dbJSONget(res, "produtos");
});
app.post(
  "/produtos",
  [
    body("nome").isString().withMessage("Nome do cliente deve ser uma string"),
    body("cpf").isString().withMessage("CPF do cliente deve ser uma string"),
    body("id_produto")
      .isInt({ min: 1 })
      .withMessage("ID do produto deve ser um inteiro válido"),
    body("valor_na_carteira")
      .isFloat({ min: 0 })
      .withMessage("Valor na carteira deve ser um número positivo"),
    body("send_email")
      .optional()
      .isEmail()
      .withMessage("Se fornecido, send_email deve ser um email válido"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nome, cpf, id_produto, valor_na_carteira, send_email } = req.body;
    const id_parse = parseInt(id_produto);
    // Lógica para verificar o saldo na carteira e realizar a compra do produto
    // Supondo que temos uma função para buscar o produto por ID
    let produto = await buscar(`produtos/produtos/${id_parse - 1}`);
    produto = {
      id: id_parse,
      marca: produto[1],
      nome: produto[2],
      preco: produto[3],
    };

    if (!produto) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }

    if (valor_na_carteira < produto.valor) {
      return res.status(400).json({
        errors: [
          {
            msg: "Saldo insuficiente na carteira",
            param: "valor_na_carteira",
            location: "body",
          },
        ],
      });
    }

    res.status(201).json({
      produto,
      message: "Compra realizada com sucesso",
    });

    if (send_email) {
      let html = `<!DOCTYPE html>
      <html lang="en">
      <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmação de Compra</title>
      <style>
          body {
              font-family: 'Arial', sans-serif;
              margin: 0;
              padding: 0;
              color: #333;
          }
          .container {
              padding: 20px;
              background-color: #f4f4f4;
              border: 1px solid #ddd;
              margin: 20px auto;
              width: 80%;
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          .header {
              background-color: #007bff;
              color: white;
              padding: 10px;
              text-align: center;
          }
          .content {
              padding: 20px;
              background-color: white;
          }
          .footer {
              text-align: center;
              padding: 10px;
              font-size: 0.8em;
              background-color: #eee;
          }
      </style>
      </head>
      <body>
      <div class="container">
          <div class="header">
              <h1>Parabéns pela sua compra! ${nome}</h1>
          </div>
          <div class="content">
              <h2>Detalhes do Produto</h2>
              <p><strong>Produto:</strong> ${produto.nome}</p>
              <p><strong>Marca:</strong> ${produto.marca}</p>
              <p><strong>Preço:</strong> R$${produto.preco}</p>
          </div>
          <div class="footer">
              Obrigado por comprar conosco!.
          </div>
      </div>
      </body>
      </html>
       `;
      enviarEmail(
        send_email,
        `Parabéns pela compra do produto ${produto.nome}`,
        html
      );
    }
  }
);

app.get(
  "/produtos/:id",
  [param("id").isInt().withMessage("O ID deve ser um numero inteiro")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const id = parseInt(req.params.id);
    let user = await buscar(`produtos/produtos/${id - 1}`);
    if (!user) {
      return res.status(404).send({ message: "Produto não encontrado" });
    }
    user = { id: id, marca: user[1], nome: user[2], preco: user[3] };
    res.status(200).json(user);
  }
);

// app.post(
//   "/projects",
//   [
//     body("name")
//       .notEmpty()
//       .withMessage("O nome é obrigatório")
//       .isString()
//       .withMessage("O campo name deve ser uma string"),
//     body("leader")
//       .notEmpty()
//       .withMessage("Campo líder é obrigatório")
//       .isString()
//       .withMessage("O campo leader deve ser uma string"),
//     body("description")
//       .notEmpty()
//       .withMessage("A descrição é obrigatória")
//       .isString()
//       .withMessage("O campo description deve ser uma string"),
//     body("endDate")
//       .isISO8601()
//       .withMessage("Data de término inválida")
//       .custom((value) => {
//         const endDate = new Date(value);
//         const today = new Date();
//         if (endDate <= today) {
//           throw new Error("A data de término deve ser maior que a data atual");
//         }
//         return true;
//       }),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { name, description, endDate, leader } = req.body;
//     const projects = await buscar("projects");
//     const projectExists = projects.some(
//       (p) => p.name.trim().toLowerCase() === name.trim().toLowerCase()
//     );
//     if (projectExists) {
//       return res
//         .status(400)
//         .json({ message: `Já existe um projeto com o nome ${name}` });
//     }

//     const startDate = new Date().toISOString().split("T")[0]; // Formato YYYY-MM-DD
//     const newProject = {
//       id: projects.length + 1,
//       name,
//       leader,
//       description,
//       startDate,
//       endDate,
//       members: [],
//     };

//     // Limite e remoção de projetos antigos
//     if (projects.length >= 50) {
//       projects.splice(0, 10); // Remove os 10 primeiros
//     }

//     projects.push(newProject);
//     const ref = db.ref("projects");
//     await ref.set(projects);

//     res.status(201).json({
//       message: "Projeto criado com sucesso!",
//       project: newProject,
//     });
//   }
// );

// // BANK
function generateCode() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }
  return code;
}
app.get("/clientes", async (req, res) => {
  dbJSONget(res, "bank/clientes");
});

app.post(
  "/clientes",
  [
    body("nome").notEmpty().withMessage("O campo nome é obrigatório"),
    body("cpf").notEmpty().withMessage("O campo CPF é obrigatório"),
    body("cpf").custom(async (cpf) => {
      const usuarios = await buscar("bank/clientes");
      const cpfExistente = usuarios.find((user) => user.cpf === cpf);
      if (cpfExistente) {
        throw new Error("CPF já cadastrado");
      }
      // Adicione aqui a lógica de validação de formato de CPF, se necessário
    }),
    body("contato.email")
      .isEmail()
      .withMessage("O campo email deve ser um email válido"),
    body("contato.telefone")
      .notEmpty()
      .withMessage("O campo telefone é obrigatório"),
    body("contato.endereco")
      .notEmpty()
      .withMessage("O campo endereço é obrigatório"),
    body("bank.credito")
      .notEmpty()
      .withMessage("O campo de crédito é obrigatório"),
    body("bank.debito")
      .notEmpty()
      .withMessage("O campo de débito é obrigatório"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const usuarios = await buscar("bank/clientes");
    const { nome, cpf, contato, bank } = req.body;

    if (usuarios.length >= 50) {
      usuarios.splice(0, 10); // Remove os primeiros 10 clientes
    }
    const novoCliente = {
      id: usuarios.length + 1,
      nome,
      cpf,
      contato,
      bank,
    };

    usuarios.push(novoCliente);

    try {
      await db.ref(`bank/clientes`).set(usuarios);
      res.status(201).json(novoCliente);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erro ao salvar cliente no banco de dados", error });
    }
  }
);
app.post("/emprestimo", async (req, res) => {
  let { id_cliente, emprestimo } = req.body;

  id_cliente = parseInt(id_cliente);
  try {
    const cli = await db.ref("bank/clientes").once("value");
    const clien = cli.val() ? Object.values(cli.val()) : [];
    const cliente = clien.find((user) => user.id === id_cliente);

    if (!cliente) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }
    // if (!isValidCPF(cliente.cpf)) {
    //   return res.status(400).json({ error: "CPF inválido" });
    // }
    if (emprestimo <= 0) {
      return res.status(400).json({ error: "Valor de empréstimo inválido" });
    }
    if (emprestimo < cliente.bank.debito) {
      return res.status(400).json({
        error: "Valor de empréstimo menor que débito disponível",
        debit_value: cliente.bank.debito,
        loan: emprestimo,
      });
    }
    const code_emprestimo_bank = generateCode();
    const codeRef = db.ref("bank/codeemprestimo");
    const snapshots = await codeRef.once("value");
    let codes = snapshots.val();

    if (!codes) {
      codes = [];
    } else {
      codes = Object.values(codes);
    }

    codes.push(code_emprestimo_bank);
    await codeRef.set(codes);

    cliente.bank.credito += emprestimo;

    const clienteAtualizado = {
      ...cliente,
      emprestimo_aprovado: code_emprestimo_bank,
    };
    await db.ref(`bank/clientes/${cliente.id - 1}`).set(clienteAtualizado);
    res.status(201).json(clienteAtualizado);
  } catch (error) {
    console.error("Erro ao processar empréstimo:", error);
    res.status(500).json({ error: "Erro ao processar empréstimo" });
  }
});
app.get("/financiamento-produtos", (req, res) => {
  dbJSONget(res, "bank/produtosdeluxo");
});
app.post(
  "/contratar-financiamento",
  [
    body("id_cliente")
      .notEmpty()
      .withMessage("O campo id_cliente é obrigatório"),
    body("id_produto")
      .notEmpty()
      .withMessage("O campo id_produto é obrigatório"),
    body("code_emprestimo")
      .notEmpty()
      .withMessage("O campo code_emprestimo é obrigatório")
      .isString()
      .withMessage("O campo code_emprestimo é uma string"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let { id_cliente, id_produto, code_emprestimo, receber_email, send_email } =
      req.body;

    id_cliente = parseInt(id_cliente);
    id_produto = parseInt(id_produto);
    // Verificar se o cliente existe
    const cli = await db.ref("bank/clientes").once("value");
    const clien = cli.val() ? Object.values(cli.val()) : [];
    const cliente = clien.find((user) => user.id === id_cliente);
    if (!cliente) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }
    // Verificar se o produto existe
    const produtos = await buscar("bank/produtosdeluxo");
    const produto = produtos.find((produto) => produto.id === id_produto);
    if (!produto) {
      return res.status(404).json({ message: "Produto não encontrado." });
    }

    const codesSnapshot = await db.ref("bank/codeemprestimo").once("value");
    const codes = codesSnapshot.val() ? Object.values(codesSnapshot.val()) : [];
    const codeExists = codes.find((codeem) => codeem === code_emprestimo);

    // Verificar se o cliente possui o campo emprestimo
    if (!codeExists) {
      return res.status(400).json({
        message:
          "Cliente não passou pelo endpoint /emprestimo para gerar código de emprestimo.",
      });
    }

    // Verificar se o cliente tem crédito suficiente
    if (cliente.bank.credito < produto.preco) {
      const diferenca = produto.preco - cliente.bank.credito;
      return res.status(400).json({
        message: "Crédito insuficiente.",
        actual_credit: diferenca,
      });
    }

    // Atualizar o crédito do cliente
    cliente.bank.credito -= produto.preco;

    await db.ref(`bank/clientes/${cliente.id - 1}`).set(cliente);

    // Retornar mensagem de sucesso
    const mensagem = `Financiamento do produto ${produto.nome} (${produto.marca}, ${produto.tipo}) aprovado para o cliente ${cliente.nome}.`;
    res.status(201).json({
      message: mensagem,
      produto: produto,
      valor_credito_atual: cliente.bank.credito,
    });
    if (receber_email || send_email) {
      let html = `<!DOCTYPE html>
      <html lang="en">
      <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmação de Compra</title>
      <style>
          body {
              font-family: 'Arial', sans-serif;
              margin: 0;
              padding: 0;
              color: #333;
          }
          .container {
              padding: 20px;
              background-color: #f4f4f4;
              border: 1px solid #ddd;
              margin: 20px auto;
              width: 80%;
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          .header {
              background-color: #007bff;
              color: white;
              padding: 10px;
              text-align: center;
          }
          .content {
              padding: 20px;
              background-color: white;
          }
          .footer {
              text-align: center;
              padding: 10px;
              font-size: 0.8em;
              background-color: #eee;
          }
      </style>
      </head>
      <body>
      <div class="container">
          <div class="header">
              <h1>Parabéns pela sua compra!</h1>
          </div>
          <div class="content">
              <h2>Detalhes do Produto</h2>
              <p><strong>Produto:</strong> ${produto.nome}</p>
              <p><strong>Marca:</strong> ${produto.marca}</p>
              <p><strong>Preço:</strong> R$${produto.preco}</p>
          </div>
          <div class="footer">
              Obrigado por comprar conosco!.
          </div>
      </div>
      </body>
      </html>
       `;
      enviarEmail(
        receber_email || send_email,
        `Parabéns pela compra do produto ${produto.nome}`,
        html
      );
    }
  }
);

// // PROJECT
app.get("/projects", (req, res) => {
  dbJSONget(res, "projects");
});
app.post(
  "/projects",
  [
    body("name")
      .notEmpty()
      .withMessage("O nome é obrigatório")
      .isString()
      .withMessage("O campo name deve ser uma string"),
    body("leader")
      .notEmpty()
      .withMessage("Campo líder é obrigatório")
      .isString()
      .withMessage("O campo leader deve ser uma string"),
    body("description")
      .notEmpty()
      .withMessage("A descrição é obrigatória")
      .isString()
      .withMessage("O campo description deve ser uma string"),
    body("endDate")
      .isISO8601()
      .withMessage("Data de término inválida")
      .custom((value) => {
        const endDate = new Date(value);
        const today = new Date();
        if (endDate <= today) {
          throw new Error("A data de término deve ser maior que a data atual");
        }
        return true;
      }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, endDate, leader } = req.body;
    const projects = await buscar("projects");
    const projectExists = projects.some(
      (p) => p.name.trim().toLowerCase() === name.trim().toLowerCase()
    );
    if (projectExists) {
      return res
        .status(400)
        .json({ message: `Já existe um projeto com o nome ${name}` });
    }

    const startDate = new Date().toISOString().split("T")[0]; // Formato YYYY-MM-DD
    const newProject = {
      id: projects.length + 1,
      name,
      leader,
      description,
      startDate,
      endDate,
      members: [],
    };

    // Limite e remoção de projetos antigos
    if (projects.length >= 50) {
      projects.splice(0, 10); // Remove os 10 primeiros
    }

    projects.push(newProject);
    const ref = db.ref("projects");
    await ref.set(
      projects.reduce((acc, project) => {
        acc[project.id] = project;
        return acc;
      }, {})
    );

    res.status(201).json({
      message: "Projeto criado com sucesso!",
      project: newProject,
    });
  }
);

app.get(
  "/projects/:id",
  [param("id").isInt().withMessage("O ID deve ser um número inteiro")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const id = parseInt(req.params.id);
    const projects = await buscar("projects");
    const project = projects.find((p) => p.id === id);
    if (!project) {
      return res.status(404).json({ message: "Projeto não encontrado" });
    }
    res.status(200).json(project);
  }
);
app.put(
  "/projects/:id",
  [param("id").isInt().withMessage("O ID deve ser um número inteiro")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const id = parseInt(req.params.id);
    const { name, description, startDate, endDate, members } = req.body;

    // Encontrar o projeto pelo ID
    const projects = await buscar("projects");
    const project = projects.find((p) => p.id === id);
    if (!project) {
      return res.status(404).json({ message: "Projeto não encontrado" });
    }

    // Atualizar os detalhes do projeto
    if (name) project.name = name;
    if (description) project.description = description;
    if (startDate) project.startDate = startDate;
    if (endDate) project.endDate = endDate;
    if (members) project.members = members;

    await db.ref("projects").set(project);

    // Responder com o projeto atualizado
    res.status(200).json({
      message: "Projeto atualizado com sucesso",
      project,
    });
  }
);
app.get(
  "/projects/:id/members",
  [param("id").isInt().withMessage("O ID deve ser um número inteiro")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const projects = await buscar("projects");
    const id = parseInt(req.params.id);
    const project = projects.find((p) => p.id === id);
    if (!project) {
      return res
        .status(404)
        .json({ message: `Projeto com id ${id} não encontrado.` });
    }
    res.status(200).json(project.members);
  }
);
app.delete(
  "/projects/:id",
  [param("id").isInt().withMessage("O ID deve ser um número inteiro")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const projects = await buscar("projects");
    const projectId = parseInt(req.params.id);
    const projectIndex = projects.findIndex((p) => p.id === projectId);
    const project = projects.find((p) => p.id === projectId);

    if (projectIndex === -1) {
      return res.status(404).json({ message: "Projeto não encontrado" });
    }

    // Remove o projeto da lista
    projects.splice(projectIndex, 1);
    await db.ref("projects").set(projects);
    res
      .status(200)
      .json({ message: `Projeto ${project.name} deletado com sucesso!` });
  }
);

app.post(
  "/projects/:projectId/member",
  [
    body("member_name")
      .not()
      .isEmpty()
      .withMessage("O nome do membro é obrigatório"),
    body("office")
      .not()
      .isEmpty()
      .withMessage("O cargo do membro é obrigatório"),
    body("send_email")
      .optional()
      .isString()
      .withMessage("O campo send_email deve ser uma string"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const projectId = parseInt(req.params.projectId);
    let { member_name, office, send_email } = req.body;

    try {
      // Buscar o projeto específico pelo ID
      const projects = await buscar("projects");
      const project = projects.find((p) => p.id === projectId);

      if (!project) {
        return res.status(404).json({ message: "Projeto não encontrado." });
      }

      if (!project.members) {
        project.members = [];
      }

      const membersProject = project.members;
      const id_member = membersProject.length ? membersProject.length + 1 : 1;

      // Verificar se o membro já existe no projeto
      const project_member = membersProject.find(
        (p) => p.member_name.trim() === member_name.trim()
      );
      if (project_member) {
        return res
          .status(400)
          .json({ message: `Membro ${member_name} já se encontra na equipe.` });
      }

      // Criar o novo membro
      const newMember = {
        id_member,
        member_name,
        office,
        send_email: send_email || "opcional",
      };

      // Limitar o número de membros a 50
      if (membersProject.length >= 50) {
        membersProject.splice(0, 10);
      }

      // Adicionar o novo membro ao array de membros do projeto
      membersProject.push(newMember);
      project.members = membersProject;

      // Atualizar o projeto no Firebase
      await db.ref(`projects/${projectId}`).set(project);

      // Simular o envio de e-mail
      if (send_email) {
        const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Bem-vindo ao Projeto</title>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    margin: 0;
                    padding: 0;
                    color: #333;
                }
                .container {
                    padding: 20px;
                    background-color: #f4f4f4;
                    border: 1px solid #ddd;
                    margin: 20px auto;
                    width: 80%;
                    box-shadow: 0 0 10px rgba(0,0,0,0.1);
                }
                .header {
                    background-color: #007bff;
                    color: white;
                    padding: 10px;
                    text-align: center;
                }
                .content {
                    padding: 20px;
                    background-color: white;
                }
                .footer {
                    text-align: center;
                    padding: 10px;
                    font-size: 0.8em;
                    background-color: #eee;
                }
            </style>
        </head>
        <body>
        <div class="container">
            <div class="header">
                <h1>Bem-vindo ao Projeto ${project.name}!</h1>
            </div>
            <div class="content">
                <h2>Detalhes da Adesão</h2>
                <p><strong>Nome:</strong> ${newMember.name}</p>
                <p><strong>Cargo:</strong> ${newMember.office}</p>
                <p><strong>Projeto:</strong> ${project.name}</p>
                <p><strong>Líder:</strong> ${project.leader}</p>
            </div>
            <div class="footer">
                Obrigado por juntar-se a nós!
            </div>
        </div>
        </body>
        </html>
        `;
        enviarEmail(
          newMember.send_email,
          `Integração do(a) ${newMember.member_name} no projeto ${project.name}`,
          html
        );
      }

      // Responder com sucesso
      res.status(201).json({
        message: "Membro adicionado com sucesso ao projeto",
        project,
      });
    } catch (error) {
      console.error("Erro ao buscar projeto:", error);
      res.status(500).send({ message: "Erro ao buscar projeto" });
    }
  }
);

app.delete(
  "/projects/:projectId/member/:id_member",
  [
    param("projectId")
      .isInt()
      .withMessage("O ID do projeto deve ser um número inteiro"),
    param("id_member")
      .isInt()
      .withMessage("O ID do membro deve ser um número inteiro"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { projectId, id_member } = req.params;

    // Buscar todos os projetos
    const projects = await buscar("projects");

    // Encontrar o projeto pelo ID
    const project = projects.find((p) => p.id === parseInt(projectId));
    if (!project) {
      return res.status(404).json({ message: "Projeto não encontrado" });
    }
    // Encontrar o índice do membro no projeto
    const memberIndex = project.members.findIndex(
      (m) => m.id_member === parseInt(id_member)
    );
    if (memberIndex === -1) {
      return res.status(404).json({ message: "Membro não encontrado" });
    }

    const member_name = project.members[memberIndex].member_name;
    // Remover o membro do array de membros do projeto
    project.members.splice(memberIndex, 1);

    // Garantir que o campo members existe como um array vazio se não houver membros
    if (!project.members.length) {
      project.members = [];
    }

    // Atualizar o projeto no Firebase
    await db.ref(`projects/${projectId - 1}`).set(project);

    res.status(200).json({
      message: `Membro ${member_name} retirado do projeto ${project.name}`,
    });
  }
);

// //
// // PAYMENTS
app.post(
  "/clients",
  [
    body("name").not().isEmpty().withMessage("O nome é obrigatório"),
    body("cpf")
      .matches(/^\d{11}$/)
      .withMessage("CPF inválido. Deve conter 11 dígitos sem pontos ou traços"),
    body("card.flag")
      .isIn(["MASTER", "VISA"])
      .withMessage("A bandeira do cartão deve ser MASTER ou VISA"),
    body("card.credit")
      .isFloat({ min: 1000 })
      .withMessage("O crédito deve ser um número válido maior ou igual a 1000"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const clients = await buscar("payments/clients");
    const clients_name = clients.find(
      (p) => p.name.trim() === req.body.name.trim()
    );
    if (clients_name) {
      return res
        .status(400)
        .json({ errors: `${req.body.name} já existe na lista de Clientes.` });
    }

    // Cria um novo cliente e adiciona ao array de clientes
    const newClient = {
      id: clients.length + 1,
      name: req.body.name,
      cpf: req.body.cpf,
      card: {
        flag: req.body.card.flag,
        credit: parseFloat(req.body.card.credit),
      },
    };
    if (clients.length > 50) {
      clients = clients.splice(0, 10);
    }

    clients.push(newClient);
    await db.ref("payments/clients").set(clients);
    res
      .status(201)
      .json({ message: "Cliente registrado com sucesso!", client: newClient });
  }
);
app.get("/clients", (req, res) => {
  dbJSONget(res, "payments/clients");
});
app.get(
  "/clients/:id",
  [param("id").isInt().withMessage("O ID deve ser um número inteiro")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const clients = await buscar("payments/clients");
    const id = parseInt(req.params.id);
    const client = clients.find((client) => client.id === id);
    if (!client) {
      return res.status(404).json({ message: "Cliente não encontrado" });
    }
    res.status(200).json(client);
  }
);
app.put(
  "/clients/:id",
  [
    param("id").isInt().withMessage("ID deve ser um número inteiro"),
    body("name").optional().notEmpty().withMessage("O nome não pode ser vazio"),
    body("cpf")
      .optional()
      .isLength({ min: 11, max: 11 })
      .withMessage("CPF inválido. Deve conter 11 dígitos sem pontos ou traços")
      .isNumeric()
      .withMessage("CPF deve conter apenas números"),
    body("card.flag")
      .optional()
      .isIn(["MASTER", "VISA"])
      .withMessage("A bandeira do cartão deve ser MASTER ou VISA"),
    body("card.credit")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("O crédito deve ser um número válido maior ou igual a zero"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    try {
      const clientSnapshot = await db
        .ref(`payments/clients/${parseInt(id - 1)}`)
        .once("value");
      const client = clientSnapshot.val();

      if (!client) {
        return res.status(404).send({ message: "Cliente não encontrado" });
      }

      // Atualizar somente os campos fornecidos na requisição
      const { name, cpf, card } = req.body;
      let updatedClient = { ...client };

      if (name) updatedClient.name = name;
      if (cpf) updatedClient.cpf = cpf;
      if (card) {
        if (!updatedClient.card) {
          updatedClient.card = {};
        }
        if (card.flag) updatedClient.card.flag = card.flag;
        if (card.credit) updatedClient.card.credit = card.credit;
      }

      await db.ref(`payments/clients/${id - 1}`).set(updatedClient);
      res.status(200).send({
        message: "Cliente atualizado com sucesso",
        client: updatedClient,
      });
    } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar cliente", error });
    }
  }
);
app.delete(
  "/clients/:id",
  [param("id").isInt().withMessage("O ID deve ser um número inteiro")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const id = parseInt(req.params.id);
    const clients = await buscar("payments/clients");
    const clientIndex = clients.findIndex((client) => client.id === id);
    if (clientIndex === -1) {
      return res.status(404).json({ message: "Cliente não encontrado" });
    }

    // Remove o cliente do array
    clients.splice(clientIndex, 1);
    await db.ref("payments/clients").set(clients);

    res.status(200).json({ message: "Cliente deletado com sucesso" });
  }
);

app.get("/products-gamers", (req, res) => {
  dbJSONget(res, "payments/productsgamers");
});

app.post(
  "/products-purchase-gamers",
  [
    body("id_client").isInt({ min: 1 }).withMessage("ID do cliente inválido"),
    body("id_product").isInt({ min: 1 }).withMessage("ID do produto inválido"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let { id_client, id_product, send_email } = req.body;
    id_client = parseInt(id_client, 10);
    id_product = parseInt(id_product, 10);
    const clients = await buscar("payments/clients");
    const client = clients.find((c) => c.id === id_client);
    const products = await buscar("payments/productsgamers");
    const product = products.find((p) => p.id === id_product);

    if (!client) {
      return res.status(404).json({ message: "Cliente não encontrado" });
    }
    if (!product) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }

    if (client.card.credit >= product.price) {
      client.card.credit -= product.price;
      res.status(201).json({
        message: "Compra realizada com sucesso",
        product: product.name,
        remainingCredit: client.card.credit,
      });

      await db.ref(`payments/clients/${client.id - 1}`).update(client);

      if (send_email) {
        let html = `
        <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bem-vindo ao Projeto</title>
      <style>
          body {
              font-family: 'Arial', sans-serif;
              margin: 0;
              padding: 0;
              color: #333;
          }
          .container {
              padding: 20px;
              background-color: #f4f4f4;
              border: 1px solid #ddd;
              margin: 20px auto;
              width: 80%;
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          .header {
              background-color: #007bff;
              color: white;
              padding: 10px;
              text-align: center;
          }
          .content {
              padding: 20px;
              background-color: white;
          }
          .footer {
              text-align: center;
              padding: 10px;
              font-size: 0.8em;
              background-color: #eee;
          }
      </style>
  </head>
  <body>
  <div class="container">
      <div class="header">
          <h1>${client.name}, parabéns pela compra ${product.name}!</h1>
      </div>
      <div class="content">
          <h2>Detalhes  da Compra</h2>
          <p><strong>Nome:</strong> ${product.name}</p>
          <p><strong>Descrição:</strong> ${product.description}</p>
          <p><strong>Valor:</strong> ${product.price}</p>
      </div>
      <div class="footer">
          Obrigado por comprar no conosco!
      </div>
  </div>
  </body>
  </html>

        `;
        enviarEmail(
          send_email,
          `Parabéns ${client.name} você adquiriu ${product.name}`,
          html
        );
      }
    } else {
      res.status(400).json({
        message: "Crédito insuficiente",
        requiredCredit: product.price,
        currentCredit: client.card.credit,
      });
    }
  }
);
app.post(
  "/credit",
  [
    body("id_client").isInt({ min: 1 }).withMessage("ID do cliente inválido"),
    body("id_product").isInt({ min: 1 }).withMessage("ID do produto inválido"),
    body("value_credit")
      .isInt({ min: 1, max: 15000 })
      .withMessage("O valor de crédito solicitado deve ser menor que 15000"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let { id_client, id_product, value_credit } = req.body;
    id_client = parseInt(id_client, 10);
    id_product = parseInt(id_product, 10);
    const clients = await buscar("payments/clients");
    const client = clients.find((c) => c.id === id_client);
    const products = await buscar("payments/productsgamers");
    const product = products.find((p) => p.id === id_product);
    const credit_client = client.card.credit;
    if (!client) {
      return res.status(404).json({ message: "Cliente não encontrado" });
    }
    if (!product) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }
    const totalCreditAvailable = client.card.credit + value_credit;
    if (totalCreditAvailable < product.price) {
      return res.status(400).json({
        message: `O crédito total após adicionar o empréstimo ainda é insuficiente para comprar o produto. Crédito necessário: ${product.price}, crédito disponível: ${totalCreditAvailable}`,
      });
    }

    if (client.card.credit >= product.price) {
      return res.status(400).json({
        message:
          "Crédito atual já é suficiente para comprar o produto " +
          client.card.credit,
      });
    }
    // Atualizar o crédito do cliente
    client.card.credit = totalCreditAvailable;

    if (product.price > totalCreditAvailable) {
      res.status(400).json({
        message: `O valor do produto ${product.price} ainda é maior que o crédito atual somado ao emprestimo ${value_sum}, ${client.name} faça um novo emprestimo`,
      });
    }
    await db.ref(`payments/clients/${client.id - 1}`).update(client);

    res.status(200).json({
      message: "Crédito adicionado com sucesso",
      holdCredit: credit_client,
      newCredit: client.card.credit,
      client: client,
    });
  }
);

// // COMPANY

app.get("/company", (req, res) => {
  dbJSONget(res, "company");
});
app.get(
  "/company/:companyId",
  [
    param("companyId")
      .isInt()
      .withMessage("ID da empresa deve ser um número inteiro"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { companyId } = req.params;
    const company = await buscar("company");
    const company_ = company.find((c) => c.id === parseInt(companyId));
    if (!company_) {
      return res.status(404).send({ message: "Empresa não encontrada" });
    }

    res.status(200).send(company_);
  }
);
app.post(
  "/company",
  [
    body("name").notEmpty().withMessage("Nome é obrigatório"),
    body("cnpj")
      .isLength({ min: 14, max: 14 })
      .withMessage("CNPJ deve ter 14 dígitos")
      .isNumeric()
      .withMessage("CNPJ deve conter apenas números"),
    body("state").notEmpty().withMessage("Estado é obrigatório"),
    body("city").notEmpty().withMessage("Cidade é obrigatória"),
    body("address").notEmpty().withMessage("Endereço é obrigatório"),
    body("sector").notEmpty().withMessage("Setor é obrigatório"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, cnpj, state, city, address, sector } = req.body;
    const company = await buscar("company");
    const projectExists = company.some(
      (p) => p.name.trim().toLowerCase() === name.trim().toLowerCase()
    );
    if (projectExists) {
      return res
        .status(400)
        .json({ message: `Já existe uma Empresa com o nome ${name}` });
    }
    if (company.length > 50) {
      company.splice(0, 10); // Remove os 10 primeiros
    }
    let newCompany = {
      id: company.length + 1, // ID fictício
      name,
      cnpj,
      state,
      city,
      address,
      sector,
      products: [],
      employees: [],
      services: [],
    };
    company.push(newCompany);
    await db.ref("company").set(company);
    return res.status(201).send(newCompany);
  }
);
app.put(
  "/company/:id",
  [
    param("id").isInt().withMessage("ID deve ser um número inteiro"),
    body("name").optional().notEmpty().withMessage("Nome não pode ser vazio"),
    body("cnpj")
      .optional()
      .isLength({ min: 14, max: 14 })
      .withMessage("CNPJ deve ter 14 dígitos")
      .isNumeric()
      .withMessage("CNPJ deve conter apenas números"),
    body("state")
      .optional()
      .notEmpty()
      .withMessage("Estado não pode ser vazio"),
    body("city").optional().notEmpty().withMessage("Cidade não pode ser vazia"),
    body("address")
      .optional()
      .notEmpty()
      .withMessage("Endereço não pode ser vazio"),
    body("sector")
      .optional()
      .notEmpty()
      .withMessage("Setor não pode ser vazio"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { id } = req.params;

    const companys = await db.ref(`company/${parseInt(id - 1)}`).once("value");
    const company = companys.val();

    if (!company) {
      return res.status(404).send({ message: "Empresa não encontrada" });
    }

    // Atualizar somente os campos fornecidos na requisição
    const { name, cnpj, state, city, address, sector } = req.body;
    let updatedCompany = {};

    updatedCompany.id = parseInt(id);
    if (name) updatedCompany.name = name;
    if (cnpj) updatedCompany.cnpj = cnpj;
    if (state) updatedCompany.state = state;
    if (city) updatedCompany.city = city;
    if (address) updatedCompany.address = address;
    if (sector) updatedCompany.sector = sector;

    await db.ref(`company/${id - 1}`).set(updatedCompany);
    res.status(200).send({
      message: "Empresa atualizada com sucesso",
      company: updatedCompany,
    });
  }
);
app.delete(
  "/company/:id",
  param("id").isInt().withMessage("ID deve ser um número inteiro"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const company = await buscar(`company`);
    const companyIndex = company.findIndex(
      (company) => company.id === parseInt(id)
    );

    if (!company) {
      return res.status(404).send({ message: "Empresa não encontrada" });
    }

    // Remover a empresa
    company.splice(companyIndex, 1);
    await db.ref("company").set(company);
    // Responder que a empresa foi deletada
    res.status(200).send({ message: "Empresa deletada com sucesso" });
  }
);
// // PRODUCTS COMPANY
app.get(
  "/company/:companyId/products",
  [
    param("companyId")
      .isInt()
      .withMessage("ID da empresa deve ser um número inteiro"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { companyId } = req.params;
    const company = await buscar("company");

    const company_ = company.find((c) => c.id === parseInt(companyId));
    if (!company_) {
      return res.status(404).send({ message: "Empresa não encontrada" });
    }
    if (!company.products) company.products = [];
    const product = company_.products;
    res.status(200).send(product);
  }
);
app.post(
  "/company/:companyId/products",
  [
    param("companyId")
      .isInt()
      .withMessage("ID da empresa deve ser um número inteiro"),
    body("productName").notEmpty().withMessage("Nome do produto é obrigatório"),
    body("productDescription")
      .notEmpty()
      .withMessage("Descrição do produto é obrigatória"),
    body("price")
      .isInt({ min: 0 })
      .withMessage("Preço deve ser um número inteiro positivo"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const company = await buscar("company");
    const { companyId } = req.params;
    const company_ = company.find((c) => c.id === parseInt(companyId));
    if (!company_) {
      return res.status(404).send({ message: "Empresa não encontrada" });
    }

    const { productName, productDescription, price } = req.body;
    if (!company_.products) company_.products = [];
    const verify_name = company_.products.find(
      (c) =>
        c.productName.trim().toLowerCase() === productName.trim().toLowerCase()
    );
    if (verify_name) {
      return res
        .status(400)
        .send({ message: `${productName}  já existe nos produtos.` });
    }
    if (company_.products.length > 10) {
      company_.products.splice(0, 5); // Remove os 10 primeiros
    }

    const productId = company_.products.length + 1; // Simples ID incremental
    const newProduct = { productId, productName, productDescription, price };
    company_.products.push(newProduct);
    await db.ref(`company/${companyId - 1}`).set(company_);
    res.status(201).send({
      message: "Produto adicionado com sucesso",
      product: newProduct,
    });
  }
);
app.get(
  "/company/:companyId/products/:productId",
  [
    param("companyId")
      .isInt()
      .withMessage("ID da empresa deve ser um número inteiro"),
    param("productId")
      .isInt()
      .withMessage("ID do produto deve ser um número inteiro"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { companyId, productId } = req.params;
    const company = await buscar("company");
    const company_ = company.find((c) => c.id === parseInt(companyId));
    if (!company_) {
      return res.status(404).send({ message: "Empresa não encontrada" });
    }
    if (!company_.products) company_.products = [];
    const product = company_.products.find(
      (p) => p.productId === parseInt(productId)
    );
    if (!product) {
      return res.status(404).send({ message: "Produto não encontrado" });
    }
    res.status(200).send(product);
  }
);
app.put(
  "/company/:companyId/products/:productId",
  [
    param("companyId")
      .isInt()
      .withMessage("ID da empresa deve ser um número inteiro"),
    param("productId")
      .isInt()
      .withMessage("ID do produto deve ser um número inteiro"),
    body("productName")
      .optional()
      .notEmpty()
      .withMessage("Nome do produto não pode ser vazio"),
    body("productDescription")
      .optional()
      .notEmpty()
      .withMessage("Descrição do produto não pode ser vazia"),
    body("price")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Preço deve ser um número inteiro positivo"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { companyId, productId } = req.params;
    const company = await buscar("company");
    const company_ = company.find((c) => c.id === parseInt(companyId));
    if (!company_) {
      return res.status(404).send({ message: "Empresa não encontrada" });
    }
    if (!company_.products) company_.products = [];
    const productIndex = company_.products.findIndex(
      (p) => p.productId === parseInt(productId)
    );
    if (productIndex === -1) {
      return res.status(404).send({ message: "Produto não encontrado" });
    }

    const product = company_.products[productIndex];
    const { productName, productDescription, price } = req.body;
    if (productName) product.productName = productName;
    if (productDescription) product.productDescription = productDescription;
    if (price) product.price = price;

    await db
      .ref(`company/${companyId - 1}/products/${productId - 1}`)
      .set(product);

    res.status(200).send({
      message: "Produto atualizado com sucesso",
      product,
    });
  }
);
app.delete(
  "/company/:companyId/products/:productId",
  [
    param("companyId")
      .isInt()
      .withMessage("ID da empresa deve ser um número inteiro"),
    param("productId")
      .isInt()
      .withMessage("ID do produto deve ser um número inteiro"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const company = await buscar("company");
    const { companyId, productId } = req.params;
    const company_ = company.find((c) => c.id === parseInt(companyId));
    if (!company_) {
      return res.status(404).send({ message: "Empresa não encontrada" });
    }
    if (!company_.products) company_.products = [];
    const productIndex = company_.products.findIndex(
      (p) => p.productId === parseInt(productId)
    );
    if (productIndex === -1) {
      return res.status(404).send({ message: "Produto não encontrado" });
    }

    company_.products.splice(productIndex, 1);

    await db.ref(`company/${companyId - 1}`).set(company_);

    res.status(200).send({ message: "Produto removido com sucesso" });
  }
);

// //

// // EMPLOYEES
app.get(
  "/company/:companyId/employees",
  [
    param("companyId")
      .isInt()
      .withMessage("ID da empresa deve ser um número inteiro"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const company = await buscar("company");
    const { companyId, productId } = req.params;
    const company_ = company.find((c) => c.id === parseInt(companyId));
    if (!company_) {
      return res.status(404).send({ message: "Empresa não encontrada" });
    }
    if (!company_.employees) company_.employees = [];

    const employee = company_.employees;

    res.status(200).send(employee);
  }
);
app.post(
  "/company/:companyId/employees",
  [
    param("companyId")
      .isInt()
      .withMessage("ID da empresa deve ser um número inteiro"),
    body("name").notEmpty().withMessage("name do produto é obrigatório"),
    body("position")
      .notEmpty()
      .withMessage("position do produto é obrigatória"),
    body("email")
      .isEmail()
      .withMessage("Deve ser um email válido")
      .notEmpty()
      .withMessage("O campo email é obrigatório"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const company = await buscar("company");
    const { companyId } = req.params;
    const company_ = company.find((c) => c.id === parseInt(companyId));
    if (!company_) {
      return res.status(404).send({ message: "Empresa não encontrada" });
    }

    const { name, position, email } = req.body;
    if (!company_.employees) company_.employees = [];

    const verify_name = company_.employees.find(
      (c) => c.name.trim().toLowerCase() === name.trim().toLowerCase()
    );
    if (verify_name) {
      return res
        .status(400)
        .send({ message: `${name} já existe nos Employees.` });
    }
    if (company_.employees.length > 10) {
      company_.employees.splice(0, 5); // Remove os 10 primeiros
    }
    const employeeId = company_.employees.length + 1; // Simples ID incremental
    const newProduct = { employeeId, name, position, email };
    company_.employees.push(newProduct);
    await db.ref(`company/${companyId - 1}`).set(company_);
    res.status(201).send({
      message: "Funcionário(q) adicionado(a) com sucesso",
      employees: newProduct,
    });
  }
);

app.get(
  "/company/:companyId/employees/:employeeId",
  [
    param("companyId")
      .isInt()
      .withMessage("ID da empresa deve ser um número inteiro"),
    param("employeeId")
      .isInt()
      .withMessage("ID do funcionário deve ser um número inteiro"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { employeeId, companyId } = req.params;
    const company = await buscar("company");
    const company_ = company.find((c) => c.id === parseInt(employeeId));
    if (!company_) {
      return res.status(404).send({ message: "Empresa não encontrada" });
    }

    if (!company_.employees) company_.employees = [];

    const employee = company_.employees.find(
      (e) => e.employeeId === parseInt(employeeId)
    );
    if (!employee) {
      return res.status(404).send({ message: "Funcionário não encontrado" });
    }

    res.status(200).send(employee);
  }
);
app.put(
  "/company/:companyId/employees/:employeeId",
  [
    param("companyId")
      .isInt()
      .withMessage("ID da empresa deve ser um número inteiro"),
    param("employeeId")
      .isInt()
      .withMessage("ID do employeeId deve ser um número inteiro"),
    body("name")
      .optional()
      .notEmpty()
      .withMessage("name do produto não pode ser vazio"),
    body("position")
      .optional()
      .notEmpty()
      .withMessage("position do produto não pode ser vazia"),
    body("email").optional().isEmail().withMessage("Deve ser um email válido"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const company = await buscar("company");
    const { companyId, employeeId } = req.params;
    const company_ = company.find((c) => c.id === parseInt(companyId));
    if (!company_) {
      return res.status(404).send({ message: "Empresa não encontrada" });
    }
    if (!company_.employees) company_.employees = [];

    const employeeIndex = company_.employees.findIndex(
      (p) => p.employeeId === parseInt(employeeId)
    );
    if (employeeIndex === -1) {
      return res.status(404).send({ message: "Funcionário não encontrado" });
    }

    const employee = company_.employees[employeeIndex];
    const { name, position, email } = req.body;
    if (name) employee.name = name;
    if (position) employee.position = position;
    if (email) employee.email = email;

    await db
      .ref(`company/${companyId - 1}/employees/${employeeId - 1}`)
      .set(employee);
    res.status(200).send({
      message: `Funcionário(a) ${name} atualizado.`,
      employee,
    });
  }
);
app.delete(
  "/company/:companyId/employees/:employeeId",
  [
    param("companyId")
      .isInt()
      .withMessage("ID da empresa deve ser um número inteiro"),
    param("employeeId")
      .isInt()
      .withMessage("ID do produto deve ser um número inteiro"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const company = await buscar("company");
    const { companyId, employeeId } = req.params;
    const company_ = company.find((c) => c.id === parseInt(companyId));
    if (!company_) {
      return res.status(404).send({ message: "Empresa não encontrada" });
    }
    if (!company_.employees) company_.employees = [];

    const productIndex = company_.employees.findIndex(
      (p) => p.employeeId === parseInt(employeeId)
    );
    if (productIndex === -1) {
      return res.status(404).send({ message: "Funcionário(a) não encontrado" });
    }

    company_.employees.splice(productIndex, 1);
    await db.ref(`company/${companyId - 1}`).set(company_);

    res.status(200).send({ message: "Funcionário(a) removido com sucesso" });
  }
);
// //

// // SERVICE
app.get(
  "/company/:companyId/services",
  [
    param("companyId")
      .isInt()
      .withMessage("ID da empresa deve ser um número inteiro"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const company = await buscar("company");
    const { companyId, productId } = req.params;
    const company_ = company.find((c) => c.id === parseInt(companyId));
    if (!company_) {
      return res.status(404).send({ message: "Empresa não encontrada" });
    }
    if (!company_.services) company_.services = [];

    const service = company_.services;

    res.status(200).send(service);
  }
);
app.post(
  "/company/:companyId/services",
  [
    param("companyId")
      .isInt()
      .withMessage("ID da empresa deve ser um número inteiro"),
    body("serviceName")
      .notEmpty()
      .withMessage("serviceName do produto é obrigatório"),
    body("serviceDescription")
      .notEmpty()
      .withMessage("serviceDescription do produto é obrigatória"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const company = await buscar("company");
    const { companyId } = req.params;
    const company_ = company.find((c) => c.id === parseInt(companyId));
    if (!company_) {
      return res.status(404).send({ message: "Empresa não encontrada" });
    }

    const { serviceName, serviceDescription } = req.body;

    if (!company_.services) company_.services = [];

    const verify_name = company_.services.find(
      (c) =>
        c.serviceName.trim().toLowerCase() === serviceName.trim().toLowerCase()
    );
    if (verify_name) {
      return res
        .status(400)
        .send({ message: `${serviceName} já existe nos Serviços.` });
    }
    if (company_.services.length > 10) {
      company_.services.splice(0, 5); // Remove os 10 primeiros
    }

    const serviceId = company_.services.length + 1; // Simples ID incremental
    const newProduct = { serviceId, serviceName, serviceDescription };
    company_.services.push(newProduct);
    await db.ref(`company/${companyId - 1}`).set(company_);
    res.status(201).send({
      message: "Serviço adicionado com sucesso",
      services: newProduct,
    });
  }
);
app.get(
  "/company/:companyId/services/:serviceId",
  [
    param("companyId")
      .isInt()
      .withMessage("ID da empresa deve ser um número inteiro"),
    param("serviceId")
      .isInt()
      .withMessage("ID do serviço deve ser um número inteiro"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { serviceId, companyId } = req.params;
    const company = await buscar("company");
    const company_ = company.find((c) => c.id === parseInt(serviceId));
    if (!company_) {
      return res.status(404).send({ message: "Empresa não encontrada" });
    }

    if (!company_.services) company_.services = [];
    const service = company_.services.find(
      (s) => s.serviceId === parseInt(serviceId)
    );
    if (!service) {
      return res.status(404).send({ message: "Serviço não encontrado" });
    }

    res.status(200).send(service);
  }
);
app.put(
  "/company/:companyId/services/:serviceId",
  [
    param("companyId")
      .isInt()
      .withMessage("ID da empresa deve ser um número inteiro"),
    param("serviceId")
      .isInt()
      .withMessage("ID do serviceId deve ser um número inteiro"),
    body("serviceName")
      .optional()
      .notEmpty()
      .withMessage("serviceName do serviço não pode ser vazio"),
    body("serviceDescription")
      .optional()
      .notEmpty()
      .withMessage("Descrição do serviço não pode ser vazia"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { serviceName, serviceDescription } = req.body;
    const company = await buscar("company");
    const { companyId, serviceId } = req.params;
    const company_ = company.find((c) => c.id === parseInt(companyId));
    if (!company_) {
      return res.status(404).send({ message: "Empresa não encontrada" });
    }
    if (!company_.services) company_.services = [];
    const serviceIndex = company_.services.findIndex(
      (p) => p.serviceId === parseInt(serviceId)
    );
    if (serviceIndex === -1) {
      return res.status(404).send({ message: "Serviço não encontrado" });
    }
    const verify_name = company_.services.find(
      (c) =>
        c.serviceName.trim().toLowerCase() === serviceName.trim().toLowerCase()
    );
    if (verify_name) {
      return res
        .status(400)
        .send({ message: `${serviceName} já existe nos Serviços.` });
    }

    const service = company_.services[serviceIndex];
    if (serviceName) service.serviceName = serviceName;
    if (serviceDescription) service.serviceDescription = serviceDescription;
    await db
      .ref(`company/${companyId - 1}/services/${serviceId - 1}`)
      .set(service);
    res.status(200).send({
      message: `Serviço ${serviceName} atualizado.`,
      service,
    });
  }
);
app.delete(
  "/company/:companyId/services/:serviceId",
  [
    param("companyId")
      .isInt()
      .withMessage("ID da empresa deve ser um número inteiro"),
    param("serviceId")
      .isInt()
      .withMessage("ID do serviceId deve ser um número inteiro"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const company = await buscar("company");
    const { companyId, serviceId } = req.params;
    const company_ = company.find((c) => c.id === parseInt(companyId));
    if (!company_) {
      return res.status(404).send({ message: "Empresa não encontrada" });
    }

    const productIndex = company_.services.findIndex(
      (p) => p.serviceId === parseInt(serviceId)
    );
    if (productIndex === -1) {
      return res.status(404).send({ message: "Serviço não encontrado" });
    }

    company_.services.splice(productIndex, 1);
    await db.ref(`company/${companyId - 1}`).set(company_);

    res.status(200).send({ message: "Serviço removido com sucesso" });
  }
);

// // MERCADO
app.get("/mercado", (req, res) => {
  dbJSONget(res, "mercado");
});
app.post(
  "/mercado",
  [
    body("nome").not().isEmpty().withMessage("Nome é obrigatório"),
    body("cnpj")
      .not()
      .isEmpty()
      .withMessage("CNPJ é obrigatório")
      .isLength({ min: 14, max: 14 })
      .withMessage("CNPJ deve ter 14 dígitos"),
    body("endereco").not().isEmpty().withMessage("Endereço é obrigatório"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const mercadoSnapshot = await db.ref("mercado").once("value");
    const mercado = mercadoSnapshot.val()
      ? Object.values(mercadoSnapshot.val())
      : [];

    const verify_name = mercado.find(
      (c) =>
        c.nome &&
        req.body.nome &&
        c.nome.trim().toLowerCase() === req.body.nome.trim().toLowerCase()
    );
    if (verify_name) {
      return res.status(400).send({
        message: `O nome ${req.body.nome} já existe na lista de Mercados.`,
      });
    }

    // Adicionando todos os campos de produtos com suas subcategorias inicialmente vazias
    const novoMercado = {
      id: mercado.length + 1,
      nome: req.body.nome,
      cnpj: req.body.cnpj,
      endereco: req.body.endereco,
      produtos: {
        hortifruit: [{ frutas: [] }, { legumes: [] }],
        padaria: [{ doces: [] }, { salgados: [] }],
        acougue: [{ bovinos: [] }, { suinos: [] }, { aves: [] }],
        peixaria: [{ peixes: [] }, { frutos_do_mar: [] }],
        frios: [{ queijos: [] }, { embutidos: [] }, { outros: [] }],
        mercearia: [
          { graos_cereais: [] },
          { massas: [] },
          { farinhas: [] },
          { conservados_enlatados: [] },
          { oleos: [] },
          { temperos_condimentos: [] },
        ],
        bebidas: [{ com_alcool: [] }, { sem_alcool: [] }],
        higienelimpeza: [{ higiene: [] }, { limpeza: [] }],
      },
    };

    if (mercado.length > 50) {
      mercado.splice(0, 10); // Remove os 10 primeiros
    }

    mercado.push(novoMercado);
    await db.ref("mercado").set(mercado);

    res.status(201).send({
      message: `Mercado '${novoMercado.nome}' adicionado com sucesso com todas as subcategorias iniciais vazias!`,
      novoMercado,
    });
  }
);

app.get(
  "/mercado/:mercadoId",
  [
    param("mercadoId")
      .isInt()
      .withMessage("ID do Mercado deve ser um número inteiro"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const mercado = await buscar("mercado");
    const mercado_ = mercado.find(
      (m) => m.id === parseInt(req.params.mercadoId)
    );
    if (!mercado_) {
      return res
        .status(404)
        .send("O mercado com o ID fornecido não foi encontrado.");
    }
    res.send(mercado_);
  }
);
app.get(
  "/mercado/:mercadoId/produtos",
  [
    param("mercadoId")
      .isInt()
      .withMessage("ID do Mercado deve ser um número inteiro"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const mercado = await buscar("mercado");
    const mercado_ = mercado.find(
      (m) => m.id === parseInt(req.params.mercadoId)
    );
    if (!mercado_) {
      return res
        .status(404)
        .send("O mercado com o ID fornecido não foi encontrado.");
    }
    if (!mercado_.produtos) {
      mercado_.produtos = {
        hortifruit: [
          {
            frutas: [],
          },
          {
            legumes: [],
          },
        ],
        padaria: [
          {
            doces: [],
          },
          {
            salgados: [],
          },
        ],
        acougue: [
          {
            bovinos: [],
          },
          {
            suinos: [],
          },
          {
            aves: [],
          },
        ],
        peixaria: [
          {
            peixes: [],
          },
          {
            frutos_do_mar: [],
          },
        ],
        frios: [
          {
            queijos: [],
          },
          {
            embutidos: [],
          },
          {
            outros: [],
          },
        ],
        mercearia: [
          {
            graos_cereais: [],
          },
          {
            massas: [],
          },
          {
            farinhas: [],
          },
          {
            conservados_enlatados: [],
          },
          {
            oleos: [],
          },
          {
            temperos_condimentos: [],
          },
        ],
        bebidas: [
          {
            com_alcool: [],
          },
          {
            sem_alcool: [],
          },
        ],
        higienelimpeza: [
          {
            higiene: [],
          },
          {
            limpeza: [],
          },
        ],
      };
    }

    res.send(mercado_.produtos);
  }
);
app.put(
  "/mercado/:mercadoId",
  [
    param("mercadoId")
      .isInt()
      .withMessage("ID do Mercado deve ser um número inteiro"),
    body("nome")
      .optional()
      .isString()
      .withMessage("Nome deve ser uma string válida"),
    body("cnpj")
      .optional()
      .isString()
      .withMessage("CNPJ deve ser uma string válida"),
    body("endereco")
      .optional()
      .isString()
      .withMessage("Endereço deve ser uma string válida"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const mercadoId = parseInt(req.params.mercadoId);
    const mercado = await buscar("mercado");
    const index = mercado.findIndex((m) => m.id === mercadoId);
    if (index === -1) {
      return res
        .status(404)
        .send("O mercado com o ID fornecido não foi encontrado.");
    }

    const updatedMercado = {
      ...mercado[index],
      ...req.body,
    };

    mercado[index] = updatedMercado;
    await db.ref(`mercado/${mercadoId - 1}`).set(updatedMercado);
    res.send({
      message: `Mercado com ID ${req.params.mercadoId} atualizado com sucesso.`,
      updatedMercado,
    });
  }
);
app.delete(
  "/mercado/:mercadoId",
  [
    param("mercadoId")
      .isInt()
      .withMessage("O ID do mercado precisa ser informado"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const mercado = await buscar("mercado");

    const mercadoId = parseInt(req.params.mercadoId);

    // Procurando o mercado pelo ID
    const index = mercado.findIndex((m) => m.id === mercadoId);

    if (!mercado[index]) {
      return res
        .status(404)
        .send("O mercado com o ID fornecido não foi encontrado.");
    }
    // Removendo o mercado

    res.status(200).json({
      message: `Mercado com ID ${mercadoId} foi removido com sucesso.`,
    });
    mercado.splice(index, 1);
    await db.ref(`mercado/${mercadoId - 1}`).set(mercado);
  }
);
// // HORTIFRUIT
const postMercado = async (
  categoria = "padaria",
  item = "salgados",
  id,
  nome,
  valor,
  res
) => {
  let verify_name;

  const mercado = await buscar("mercado");

  // Encontrando o mercado com o ID fornecido
  const mercado_ = mercado.find((m) => m.id === id);
  if (!mercado_) {
    return res.status(404).json({ message: "Mercado não encontrado." });
  }

  // Inicializa produtos se não existir
  if (!mercado_.produtos) {
    mercado_.produtos = {};
  }

  // Inicializa a categoria se não existir
  if (!mercado_.produtos[categoria]) {
    mercado_.produtos[categoria] = [];
  }

  // Encontrar o índice da posição onde a categoria está
  const categoriaIndex = mercado_.produtos[categoria].findIndex((cat) =>
    cat.hasOwnProperty(item)
  );

  // Se não encontrar a categoria, cria uma nova
  if (categoriaIndex === -1) {
    mercado_.produtos[categoria].push({ [item]: [] });
  }

  // Atualizar o índice da categoria após a possível adição
  const updatedCategoriaIndex = mercado_.produtos[categoria].findIndex((cat) =>
    cat.hasOwnProperty(item)
  );

  // Referência ao array de produtos para facilitar a manipulação
  const produtosArray =
    mercado_.produtos[categoria][updatedCategoriaIndex][item];

  // Verificar se o nome do produto já existe
  verify_name = produtosArray.find(
    (c) => c.nome.trim().toLowerCase() === nome.trim().toLowerCase()
  );

  if (verify_name) {
    return res.status(400).send({
      message: `O nome ${nome} já existe na lista de ${item}.`,
    });
  }

  // Calcular o novo ID do produto
  const newId =
    produtosArray.length > 0
      ? produtosArray[produtosArray.length - 1].id + 1
      : 1;

  // Adicionar o produto
  const product_item = {
    id: newId,
    nome,
    valor,
  };

  produtosArray.push(product_item);
  // Atualizar o mercado no Firebase
  await db.ref(`mercado/${id - 1}`).set(mercado_);

  res.status(201).send({
    message: `Produto ${nome} adicionado com sucesso aos ${item} do mercado ${mercado_.nome} com valor R$ ${valor}.`,
    product_item,
  });
};

function removerObjetosVazios(array) {
  for (let i = array.length - 1; i >= 0; i--) {
    const item = array[i];

    // Verificar se o item é um objeto vazio
    if (
      typeof item === "object" &&
      item !== null &&
      Object.keys(item).length === 0
    ) {
      array.splice(i, 1);
    }
    // Verificar se o item é um array e chamar a função recursivamente
    else if (Array.isArray(item)) {
      removerObjetosVazios(item);
      // Após remover objetos vazios do array aninhado, verificar se ele ficou vazio
      if (item.length === 0) {
        array.splice(i, 1);
      }
    }
  }
}
const getMercado = async (categoria, item, id, res) => {
  const mercado = await buscar("mercado");
  // Encontrando o mercado com o ID fornecido
  const mercado_ = mercado.find((m) => m.id === id);
  if (!mercado_) {
    return res.status(404).json({ message: "Mercado não encontrado." });
  }
  if (!mercado_.produtos) {
    mercado_.produtos = {};
    if (!mercado_.produtos[categoria]) {
      mercado_.produtos[categoria] = mercado_.produtos[categoria] = [];
      mercado_.produtos = {
        [categoria]: [
          {
            [item]: [],
          },
        ],
      };
    } else if (mercado_.produtos[categoria][position]) {
      mercado_.produtos = {
        [categoria]: [
          {
            [item]: [],
          },
        ],
      };
    }
  }
  const products = await buscar(`mercado/${id - 1}/produtos/${categoria}`);
  if (!products) {
    return res
      .status(404)
      .json({ message: `Produtos ${categoria} não encontrados.` });
  }
  // Encontrar o objeto legumes dentro de products
  const produto = products.find((cat) => cat.hasOwnProperty(item));
  if (!produto) {
    return res.status(404).json({ message: `A key ${item} ainda não existe` });
  }
  const frutas = produto;
  if (!frutas || frutas.length === 0) {
    return res.status(404).send({
      message: `Não há ${item} cadastradas neste mercado.`,
    });
  }
  const produtos = produto;
  res.status(200).json({
    message: `Lista de ${item} do mercado ${mercado_.nome}`,
    produtos,
  });
};
const deleteMercado = async (categoria, item_cat, id, id_item, res) => {
  const hortifruit = await buscar(`mercado/${id - 1}/produtos/${categoria}`);
  if (!hortifruit) {
    return res
      .status(404)
      .json({ message: `Produtos ${categoria} não encontrados.` });
  }
  // Encontrar o objeto legumes dentro de hortifruit
  const produto = hortifruit.find((item) => item.hasOwnProperty(item_cat));
  if (!produto) {
    return res
      .status(404)
      .json({ message: `A key ${item_cat} ainda não existe` });
  }

  // Encontrar o índice do legume específico a ser removido
  const index = produto[item_cat].findIndex((m) => m.id === id_item);
  if (index === -1) {
    return res.status(404).json({
      message: `O ${item_cat} com o ID fornecido não foi encontrado.`,
    });
  }

  // Remover o legume do array
  produto[item_cat].splice(index, 1);

  // Atualizar a lista de produtos hortifruit no Firebase
  await db.ref(`mercado/${id - 1}/produtos/${categoria}`).set(hortifruit);

  res.send({
    message: `${item_cat} com ID ${id_item} foi removido com sucesso.`,
  });
};
app.post(
  "/mercado/:id/produtos/hortifruit/frutas",
  [
    param("id").isInt().withMessage("ID do mercado deve ser um número inteiro"),
    body("nome").not().isEmpty().withMessage("Nome é obrigatório"),
    body("valor")
      .isInt({ min: 1 })
      .withMessage("Valor deve ser um número inteiro e não negativo"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const id_mercado = parseInt(req.params.id);
    // Adicionando o novo produto na categoria de frutas do hortifruit do mercado especificado
    const { nome, valor } = req.body;
    await postMercado("hortifruit", "frutas", id_mercado, nome, valor, res);
  }
);
app.get(
  "/mercado/:id/produtos/hortifruit/frutas",
  [param("id").isInt().withMessage("ID do mercado deve ser um número inteiro")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const mercadoId = parseInt(req.params.id);
    await getMercado("hortifruit", "frutas", mercadoId, res);
  }
);
app.delete(
  "/mercado/:id/produtos/hortifruit/frutas/:frutaId",
  [
    param("id").isInt().withMessage("ID do mercado deve ser um número inteiro"),
    param("frutaId")
      .isInt()
      .withMessage("ID do mercado deve ser um número inteiro"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const mercadoId = parseInt(req.params.id);
    const frutaId = parseInt(req.params.frutaId);

    await deleteMercado("hortifruit", "frutas", mercadoId, frutaId, res);

    // Recuperando a lista de frutas do hortifruit do mercado especificado
  }
);
// // LEGUMES
app.post(
  "/mercado/:id/produtos/hortifruit/legumes",
  [
    param("id").isInt().withMessage("ID do mercado deve ser um número inteiro"),
    body("nome").not().isEmpty().withMessage("Nome é obrigatório"),
    body("valor")
      .isInt({ min: 1 })
      .withMessage("Valor deve ser um número inteiro e não negativo"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const id_mercado = parseInt(req.params.id);
    // Adicionando o novo produto na categoria de legumes do hortifruit do mercado especificado
    const { nome, valor } = req.body;
    await postMercado("hortifruit", "legumes", id_mercado, nome, valor, res);
  }
);
app.get(
  "/mercado/:id/produtos/hortifruit/legumes",
  [param("id").isInt().withMessage("ID do mercado deve ser um número inteiro")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const mercadoId = parseInt(req.params.id);
    await getMercado("hortifruit", "legumes", mercadoId, res);
  }
);
app.delete(
  "/mercado/:id/produtos/hortifruit/legumes/:legumesId",
  [
    param("id").isInt().withMessage("ID do mercado deve ser um número inteiro"),
    param("legumesId")
      .isInt()
      .withMessage("ID do legume deve ser um número inteiro"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const mercadoId = parseInt(req.params.id);
    const legumesId = parseInt(req.params.legumesId);
    await deleteMercado("hortifruit", "legumes", mercadoId, legumesId, res);

    // Buscar os produtos hortifruit
  }
);
// // PADARIA
app.post(
  "/mercado/:id/produtos/padaria/doces",
  [
    param("id").isInt().withMessage("ID do mercado deve ser um número inteiro"),
    body("nome").not().isEmpty().withMessage("Nome é obrigatório"),
    body("valor")
      .isInt({ min: 1 })
      .withMessage("Valor deve ser um número inteiro e não negativo"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const id_mercado = parseInt(req.params.id);
    const positionIndex = await buscar(
      `mercado/${id_mercado - 1}/produtos/padaria`
    );
    const index =
      positionIndex.length === 0
        ? positionIndex.length
        : positionIndex.length === 1
        ? 1
        : positionIndex.length + 1;

    // Adicionando o novo produto na categoria de frutas do padaria do mercado especificado
    const { nome, valor } = req.body;
    await postMercado("padaria", "doces", id_mercado, nome, valor, res);
  }
);
app.get(
  "/mercado/:id/produtos/padaria/doces",
  [param("id").isInt().withMessage("ID do mercado deve ser um número inteiro")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const mercadoId = parseInt(req.params.id);
    await getMercado("padaria", "doces", mercadoId, res);
  }
);
app.delete(
  "/mercado/:id/produtos/padaria/doces/:docesId",
  [
    param("id").isInt().withMessage("ID do mercado deve ser um número inteiro"),
    param("docesId")
      .isInt()
      .withMessage("ID do mercado deve ser um número inteiro"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const mercadoId = parseInt(req.params.id);
    const frutaId = parseInt(req.params.docesId);

    await deleteMercado("padaria", "doces", mercadoId, frutaId, res);
  }
);

// // padaria salgado

app.post(
  "/mercado/:id/produtos/padaria/salgados",
  [
    param("id").isInt().withMessage("ID do mercado deve ser um número inteiro"),
    body("nome").not().isEmpty().withMessage("Nome é obrigatório"),
    body("valor")
      .isInt({ min: 1 })
      .withMessage("Valor deve ser um número inteiro e não negativo"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Encontrando o mercado com o ID fornecido
    const id_mercado = parseInt(req.params.id);
    const positionIndex = await buscar(
      `mercado/${id_mercado - 1}/produtos/padaria`
    );
    // Adicionando o novo produto na categoria de salgados do padaria do mercado especificado
    const { nome, valor } = req.body;
    await postMercado("padaria", "salgados", id_mercado, nome, valor, res);
  }
);
app.get(
  "/mercado/:id/produtos/padaria/salgados",
  [param("id").isInt().withMessage("ID do mercado deve ser um número inteiro")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const mercadoId = parseInt(req.params.id);
    await getMercado("padaria", "salgados", mercadoId, res);
  }
);
app.delete(
  "/mercado/:id/produtos/padaria/salgados/:salgadosId",
  [
    param("id").isInt().withMessage("ID do mercado deve ser um número inteiro"),
    param("salgadosId")
      .isInt()
      .withMessage("ID do mercado deve ser um número inteiro"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const mercadoId = parseInt(req.params.id);
    const salgadosId = parseInt(req.params.salgadosId);

    await deleteMercado("padaria", "salgados", mercadoId, salgadosId, res);
  }
);
// //  "acougue": [{ "bovinos": [] }, { "suinos": [] }, { "aves": [] }],
app.post(
  "/mercado/:id/produtos/acougue/bovinos",
  [
    param("id").isInt().withMessage("ID do mercado deve ser um número inteiro"),
    body("nome").not().isEmpty().withMessage("Nome é obrigatório"),
    body("valor")
      .isInt({ min: 1 })
      .withMessage("Valor deve ser um número inteiro e não negativo"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const id_mercado = parseInt(req.params.id);
    // Adicionando o novo produto na categoria de bovinos do acougue do mercado especificado
    const { nome, valor } = req.body;
    await postMercado("acougue", "bovinos", id_mercado, nome, valor, res);
  }
);
app.get(
  "/mercado/:id/produtos/acougue/bovinos",
  [param("id").isInt().withMessage("ID do mercado deve ser um número inteiro")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const mercadoId = parseInt(req.params.id);
    await getMercado("acougue", "bovinos", mercadoId, res);
  }
);
app.delete(
  "/mercado/:id/produtos/acougue/bovinos/:bovinosId",
  [
    param("id").isInt().withMessage("ID do mercado deve ser um número inteiro"),
    param("bovinosId")
      .isInt()
      .withMessage("ID do mercado deve ser um número inteiro"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const mercadoId = parseInt(req.params.id);
    const bovinosId = parseInt(req.params.bovinosId);

    await deleteMercado("acougue", "bovinos", mercadoId, bovinosId, res);
  }
);

// // suinos
app.post(
  "/mercado/:id/produtos/acougue/suinos",
  [
    param("id").isInt().withMessage("ID do mercado deve ser um número inteiro"),
    body("nome").not().isEmpty().withMessage("Nome é obrigatório"),
    body("valor")
      .isInt({ min: 1 })
      .withMessage("Valor deve ser um número inteiro e não negativo"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const id_mercado = parseInt(req.params.id);
    // Adicionando o novo produto na categoria de frutas do hortifruit do mercado especificado
    const { nome, valor } = req.body;
    await postMercado("acougue", "suinos", id_mercado, nome, valor, res);
  }
);
app.get(
  "/mercado/:id/produtos/acougue/suinos",
  [param("id").isInt().withMessage("ID do mercado deve ser um número inteiro")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const mercadoId = parseInt(req.params.id);
    await getMercado("acougue", "suinos", mercadoId, res);
  }
);
app.delete(
  "/mercado/:id/produtos/acougue/suinos/:suinoId",
  [
    param("id").isInt().withMessage("ID do mercado deve ser um número inteiro"),
    param("suinoId")
      .isInt()
      .withMessage("ID do mercado deve ser um número inteiro"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const mercadoId = parseInt(req.params.id);
    const suinoId = parseInt(req.params.suinoId);
    await deleteMercado("acougue", "suinos", mercadoId, suinoId, res);
  }
);

// // aves
app.post(
  "/mercado/:id/produtos/acougue/aves",
  [
    param("id").isInt().withMessage("ID do mercado deve ser um número inteiro"),
    body("nome").not().isEmpty().withMessage("Nome é obrigatório"),
    body("valor")
      .isInt({ min: 1 })
      .withMessage("Valor deve ser um número inteiro e não negativo"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const id_mercado = parseInt(req.params.id);
    // Adicionando o novo produto na categoria de legumes do hortifruit do mercado especificado
    const { nome, valor } = req.body;
    await postMercado("acougue", "aves", id_mercado, nome, valor, res);
  }
);
app.get(
  "/mercado/:id/produtos/acougue/aves",
  [param("id").isInt().withMessage("ID do mercado deve ser um número inteiro")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const mercadoId = parseInt(req.params.id);
    await getMercado("acougue", "aves", mercadoId, res);
  }
);
app.delete(
  "/mercado/:id/produtos/acougue/aves/:avesId",
  [
    param("id").isInt().withMessage("ID do mercado deve ser um número inteiro"),
    param("avesId")
      .isInt()
      .withMessage("ID do mercado deve ser um número inteiro"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const mercadoId = parseInt(req.params.id);
    const avesId = parseInt(req.params.avesId);
    await deleteMercado("acougue", "aves", mercadoId, avesId, res);
  }
);
// // peixaria
app.post(
  "/mercado/:id/produtos/peixaria/peixes",
  [
    param("id").isInt().withMessage("ID do mercado deve ser um número inteiro"),
    body("nome").not().isEmpty().withMessage("Nome é obrigatório"),
    body("valor")
      .isInt({ min: 1 })
      .withMessage("Valor deve ser um número inteiro e não negativo"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const id_mercado = parseInt(req.params.id);
    // Adicionando o novo produto na categoria de legumes do hortifruit do mercado especificado
    const { nome, valor } = req.body;
    await postMercado("peixaria", "peixes", id_mercado, nome, valor, res);
  }
);
app.get(
  "/mercado/:id/produtos/peixaria/peixes",
  [param("id").isInt().withMessage("ID do mercado deve ser um número inteiro")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const mercadoId = parseInt(req.params.id);
    await getMercado("peixaria", "peixes", mercadoId, res);
  }
);
app.delete(
  "/mercado/:id/produtos/peixaria/peixes/:peixeId",
  [
    param("id").isInt().withMessage("ID do mercado deve ser um número inteiro"),
    param("peixeId")
      .isInt()
      .withMessage("ID do mercado deve ser um número inteiro"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const mercadoId = parseInt(req.params.id);
    const peixeId = parseInt(req.params.peixeId);
    await deleteMercado("peixaria", "peixes", mercadoId, peixeId, res);
  }
);
// //

// //  "frios": [{ "queijos": [] }, { "embutidos": [] }, { "outros": [] }],
app.post(
  "/mercado/:id/produtos/frios/queijos",
  [
    param("id").isInt().withMessage("ID do mercado deve ser um número inteiro"),
    body("nome").not().isEmpty().withMessage("Nome é obrigatório"),
    body("valor")
      .isInt({ min: 1 })
      .withMessage("Valor deve ser um número inteiro e não negativo"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const id_mercado = parseInt(req.params.id);
    // Adicionando o novo produto na categoria de legumes do hortifruit do mercado especificado
    const { nome, valor } = req.body;
    await postMercado("frios", "queijos", id_mercado, nome, valor, res);
  }
);
app.get(
  "/mercado/:id/produtos/frios/queijos",
  [param("id").isInt().withMessage("ID do mercado deve ser um número inteiro")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const mercadoId = parseInt(req.params.id);
    await getMercado("frios", "queijos", mercadoId, res);
  }
);
app.delete(
  "/mercado/:id/produtos/frios/queijos/:queijosId",
  [
    param("id").isInt().withMessage("ID do mercado deve ser um número inteiro"),
    param("queijosId")
      .isInt()
      .withMessage("ID do mercado deve ser um número inteiro"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const mercadoId = parseInt(req.params.id);
    const queijosId = parseInt(req.params.queijosId);
    await deleteMercado("frios", "queijos", mercadoId, queijosId, res);
  }
);

// // embutidos
app.post(
  "/mercado/:id/produtos/frios/embutidos",
  [
    param("id").isInt().withMessage("ID do mercado deve ser um número inteiro"),
    body("nome").not().isEmpty().withMessage("Nome é obrigatório"),
    body("valor")
      .isInt({ min: 1 })
      .withMessage("Valor deve ser um número inteiro e não negativo"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const id_mercado = parseInt(req.params.id);
    // Adicionando o novo produto na categoria de legumes do hortifruit do mercado especificado
    const { nome, valor } = req.body;
    await postMercado("frios", "embutidos", id_mercado, nome, valor, res);
  }
);
app.get(
  "/mercado/:id/produtos/frios/embutidos",
  [param("id").isInt().withMessage("ID do mercado deve ser um número inteiro")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const mercadoId = parseInt(req.params.id);
    await getMercado("frios", "embutidos", mercadoId, res);
  }
);
app.delete(
  "/mercado/:id/produtos/frios/embutidos/:embutidosId",
  [
    param("id").isInt().withMessage("ID do mercado deve ser um número inteiro"),
    param("embutidosId")
      .isInt()
      .withMessage("ID do mercado deve ser um número inteiro"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const mercadoId = parseInt(req.params.id);
    const embutidosId = parseInt(req.params.embutidosId);
    await deleteMercado("frios", "embutidos", mercadoId, embutidosId, res);
  }
);
// // outros
app.post(
  "/mercado/:id/produtos/frios/outros",
  [
    param("id").isInt().withMessage("ID do mercado deve ser um número inteiro"),
    body("nome").not().isEmpty().withMessage("Nome é obrigatório"),
    body("valor")
      .isInt({ min: 1 })
      .withMessage("Valor deve ser um número inteiro e não negativo"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const id_mercado = parseInt(req.params.id);
    // Adicionando o novo produto na categoria de legumes do hortifruit do mercado especificado
    const { nome, valor } = req.body;
    await postMercado("frios", "outros", id_mercado, nome, valor, res);
  }
);
app.get(
  "/mercado/:id/produtos/frios/outros",
  [param("id").isInt().withMessage("ID do mercado deve ser um número inteiro")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const mercadoId = parseInt(req.params.id);
    await getMercado("frios", "outros", mercadoId, res);
  }
);
app.delete(
  "/mercado/:id/produtos/frios/outros/:outrosId",
  [
    param("id").isInt().withMessage("ID do mercado deve ser um número inteiro"),
    param("outrosId")
      .isInt()
      .withMessage("ID do mercado deve ser um número inteiro"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const mercadoId = parseInt(req.params.id);
    const outrosId = parseInt(req.params.outrosId);
    await deleteMercado("frios", "outros", mercadoId, outrosId, res);
  }
);
// // frutos do mar
app.post(
  "/mercado/:id/produtos/peixaria/frutosDoMar",
  [
    param("id").isInt().withMessage("ID do mercado deve ser um número inteiro"),
    body("nome").not().isEmpty().withMessage("Nome é obrigatório"),
    body("valor")
      .isInt({ min: 1 })
      .withMessage("Valor deve ser um número inteiro e não negativo"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const id_mercado = parseInt(req.params.id);
    // Adicionando o novo produto na categoria de legumes do hortifruit do mercado especificado
    const { nome, valor } = req.body;
    await postMercado("peixaria", "frutosDoMar", id_mercado, nome, valor, res);
  }
);
app.get(
  "/mercado/:id/produtos/peixaria/frutosDoMar",
  [param("id").isInt().withMessage("ID do mercado deve ser um número inteiro")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const mercadoId = parseInt(req.params.id);
    await getMercado("peixaria", "frutosDoMar", mercadoId, res);
  }
);
app.delete(
  "/mercado/:id/produtos/peixaria/frutosDoMar/:frutosDoMarId",
  [
    param("id").isInt().withMessage("ID do mercado deve ser um número inteiro"),
    param("frutosDoMarId")
      .isInt()
      .withMessage("ID do mercado deve ser um número inteiro"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const mercadoId = parseInt(req.params.id);
    const frutosDoMarId = parseInt(req.params.frutosDoMarId);
    await deleteMercado(
      "peixaria",
      "frutosDoMar",
      mercadoId,
      frutosDoMarId,
      res
    );
  }
);
// // mercearia graos cereais
app.post(
  "/mercado/:id/produtos/mercearia/graosCereais",
  [
    param("id").isInt().withMessage("ID do mercado deve ser um número inteiro"),
    body("nome").not().isEmpty().withMessage("Nome é obrigatório"),
    body("valor")
      .isInt({ min: 1 })
      .withMessage("Valor deve ser um número inteiro e não negativo"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const id_mercado = parseInt(req.params.id);
    // Adicionando o novo produto na categoria de legumes do hortifruit do mercado especificado
    const { nome, valor } = req.body;
    await postMercado(
      "mercearia",
      "graosCereais",
      id_mercado,
      nome,
      valor,
      res
    );
  }
);
app.get(
  "/mercado/:id/produtos/mercearia/graosCereais",
  [param("id").isInt().withMessage("ID do mercado deve ser um número inteiro")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const mercadoId = parseInt(req.params.id);
    await getMercado("mercearia", "graosCereais", mercadoId, res);
  }
);
app.delete(
  "/mercado/:id/produtos/mercearia/graosCereais/:graosCereaisId",
  [
    param("id").isInt().withMessage("ID do mercado deve ser um número inteiro"),
    param("graosCereaisId")
      .isInt()
      .withMessage("ID do mercado deve ser um número inteiro"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const mercadoId = parseInt(req.params.id);
    const graosCereaisId = parseInt(req.params.graosCereaisId);
    await deleteMercado(
      "mercearia",
      "graosCereais",
      mercadoId,
      graosCereaisId,
      res
    );
  }
);

// // massas
app.post(
  "/mercado/:id/produtos/mercearia/massas",
  [
    param("id").isInt().withMessage("ID do mercado deve ser um número inteiro"),
    body("nome").not().isEmpty().withMessage("Nome é obrigatório"),
    body("valor")
      .isInt({ min: 1 })
      .withMessage("Valor deve ser um número inteiro e não negativo"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const id_mercado = parseInt(req.params.id);
    // Adicionando o novo produto na categoria de legumes do hortifruit do mercado especificado
    const { nome, valor } = req.body;
    await postMercado("mercearia", "massas", id_mercado, nome, valor, res);
  }
);
app.get(
  "/mercado/:id/produtos/mercearia/massas",
  [param("id").isInt().withMessage("ID do mercado deve ser um número inteiro")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const mercadoId = parseInt(req.params.id);
    await getMercado("mercearia", "massas", mercadoId, res);
  }
);
app.delete(
  "/mercado/:id/produtos/mercearia/massas/:massasId",
  [
    param("id").isInt().withMessage("ID do mercado deve ser um número inteiro"),
    param("massasId")
      .isInt()
      .withMessage("ID do mercado deve ser um número inteiro"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const mercadoId = parseInt(req.params.id);
    const massasId = parseInt(req.params.massasId);
    await deleteMercado("mercearia", "massas", mercadoId, massasId, res);
  }
);

// // merc farinhas

app.post(
  "/mercado/:id/produtos/mercearia/farinhas",
  [
    param("id").isInt().withMessage("ID do mercado deve ser um número inteiro"),
    body("nome").not().isEmpty().withMessage("Nome é obrigatório"),
    body("valor")
      .isInt({ min: 1 })
      .withMessage("Valor deve ser um número inteiro e não negativo"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const id_mercado = parseInt(req.params.id);
    // Adicionando o novo produto na categoria de legumes do hortifruit do mercado especificado
    const { nome, valor } = req.body;
    await postMercado("mercearia", "farinhas", id_mercado, nome, valor, res);
  }
);
app.get(
  "/mercado/:id/produtos/mercearia/farinhas",
  [param("id").isInt().withMessage("ID do mercado deve ser um número inteiro")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const mercadoId = parseInt(req.params.id);
    await getMercado("mercearia", "farinhas", mercadoId, res);
  }
);
app.delete(
  "/mercado/:id/produtos/mercearia/farinhas/:farinhasId",
  [
    param("id").isInt().withMessage("ID do mercado deve ser um número inteiro"),
    param("farinhasId")
      .isInt()
      .withMessage("ID do mercado deve ser um número inteiro"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const mercadoId = parseInt(req.params.id);
    const farinhasId = parseInt(req.params.farinhasId);
    await deleteMercado("mercearia", "farinhas", mercadoId, farinhasId, res);
  }
);
// // conservados emlatados

app.post(
  "/mercado/:id/produtos/mercearia/conservadosEnlatados",
  [
    param("id").isInt().withMessage("ID do mercado deve ser um número inteiro"),
    body("nome").not().isEmpty().withMessage("Nome é obrigatório"),
    body("valor")
      .isInt({ min: 1 })
      .withMessage("Valor deve ser um número inteiro e não negativo"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const id_mercado = parseInt(req.params.id);
    // Adicionando o novo produto na categoria de legumes do hortifruit do mercado especificado
    const { nome, valor } = req.body;
    await postMercado(
      "mercearia",
      "conservadosEnlatados",
      id_mercado,
      nome,
      valor,
      res
    );
  }
);
app.get(
  "/mercado/:id/produtos/mercearia/conservadosEnlatados",
  [param("id").isInt().withMessage("ID do mercado deve ser um número inteiro")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const mercadoId = parseInt(req.params.id);
    await getMercado("mercearia", "conservadosEnlatados", mercadoId, res);
  }
);
app.delete(
  "/mercado/:id/produtos/mercearia/conservadosEnlatados/:conservadosEnlatadosId",
  [
    param("id").isInt().withMessage("ID do mercado deve ser um número inteiro"),
    param("conservadosEnlatadosId")
      .isInt()
      .withMessage("ID do mercado deve ser um número inteiro"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const mercadoId = parseInt(req.params.id);
    const conservadosEnlatadosId = parseInt(req.params.conservadosEnlatadosId);
    await deleteMercado(
      "mercearia",
      "conservadosEnlatados",
      mercadoId,
      conservadosEnlatadosId,
      res
    );
  }
);
// // merc oleos
app.post(
  "/mercado/:id/produtos/mercearia/oleos",
  [
    param("id").isInt().withMessage("ID do mercado deve ser um número inteiro"),
    body("nome").not().isEmpty().withMessage("Nome é obrigatório"),
    body("valor")
      .isInt({ min: 1 })
      .withMessage("Valor deve ser um número inteiro e não negativo"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const id_mercado = parseInt(req.params.id);
    // Adicionando o novo produto na categoria de legumes do hortifruit do mercado especificado
    const { nome, valor } = req.body;
    await postMercado("mercearia", "oleos", id_mercado, nome, valor, res);
  }
);
app.get(
  "/mercado/:id/produtos/mercearia/oleos",
  [param("id").isInt().withMessage("ID do mercado deve ser um número inteiro")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const mercadoId = parseInt(req.params.id);
    await getMercado("mercearia", "oleos", mercadoId, res);
  }
);
app.delete(
  "/mercado/:id/produtos/mercearia/oleos/:oleosId",
  [
    param("id").isInt().withMessage("ID do mercado deve ser um número inteiro"),
    param("oleosId")
      .isInt()
      .withMessage("ID do mercado deve ser um número inteiro"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const mercadoId = parseInt(req.params.id);
    const oleosId = parseInt(req.params.oleosId);
    await deleteMercado("mercearia", "oleos", mercadoId, oleosId, res);
  }
);
// // merce temperos condimentos
app.post(
  "/mercado/:id/produtos/mercearia/temperosCondimentos",
  [
    param("id").isInt().withMessage("ID do mercado deve ser um número inteiro"),
    body("nome").not().isEmpty().withMessage("Nome é obrigatório"),
    body("valor")
      .isInt({ min: 1 })
      .withMessage("Valor deve ser um número inteiro e não negativo"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const id_mercado = parseInt(req.params.id);
    // Adicionando o novo produto na categoria de legumes do hortifruit do mercado especificado
    const { nome, valor } = req.body;
    await postMercado(
      "mercearia",
      "temperosCondimentos",
      id_mercado,
      nome,
      valor,
      res
    );
  }
);
app.get(
  "/mercado/:id/produtos/mercearia/temperosCondimentos",
  [param("id").isInt().withMessage("ID do mercado deve ser um número inteiro")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const mercadoId = parseInt(req.params.id);
    await getMercado("mercearia", "temperosCondimentos", mercadoId, res);
  }
);
app.delete(
  "/mercado/:id/produtos/mercearia/temperosCondimentos/:temperosCondimentosId",
  [
    param("id").isInt().withMessage("ID do mercado deve ser um número inteiro"),
    param("temperosCondimentosId")
      .isInt()
      .withMessage("ID do mercado deve ser um número inteiro"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const mercadoId = parseInt(req.params.id);
    const temperosCondimentosId = parseInt(req.params.temperosCondimentosId);
    await deleteMercado(
      "mercearia",
      "temperosCondimentos",
      mercadoId,
      temperosCondimentosId,
      res
    );
  }
);

// // bebidas com alcool
app.post(
  "/mercado/:id/produtos/bebidas/comAlcool",
  [
    param("id").isInt().withMessage("ID do mercado deve ser um número inteiro"),
    body("nome").not().isEmpty().withMessage("Nome é obrigatório"),
    body("valor")
      .isInt({ min: 1 })
      .withMessage("Valor deve ser um número inteiro e não negativo"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const id_mercado = parseInt(req.params.id);
    // Adicionando o novo produto na categoria de legumes do hortifruit do mercado especificado
    const { nome, valor } = req.body;
    await postMercado("bebidas", "comAlcool", id_mercado, nome, valor, res);
  }
);
app.get(
  "/mercado/:id/produtos/bebidas/comAlcool",
  [param("id").isInt().withMessage("ID do mercado deve ser um número inteiro")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const mercadoId = parseInt(req.params.id);
    await getMercado("bebidas", "comAlcool", mercadoId, res);
  }
);
app.delete(
  "/mercado/:id/produtos/bebidas/comAlcool/:comAlcoolId",
  [
    param("id").isInt().withMessage("ID do mercado deve ser um número inteiro"),
    param("comAlcoolId")
      .isInt()
      .withMessage("ID do mercado deve ser um número inteiro"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const mercadoId = parseInt(req.params.id);
    const comAlcoolId = parseInt(req.params.comAlcoolId);
    await deleteMercado("bebidas", "comAlcool", mercadoId, comAlcoolId, res);
  }
);

// // bebiidas sem alcool
app.post(
  "/mercado/:id/produtos/bebidas/semAlcool",
  [
    param("id").isInt().withMessage("ID do mercado deve ser um número inteiro"),
    body("nome").not().isEmpty().withMessage("Nome é obrigatório"),
    body("valor")
      .isInt({ min: 1 })
      .withMessage("Valor deve ser um número inteiro e não negativo"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const id_mercado = parseInt(req.params.id);
    // Adicionando o novo produto na categoria de legumes do hortifruit do mercado especificado
    const { nome, valor } = req.body;
    await postMercado("bebidas", "semAlcool", id_mercado, nome, valor, res);
  }
);
app.get(
  "/mercado/:id/produtos/bebidas/semAlcool",
  [param("id").isInt().withMessage("ID do mercado deve ser um número inteiro")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const mercadoId = parseInt(req.params.id);
    await getMercado("bebidas", "semAlcool", mercadoId, res);
  }
);
app.delete(
  "/mercado/:id/produtos/bebidas/semAlcool/:semAlcoolId",
  [
    param("id").isInt().withMessage("ID do mercado deve ser um número inteiro"),
    param("semAlcoolId")
      .isInt()
      .withMessage("ID do mercado deve ser um número inteiro"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const mercadoId = parseInt(req.params.id);
    const semAlcoolId = parseInt(req.params.semAlcoolId);
    await deleteMercado("bebidas", "semAlcool", mercadoId, semAlcoolId, res);
  }
);

// //  higiene e limpeza

app.post(
  "/mercado/:id/produtos/higienelimpeza/higiene",
  [
    param("id").isInt().withMessage("ID do mercado deve ser um número inteiro"),
    body("nome").not().isEmpty().withMessage("Nome é obrigatório"),
    body("valor")
      .isInt({ min: 1 })
      .withMessage("Valor deve ser um número inteiro e não negativo"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const id_mercado = parseInt(req.params.id);
    // Adicionando o novo produto na categoria de legumes do hortifruit do mercado especificado
    const { nome, valor } = req.body;
    await postMercado(
      "higienelimpeza",
      "higiene",
      id_mercado,
      nome,
      valor,
      res
    );
  }
);
app.get(
  "/mercado/:id/produtos/higienelimpeza/higiene",
  [param("id").isInt().withMessage("ID do mercado deve ser um número inteiro")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const mercadoId = parseInt(req.params.id);
    await getMercado("higienelimpeza", "higiene", mercadoId, res);
  }
);
app.delete(
  "/mercado/:id/produtos/higienelimpeza/higiene/:higieneId",
  [
    param("id").isInt().withMessage("ID do mercado deve ser um número inteiro"),
    param("higieneId")
      .isInt()
      .withMessage("ID do mercado deve ser um número inteiro"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const mercadoId = parseInt(req.params.id);
    const higieneId = parseInt(req.params.higieneId);
    await deleteMercado("higienelimpeza", "higiene", mercadoId, higieneId, res);
  }
);
// // limpeza

app.post(
  "/mercado/:id/produtos/higienelimpeza/limpeza",
  [
    param("id").isInt().withMessage("ID do mercado deve ser um número inteiro"),
    body("nome").not().isEmpty().withMessage("Nome é obrigatório"),
    body("valor")
      .isInt({ min: 1 })
      .withMessage("Valor deve ser um número inteiro e não negativo"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const id_mercado = parseInt(req.params.id);
    // Adicionando o novo produto na categoria de legumes do hortifruit do mercado especificado
    const { nome, valor } = req.body;
    await postMercado(
      "higienelimpeza",
      "limpeza",
      id_mercado,
      nome,
      valor,
      res
    );
  }
);
app.get(
  "/mercado/:id/produtos/higienelimpeza/limpeza",
  [param("id").isInt().withMessage("ID do mercado deve ser um número inteiro")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const mercadoId = parseInt(req.params.id);
    await getMercado("higienelimpeza", "limpeza", mercadoId, res);
  }
);
app.delete(
  "/mercado/:id/produtos/higienelimpeza/limpeza/:limpezaId",
  [
    param("id").isInt().withMessage("ID do mercado deve ser um número inteiro"),
    param("limpezaId")
      .isInt()
      .withMessage("ID do mercado deve ser um número inteiro"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const mercadoId = parseInt(req.params.id);
    const limpezaId = parseInt(req.params.limpezaId);
    await deleteMercado("higienelimpeza", "limpeza", mercadoId, limpezaId, res);
  }
);
// // EVENTOS
app.get("/eventos", (req, res) => {
  dbJSONget(res, "eventos");
});
const isFutureDate = (date) => {
  const today = new Date();
  const inputDate = new Date(date);
  return inputDate >= today.setHours(0, 0, 0, 0);
};
app.post(
  "/eventos",
  [
    body("nome")
      .trim()
      .custom(async (value) => {
        const eventos = await buscar("eventos");
        const eventoExistente = eventos.some(
          (evento) =>
            evento.nome.trim().toLowerCase() === value.trim().toLowerCase()
        );
        if (eventoExistente) {
          throw new Error("O nome do evento já existe");
        }
        return true;
      }),
    body("data")
      .isISO8601()
      .withMessage("A data deve estar no formato ISO8601 (AAAA-MM-DD)")
      .custom((value) => {
        if (!isFutureDate(value)) {
          throw new Error("A data deve ser do dia atual ou futura");
        }
        return true;
      }),
    body("local")
      .trim()
      .custom(async (value, { req }) => {
        const eventos = await buscar("eventos");
        const eventoNoLocal = eventos.some(
          (evento) =>
            evento.local.trim().toLowerCase() === value.trim().toLowerCase() &&
            evento.data === req.body.data
        );
        if (eventoNoLocal) {
          throw new Error("Já existe um evento no local na mesma data");
        }
        return true;
      }),
    body("capacidade")
      .isInt({ gt: 5, max: 50 })
      .withMessage(
        "A capacidade deve ser um número inteiro maior que 5 e menor que 50"
      ),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const eventos = await buscar("eventos");

    const { nome, data, local, capacidade } = req.body;

    const novoEvento = {
      id: eventos.length ? eventos[eventos.length - 1].id + 1 : 1,
      nome,
      data,
      local,
      capacidade,
      participantes: [],
    };

    if (eventos.length > 50) {
      eventos.splice(0, 10);
    }
    eventos.push(novoEvento);
    await db.ref("eventos").set(eventos);
    res.status(201).json(novoEvento);
  }
);

app.get(
  "/eventos/:id",
  [
    param("id")
      .isInt({ gt: 0 })
      .withMessage("O ID deve ser um número inteiro positivo"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const eventos = await buscar("eventos");

    const eventoId = parseInt(req.params.id, 10);
    const evento = eventos.find((evento) => evento.id === eventoId);

    if (!evento) {
      return res.status(404).json({ message: "Evento não encontrado" });
    }

    res.json(evento);
  }
);

// // Rota para deletar um evento por ID
app.delete(
  "/eventos/:id",
  [
    param("id")
      .isInt({ gt: 0 })
      .withMessage("O ID deve ser um número inteiro positivo"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const eventos = await buscar("eventos");
    const eventoId = parseInt(req.params.id, 10);
    const eventoIndex = eventos.findIndex((evento) => evento.id === eventoId);

    if (eventoIndex === -1) {
      return res.status(404).json({ message: "Evento não encontrado" });
    }
    eventos.splice(eventoIndex, 1);

    await db.ref("eventos").set(eventos);
    res.status(200).send({ message: "Evento finalizado." });
  }
);

app.put(
  "/eventos/:id",
  [
    param("id")
      .isInt({ gt: 0 })
      .withMessage("O ID deve ser um número inteiro positivo"),
    body("nome")
      .optional()
      .custom(async (value, { req }) => {
        const eventos = await buscar("eventos");
        const eventoExistente = eventos.some(
          (evento) =>
            evento.nome.trim().toLowerCase() === value.trim().toLowerCase() &&
            evento.id !== parseInt(req.params.id, 10)
        );
        if (eventoExistente) {
          throw new Error("O nome do evento já existe");
        }
        return true;
      }),
    body("data")
      .isISO8601()
      .optional()
      .withMessage("A data deve estar no formato ISO8601 (AAAA-MM-DD)")
      .custom((value) => {
        const isFutureDate = (date) => {
          const today = new Date();
          const inputDate = new Date(date);
          return inputDate >= today.setHours(0, 0, 0, 0);
        };

        if (!isFutureDate(value)) {
          throw new Error("A data deve ser do dia atual ou futura");
        }
        return true;
      }),
    body("local")
      .optional()
      .custom(async (value, { req }) => {
        const eventos = await buscar("eventos");
        const eventoNoLocal = eventos.some(
          (evento) =>
            evento.local.trim().toLowerCase() === value.trim().toLowerCase() &&
            evento.data === req.body.data &&
            evento.id !== parseInt(req.params.id, 10)
        );
        if (eventoNoLocal) {
          throw new Error("Já existe um evento no local na mesma data");
        }
        return true;
      }),
    body("capacidade")
      .isInt({ gt: 5, max: 50 })
      .optional()
      .withMessage(
        "A capacidade deve ser um número inteiro maior que 5 e menor que 50"
      ),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const eventos = await buscar("eventos");
    const eventoId = parseInt(req.params.id, 10);
    const eventoIndex = eventos.findIndex((evento) => evento.id === eventoId);

    if (eventoIndex === -1) {
      return res.status(404).json({ message: "Evento não encontrado" });
    }

    const { nome, data, local, capacidade } = req.body;
    const update = await buscar(`eventos`);
    const evento_ = update.find((evento) => evento.id === eventoId);
    evento_.id = evento_.id;
    evento_.nome = nome || evento_.nome;
    evento_.data = data || evento_.data;
    evento_.local = local || evento_.local;
    evento_.capacidade = capacidade || evento_.capacidade;

    await db.ref(`eventos/${eventoIndex}`).set(evento_);
    res.status(201).json(eventos[eventoIndex]);
  }
);

// // PARTICIPANTES
app.get(
  "/eventos/:id/participantes",
  [
    param("id")
      .isInt({ gt: 0 })
      .withMessage("O ID do evento deve ser um número inteiro positivo"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const eventos = await buscar("eventos");
    const eventoId = parseInt(req.params.id, 10);
    const evento = eventos.find((evento) => evento.id === eventoId);

    if (!evento) {
      return res.status(404).json({ message: "Evento não encontrado" });
    }
    if (!evento.participantes) evento.participantes = [];
    res.json(evento.participantes);
  }
);
app.post(
  "/eventos/:id/participantes",
  [
    param("id")
      .isInt({ gt: 0 })
      .withMessage("O ID do evento deve ser um número inteiro positivo"),
    body("nome").trim().notEmpty().withMessage("O nome é obrigatório"),
    body("email").isEmail().withMessage("Email inválido").optional(),
    body("idade")
      .isInt({ gt: 12 })
      .withMessage("A idade deve ser maior que 12"),
    body("nome").custom(async (value, { req }) => {
      const eventos = await buscar("eventos");
      const eventoId = parseInt(req.params.id, 10);
      const evento = eventos.find((evento) => evento.id === eventoId);

      if (!evento) {
        throw new Error("Evento não encontrado");
      }
      if (!evento.participantes) evento.participantes = [];

      const participanteExistente = eventos.some(
        (evento) =>
          evento.data === evento.data &&
          evento.participantes.some(
            (participante) =>
              participante.nome.trim().toLowerCase() ===
              value.trim().toLowerCase()
          )
      );

      if (participanteExistente) {
        throw new Error(
          "Já existe um participante com o mesmo nome em um evento na mesma data"
        );
      }

      return true;
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const eventos = await buscar("eventos");

    const eventoId = parseInt(req.params.id, 10);
    const evento = eventos.find((evento) => evento.id === eventoId);

    if (!evento) {
      return res.status(404).json({ message: "Evento não encontrado" });
    }
    if (!evento.participantes) evento.participantes = [];

    const newId =
      evento.participantes.length > 0
        ? evento.participantes[evento.participantes.length - 1].id + 1
        : 1;
    const { nome, email, idade } = req.body;
    const novoParticipante = {
      id: newId,
      nome,
      email,
      idade,
    };

    if (email) {
      let html = `<!DOCTYPE html>
      <html lang="en">
      <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmação de Compra</title>
      <style>
          body {
              font-family: 'Arial', sans-serif;
              margin: 0;
              padding: 0;
              color: #333;
          }
          .container {
              padding: 20px;
              background-color: #f4f4f4;
              border: 1px solid #ddd;
              margin: 20px auto;
              width: 80%;
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          .header {
              background-color: #007bff;
              color: white;
              padding: 10px;
              text-align: center;
          }
          .content {
              padding: 20px;
              background-color: white;
          }
          .footer {
              text-align: center;
              padding: 10px;
              font-size: 0.8em;
              background-color: #eee;
          }
      </style>
      </head>
      <body>
      <div class="container">
          <div class="header">
              <h1>Você é novo(a) escrito(a) no Evento</h1>
          </div>
          <div class="content">
              <h2>Detalhes do Evento</h2>
              <p><strong>Nome:</strong>  ${evento.nome}</p>
              <p><strong>Local:</strong>  ${evento.local}</p>
              <p><strong>Data:</strong>  ${evento.data}</p>
              <p><strong>Capacidade:</strong>  ${evento.capacidade} participantes</p>
          </div>
          <div class="footer">
              Obrigado por participar!.
          </div>
      </div>
      </body>
      </html>
       `;
      enviarEmail(
        email,
        `Evento * ${evento.nome} * Parabéns senhor(a): ${
          nome || "Participante"
        } pela adesão ao Evento`,
        html
      );
    }

    evento.capacidade -= 1;

    if (evento.capacidade < 0) {
      return res
        .status(400)
        .send({ message: "O Evento não suporta mais participantes." });
    }
    evento.participantes.push(novoParticipante);
    await db.ref(`eventos/${eventoId - 1}`).set(evento);
    res.status(201).json(novoParticipante);
  }
);
app.delete(
  "/eventos/:id/participantes/:participanteId",
  [
    param("id")
      .isInt({ gt: 0 })
      .withMessage("O ID do evento deve ser um número inteiro positivo"),
    param("participanteId")
      .isInt({ gt: 0 })
      .withMessage("O ID do participante deve ser um número inteiro positivo"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const eventos = await buscar("eventos");
    const eventoId = parseInt(req.params.id, 10);
    const participanteId = parseInt(req.params.participanteId, 10);
    const evento = eventos.find((evento) => evento.id === eventoId);

    if (!evento) {
      return res.status(404).json({ message: "Evento não encontrado" });
    }
    if (!evento.participantes) evento.participantes = [];

    const participanteIndex = evento.participantes.findIndex(
      (participante) => participante.id === participanteId
    );

    if (participanteIndex === -1) {
      return res.status(404).json({ message: "Participante não encontrado" });
    }
    evento.capacidade += 1;
    evento.participantes.splice(participanteIndex, 1);
    await db.ref(`eventos/${eventoId - 1}`).set(evento);
    res.status(200).send({ message: "Participante excluído." });
  }
);

// herois uteis

app.get("/herois", async (req, res) => {
  dbJSONget(res, "heroes/herois");
});

app.post(
  "/herois",
  [
    body("nome")
      .notEmpty()
      .withMessage("O campo nome é obrigatório")
      .custom(async (value) => {
        const get = await buscar("heroes/herois");
        const userExists = get.find(
          (user) => user.nome.trim() === value.trim()
        );
        if (userExists) {
          throw new Error("Nome já existe");
        }
        return true;
      }),
    body("habilidade")
      .notEmpty()
      .withMessage("O campo habilidade é obrigatório"),
    body("problema")
      .notEmpty()
      .withMessage(
        "O campo problema é obrigatório, e deve descrever um problema que o héroi tem."
      ),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const search = await buscar("heroes/herois");
    let get = search;
    // Atribuição automática de 'status' como 'ativo' e 'dataCadastro' para a data atual
    const newUser = {
      id: search.length + 1,
      nome: req.body.nome,
      habilidade: req.body.habilidade,
      problema: req.body.problema,
    };

    if (get.length > 50) {
      get.splice(0, 10);
    }
    // Adiciona o novo usuário ao array
    get.push(newUser);
    const ref = db.ref("heroes/herois");
    await ref.set(get);

    if (get.length > 50) {
      get.splice(0, 10); // Remove os 10 primeiros
    }

    res.status(201).json({
      message: `Héroi *${req.body.nome}* adicionado a lista de hérois.`,
      newUser,
    });
  }
);

app.get(
  "/herois/:id",
  [param("id").isInt().withMessage("O ID deve ser um número inteiro")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const id = parseInt(req.params.id);

    try {
      let user = await buscar(`heroes/herois`);
      user = user.find((heroi) => heroi.id === id);
      if (!user) {
        return res.status(404).send({ message: "Héroi não encontrado" });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      res.status(500).send({ message: "Erro ao buscar héroi" });
    }
  }
);
app.delete(
  "/herois/:id",
  [param("id").isInt().withMessage("O ID deve ser um número inteiro")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const id = parseInt(req.params.id);

    try {
      const ref = db.ref(`heroes/herois/${id - 1}`);
      const snapshot = await ref.once("value");
      const user = snapshot.val();

      if (!user) {
        return res.status(404).send({ message: "héroi não encontrado" });
      }

      await ref.remove();

      res
        .status(200)
        .json({ message: `héroi com ID ${id} foi removido com sucesso.` });
    } catch (error) {
      console.error("Erro ao remover héroi:", error);
      res.status(500).send({ message: "Erro ao remover héroi" });
    }
  }
);
// herois inuteis

app.get("/herois-inuteis", async (req, res) => {
  dbJSONget(res, "heroes/herois-inuteis");
});

app.post(
  "/herois-inuteis",
  [
    body("nome")
      .notEmpty()
      .withMessage("O campo nome é obrigatório")
      .custom(async (value) => {
        const get = await buscar("heroes/herois-inuteis");
        const userExists = get.find(
          (user) => user.nome.trim() === value.trim()
        );
        if (userExists) {
          throw new Error("Nome já existe");
        }
        return true;
      }),
    body("habilidade")
      .notEmpty()
      .withMessage("O campo habilidade é obrigatório"),
    body("problema")
      .notEmpty()
      .withMessage(
        "O campo problema é obrigatório, e deve descrever um problema que o héroi inútil tem."
      ),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const search = await buscar("heroes/herois-inuteis");
    let get = search;
    // Atribuição automática de 'status' como 'ativo' e 'dataCadastro' para a data atual
    const newUser = {
      id: search.length + 1,
      nome: req.body.nome,
      habilidade: req.body.habilidade,
      problema: req.body.problema,
    };

    if (get.length > 50) {
      get.splice(0, 10);
    }
    // Adiciona o novo usuário ao array
    get.push(newUser);
    const ref = db.ref("heroes/herois-inuteis");
    await ref.set(get);

    if (get.length > 50) {
      get.splice(0, 10); // Remove os 10 primeiros
    }

    res.status(201).json({
      message: `Héroi *${req.body.nome}* adicionado a lista de hérois inúteis.`,
      newUser,
    });
  }
);

app.get(
  "/herois-inuteis/:id",
  [param("id").isInt().withMessage("O ID deve ser um número inteiro")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const id = parseInt(req.params.id);

    try {
      let user = await buscar(`heroes/herois-inuteis`);
      user = user.find((heroi) => heroi.id === id);
      if (!user) {
        return res.status(404).send({ message: "Héroi inútil não encontrado" });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      res.status(500).send({ message: "Erro ao buscar héroi inútil" });
    }
  }
);
app.delete(
  "/herois-inuteis/:id",
  [param("id").isInt().withMessage("O ID deve ser um número inteiro")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const id = parseInt(req.params.id);

    try {
      const ref = db.ref(`heroes/herois-inuteis/${id - 1}`);
      const snapshot = await ref.once("value");
      const user = snapshot.val();

      if (!user) {
        return res.status(404).send({ message: "héroi inútil não encontrado" });
      }

      await ref.remove();

      res.status(200).json({
        message: `héroi inútil com ID ${id} foi removido com sucesso.`,
      });
    } catch (error) {
      console.error("Erro ao remover héroi:", error);
      res.status(500).send({ message: "Erro ao remover héroi inútil" });
    }
  }
);
// DESAFIOS
app.get("/level1", (req, res) => {
 res.status(200).send(complicated)
});
app.get("/level2", (req, res) => {
  res.status(200).send(level2)
});
//


const htmlApresentation = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bem-vindo à API de Teste</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
        body {
            font-family: 'Roboto', sans-serif;
            background: url('https://st3.depositphotos.com/10325396/17238/i/450/depositphotos_172385004-stock-photo-programming-code-abstract-technology-background.jpg') no-repeat center center fixed;
            background-size: cover;
            margin: 0;
            padding: 0;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            color: white;
            position: relative;
        }
        .container {
            text-align: center;
            background: rgba(0, 0, 0, 0.8);
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
            max-width: 800px;
            margin: 0 20px;
            z-index: 1;
            position: relative;
        }
        .container h1 {
            color: #fff;
            margin-bottom: 20px;
        }
        .container p {
            color: #ccc;
            font-size: 1.2em;
            line-height: 1.6;
            margin-bottom: 30px;
        }
        .container a {
            display: inline-block;
            margin-top: 20px;
            padding: 15px 25px;
            background-color: #3498db;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-size: 1.1em;
            transition: background-color 0.3s, transform 0.3s;
        }
        .container a:hover {
            background-color: #2980b9;
            transform: translateY(-2px);
        }
        .icons {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: space-around;
            align-items: center;
            z-index: 0;
            pointer-events: none;
            overflow: hidden;
        }
        .icons i {
            font-size: 3em;
            color: rgba(255, 255, 255, 0.4);
            animation: float 10s infinite;
        }
        .icons i:nth-child(odd) {
            animation-delay: 0s;
        }
        .icons i:nth-child(even) {
            animation-delay: 5s;
        }
        @keyframes float {
            0% {
                transform: translateY(100vh);
            }
            50% {
                transform: translateY(-50vh);
            }
            100% {
                transform: translateY(100vh);
            }
        }
    </style>
</head>
<body>
    <div class="container animate__animated animate__fadeIn">
        <h1><i class="fas fa-laptop-code"></i> Bem-vindo à API de Teste</h1>
        <p>Esta API foi criada para ajudar novos testers a praticar automação.</p>
        <p>Integrada com Firebase RealTime.</p>
        <p>Construída com NodeJs, Express, Express-validator e Swagger-ui-express.</p>
        <a href="/docs"><i class="fas fa-book"></i> Ir para a documentação do Swagger</a>
    </div>
    <div class="icons">
        <i class="fab fa-js"></i>
        <i class="fab fa-node-js"></i>
        <i class="fab fa-java"></i>
        <i class="fab fa-python"></i>
        <i class="fab fa-react"></i>
        <i class="fab fa-html5"></i>
        <i class="fab fa-css3-alt"></i>
        <i class="fas fa-database"></i>
        <i class="fas fa-cogs"></i>
        <i class="fas fa-robot"></i>
        <i class="fas fa-code"></i>
        <i class="fas fa-vial"></i>
        <i class="fas fa-mobile-alt"></i>
        <i class="fas fa-globe"></i>
    </div>
</body>
</html>
`;
app.get("/", (req, res) => {
  res.send(htmlApresentation);
});
app.get("/apresentation", (req, res) => {
  res.send(htmlApresentation);
});
app.get("/api", (req, res) => {
  res.send(htmlApresentation);
});
app.get("/html", (req, res) => {
  res.send(htmlApresentation);
});
app.get("/doc", (req, res) => {
  res.send(htmlApresentation);
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {});
