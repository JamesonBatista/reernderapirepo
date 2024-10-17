let contador = 1;

// Definindo a função que incrementa o contador
function count() {
  return `             ​🇪​​🇳​​🇩​​🇵​​🇴​​🇮​​🇳​​🇹​:  ${contador++} `;
}
function getFormattedDateTime() {
  const now = new Date();

  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0'); // getMonth() retorna o mês de 0 a 11, por isso adicionamos 1
  const year = now.getFullYear();

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}
const local = "http://localhost:3000/"

const swaggerDocument = {
  openapi: "3.0.3",
  info: {
    version: "1.0.0",
    title: `QAs trainamentos || last reset: ${getFormattedDateTime()}`,
    description:
      "`A princípio na primeira chamada pode acontecer um erro, por tempo de inatividade, mas tente novamente.`\n\n Nesse Swagger você consegue validar e passar por vários cenários de testes, tente validar o máximo de JSONs, e boa sorte.\n\nEste swagger é postado na Render, ainda não temos um servidor em nuvem para melhorar a qualidade do serviço, mas em breve faremos isso.\n\n criado por:\n\n `Jam Batista`  [LinkedIn](https://www.linkedin.com/in/jam-batista-98101015b/)\n\n `Gabriel Lopes`  [LinkedIn](https://www.linkedin.com/in/gabriel-lopes-500b71269/)\n\nLogin: \n\n username: admin \n\npassword: password\n\n**Informações**:\n- Os endpoints de POST terão limite de 50 registros, depois disso os 10 primeiros serão deletados.  \n(POST endpoints will have a limit of 50 records, after which the first 10 will be deleted.)\n\n- Alguns endpoint de POST fazem envios de emails, olhe na descrição.  \n(Some POST endpoints send emails, look at the description.)\n\n `Com o tempo, iremos adicionar mais desafios e JSONs para validações.`\n\n\nTotal: `170` endpoints.",
  },

  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  servers: [
    {
      url: local,
    },
  ],
  tags: [
    {
      name: "Login",
      description: "Login simples e login hard validation",
      externalDocs: { description: "Swagger.io", url: "http://swagger.io" },
    },
    {
      name: "Users",
      description: "Simulação de criação de usuarios",
      externalDocs: { description: "Swagger.io", url: "http://swagger.io" },
    },
    {
      name: "Challenger",
      description: "Desafios praticando automação de testes em endpoints",
      externalDocs: { description: "Swagger.io", url: "http://swagger.io" },
    },
    {
      name: "Others",
      description: "JSONs variados para validações",
      externalDocs: { description: "Swagger.io", url: "http://swagger.io" },
    },
    {
      name: "CRUD",
      description: "GET, POST, GET:ID, DELETE",
      externalDocs: { description: "Swagger.io", url: "http://swagger.io" },
    },
    {
      name: "Shop",
      description: "Simulação de compra",
      externalDocs: { description: "Swagger.io", url: "http://swagger.io" },
    },
    {
      name: "Bank",
      description: "Simulação de pedido de emprestimo e compra de item de luxo",
      externalDocs: { description: "Swagger.io", url: "http://swagger.io" },
    },
    {
      name: "Projetos",
      description: "Simulação de criação de configuração um projeto",
      externalDocs: { description: "Swagger.io", url: "http://swagger.io" },
    },
    {
      name: "Payments",
      description: "Simulação de compra e pagamento em cartão",
      externalDocs: { description: "Swagger.io", url: "http://swagger.io" },
    },
    {
      name: "Company",
      description:
        "Simulação de criação de Empresa, Funcionários, Produtos, e Serviços",
      externalDocs: { description: "Swagger.io", url: "http://swagger.io" },
    },
    {
      name: "Mercado",
      description: "Simulação de criação de Mercado, produtos, e subcategorias",
      externalDocs: { description: "Swagger.io", url: "http://swagger.io" },
    },
    {
      name: "Eventos",
      description: "Simulação de criação de Eventos, e adesão de participantes",
      externalDocs: { description: "Swagger.io", url: "http://swagger.io" },
    },
    {
      name: "Heroes",
      description: "Simulação de criação de hérois",
      externalDocs: { description: "Swagger.io", url: "http://swagger.io" },
    },
    {
      name: "Animes",
      description: "Simulação de criação de Animes",
      externalDocs: { description: "Swagger.io", url: "http://swagger.io" },
    },
  ],
  paths: {
    "/login": {
      post: {
        tags: ["Login"],
        summary: ` Generate new Bearer token   ${count()}`,
        description: "Endpoint to generate a new token",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  username: {
                    type: "string",
                    default: "admin",
                    description: "Nome de usuário para autenticação",
                  },
                  password: {
                    type: "string",
                    default: "password",
                    description: "Senha para autenticação",
                  },
                },
                required: ["username", "password"],
                example: {
                  username: "admin",
                  password: "password",
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Authentication successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    token: {
                      type: "string",
                      example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Invalid username or password",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: {
                      type: "string",
                      example: "Invalid credentials provided.",
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: {
                      type: "string",
                      example: "Authentication failed.",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/login-hard": {
      post: {
        tags: ["Login"],
        summary: `Generate hard-token ${count()} `,
        description: "Endpoint to generate a new token",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  username: {
                    type: "string",
                    default: "admin",
                    description: "Nome de usuário para autenticação",
                  },
                  password: {
                    type: "string",
                    default: "password",
                    description: "Senha para autenticação",
                  },
                },
                required: ["username", "password"],
                example: {
                  username: "admin",
                  password: "password",
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Authentication successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    token: {
                      type: "string",
                      example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Invalid username or password",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: {
                      type: "string",
                      example: "Invalid credentials provided.",
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: {
                      type: "string",
                      example: "Authentication failed.",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/users": {
      post: {
        tags: ["Users"],
        summary: "Create a new user " + count(),
        description: "Creates a new user with the given details",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            in: "body",
            name: "body",
            description: "User object to be created",
            required: true,
            schema: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                },
                last_name: {
                  type: "string",
                },
                email: {
                  type: "string",
                },
              },
              required: ["name", "last_name", "email"],
            },
          },
        ],
        responses: {
          201: {
            description: "User created successfully",
            schema: {
              type: "object",
              properties: {
                id: {
                  type: "integer",
                },
                name: {
                  type: "string",
                },
                last_name: {
                  type: "string",
                },
                email: {
                  type: "string",
                },
              },
            },
          },
        },
      },
      get: {
        tags: ["Users"],
        summary: "Get all users " + count(),
        description: "Returns a list of all users",
        produces: ["application/json"],
        responses: {
          200: {
            description: "A list of users",
            schema: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: {
                    type: "integer",
                  },
                  name: {
                    type: "string",
                  },
                  last_name: {
                    type: "string",
                  },
                  email: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
      },
    },
    "/users/{id}": {
      get: {
        tags: ["Users"],
        summary: "Get a user by ID " + count(),
        description: "Returns a single user",
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "ID of the user to fetch",
            required: true,
            type: "integer",
          },
        ],
        responses: {
          200: {
            description: "A single user",
            schema: {
              type: "object",
              properties: {
                id: {
                  type: "integer",
                },
                name: {
                  type: "string",
                },
                last_name: {
                  type: "string",
                },
                email: {
                  type: "string",
                },
              },
            },
          },
          404: {
            description: "User not found",
          },
        },
      },
      put: {
        tags: ["Users"],
        summary: "Update a user by ID " + count(),
        description: "Updates the details of a user",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "ID of the user to update",
            required: true,
            type: "integer",
          },
          {
            in: "body",
            name: "body",
            description: "User object with updated details",
            required: true,
            schema: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                },
                last_name: {
                  type: "string",
                },
                email: {
                  type: "string",
                },
              },
            },
          },
        ],
        responses: {
          200: {
            description: "User updated successfully",
            schema: {
              type: "object",
              properties: {
                id: {
                  type: "integer",
                },
                name: {
                  type: "string",
                },
                last_name: {
                  type: "string",
                },
                email: {
                  type: "string",
                },
              },
            },
          },
          404: {
            description: "User not found",
          },
        },
      },
      delete: {
        tags: ["Users"],
        summary: "Delete a user by ID " + count(),
        description: "Deletes a user from the system",
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "ID of the user to delete",
            required: true,
            type: "integer",
          },
        ],
        responses: {
          200: {
            description: "User deleted successfully",
          },
          404: {
            description: "User not found",
          },
        },
      },
    },
    "/json_1": {
      get: {
        tags: ["Challenger"],
        summary: "Open challenger 1 " + count(),
        description:
          "Este endpoint valida um JSON contendo informações de usuário e interações em um sistema de e-commerce, conforme as seguintes regras:\n§\nProdutos:\nCada produto deve ter um 'id' único e um 'nome' não vazio.\nO 'preco' de cada produto deve ser um número positivo.\nO campo 'disponivel' deve ser um booleano indicando se o produto está disponível ou não.\n\nUsuário:\nO usuário deve ter um 'nome' não vazio.\nA 'idade' do usuário deve ser um número positivo.\nO 'email' do usuário deve estar em um formato válido.\n\nConfigurações:\nO campo 'notificacoes' deve ser um booleano.\nO campo 'tema' deve ser uma string não vazia.\nO campo 'idioma' deve ser uma string não vazia.\n\nEndereço:\nO campo 'rua' deve ser uma string não vazia.\nO campo 'numero' deve ser um número positivo.\nO campo 'cidade' deve ser uma string não vazia.\nO campo 'estado' deve ser uma string de dois caracteres representando a sigla do estado.\nO campo 'cep' deve estar em um formato válido.\n\nHistórico de Pedidos:\nCada pedido deve ter um 'pedidoId' único.\nO campo 'produto' deve corresponder ao nome de um dos produtos listados.\nO campo 'quantidade' deve ser um número inteiro positivo.\nO campo 'precoTotal' deve ser um número positivo.\n\nCarrinho Atual:\nCada produto no carrinho deve ter um 'produtoId' correspondente a um dos produtos listados.\nA 'quantidade' de cada produto no carrinho deve ser um número inteiro positivo.\nO 'precoTotal' do carrinho deve ser um número positivo.\n\nMétodo de Pagamento:\nPara o método de pagamento por cartão, o 'numero' do cartão deve estar em um formato válido.\nA 'validade' do cartão deve estar em um formato válido (MM/AAAA).\nO 'cvv' do cartão deve ser um código de três ou quatro dígitos.\n\nContato:\nO campo 'telefone' deve estar em um formato válido.\nO campo 'emailSecundario', se fornecido, deve estar em um formato válido.\n\nÚltima Compra:\nA 'data' da última compra deve estar em um formato válido (AAAA-MM-DD).\nO 'valor' da última compra deve ser um número positivo.\nO campo 'produto' deve corresponder ao nome de um dos produtos listados.\n\nRecomendações:\nO campo 'preco' de cada recomendação deve ser um número positivo.\n\nEstatísticas de Uso:\nO campo 'horasConectado' deve ser um número positivo.\nO campo 'diasAtivo' deve ser um número positivo.\n\nAmigos:\nCada amigo deve ter um 'nome' não vazio.\nO campo 'contato' de cada amigo, se fornecido, deve estar em um formato válido.\n\nPreferências:\nO campo 'categoriasFavoritas' deve ser uma lista não vazia de strings.\nO campo 'notificarPromocoes' deve ser um booleano.",
        parameters: [
          {
            name: "body",
            in: "body",
            description: "JSON a ser validado",
            schema: {
              type: "object",
              properties: {
                produtos: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "integer" },
                      nome: { type: "string" },
                      preco: { type: "number" },
                      disponivel: { type: "boolean" },
                    },
                  },
                },
                usuario: {
                  type: "object",
                  properties: {
                    nome: { type: "string" },
                    idade: { type: "integer" },
                    email: { type: "string" },
                  },
                },
                configuracoes: {
                  type: "object",
                  properties: {
                    notificacoes: { type: "boolean" },
                    tema: { type: "string" },
                    idioma: { type: "string" },
                  },
                },
                endereco: {
                  type: "object",
                  properties: {
                    rua: { type: "string" },
                    numero: { type: "integer" },
                    cidade: { type: "string" },
                    estado: { type: "string" },
                    cep: { type: "string" },
                  },
                },
                historicoDePedidos: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      pedidoId: { type: "integer" },
                      produto: { type: "string" },
                      quantidade: { type: "integer" },
                      precoTotal: { type: "number" },
                    },
                  },
                },
                carrinhoAtual: {
                  type: "object",
                  properties: {
                    produtos: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          produtoId: { type: "integer" },
                          quantidade: { type: "integer" },
                        },
                      },
                    },
                    precoTotal: { type: "number" },
                  },
                },
                metodoDePagamento: {
                  type: "object",
                  properties: {
                    cartao: {
                      type: "object",
                      properties: {
                        numero: { type: "string" },
                        validade: { type: "string" },
                        cvv: { type: "string" },
                      },
                    },
                  },
                },
                contato: {
                  type: "object",
                  properties: {
                    telefone: { type: "string" },
                    emailSecundario: { type: "string" },
                  },
                },
                assinaturaNewsletter: { type: "boolean" },
                ultimaCompra: {
                  type: "object",
                  properties: {
                    data: { type: "string" },
                    valor: { type: "number" },
                    produto: { type: "string" },
                  },
                },
                recomendacoes: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      produto: { type: "string" },
                      preco: { type: "number" },
                    },
                  },
                },
                perfilPublico: { type: "boolean" },
                estatisticasDeUso: {
                  type: "object",
                  properties: {
                    horasConectado: { type: "integer" },
                    diasAtivo: { type: "integer" },
                  },
                },
                amigos: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      nome: { type: "string" },
                      contato: { type: "string" },
                    },
                  },
                },
                preferencias: {
                  type: "object",
                  properties: {
                    categoriasFavoritas: {
                      type: "array",
                      items: { type: "string" },
                    },
                    notificarPromocoes: { type: "boolean" },
                  },
                },
              },
            },
          },
        ],
        responses: {
          200: {
            description: "Challenger Automation 1 successful",
          },
        },
      },
    },
    "/json_2": {
      get: {
        tags: ["Challenger"],
        summary: "Open challenger 2 " + count(),
        description:
          "Desafio de Validação:\n\n1. Verifique se o nome do usuário está presente e não está vazio.\n2. Certifique-se de que a idade do usuário é um número positivo.\n3. Valide os endereços de e-mail do usuário principal e secundário.\n4. Garanta que o número de telefone do usuário esteja em um formato válido.\n5. Verifique se a rua, cidade e estado do endereço estão preenchidos e não vazios.\n6. Certifique-se de que o número do endereço é um número positivo.\n7. Valide o formato do CEP.\n8. Verifique se o tema e idioma das preferências estão preenchidos e não vazios.\n9. Certifique-se de que há pelo menos uma categoria favorita nas preferências.\n10. Verifique se a opção de notificar promoções está definida como um booleano.\n11. Valide os pedidos no histórico de compras:\n    a. Garanta que cada pedido tenha um ID único.\n    b. Verifique se cada item de pedido tem um ID de produto, nome, quantidade e preço.\n    c. Certifique-se de que o total do pedido é um número positivo.\n    d. Valide o formato da data do pedido.\n12. Verifique se a assinatura da newsletter está definida como um booleano.\n13. Certifique-se de que a opção de receber SMS está definida como um booleano.\n14. Valide os métodos de pagamento:\n    a. Para o cartão de crédito, verifique se o número do cartão está em um formato válido.\n    b. Verifique se a data de validade do cartão está em um formato válido.\n    c. Certifique-se de que o CVV do cartão é um código de três ou quatro dígitos.\n    d. Para o PayPal, verifique se o e-mail está em um formato válido.\n15. Certifique-se de que as horas conectadas e os dias ativos nas estatísticas de uso são números positivos.\n16. Valide o formato da data do último login.\n17. Certifique-se de que cada amigo tenha um nome não vazio e um formato de contato válido.\n18. Verifique se cada recomendação de produto tem um ID de produto, nome e preço.\n\nSe todas essas validações forem bem-sucedidas, o JSON estará corretamente estruturado e pronto para ser processado pelo sistema de e-commerce.",
        parameters: [
          {
            name: "body",
            in: "body",
            description: "JSON a ser validado",
            schema: {
              type: "object",
              properties: {
                usuario: {
                  type: "object",
                  properties: {
                    informacoesPessoais: {
                      type: "object",
                      properties: {
                        nome: {
                          type: "string",
                        },
                        idade: {
                          type: "number",
                        },
                        contatos: {
                          type: "object",
                          properties: {
                            emailPrincipal: {
                              type: "string",
                            },
                            emailSecundario: {
                              type: "string",
                            },
                            telefone: {
                              type: "string",
                            },
                          },
                          required: [
                            "emailPrincipal",
                            "emailSecundario",
                            "telefone",
                          ],
                        },
                        endereco: {
                          type: "object",
                          properties: {
                            rua: {
                              type: "string",
                            },
                            numero: {
                              type: "number",
                            },
                            complemento: {
                              type: "string",
                            },
                            cidade: {
                              type: "string",
                            },
                            estado: {
                              type: "string",
                            },
                            cep: {
                              type: "string",
                            },
                          },
                          required: [
                            "rua",
                            "numero",
                            "complemento",
                            "cidade",
                            "estado",
                            "cep",
                          ],
                        },
                      },
                      required: ["nome", "idade", "contatos", "endereco"],
                    },
                    preferencias: {
                      type: "object",
                      properties: {
                        tema: {
                          type: "string",
                        },
                        idioma: {
                          type: "string",
                        },
                        categoriasFavoritas: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                        },
                        notificarPromocoes: {
                          type: "boolean",
                        },
                      },
                      required: [
                        "tema",
                        "idioma",
                        "categoriasFavoritas",
                        "notificarPromocoes",
                      ],
                    },
                    historicoDeCompras: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          pedidoId: {
                            type: "number",
                          },
                          itens: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                produtoId: {
                                  type: "number",
                                },
                                nome: {
                                  type: "string",
                                },
                                quantidade: {
                                  type: "number",
                                },
                                preco: {
                                  type: "number",
                                },
                              },
                              required: [
                                "produtoId",
                                "nome",
                                "quantidade",
                                "preco",
                              ],
                            },
                          },
                          total: {
                            type: "number",
                          },
                          data: {
                            type: "string",
                          },
                        },
                        required: ["pedidoId", "itens", "total", "data"],
                      },
                    },
                    configuracoesDeConta: {
                      type: "object",
                      properties: {
                        assinaturaNewsletter: {
                          type: "boolean",
                        },
                        receberSMS: {
                          type: "boolean",
                        },
                        metodosDePagamento: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              tipo: {
                                type: "string",
                              },
                              detalhes: {
                                type: "object",
                                properties: {
                                  numero: {
                                    type: "string",
                                  },
                                  validade: {
                                    type: "string",
                                  },
                                  cvv: {
                                    type: "string",
                                  },
                                },
                                required: ["numero", "validade", "cvv"],
                              },
                              email: {
                                type: "string",
                              },
                            },
                            required: ["tipo"],
                          },
                        },
                      },
                      required: [
                        "assinaturaNewsletter",
                        "receberSMS",
                        "metodosDePagamento",
                      ],
                    },
                    estatisticasDeUso: {
                      type: "object",
                      properties: {
                        horasConectado: {
                          type: "number",
                        },
                        diasAtivo: {
                          type: "number",
                        },
                        logins: {
                          type: "object",
                          properties: {
                            ultimoLogin: {
                              type: "string",
                            },
                            dispositivosUsados: {
                              type: "array",
                              items: {
                                type: "object",
                                properties: {
                                  tipo: {
                                    type: "string",
                                  },
                                  modelo: {
                                    type: "string",
                                  },
                                },
                                required: ["tipo", "modelo"],
                              },
                            },
                          },
                          required: ["ultimoLogin", "dispositivosUsados"],
                        },
                      },
                      required: ["horasConectado", "diasAtivo", "logins"],
                    },
                    amigos: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          nome: {
                            type: "string",
                          },
                          contato: {
                            type: "string",
                          },
                        },
                        required: ["nome", "contato"],
                      },
                    },
                    recomendacoesDeProdutos: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          produtoId: {
                            type: "number",
                          },
                          nome: {
                            type: "string",
                          },
                          preco: {
                            type: "number",
                          },
                        },
                        required: ["produtoId", "nome", "preco"],
                      },
                    },
                  },
                  required: [
                    "informacoesPessoais",
                    "preferencias",
                    "historicoDeCompras",
                    "configuracoesDeConta",
                    "estatisticasDeUso",
                    "amigos",
                    "recomendacoesDeProdutos",
                  ],
                },
              },
              required: ["usuario"],
            },
          },
        ],
        responses: {
          200: {
            description: "Challenger Automation 2 successful",
          },
        },
      },
    },
    "/json_3": {
      get: {
        tags: ["Challenger"],
        summary: "Open challenger 3 " + count(),
        description:
          "Validação do JSON para a 'Conferência de Tecnologia 2024'. Verifique: \n1. Estrutura: Confirmação de todas as chaves principais e sub-chaves corretas em cada seção do JSON. \n2. Conteúdo e Dados: Verificação da exatidão dos dados de local, data, organizadores, programação, participantes, feedbacks e sustentabilidade. \n3. Relações e Lógica: Confirmação de que participantes estão inscritos em sessões existentes, feedbacks associados corretamente, e avaliações dentro da escala válida. \n4. Sustentabilidade: Verificar a corretude das políticas e parceiros listados. ",
        parameters: [
          {
            name: "body",
            in: "body",
            schema: {
              $schema: "http://json-schema.org/draft-07/schema#",
              title: "Generated schema for Root",
              type: "object",
              properties: {
                evento: {
                  type: "object",
                  properties: {
                    nome: {
                      type: "string",
                    },
                    local: {
                      type: "object",
                      properties: {
                        nome: {
                          type: "string",
                        },
                        endereco: {
                          type: "object",
                          properties: {
                            rua: {
                              type: "string",
                            },
                            cidade: {
                              type: "string",
                            },
                            estado: {
                              type: "string",
                            },
                            cep: {
                              type: "string",
                            },
                          },
                          required: ["rua", "cidade", "estado", "cep"],
                        },
                      },
                      required: ["nome", "endereco"],
                    },
                    data: {
                      type: "string",
                    },
                    organizadores: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          nome: {
                            type: "string",
                          },
                          contato: {
                            type: "string",
                          },
                        },
                        required: ["nome", "contato"],
                      },
                    },
                    programacao: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          dia: {
                            type: "string",
                          },
                          sessoes: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                titulo: {
                                  type: "string",
                                },
                                horario: {
                                  type: "string",
                                },
                                palestrante: {
                                  type: "string",
                                },
                                sala: {
                                  type: "string",
                                },
                                descricao: {
                                  type: "string",
                                },
                              },
                              required: [
                                "titulo",
                                "horario",
                                "palestrante",
                                "sala",
                                "descricao",
                              ],
                            },
                          },
                        },
                        required: ["dia", "sessoes"],
                      },
                    },
                    participantes: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          nome: {
                            type: "string",
                          },
                          email: {
                            type: "string",
                          },
                          tipo: {
                            type: "string",
                          },
                          sessoesInscritas: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                          },
                        },
                        required: ["nome", "email", "tipo", "sessoesInscritas"],
                      },
                    },
                    feedbacks: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          sessao: {
                            type: "string",
                          },
                          comentarios: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                participante: {
                                  type: "string",
                                },
                                comentario: {
                                  type: "string",
                                },
                                avaliacao: {
                                  type: "number",
                                },
                              },
                              required: [
                                "participante",
                                "comentario",
                                "avaliacao",
                              ],
                            },
                          },
                        },
                        required: ["sessao", "comentarios"],
                      },
                    },
                    sustentabilidade: {
                      type: "object",
                      properties: {
                        politicas: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                        },
                        parceiros: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              nome: {
                                type: "string",
                              },
                              contato: {
                                type: "string",
                              },
                            },
                            required: ["nome", "contato"],
                          },
                        },
                      },
                      required: ["politicas", "parceiros"],
                    },
                  },
                  required: [
                    "nome",
                    "local",
                    "data",
                    "organizadores",
                    "programacao",
                    "participantes",
                    "feedbacks",
                    "sustentabilidade",
                  ],
                },
              },
              required: ["evento"],
            },
          },
        ],

        responses: {
          200: {
            description: "Challenger Automation 3 successful",
          },
        },
      },
    },
    "/json_4": {
      get: {
        tags: ["Challenger"],
        summary: "Open challenger 4 " + count(),
        description:
          "4 - Desafio de Validação Verificar a consistência das linguas e tradicionalVestimenta entre as culturas para garantir que não haja duplicatas no mesmo continente e que cada cultura esteja associada a apenas uma região.",
        parameters: [
          {
            name: "body",
            in: "body",
            schema: {
              $schema: "http://json-schema.org/draft-07/schema#",
              title: "Generated schema for Root",
              type: "object",
              properties: {
                linguagensDeProgramacao: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: {
                        type: "number",
                      },
                      nome: {
                        type: "string",
                      },
                      criador: {
                        type: "object",
                        properties: {
                          nome: {
                            type: "string",
                          },
                          nacionalidade: {
                            type: "string",
                          },
                        },
                        required: ["nome", "nacionalidade"],
                      },
                      ano: {
                        type: "number",
                      },
                      paradigmas: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                      },
                      aplicacoes: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                      },
                      validacoesEspecificas: {
                        type: "object",
                        properties: {
                          formatoNome: {
                            type: "string",
                          },
                          anoMinimo: {
                            type: "number",
                          },
                        },
                        required: ["formatoNome", "anoMinimo"],
                      },
                    },
                    required: [
                      "id",
                      "nome",
                      "criador",
                      "ano",
                      "paradigmas",
                      "aplicacoes",
                      "validacoesEspecificas",
                    ],
                  },
                },
                etnologia: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: {
                        type: "number",
                      },
                      continente: {
                        type: "string",
                      },
                      culturas: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            id: {
                              type: "number",
                            },
                            nome: {
                              type: "string",
                            },
                            lingua: {
                              type: "string",
                            },
                            tradicionalVestimenta: {
                              type: "string",
                            },
                            rituais: {
                              type: "array",
                              items: {
                                type: "string",
                              },
                            },
                            validacoesEspecificas: {
                              type: "object",
                              properties: {
                                linguaFormato: {
                                  type: "string",
                                },
                                numeroDeRituais: {
                                  type: "object",
                                  properties: {
                                    min: {
                                      type: "number",
                                    },
                                    max: {
                                      type: "number",
                                    },
                                  },
                                  required: ["min", "max"],
                                },
                              },
                              required: ["linguaFormato", "numeroDeRituais"],
                            },
                          },
                          required: [
                            "id",
                            "nome",
                            "lingua",
                            "tradicionalVestimenta",
                            "rituais",
                            "validacoesEspecificas",
                          ],
                        },
                      },
                    },
                    required: ["id", "continente", "culturas"],
                  },
                },
                validacaoGlobal: {
                  type: "object",
                  properties: {
                    idsUnicos: {
                      type: "boolean",
                    },
                    referenciaCruzada: {
                      type: "object",
                      properties: {
                        linguagensCulturas: {
                          type: "object",
                          properties: {
                            1: {
                              type: "array",
                              items: {
                                type: "string",
                              },
                            },
                            2: {
                              type: "array",
                              items: {
                                type: "string",
                              },
                            },
                          },
                          required: ["1", "2"],
                        },
                      },
                      required: ["linguagensCulturas"],
                    },
                  },
                  required: ["idsUnicos", "referenciaCruzada"],
                },
              },
              required: [
                "linguagensDeProgramacao",
                "etnologia",
                "validacaoGlobal",
              ],
            },
          },
        ],
        responses: {
          200: {
            description: "Challenger Automation 4 successful",
          },
        },
      },
    },
    "/json_5": {
      get: {
        tags: ["Challenger"],
        summary: "Open challenger 5 " + count(),
        description:
          "5 - Desafio de Validação Assegurar que cada id nos projetos, equipes, e tarefas seja único dentro de toda a estrutura do JSON e que o status de cada tarefa esteja em concordância com as dependências de outras tarefas dentro da mesma equipe.",
        parameters: [
          {
            name: "body",
            in: "body",
            schema: {
              $schema: "http://json-schema.org/draft-07/schema#",
              title: "Generated schema for Root",
              type: "object",
              properties: {
                empresa: {
                  type: "object",
                  properties: {
                    nome: {
                      type: "string",
                    },
                    setores: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: {
                            type: "number",
                          },
                          nome: {
                            type: "string",
                          },
                          projetos: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                id: {
                                  type: "number",
                                },
                                nome: {
                                  type: "string",
                                },
                                linguagensUsadas: {
                                  type: "array",
                                  items: {
                                    type: "object",
                                    properties: {
                                      id: {
                                        type: "number",
                                      },
                                      nome: {
                                        type: "string",
                                      },
                                      versao: {
                                        type: "string",
                                      },
                                    },
                                    required: ["id", "nome", "versao"],
                                  },
                                },
                                inicio: {
                                  type: "string",
                                },
                                prazo: {
                                  type: "string",
                                },
                                status: {
                                  type: "string",
                                },
                                equipes: {
                                  type: "array",
                                  items: {
                                    type: "object",
                                    properties: {
                                      id: {
                                        type: "number",
                                      },
                                      nome: {
                                        type: "string",
                                      },
                                      membros: {
                                        type: "array",
                                        items: {
                                          type: "object",
                                          properties: {
                                            id: {
                                              type: "number",
                                            },
                                            nome: {
                                              type: "string",
                                            },
                                            cargo: {
                                              type: "string",
                                            },
                                          },
                                          required: ["id", "nome", "cargo"],
                                        },
                                      },
                                      tarefas: {
                                        type: "array",
                                        items: {
                                          type: "object",
                                          properties: {
                                            id: {
                                              type: "number",
                                            },
                                            descricao: {
                                              type: "string",
                                            },
                                            status: {
                                              type: "string",
                                            },
                                          },
                                          required: [
                                            "id",
                                            "descricao",
                                            "status",
                                          ],
                                        },
                                      },
                                    },
                                    required: [
                                      "id",
                                      "nome",
                                      "membros",
                                      "tarefas",
                                    ],
                                  },
                                },
                              },
                              required: [
                                "id",
                                "nome",
                                "linguagensUsadas",
                                "inicio",
                                "prazo",
                                "status",
                                "equipes",
                              ],
                            },
                          },
                        },
                        required: ["id", "nome", "projetos"],
                      },
                    },
                  },
                  required: ["nome", "setores"],
                },
              },
              required: ["empresa"],
            },
          },
        ],
        responses: {
          200: {
            description: "Challenger Automation 5 successful",
          },
        },
      },
    },
    "/json_6": {
      get: {
        tags: ["Challenger"],
        summary: "Open challenger 6 " + count(),
        description:
          "Validação de lógica e consistência para a 'Agência Espacial Internacional'. O desafio inclui: \n1. Consistência de Lançamentos: Verificação de que cada satélite está associado a um veículo lançador com capacidade suficiente e que veículos 'ativos' têm missões associadas. \n2. Temporalidade e Status: Garantir que todas as missões 'ativas' têm datas passadas e que itens 'em preparação' têm lançamentos futuros. \n3. Relações de Dados: Coerência entre satélites e missões quanto aos veículos usados, e uso de veículos lançadores ativos para operações planejadas. \n4. Coerência de Missão: As missões tripuladas devem ter astronautas apropriados; missões não tripuladas devem ter objetivos compatíveis.",
        parameters: [
          {
            name: "body",
            in: "body",
            schema: {
              $schema: "http://json-schema.org/draft-07/schema#",
              title: "Generated schema for Root",
              type: "object",
              properties: {
                agenciaEspacial: {
                  type: "string",
                },
                veiculosLancadores: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string",
                      },
                      nome: {
                        type: "string",
                      },
                      capacidadeCarga: {
                        type: "string",
                      },
                      primeiroLancamento: {
                        type: "string",
                      },
                      status: {
                        type: "string",
                      },
                    },
                    required: [
                      "id",
                      "nome",
                      "capacidadeCarga",
                      "primeiroLancamento",
                      "status",
                    ],
                  },
                },
                satelites: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string",
                      },
                      nome: {
                        type: "string",
                      },
                      tipo: {
                        type: "string",
                      },
                      veiculoLancadorId: {
                        type: "string",
                      },
                      status: {
                        type: "string",
                      },
                    },
                    required: [
                      "id",
                      "nome",
                      "tipo",
                      "veiculoLancadorId",
                      "status",
                    ],
                  },
                },
                missoes: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string",
                      },
                      nome: {
                        type: "string",
                      },
                      tipo: {
                        type: "string",
                      },
                      veiculoLancadorId: {
                        type: "string",
                      },
                      tripulacao: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            id: {
                              type: "string",
                            },
                            nome: {
                              type: "string",
                            },
                          },
                          required: ["id", "nome"],
                        },
                      },
                      objetivos: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                      },
                      status: {
                        type: "string",
                      },
                    },
                    required: [
                      "id",
                      "nome",
                      "tipo",
                      "veiculoLancadorId",
                      "objetivos",
                      "status",
                    ],
                  },
                },
              },
              required: [
                "agenciaEspacial",
                "veiculosLancadores",
                "satelites",
                "missoes",
              ],
            },
          },
        ],
        responses: {
          200: {
            description: "Challenger Automation 6 successful",
          },
        },
      },
    },
    "/json_7": {
      get: {
        tags: ["Challenger"],
        summary: "Open challenger 7 " + count(),
        description:
          "Consistência de Equipes: Assegurar que todas as equipes mencionadas nos jogos estejam listadas nas equipes participantes do torneio correspondente. Isso envolve verificar se as equipes de cada jogo realmente pertencem ao grupo listado para o ano correspondente. \n\n Resultados Corretos: Validar que os resultados dos jogos refletem de forma precisa os gols marcados, verificando também que não existam discrepâncias nos dados dos jogos, como uma equipe sendo listada como vencedora mas com menos gols que o adversário.\n\nCapacidade dos Estádios: Verificar que a capacidade dos estádios listada para cada Copa do Mundo seja consistente ou maior do que a capacidade registrada em Copas anteriores, assegurando uma validação temporal de dados.",
        parameters: [
          {
            name: "body",
            in: "body",
            schema: {
              $schema: "http://json-schema.org/draft-07/schema#",
              title: "Generated schema for Root",
              type: "object",
              properties: {
                copasDoMundo: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      ano: {
                        type: "number",
                      },
                      paisSede: {
                        type: "string",
                      },
                      estadios: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            nome: {
                              type: "string",
                            },
                            cidade: {
                              type: "string",
                            },
                            capacidade: {
                              type: "number",
                            },
                          },
                          required: ["nome", "cidade", "capacidade"],
                        },
                      },
                      equipes: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            nome: {
                              type: "string",
                            },
                            grupo: {
                              type: "string",
                            },
                          },
                          required: ["nome", "grupo"],
                        },
                      },
                      jogos: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            data: {
                              type: "string",
                            },
                            estadio: {
                              type: "string",
                            },
                            equipes: {
                              type: "array",
                              items: {
                                type: "string",
                              },
                            },
                            resultado: {
                              type: "object",
                              properties: {
                                Brasil: {
                                  type: "number",
                                },
                                Suíça: {
                                  type: "number",
                                },
                                França: {
                                  type: "number",
                                },
                                Austrália: {
                                  type: "number",
                                },
                                Alemanha: {
                                  type: "number",
                                },
                                "Coreia do Sul": {
                                  type: "number",
                                },
                                Argentina: {
                                  type: "number",
                                },
                                México: {
                                  type: "number",
                                },
                              },
                              required: [],
                            },
                          },
                          required: ["data", "estadio", "equipes", "resultado"],
                        },
                      },
                    },
                    required: [
                      "ano",
                      "paisSede",
                      "estadios",
                      "equipes",
                      "jogos",
                    ],
                  },
                },
              },
              required: ["copasDoMundo"],
            },
          },
        ],
        responses: {
          200: {
            description: "Challenger Automation 7 successful",
          },
        },
      },
    },
    "/json_8": {
      get: {
        tags: ["Challenger"],
        summary: "Open challenger 8 " + count(),
        description:
          "Disponibilidade de Quartos: Certificar que os quartos de hotel listados nas reservas estejam disponíveis nas datas especificadas pela reserva do cliente, sem sobreposição com outras reservas.\n\nCompatibilidade de Reservas: Garantir que as datas e locais de voos, hotéis, e veículos se alinhem de forma lógica. Por exemplo, um cliente não pode reservar um voo que chega em Londres e imediatamente depois um carro em Paris sem um voo intermediário.\n\nPreço Total da Reserva: Verificar o preço total de cada reserva, incluindo todos os voos, estadias em hotéis e locações de veículos para garantir que o total cobrado está correto e que todas as taxas estão incluídas.",
        parameters: [
          {
            name: "body",
            in: "body",
            schema: {
              $schema: "http://json-schema.org/draft-07/schema#",
              title: "Generated schema for Root",
              type: "object",
              properties: {
                sistemaDeReservas: {
                  type: "object",
                  properties: {
                    voos: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: {
                            type: "string",
                          },
                          companhia: {
                            type: "string",
                          },
                          origem: {
                            type: "string",
                          },
                          destino: {
                            type: "string",
                          },
                          partida: {
                            type: "string",
                          },
                          chegada: {
                            type: "string",
                          },
                          preco: {
                            type: "number",
                          },
                        },
                        required: [
                          "id",
                          "companhia",
                          "origem",
                          "destino",
                          "partida",
                          "chegada",
                          "preco",
                        ],
                      },
                    },
                    hoteis: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: {
                            type: "string",
                          },
                          nome: {
                            type: "string",
                          },
                          cidade: {
                            type: "string",
                          },
                          quartosDisponiveis: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                tipo: {
                                  type: "string",
                                },
                                precoPorNoite: {
                                  type: "number",
                                },
                                capacidade: {
                                  type: "number",
                                },
                              },
                              required: ["tipo", "precoPorNoite", "capacidade"],
                            },
                          },
                        },
                        required: [
                          "id",
                          "nome",
                          "cidade",
                          "quartosDisponiveis",
                        ],
                      },
                    },
                    veiculos: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: {
                            type: "string",
                          },
                          tipo: {
                            type: "string",
                          },
                          modelo: {
                            type: "string",
                          },
                          localRetirada: {
                            type: "string",
                          },
                          precoPorDia: {
                            type: "number",
                          },
                          disponibilidade: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                          },
                        },
                        required: [
                          "id",
                          "tipo",
                          "modelo",
                          "localRetirada",
                          "precoPorDia",
                          "disponibilidade",
                        ],
                      },
                    },
                  },
                  required: ["voos", "hoteis", "veiculos"],
                },
                reservas: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      cliente: {
                        type: "string",
                      },
                      itensReservados: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            tipo: {
                              type: "string",
                            },
                            id: {
                              type: "string",
                            },
                            quarto: {
                              type: "string",
                            },
                            dias: {
                              type: "array",
                              items: {
                                type: "string",
                              },
                            },
                          },
                          required: ["tipo", "id"],
                        },
                      },
                    },
                    required: ["cliente", "itensReservados"],
                  },
                },
              },
              required: ["sistemaDeReservas", "reservas"],
            },
          },
        ],
        responses: {
          200: {
            description: "Challenger Automation 8 successful",
          },
        },
      },
    },
    "/json_9": {
      get: {
        tags: ["Challenger"],
        summary: "Open challenger 9 " + count(),
        description:
          "Desafio de Validação Complexo: Total de Gols: Calcule o total de gols marcados pelo Brasil ao longo dos sete jogos da Copa do Mundo.\n\n Total de Faltas: Determine o total de faltas cometidas pela equipe brasileira durante toda a competição.\n\n Total de Cartões: Conte quantos cartões amarelos e vermelhos foram recebidos pelos jogadores do Brasil durante os sete jogos.\n\nDesafio de Relatórios Detalhados: Crie uma função que processe o JSON dos jogos do Brasil na Copa do Mundo e retorne um relatório detalhado para cada jogo, incluindo: - Total de gols marcados pelo Brasil e pelos adversários. - Nomes dos jogadores que marcaram gols para o Brasil e para os adversários, juntamente com os minutos em que os gols foram marcados. - Total de faltas cometidas pelo Brasil e pelos adversários. - Nomes dos jogadores que cometeram faltas para o Brasil e para os adversários, juntamente com os minutos em que as faltas ocorreram. - Total de cartões (amarelos e vermelhos) recebidos pelo Brasil e pelos adversários. - Nomes dos jogadores que receberam cartões para o Brasil e para os adversários, juntamente com os minutos em que os cartões foram mostrados.\nDesafio de Estatísticas: - Calcule a média de gols por jogo marcados pelo Brasil e pelos adversários. - Identifique o jogo com o maior número de gols. - Determine o jogador brasileiro com mais gols ao longo da competição.",
        parameters: [
          {
            name: "body",
            in: "body",
            schema: {
              $schema: "http://json-schema.org/draft-07/schema#",
              title: "Generated schema for Root",
              type: "object",
              properties: {
                copaDoMundo: {
                  type: "object",
                  properties: {
                    jogosDoBrasil: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: {
                            type: "number",
                          },
                          adversario: {
                            type: "string",
                          },
                          resultado: {
                            type: "string",
                          },
                          placar: {
                            type: "string",
                          },
                          detalhes: {
                            type: "object",
                            properties: {
                              gols: {
                                type: "array",
                                items: {
                                  type: "object",
                                  properties: {
                                    jogador: {
                                      type: "string",
                                    },
                                    minuto: {
                                      type: "number",
                                    },
                                  },
                                  required: ["jogador", "minuto"],
                                },
                              },
                              faltas: {
                                type: "array",
                                items: {
                                  type: "object",
                                  properties: {
                                    jogador: {
                                      type: "string",
                                    },
                                    minuto: {
                                      type: "number",
                                    },
                                  },
                                  required: ["jogador", "minuto"],
                                },
                              },
                              cartoes: {
                                type: "array",
                                items: {
                                  type: "object",
                                  properties: {
                                    jogador: {
                                      type: "string",
                                    },
                                    tipo: {
                                      type: "string",
                                    },
                                    minuto: {
                                      type: "number",
                                    },
                                  },
                                  required: ["jogador", "tipo", "minuto"],
                                },
                              },
                            },
                            required: ["gols", "faltas", "cartoes"],
                          },
                        },
                        required: [
                          "id",
                          "adversario",
                          "resultado",
                          "placar",
                          "detalhes",
                        ],
                      },
                    },
                  },
                  required: ["jogosDoBrasil"],
                },
              },
              required: ["copaDoMundo"],
            },
          },
        ],
        responses: {
          200: {
            description: "Challenger Automation 9 successful",
          },
        },
      },
    },
    "/json_10": {
      get: {
        tags: ["Challenger"],
        summary: "Open challenger 10 " + count(),
        description: "Desafio de Validação Complexo: Encontrar todos os campos",
        parameters: [
          {
            name: "body",
            in: "body",
            schema: {
              $schema: "http://json-schema.org/draft-07/schema#",
              title: "Generated schema for Root",
              type: "array",
              items: {
                type: "object",
                properties: {
                  users: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        main: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              intro: {
                                type: "array",
                                items: {
                                  type: "object",
                                  properties: {
                                    title: {
                                      type: "string",
                                    },
                                    description: {
                                      type: "string",
                                    },
                                    primeira_camada: {
                                      type: "array",
                                      items: {
                                        type: "object",
                                        properties: {
                                          segunda_camada: {
                                            type: "array",
                                            items: {
                                              type: "object",
                                              properties: {
                                                title_segunda_camada: {
                                                  type: "string",
                                                },
                                                terceira_camada: {
                                                  type: "array",
                                                  items: {
                                                    type: "object",
                                                    properties: {
                                                      title_terceira_camada: {
                                                        type: "string",
                                                      },
                                                      quarta_camada: {
                                                        type: "array",
                                                        items: {
                                                          type: "object",
                                                          properties: {
                                                            title_quarta_camada:
                                                              {
                                                                type: "string",
                                                              },
                                                            objeto_quarta_camada:
                                                              {
                                                                type: "object",
                                                                properties: {
                                                                  title: {
                                                                    type: "string",
                                                                  },
                                                                  objeto_da_quarta_camada:
                                                                    {
                                                                      type: "object",
                                                                      properties:
                                                                        {
                                                                          title:
                                                                            {
                                                                              type: "string",
                                                                            },
                                                                          terceiro_objeto_da_camada:
                                                                            {
                                                                              type: "string",
                                                                            },
                                                                        },
                                                                      required:
                                                                        [
                                                                          "title",
                                                                          "terceiro_objeto_da_camada",
                                                                        ],
                                                                    },
                                                                },
                                                                required: [
                                                                  "title",
                                                                  "objeto_da_quarta_camada",
                                                                ],
                                                              },
                                                            quinta_camada: {
                                                              type: "array",
                                                              items: {
                                                                type: "object",
                                                                properties: {
                                                                  title: {
                                                                    type: "string",
                                                                  },
                                                                  intro_quinta_camada:
                                                                    {
                                                                      type: "array",
                                                                      items: {
                                                                        type: "object",
                                                                        properties:
                                                                          {
                                                                            title:
                                                                              {
                                                                                type: "string",
                                                                              },
                                                                          },
                                                                        required:
                                                                          [
                                                                            "title",
                                                                          ],
                                                                      },
                                                                    },
                                                                  sexta_camada:
                                                                    {
                                                                      type: "array",
                                                                      items: {
                                                                        type: "object",
                                                                        properties:
                                                                          {
                                                                            title:
                                                                              {
                                                                                type: "string",
                                                                              },
                                                                            intro_sexta_camada:
                                                                              {
                                                                                type: "object",
                                                                                properties:
                                                                                  {
                                                                                    array_sexta_camada:
                                                                                      {
                                                                                        type: "array",
                                                                                        items:
                                                                                          {
                                                                                            type: "object",
                                                                                            properties:
                                                                                              {
                                                                                                title:
                                                                                                  {
                                                                                                    type: "string",
                                                                                                  },
                                                                                                objeto_sexta_camada:
                                                                                                  {
                                                                                                    type: "object",
                                                                                                    properties:
                                                                                                      {
                                                                                                        title:
                                                                                                          {
                                                                                                            type: "string",
                                                                                                          },
                                                                                                      },
                                                                                                    required:
                                                                                                      [
                                                                                                        "title",
                                                                                                      ],
                                                                                                  },
                                                                                                title_sem_objeto:
                                                                                                  {
                                                                                                    type: "string",
                                                                                                  },
                                                                                              },
                                                                                            required:
                                                                                              [],
                                                                                          },
                                                                                      },
                                                                                  },
                                                                                required:
                                                                                  [
                                                                                    "array_sexta_camada",
                                                                                  ],
                                                                              },
                                                                          },
                                                                        required:
                                                                          [],
                                                                      },
                                                                    },
                                                                },
                                                                required: [],
                                                              },
                                                            },
                                                          },
                                                          required: [],
                                                        },
                                                      },
                                                    },
                                                    required: [],
                                                  },
                                                },
                                              },
                                              required: [],
                                            },
                                          },
                                        },
                                        required: ["segunda_camada"],
                                      },
                                    },
                                  },
                                  required: [],
                                },
                              },
                            },
                            required: ["intro"],
                          },
                        },
                      },
                      required: ["main"],
                    },
                  },
                },
                required: ["users"],
              },
            },
          },
        ],
        responses: {
          200: {
            description: "Challenger Automation 10 successful",
          },
        },
      },
    },
    "/json_11": {
      get: {
        tags: ["Challenger"],
        summary: "Open challenger 11 " + count(),
        description: "Desafio de Validação Complexo: Encontrar todos os campos",
        parameters: [
          {
            name: "body",
            in: "body",
            schema: {
              $schema: "http://json-schema.org/draft-07/schema#",
              title: "Generated schema for Root",
              type: "object",
              properties: {
                user_info: {
                  type: "object",
                  properties: {
                    address: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          primary_address: {
                            type: "object",
                            properties: {
                              house: {
                                type: "array",
                                items: {
                                  type: "object",
                                  properties: {
                                    room: {
                                      type: "object",
                                      properties: {
                                        items: {
                                          type: "object",
                                          properties: {
                                            "item-1": {
                                              type: "string",
                                            },
                                            "item-2": {
                                              type: "string",
                                            },
                                          },
                                          required: ["item-1", "item-2"],
                                        },
                                        bad: {
                                          type: "array",
                                          items: {
                                            type: "object",
                                            properties: {
                                              sanders: {
                                                type: "object",
                                                properties: {
                                                  airPlane: {
                                                    type: "array",
                                                    items: {
                                                      type: "object",
                                                      properties: {
                                                        id: {
                                                          type: "number",
                                                        },
                                                        name: {
                                                          type: "string",
                                                        },
                                                        Brooks: {
                                                          type: "array",
                                                          items: {
                                                            type: "object",
                                                            properties: {
                                                              books: {
                                                                type: "array",
                                                                items: {
                                                                  type: "object",
                                                                  properties: {
                                                                    result_final:
                                                                      {
                                                                        type: "object",
                                                                        properties:
                                                                          {
                                                                            value:
                                                                              {
                                                                                type: "string",
                                                                              },
                                                                          },
                                                                        required:
                                                                          [
                                                                            "value",
                                                                          ],
                                                                      },
                                                                  },
                                                                  required: [
                                                                    "result_final",
                                                                  ],
                                                                },
                                                              },
                                                            },
                                                            required: ["books"],
                                                          },
                                                        },
                                                      },
                                                      required: [],
                                                    },
                                                  },
                                                },
                                                required: ["airPlane"],
                                              },
                                            },
                                            required: ["sanders"],
                                          },
                                        },
                                      },
                                      required: ["items", "bad"],
                                    },
                                  },
                                  required: ["room"],
                                },
                              },
                            },
                            required: ["house"],
                          },
                        },
                        required: ["primary_address"],
                      },
                    },
                  },
                  required: ["address"],
                },
              },
              required: ["user_info"],
            },
          },
        ],
        responses: {
          200: {
            description: "Challenger Automation 11 successful",
          },
        },
      },
    },
    "/json_12": {
      get: {
        tags: ["Challenger"],
        summary: "Open challenger 12 " + count(),
        description:
          "Imprimir de acordo com o valor quais carros cada usuário pode comprar ex: Eu sou Wood tenho 400000 e posso comprar um Dynamics Pink MAS, se ele for VIP Informe quais carro ele também tem direito. Fazer isso para Todos. Validar os endereços da Loja e o ceo.",
        parameters: [
          {
            name: "body",
            in: "body",
            schema: {
              $schema: "http://json-schema.org/draft-07/schema#",
              title: "Generated schema for Root",
              type: "object",
              properties: {
                produtos: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: {
                        type: "number",
                      },
                      nome: {
                        type: "string",
                      },
                      preco: {
                        type: "number",
                      },
                      disponivel: {
                        type: "boolean",
                      },
                    },
                    required: ["id", "nome", "preco", "disponivel"],
                  },
                },
                usuario: {
                  type: "object",
                  properties: {
                    nome: {
                      type: "string",
                    },
                    idade: {
                      type: "number",
                    },
                    email: {
                      type: "string",
                    },
                  },
                  required: ["nome", "idade", "email"],
                },
                configuracoes: {
                  type: "object",
                  properties: {
                    notificacoes: {
                      type: "boolean",
                    },
                    tema: {
                      type: "string",
                    },
                    idioma: {
                      type: "string",
                    },
                  },
                  required: ["notificacoes", "tema", "idioma"],
                },
                endereco: {
                  type: "object",
                  properties: {
                    rua: {
                      type: "string",
                    },
                    numero: {
                      type: "number",
                    },
                    cidade: {
                      type: "string",
                    },
                    estado: {
                      type: "string",
                    },
                    cep: {
                      type: "string",
                    },
                  },
                  required: ["rua", "numero", "cidade", "estado", "cep"],
                },
                historicoDePedidos: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      pedidoId: {
                        type: "number",
                      },
                      produto: {
                        type: "string",
                      },
                      quantidade: {
                        type: "number",
                      },
                      precoTotal: {
                        type: "number",
                      },
                    },
                    required: [
                      "pedidoId",
                      "produto",
                      "quantidade",
                      "precoTotal",
                    ],
                  },
                },
                carrinhoAtual: {
                  type: "object",
                  properties: {
                    produtos: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          produtoId: {
                            type: "number",
                          },
                          quantidade: {
                            type: "number",
                          },
                        },
                        required: ["produtoId", "quantidade"],
                      },
                    },
                    precoTotal: {
                      type: "number",
                    },
                  },
                  required: ["produtos", "precoTotal"],
                },
                metodoDePagamento: {
                  type: "object",
                  properties: {
                    cartao: {
                      type: "object",
                      properties: {
                        numero: {
                          type: "string",
                        },
                        validade: {
                          type: "string",
                        },
                        cvv: {
                          type: "string",
                        },
                      },
                      required: ["numero", "validade", "cvv"],
                    },
                  },
                  required: ["cartao"],
                },
                contato: {
                  type: "object",
                  properties: {
                    telefone: {
                      type: "string",
                    },
                    emailSecundario: {
                      type: "string",
                    },
                  },
                  required: ["telefone", "emailSecundario"],
                },
                assinaturaNewsletter: {
                  type: "boolean",
                },
                ultimaCompra: {
                  type: "object",
                  properties: {
                    data: {
                      type: "string",
                    },
                    valor: {
                      type: "number",
                    },
                    produto: {
                      type: "string",
                    },
                  },
                  required: ["data", "valor", "produto"],
                },
                recomendacoes: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      produto: {
                        type: "string",
                      },
                      preco: {
                        type: "number",
                      },
                    },
                    required: ["produto", "preco"],
                  },
                },
                perfilPublico: {
                  type: "boolean",
                },
                estatisticasDeUso: {
                  type: "object",
                  properties: {
                    horasConectado: {
                      type: "number",
                    },
                    diasAtivo: {
                      type: "number",
                    },
                  },
                  required: ["horasConectado", "diasAtivo"],
                },
                amigos: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      nome: {
                        type: "string",
                      },
                      contato: {
                        type: "string",
                      },
                    },
                    required: ["nome", "contato"],
                  },
                },
                preferencias: {
                  type: "object",
                  properties: {
                    categoriasFavoritas: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                    },
                    notificarPromocoes: {
                      type: "boolean",
                    },
                  },
                  required: ["categoriasFavoritas", "notificarPromocoes"],
                },
              },
              required: [
                "produtos",
                "usuario",
                "configuracoes",
                "endereco",
                "historicoDePedidos",
                "carrinhoAtual",
                "metodoDePagamento",
                "contato",
                "assinaturaNewsletter",
                "ultimaCompra",
                "recomendacoes",
                "perfilPublico",
                "estatisticasDeUso",
                "amigos",
                "preferencias",
              ],
            },
          },
        ],
        responses: {
          200: {
            description: "Challenger Automation 12 successful",
          },
        },
      },
    },
    "/all-jsons-data": {
      post: {
        tags: ["Challenger"],
        summary: "Valida os dados de entrada" + count(),
        description:
          "Verifica se os dados enviados correspondem aos conjuntos de dados válidos e pré-definidos. Extrair e enviar via post um dado pedido de cada JSON anterior. json_1, json_2 ...",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  produtoId: {
                    type: "integer",
                    description:
                      "ID do produto, deve corresponder a um ID válido existente.",
                  },
                  usuarioEmail: {
                    type: "string",
                    format: "email",
                    description:
                      "Email do usuário, deve corresponder a um email válido existente.",
                  },
                  eventoNome: {
                    type: "string",
                    description:
                      "Nome do evento, deve corresponder a um nome de evento válido existente.",
                  },
                  linguagemNome: {
                    type: "string",
                    description:
                      "Nome da linguagem de programação, deve corresponder a uma linguagem válida existente.",
                  },
                  empresaProjetoId: {
                    type: "integer",
                    description:
                      "ID do projeto da empresa, deve corresponder a um ID de projeto válido existente.",
                  },
                  agenciaVeiculoId: {
                    type: "string",
                    description:
                      "ID do veículo lançador, deve corresponder a um ID válido existente.",
                  },
                  copaAno: {
                    type: "integer",
                    description:
                      "Ano da Copa do Mundo, deve corresponder a um ano válido existente.",
                  },
                  vooId: {
                    type: "string",
                    description:
                      "ID do voo, deve corresponder a um ID de voo válido existente.",
                  },
                  jogoId: {
                    type: "integer",
                    description:
                      "ID do jogo do Brasil, deve corresponder a um ID de jogo válido existente.",
                  },
                  required: [
                    "produtoId",
                    "usuarioEmail",
                    "eventoNome",
                    "linguagemNome",
                    "empresaProjetoId",
                    "agenciaVeiculoId",
                    "copaAno",
                    "vooId",
                    "jogoId",
                  ],
                },
              },
            },
          },
          responses: {
            200: {
              description:
                "Validação bem-sucedida, todos os dados estão corretos.",
              content: {
                "text/plain": {
                  schema: {
                    type: "string",
                    example:
                      "Todos os dados informados são válidos e foram verificados com sucesso.",
                  },
                },
              },
            },
            400: {
              description: "Erro de validação",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        description:
                          "Mensagem detalhada sobre o erro de validação.",
                      },
                    },
                    example: {
                      message:
                        "Erro de validação: produtoId must be one of [1, 2, 3]",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/infinity-array": {
      get: {
        tags: ["Challenger"],
        summary: "JSON 10 camadas de aray" + count(),
        description: "JSON para treino de validação",
        parameters: [
          {
            name: "body",
            in: "body",
            schema: {
              $schema: "http://json-schema.org/draft-07/schema#",
              title: "Generated schema for Root",
              type: "object",
              properties: {
                layers: {
                  type: "array",
                  items: {
                    type: "array",
                    items: {
                      type: "array",
                      items: {
                        type: "array",
                        items: {
                          type: "array",
                          items: {
                            type: "array",
                            items: {
                              type: "array",
                              items: {
                                type: "array",
                                items: {
                                  type: "array",
                                  items: {
                                    type: "array",
                                    items: {
                                      type: "object",
                                      properties: {
                                        success: {
                                          type: "string",
                                        },
                                      },
                                      required: ["success"],
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              required: ["layers"],
            },
          },
        ],
        responses: {
          200: {
            description: "success",
          },
        },
      },
    },
    "/deep-validation": {
      get: {
        tags: ["Challenger"],
        summary: "JSON com profundidade de validações" + count(),
        description: "JSON para treino de validação",
        parameters: [
          {
            name: "body",
            in: "body",
            schema: {
              $schema: "http://json-schema.org/draft-07/schema#",
              title: "Generated schema for Root",
              type: "object",
              properties: {
                empresa: {
                  type: "object",
                  properties: {
                    departamentos: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          nome: {
                            type: "string",
                          },
                          funcionarios: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                nome: {
                                  type: "string",
                                },
                                cargo: {
                                  type: "string",
                                },
                                projetos: {
                                  type: "array",
                                  items: {
                                    type: "object",
                                    properties: {
                                      nome: {
                                        type: "string",
                                      },
                                      responsavel: {
                                        type: "object",
                                        properties: {
                                          nome: {
                                            type: "string",
                                          },
                                          cargo: {
                                            type: "string",
                                          },
                                        },
                                        required: ["nome", "cargo"],
                                      },
                                      tarefas: {
                                        type: "array",
                                        items: {
                                          type: "object",
                                          properties: {
                                            descricao: {
                                              type: "string",
                                            },
                                            responsavel: {
                                              type: "object",
                                              properties: {
                                                nome: {
                                                  type: "string",
                                                },
                                                cargo: {
                                                  type: "string",
                                                },
                                              },
                                              required: ["nome", "cargo"],
                                            },
                                          },
                                          required: [
                                            "descricao",
                                            "responsavel",
                                          ],
                                        },
                                      },
                                    },
                                    required: [
                                      "nome",
                                      "responsavel",
                                      "tarefas",
                                    ],
                                  },
                                },
                              },
                              required: ["nome", "cargo", "projetos"],
                            },
                          },
                        },
                        required: ["nome", "funcionarios"],
                      },
                    },
                  },
                  required: ["departamentos"],
                },
              },
              required: ["empresa"],
            },
          },
        ],
        responses: {
          200: {
            description: "success",
          },
        },
      },
    },
    "/germany-api": {
      get: {
        tags: ["Others"],
        summary: "JSON com profundidade de validações" + count(),
        description: "JSON para treino de validação",
        parameters: [
          {
            name: "body",
            in: "body",
            schema: {
              $schema: "http://json-schema.org/draft-07/schema#",
              title: "Generated schema for Root",
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: {
                    type: "object",
                    properties: {
                      common: {
                        type: "string",
                      },
                      official: {
                        type: "string",
                      },
                      nativeName: {
                        type: "object",
                        properties: {
                          deu: {
                            type: "object",
                            properties: {
                              official: {
                                type: "string",
                              },
                              common: {
                                type: "string",
                              },
                            },
                            required: ["official", "common"],
                          },
                        },
                        required: ["deu"],
                      },
                    },
                    required: ["common", "official", "nativeName"],
                  },
                  tld: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                  cca2: {
                    type: "string",
                  },
                  ccn3: {
                    type: "string",
                  },
                  cca3: {
                    type: "string",
                  },
                  cioc: {
                    type: "string",
                  },
                  independent: {
                    type: "boolean",
                  },
                  status: {
                    type: "string",
                  },
                  unMember: {
                    type: "boolean",
                  },
                  currencies: {
                    type: "object",
                    properties: {
                      EUR: {
                        type: "object",
                        properties: {
                          name: {
                            type: "string",
                          },
                          symbol: {
                            type: "string",
                          },
                        },
                        required: ["name", "symbol"],
                      },
                    },
                    required: ["EUR"],
                  },
                  idd: {
                    type: "object",
                    properties: {
                      root: {
                        type: "string",
                      },
                      suffixes: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                      },
                    },
                    required: ["root", "suffixes"],
                  },
                  capital: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                  altSpellings: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                  region: {
                    type: "string",
                  },
                  subregion: {
                    type: "string",
                  },
                  languages: {
                    type: "object",
                    properties: {
                      deu: {
                        type: "string",
                      },
                    },
                    required: ["deu"],
                  },
                  translations: {
                    type: "object",
                    properties: {
                      ara: {
                        type: "object",
                        properties: {
                          official: {
                            type: "string",
                          },
                          common: {
                            type: "string",
                          },
                        },
                        required: ["official", "common"],
                      },
                      bre: {
                        type: "object",
                        properties: {
                          official: {
                            type: "string",
                          },
                          common: {
                            type: "string",
                          },
                        },
                        required: ["official", "common"],
                      },
                      ces: {
                        type: "object",
                        properties: {
                          official: {
                            type: "string",
                          },
                          common: {
                            type: "string",
                          },
                        },
                        required: ["official", "common"],
                      },
                      cym: {
                        type: "object",
                        properties: {
                          official: {
                            type: "string",
                          },
                          common: {
                            type: "string",
                          },
                        },
                        required: ["official", "common"],
                      },
                      deu: {
                        type: "object",
                        properties: {
                          official: {
                            type: "string",
                          },
                          common: {
                            type: "string",
                          },
                        },
                        required: ["official", "common"],
                      },
                      est: {
                        type: "object",
                        properties: {
                          official: {
                            type: "string",
                          },
                          common: {
                            type: "string",
                          },
                        },
                        required: ["official", "common"],
                      },
                      fin: {
                        type: "object",
                        properties: {
                          official: {
                            type: "string",
                          },
                          common: {
                            type: "string",
                          },
                        },
                        required: ["official", "common"],
                      },
                      fra: {
                        type: "object",
                        properties: {
                          official: {
                            type: "string",
                          },
                          common: {
                            type: "string",
                          },
                        },
                        required: ["official", "common"],
                      },
                      hrv: {
                        type: "object",
                        properties: {
                          official: {
                            type: "string",
                          },
                          common: {
                            type: "string",
                          },
                        },
                        required: ["official", "common"],
                      },
                      hun: {
                        type: "object",
                        properties: {
                          official: {
                            type: "string",
                          },
                          common: {
                            type: "string",
                          },
                        },
                        required: ["official", "common"],
                      },
                      ita: {
                        type: "object",
                        properties: {
                          official: {
                            type: "string",
                          },
                          common: {
                            type: "string",
                          },
                        },
                        required: ["official", "common"],
                      },
                      jpn: {
                        type: "object",
                        properties: {
                          official: {
                            type: "string",
                          },
                          common: {
                            type: "string",
                          },
                        },
                        required: ["official", "common"],
                      },
                      kor: {
                        type: "object",
                        properties: {
                          official: {
                            type: "string",
                          },
                          common: {
                            type: "string",
                          },
                        },
                        required: ["official", "common"],
                      },
                      nld: {
                        type: "object",
                        properties: {
                          official: {
                            type: "string",
                          },
                          common: {
                            type: "string",
                          },
                        },
                        required: ["official", "common"],
                      },
                      per: {
                        type: "object",
                        properties: {
                          official: {
                            type: "string",
                          },
                          common: {
                            type: "string",
                          },
                        },
                        required: ["official", "common"],
                      },
                      pol: {
                        type: "object",
                        properties: {
                          official: {
                            type: "string",
                          },
                          common: {
                            type: "string",
                          },
                        },
                        required: ["official", "common"],
                      },
                      por: {
                        type: "object",
                        properties: {
                          official: {
                            type: "string",
                          },
                          common: {
                            type: "string",
                          },
                        },
                        required: ["official", "common"],
                      },
                      rus: {
                        type: "object",
                        properties: {
                          official: {
                            type: "string",
                          },
                          common: {
                            type: "string",
                          },
                        },
                        required: ["official", "common"],
                      },
                      slk: {
                        type: "object",
                        properties: {
                          official: {
                            type: "string",
                          },
                          common: {
                            type: "string",
                          },
                        },
                        required: ["official", "common"],
                      },
                      spa: {
                        type: "object",
                        properties: {
                          official: {
                            type: "string",
                          },
                          common: {
                            type: "string",
                          },
                        },
                        required: ["official", "common"],
                      },
                      srp: {
                        type: "object",
                        properties: {
                          official: {
                            type: "string",
                          },
                          common: {
                            type: "string",
                          },
                        },
                        required: ["official", "common"],
                      },
                      swe: {
                        type: "object",
                        properties: {
                          official: {
                            type: "string",
                          },
                          common: {
                            type: "string",
                          },
                        },
                        required: ["official", "common"],
                      },
                      tur: {
                        type: "object",
                        properties: {
                          official: {
                            type: "string",
                          },
                          common: {
                            type: "string",
                          },
                        },
                        required: ["official", "common"],
                      },
                      urd: {
                        type: "object",
                        properties: {
                          official: {
                            type: "string",
                          },
                          common: {
                            type: "string",
                          },
                        },
                        required: ["official", "common"],
                      },
                      zho: {
                        type: "object",
                        properties: {
                          official: {
                            type: "string",
                          },
                          common: {
                            type: "string",
                          },
                        },
                        required: ["official", "common"],
                      },
                    },
                    required: [
                      "ara",
                      "bre",
                      "ces",
                      "cym",
                      "deu",
                      "est",
                      "fin",
                      "fra",
                      "hrv",
                      "hun",
                      "ita",
                      "jpn",
                      "kor",
                      "nld",
                      "per",
                      "pol",
                      "por",
                      "rus",
                      "slk",
                      "spa",
                      "srp",
                      "swe",
                      "tur",
                      "urd",
                      "zho",
                    ],
                  },
                  latlng: {
                    type: "array",
                    items: {
                      type: "number",
                    },
                  },
                  landlocked: {
                    type: "boolean",
                  },
                  borders: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                  area: {
                    type: "number",
                  },
                  demonyms: {
                    type: "object",
                    properties: {
                      eng: {
                        type: "object",
                        properties: {
                          f: {
                            type: "string",
                          },
                          m: {
                            type: "string",
                          },
                        },
                        required: ["f", "m"],
                      },
                      fra: {
                        type: "object",
                        properties: {
                          f: {
                            type: "string",
                          },
                          m: {
                            type: "string",
                          },
                        },
                        required: ["f", "m"],
                      },
                    },
                    required: ["eng", "fra"],
                  },
                  flag: {
                    type: "string",
                  },
                  maps: {
                    type: "object",
                    properties: {
                      googleMaps: {
                        type: "string",
                      },
                      openStreetMaps: {
                        type: "string",
                      },
                    },
                    required: ["googleMaps", "openStreetMaps"],
                  },
                  population: {
                    type: "number",
                  },
                  gini: {
                    type: "object",
                    properties: {
                      2016: {
                        type: "number",
                      },
                    },
                    required: ["2016"],
                  },
                  fifa: {
                    type: "string",
                  },
                  car: {
                    type: "object",
                    properties: {
                      signs: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                      },
                      side: {
                        type: "string",
                      },
                    },
                    required: ["signs", "side"],
                  },
                  timezones: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                  continents: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                  flags: {
                    type: "object",
                    properties: {
                      png: {
                        type: "string",
                      },
                      svg: {
                        type: "string",
                      },
                      alt: {
                        type: "string",
                      },
                    },
                    required: ["png", "svg", "alt"],
                  },
                  coatOfArms: {
                    type: "object",
                    properties: {
                      png: {
                        type: "string",
                      },
                      svg: {
                        type: "string",
                      },
                    },
                    required: ["png", "svg"],
                  },
                  startOfWeek: {
                    type: "string",
                  },
                  capitalInfo: {
                    type: "object",
                    properties: {
                      latlng: {
                        type: "array",
                        items: {
                          type: "number",
                        },
                      },
                    },
                    required: ["latlng"],
                  },
                  postalCode: {
                    type: "object",
                    properties: {
                      format: {
                        type: "string",
                      },
                      regex: {
                        type: "string",
                      },
                    },
                    required: ["format", "regex"],
                  },
                },
                required: [
                  "name",
                  "tld",
                  "cca2",
                  "ccn3",
                  "cca3",
                  "cioc",
                  "independent",
                  "status",
                  "unMember",
                  "currencies",
                  "idd",
                  "capital",
                  "altSpellings",
                  "region",
                  "subregion",
                  "languages",
                  "translations",
                  "latlng",
                  "landlocked",
                  "borders",
                  "area",
                  "demonyms",
                  "flag",
                  "maps",
                  "population",
                  "gini",
                  "fifa",
                  "car",
                  "timezones",
                  "continents",
                  "flags",
                  "coatOfArms",
                  "startOfWeek",
                  "capitalInfo",
                  "postalCode",
                ],
              },
            },
          },
        ],
        responses: {
          200: {
            description: "success",
          },
        },
      },
    },
    "/independent": {
      get: {
        tags: ["Others"],
        summary: "JSON com profundidade de validações" + count(),
        description: "JSON para treino de validação",
        responses: {
          200: {
            description: "success",
          },
        },
      },
    },
    "/brasil": {
      get: {
        tags: ["Others"],
        summary: "JSON com profundidade de validações" + count(),
        description:
          "JSON para treino de validação. \n\nVocê pode fazer as chamadas nos seguintes endpoints: \n1.",
        parameters: [
          {
            name: "body",
            in: "body",
          },
        ],
        responses: {
          200: {
            description: "success",
          },
        },
      },
    },
    "/big-json": {
      get: {
        tags: ["Others"],
        summary: "JSON com profundidade de validações" + count(),
        description: "BIG JSON",
        parameters: [
          {
            name: "body",
            in: "body",
          },
        ],
        responses: {
          200: {
            description: "success",
          },
        },
      },
    },
    "/crud": {
      get: {
        tags: ["CRUD"],
        summary: "JSON CRUD validações" + count(),
        description: "JSON para treino de validação",
        parameters: [
          {
            name: "body",
            in: "body",
            schema: {},
          },
        ],
        responses: {
          200: {
            description: "success",
          },
        },
      },

      post: {
        tags: ["CRUD"],
        summary: "JSON CRUD validações" + count(),
        description: "JSON para treino de validação",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $schema: "http://json-schema.org/draft-07/schema#",
                title: "Generated schema for Root",
                type: "object",
                properties: {
                  nome: {
                    type: "string",
                  },
                  email: {
                    type: "string",
                  },
                  idade: {
                    type: "number",
                  },
                  telefone: {
                    type: "string",
                  },
                  endereco: {
                    type: "string",
                  },
                  profissao: {
                    type: "string",
                  },
                  empresa: {
                    type: "string",
                  },
                },
                required: [
                  "nome",
                  "email",
                  "idade",
                  "telefone",
                  "endereco",
                  "profissao",
                  "empresa",
                ],
              },
            },
          },
          responses: {
            201: {
              description:
                "Validação bem-sucedida, todos os dados estão corretos.",
              content: {
                "text/plain": {
                  schema: {
                    $schema: "http://json-schema.org/draft-07/schema#",
                    title: "Generated schema for Root",
                    type: "object",
                    properties: {
                      nome: {
                        type: "string",
                      },
                      email: {
                        type: "string",
                      },
                      idade: {
                        type: "number",
                      },
                      telefone: {
                        type: "string",
                      },
                      endereco: {
                        type: "string",
                      },
                      profissao: {
                        type: "string",
                      },
                      empresa: {
                        type: "string",
                      },
                    },
                    required: [
                      "nome",
                      "email",
                      "idade",
                      "telefone",
                      "endereco",
                      "profissao",
                      "empresa",
                    ],
                  },
                },
              },
            },
            400: {
              description: "Erro de validação",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        description:
                          "Mensagem detalhada sobre o erro de validação.",
                      },
                    },
                    example: {
                      message:
                        "Erro de validação: produtoId must be one of [1, 2, 3]",
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "success",
          },
        },
      },
    },
    "/crud/{id}": {
      get: {
        tags: ["CRUD"],
        summary: "JSON CRUD validações" + count(),
        description: "JSON para treino de validação",
        operationId: "getUserById",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "The ID of the user to retrieve",
            schema: {
              type: "integer",
              format: "int64",
            },
          },
        ],
        responses: {
          200: {
            description: "success",
          },
        },
      },
      put: {
        tags: ["CRUD"],
        summary: "JSON CRUD validações " + count(),
        description: "JSON para treino de validação",
        operationId: "updateUserById",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "The ID of the user to update",
            schema: {
              type: "integer",
              format: "int64",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  nome: {
                    type: "string",
                    description: "Nome do usuário",
                  },
                  email: {
                    type: "string",
                    description: "Email do usuário",
                  },
                  idade: {
                    type: "integer",
                    description: "Idade do usuário",
                  },
                  telefone: {
                    type: "string",
                    description: "Telefone do usuário",
                  },
                  endereco: {
                    type: "string",
                    description: "Endereço do usuário",
                  },
                  profissao: {
                    type: "string",
                    description: "Profissão do usuário",
                  },
                  empresa: {
                    type: "string",
                    description: "Empresa do usuário",
                  },
                },
                required: ["nome"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Usuário atualizado com sucesso",
          },
          400: {
            description: "Erro na requisição",
          },
          404: {
            description: "Usuário não encontrado",
          },
        },
      },
      delete: {
        tags: ["CRUD"],
        summary: "JSON CRUD validações" + count(),
        description: "JSON para treino de validação",
        operationId: "deleteUserById",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "The ID of the user to retrieve",
            schema: {
              type: "integer",
              format: "int64",
            },
          },
        ],
        responses: {
          200: {
            description: "success",
          },
        },
      },
    },
    "/produtos": {
      post: {
        tags: ["Shop"],
        summary: "Compra um produto " + count(),
        description:
          "Realiza a compra de um produto verificando o saldo na carteira",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  nome: {
                    type: "string",
                    description: "Nome do cliente",
                    example: "Nome do Cliente",
                  },
                  cpf: {
                    type: "string",
                    description: "CPF do cliente",
                    example: "12345678900",
                  },
                  id_produto: {
                    type: "integer",
                    description: "ID do produto",
                    example: 1,
                  },
                  valor_na_carteira: {
                    type: "number",
                    description: "Valor disponível na carteira do cliente",
                    example: 5000,
                  },
                  send_email: {
                    type: "string",
                    description: "Se o cliente deseja enviar email",
                    example: "email@email.com",
                  },
                },
                required: ["nome", "cpf", "id_produto", "valor_na_carteira"],
              },
            },
          },
        },
        responses: {
          201: {
            description: "Compra realizada com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    produto: {
                      type: "object",
                      description: "Dados do produto comprado",
                    },
                    message: {
                      type: "string",
                      description: "Mensagem de confirmação da compra",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Erro na requisição",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    errors: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          msg: {
                            type: "string",
                          },
                          param: {
                            type: "string",
                          },
                          location: {
                            type: "string",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "Produto não encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
          500: {
            description: "Erro no servidor",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
        },
      },
      get: {
        tags: ["Shop"],
        summary: "Busca todos os produtos " + count(),
        description: "Retorna uma lista de todos os produtos",
        responses: {
          200: {
            description: "Lista de produtos",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: {
                        type: "integer",
                        description: "ID do produto",
                      },
                      nome: {
                        type: "string",
                        description: "Nome do produto",
                      },
                      marca: {
                        type: "string",
                        description: "Marca do produto",
                      },
                      preco: {
                        type: "number",
                        description: "Preço do produto",
                      },
                    },
                  },
                  example: [
                    {
                      id: 1,
                      nome: "TV Smart 4K",
                      marca: "Samsung",
                      preco: 4500,
                    },
                    {
                      id: 2,
                      nome: "OLED 55' 4K",
                      marca: "LG",
                      preco: 6200,
                    },
                  ],
                },
              },
            },
          },
          500: {
            description: "Erro no servidor",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/produtos/{id_produto}": {
      get: {
        tags: ["Shop"],
        summary: "Busca um produto por ID " + count(),
        description: "Retorna os detalhes de um produto pelo seu ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID do produto",
            schema: {
              type: "integer",
              format: "int64",
              example: 1,
            },
          },
        ],
        responses: {
          200: {
            description: "Detalhes do produto",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: {
                      type: "integer",
                      description: "ID do produto",
                    },
                    nome: {
                      type: "string",
                      description: "Nome do produto",
                    },
                    marca: {
                      type: "string",
                      description: "Marca do produto",
                    },
                    preco: {
                      type: "number",
                      description: "Preço do produto",
                    },
                  },
                  example: {
                    id: 1,
                    nome: "TV Smart 4K",
                    marca: "Samsung",
                    preco: 4500,
                  },
                },
              },
            },
          },
          404: {
            description: "Produto não encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
          500: {
            description: "Erro no servidor",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/clientes": {
      get: {
        tags: ["Bank"],
        summary: "Lista de Usuários" + count(),
        description: "Retorna uma lista de clientes com cpf inválido.",
        responses: {
          200: {
            description: "Lista de clientes retornada com sucesso.",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      nome: {
                        type: "string",
                      },
                      cpf: {
                        type: "string",
                      },
                      contato: {
                        type: "object",
                        properties: {
                          email: {
                            type: "string",
                          },
                          telefone: {
                            type: "string",
                          },
                          endereco: {
                            type: "string",
                          },
                        },
                      },
                      bank: {
                        type: "object",
                        properties: {
                          credito: {
                            type: "number",
                          },
                          debito: {
                            type: "number",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Bank"],
        summary: "Criar novo cliente" + count(),
        description:
          "Endpoint para criar um novo cliente. Criar um novo cliente para efetuar um pedido de /emprestimo",
        parameters: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  nome: {
                    type: "string",
                  },
                  cpf: {
                    type: "string",
                  },
                  contato: {
                    type: "object",
                    properties: {
                      email: {
                        type: "string",
                        format: "email",
                      },
                      telefone: {
                        type: "string",
                      },
                      endereco: {
                        type: "string",
                      },
                    },
                  },
                  bank: {
                    type: "object",
                    properties: {
                      credito: {
                        type: "number",
                      },
                      debito: {
                        type: "number",
                      },
                    },
                  },
                },
                required: ["nome", "cpf", "contato", "bank"],
              },
            },
          },
        },
        responses: {
          201: {
            description: "Novo cliente criado com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: {
                      type: "string",
                    },
                    nome: {
                      type: "string",
                    },
                    cpf: {
                      type: "string",
                    },
                    contato: {
                      type: "object",
                      properties: {
                        email: {
                          type: "string",
                          format: "email",
                        },
                        telefone: {
                          type: "string",
                        },
                        endereco: {
                          type: "string",
                        },
                      },
                    },
                    bank: {
                      type: "object",
                      properties: {
                        credito: {
                          type: "number",
                        },
                        debito: {
                          type: "number",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Erro de validação",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    errors: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          param: {
                            type: "string",
                          },
                          msg: {
                            type: "string",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/financiamento-produtos": {
      get: {
        tags: ["Bank"],
        summary: "Obter lista de produtos de luxo" + count(),
        description: "Endpoint para obter a lista de produtos de luxo.",
        responses: {
          200: {
            description: "Lista de produtos de luxo recuperada com sucesso.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    produtosDeLuxo: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "string" },
                          nome: { type: "string" },
                          marca: { type: "string" },
                          preco: { type: "number" },
                          tipo: { type: "string" },
                        },
                        required: ["id", "nome", "marca", "preco", "tipo"],
                      },
                    },
                  },
                },
              },
            },
          },
          500: {
            description: "Erro interno do servidor.",
          },
        },
      },
    },
    "/emprestimo": {
      post: {
        tags: ["Bank"],
        summary: "Solicitar Empréstimo" + count(),
        description:
          "Solicita um empréstimo para um cliente. informando id do cliente criado, ou da lista existente, e o valor do emprestimo (tipo inteiro)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  id_cliente: {
                    type: "string",
                    description: "ID do cliente que solicita o empréstimo.",
                  },
                  emprestimo: {
                    type: "integer",
                    description: "Valor do empréstimo solicitado.",
                  },
                },
                required: ["id_cliente", "emprestimo"],
              },
            },
          },
        },
        responses: {
          201: {
            description:
              "Empréstimo aprovado. Retorna o objeto do cliente com o valor de crédito atualizado.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    nome: {
                      type: "string",
                    },
                    cpf: {
                      type: "string",
                    },
                    contato: {
                      type: "object",
                      properties: {
                        email: {
                          type: "string",
                        },
                        telefone: {
                          type: "string",
                        },
                        endereco: {
                          type: "string",
                        },
                      },
                    },
                    bank: {
                      type: "object",
                      properties: {
                        credito: {
                          type: "number",
                        },
                        debito: {
                          type: "number",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Erro ao processar a solicitação.",
          },
        },
      },
    },
    "/contratar-financiamento": {
      post: {
        tags: ["Bank"],
        summary: "Contratar financiamento" + count(),
        description:
          "Endpoint para contratar financiamento de produtos de luxo. Podendo enviar email da aquisição.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $schema: "http://json-schema.org/draft-07/schema#",
                title: "ContratarFinanciamento",
                type: "object",
                properties: {
                  id_cliente: {
                    type: "string",
                    description: "ID do cliente.",
                  },
                  id_produto: {
                    type: "string",
                    description: "ID do produto a ser financiado.",
                  },
                  code_emprestimo: {
                    type: "string",
                    description: "código gerado ao contratar.",
                  },
                  receber_email: {
                    type: "string",
                    description:
                      "Se o comprador opta por receber emails promocionais.",
                  },
                },
                required: ["id_cliente", "id_produto"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Sucesso",
            content: {
              "application/json": {
                schema: {
                  $schema: "http://json-schema.org/draft-07/schema#",
                  title: "MensagemSucesso",
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      description: "Mensagem de sucesso.",
                    },
                  },
                  required: ["message"],
                },
              },
            },
          },
          400: {
            description: "Erro",
            content: {
              "application/json": {
                schema: {
                  $schema: "http://json-schema.org/draft-07/schema#",
                  title: "MensagemErro",
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      description: "Mensagem de erro.",
                    },
                    diferenca: {
                      type: "integer",
                      description:
                        "Diferença entre o preço do produto e o crédito do cliente.",
                    },
                  },
                  required: ["message"],
                },
              },
            },
          },
        },
      },
    },
    "/projects": {
      post: {
        tags: ["Projetos"],
        summary: "Cria um novo projeto" + count(),
        description:
          "Este endpoint cria um novo projeto com um nome, descrição, data de término e membros.",
        operationId: "createProject",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    description: "Nome do projeto",
                  },
                  leader: {
                    type: "string",
                    description: "Líder do projeto",
                  },
                  description: {
                    type: "string",
                    description: "Descrição do projeto",
                  },
                  endDate: {
                    type: "string",
                    format: "date",
                    description: "Data de término do projeto",
                  },
                },
                required: ["name", "description", "endDate", "leader"],
              },
            },
          },
        },
        responses: {
          201: {
            description: "Projeto criado com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                    },
                    project: {
                      type: "object",
                      properties: {
                        id: {
                          type: "integer",
                        },
                        name: {
                          type: "string",
                        },
                        description: {
                          type: "string",
                        },
                        startDate: {
                          type: "string",
                          format: "date",
                        },
                        endDate: {
                          type: "string",
                          format: "date",
                        },
                        members: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Dados inválidos fornecidos",
          },
        },
      },
      get: {
        tags: ["Projetos"],
        summary: "Obtém todos os projetos" + count(),
        description:
          "Este endpoint retorna uma lista de todos os projetos cadastrados.",
        operationId: "getProjects",
        responses: {
          200: {
            description: "Lista de projetos recuperada com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: {
                        type: "integer",
                      },
                      name: {
                        type: "string",
                      },
                      description: {
                        type: "string",
                      },
                      startDate: {
                        type: "string",
                        format: "date",
                      },
                      endDate: {
                        type: "string",
                        format: "date",
                      },
                      members: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "Nenhum projeto encontrado",
          },
        },
      },
    },
    "/projects/{id}": {
      get: {
        tags: ["Projetos"],
        summary: "Busca um projeto por ID" + count(),
        description:
          "Retorna detalhes de um projeto específico baseado no ID fornecido.",
        operationId: "getProjectById",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID do projeto a ser buscado",
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          200: {
            description: "Projeto encontrado e retornado com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: { type: "integer" },
                    name: { type: "string" },
                    description: { type: "string" },
                    startDate: { type: "string", format: "date" },
                    endDate: { type: "string", format: "date" },
                    members: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          name: { type: "string" },
                          office: { type: "string" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "Projeto não encontrado",
          },
        },
      },
    },
    "/projects/{id}": {
      put: {
        tags: ["Projetos"],
        summary: "Atualiza um projeto existente" + count(),
        description:
          "Atualiza os detalhes de um projeto específico pelo ID. Permite atualização parcial.",
        operationId: "updateProject",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID do projeto a ser atualizado",
            schema: {
              type: "integer",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    description: "Nome do projeto",
                  },
                  description: {
                    type: "string",
                    description: "Descrição detalhada do projeto",
                  },
                  startDate: {
                    type: "string",
                    format: "date",
                    description: "Data de início do projeto",
                  },
                  endDate: {
                    type: "string",
                    format: "date",
                    description: "Data de término do projeto",
                  },
                  members: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: {
                          type: "string",
                          description: "Nome do membro",
                        },
                        office: {
                          type: "string",
                          description: "Cargo do membro no projeto",
                        },
                      },
                    },
                    description: "Lista de membros do projeto",
                  },
                },
                required: [],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Projeto atualizado com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                    },
                    project: {
                      type: "object",
                      properties: {
                        id: {
                          type: "integer",
                        },
                        name: {
                          type: "string",
                        },
                        description: {
                          type: "string",
                        },
                        startDate: {
                          type: "string",
                          format: "date",
                        },
                        endDate: {
                          type: "string",
                          format: "date",
                        },
                        members: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              name: {
                                type: "string",
                              },
                              office: {
                                type: "string",
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "Projeto não encontrado",
          },
        },
      },
      delete: {
        tags: ["Projetos"],
        summary: "Deleta um projeto" + count(),
        description: "Deleta um projeto específico pelo ID.",
        operationId: "deleteProject",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID do projeto a ser deletado",
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          200: {
            description: "Projeto deletado com sucesso",
          },
          404: {
            description: "Projeto não encontrado",
          },
        },
      },
    },
    "/projects/{id}/members": {
      get: {
        tags: ["Projetos"],
        summary: "Busca membros de um projeto por ID do projeto" + count(),
        description:
          "Retorna uma lista de membros de um projeto específico baseado no ID do projeto.",
        operationId: "getMembersByProjectId",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID do projeto cujos membros serão buscados",
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          200: {
            description:
              "Membros do projeto encontrados e retornados com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      office: { type: "string" },
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "Projeto não encontrado",
          },
        },
      },
    },
    "/projects/{id}/member": {
      post: {
        tags: ["Projetos"],
        summary:
          "Adiciona um novo membro ao projeto, e usando o campo send_email, você enviará email de teste." +
          count(),
        description:
          "Este endpoint adiciona um novo membro a um projeto existente, identificado pelo ID do projeto. O membro adicionado inclui informações como nome e cargo, e opcionalmente um endereço de email para notificação.",
        operationId: "addMember",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  member_name: {
                    type: "string",
                    description: "Nome do novo membro",
                  },
                  office: {
                    type: "string",
                    description: "Cargo do novo membro",
                  },
                  send_email: {
                    type: "string",
                    description:
                      "Endereço de email opcional para enviar notificação de adesão",
                    nullable: true,
                  },
                },
                required: ["member_name", "office"],
              },
            },
          },
        },
        responses: {
          201: {
            description: "Membro adicionado com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                    },
                    project: {
                      type: "object",
                      properties: {
                        id: {
                          type: "integer",
                        },
                        name: {
                          type: "string",
                        },
                        description: {
                          type: "string",
                        },
                        startDate: {
                          type: "string",
                          format: "date",
                        },
                        endDate: {
                          type: "string",
                          format: "date",
                        },
                        members: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              name: {
                                type: "string",
                              },
                              office: {
                                type: "string",
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Dados inválidos fornecidos",
          },
          404: {
            description: "Projeto não encontrado",
          },
        },
      },
    },
    "/projects/{id}/member/{id_member}": {
      delete: {
        tags: ["Projetos"],
        summary: "Deleta um membro de um projeto" + count(),
        description:
          "Deleta um membro específico de um projeto pelo nome do membro e ID do projeto.",
        operationId: "deleteMember",
        parameters: [
          {
            name: "projectId",
            in: "path",
            required: true,
            description: "ID do projeto do qual o membro será deletado",
            schema: {
              type: "integer",
            },
          },
          {
            name: "id_member",
            in: "path",
            required: true,
            description: "id do membro a ser deletado",
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          200: {
            description: "Membro deletado com sucesso",
          },
          404: {
            description: "Projeto ou membro não encontrado",
          },
        },
      },
    },
    "/clients": {
      post: {
        tags: ["Payments"],
        summary: "Cria um novo cliente" + count(),
        description:
          "Adiciona um novo cliente à lista com informações como nome, CPF, bandeira do cartão e crédito disponível.",
        operationId: "addNewClient",
        requestBody: {
          description: "Dados do cliente necessários para registro",
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    description: "Nome completo do cliente",
                  },
                  cpf: {
                    type: "string",
                    pattern: "^\\d{11}$",
                    description: "CPF do cliente sem pontos ou traços",
                  },
                  card: {
                    type: "object",
                    required: ["flag", "credit"],
                    properties: {
                      flag: {
                        type: "string",
                        enum: ["MASTER", "VISA"],
                        description: "Bandeira do cartão de crédito do cliente",
                      },
                      credit: {
                        type: "number",
                        format: "float",
                        minimum: 0,
                        description:
                          "Valor de crédito disponível para o cliente",
                      },
                    },
                  },
                },
                required: ["name", "cpf", "card"],
              },
            },
          },
        },
        responses: {
          201: {
            description: "Cliente criado com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                    },
                    client: {
                      $ref: "#/components/schemas/Client",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Erro de validação ou dados incorretos fornecidos",
          },
        },
      },
      get: {
        tags: ["Payments"],
        summary: "Obtém a lista de todos os clientes" + count(),
        description:
          "Retorna uma lista contendo todos os clientes registrados, incluindo informações detalhadas como nome, CPF, bandeira do cartão e crédito disponível.",
        operationId: "getClients",
        responses: {
          200: {
            description: "Lista de clientes recuperada com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Client",
                  },
                },
              },
            },
          },
          404: {
            description: "Nenhum cliente encontrado",
          },
        },
      },
    },
    "/clients/{id}": {
      get: {
        tags: ["Payments"],
        summary:
          "Obtém informações detalhadas de um cliente específico por ID" +
          count(),
        description:
          "Retorna um cliente específico baseado no ID fornecido, incluindo nome, CPF, bandeira do cartão e crédito disponível.",
        operationId: "getClientById",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID único do cliente",
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          200: {
            description: "Cliente encontrado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Client",
                },
              },
            },
          },
          404: {
            description: "Cliente não encontrado",
          },
        },
      },
      delete: {
        tags: ["Payments"],
        summary: "Deleta um cliente específico" + count(),
        description: "Remove um cliente do registro com base no ID fornecido.",
        operationId: "deleteClientById",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID único do cliente a ser deletado",
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          200: {
            description: "Cliente deletado com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "Cliente não encontrado",
          },
        },
      },
      put: {
        tags: ["Payments"],
        summary: "Atualiza um cliente existente" + count(),
        description:
          "Atualiza as informações de um cliente específico com base no ID fornecido.",
        operationId: "updateClientById",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID único do cliente a ser atualizado",
            schema: {
              type: "integer",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    description: "Nome completo do cliente",
                  },
                  cpf: {
                    type: "string",
                    pattern: "^\\d{11}$",
                    description: "CPF do cliente sem pontos ou traços",
                  },
                  card: {
                    type: "object",
                    properties: {
                      flag: {
                        type: "string",
                        enum: ["MASTER", "VISA"],
                        description: "Bandeira do cartão de crédito do cliente",
                      },
                      credit: {
                        type: "number",
                        format: "float",
                        description:
                          "Valor de crédito disponível para o cliente",
                      },
                    },
                  },
                },
                required: [],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Cliente atualizado com sucesso",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Client",
                },
              },
            },
          },
          400: {
            description: "Erro de validação ou dados incorretos fornecidos",
          },
          404: {
            description: "Cliente não encontrado",
          },
        },
      },
    },
    "/products-gamers": {
      get: {
        tags: ["Payments"],
        summary: "Lista todos os produtos gamers" + count(),
        description:
          "Retorna uma lista completa de produtos gamers disponíveis.",
        operationId: "getProductsGamers",
        responses: {
          200: {
            description: "Uma lista de produtos gamers",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Products",
                  },
                },
              },
            },
          },
        },
      },
    },
    "/products-purchase-gamers": {
      post: {
        tags: ["Payments"],
        summary: "Realiza uma compra de produto gamer" + count(),
        description:
          "Permite ao cliente comprar um produto, verificando se o cliente e o produto existem, e se o crédito é suficiente. Os valores dos produtos mudam a cada requisção, fazendo com que o tester precise calcular o valor necessário. Podendo enviar email da aquisição.",
        operationId: "buyProduct",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  id_client: {
                    type: "integer",
                    description: "ID do cliente",
                  },
                  id_product: {
                    type: "integer",
                    description: "ID do produto",
                  },
                  send_email: {
                    type: "string",
                    description: "caso queira enviar email para o comprador",
                  },
                },
                required: ["id_client", "id_product"],
              },
            },
          },
        },
        responses: {
          201: {
            description: "Compra realizada com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                    },
                    product: {
                      type: "string",
                    },
                    remainingCredit: {
                      type: "integer",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Erro na compra, como crédito insuficiente",
          },
          404: {
            description: "Cliente ou produto não encontrado",
          },
        },
      },
    },
    "/credit": {
      post: {
        tags: ["Payments"],
        summary: "Solicitação de crédito adicional" + count(),
        description:
          "Permite ao cliente solicitar crédito adicional para a compra de um produto, tente via automação garantir que o crédito seja apenas suficiente e não  a mais.",
        operationId: "requestAdditionalCredit",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  id_client: {
                    type: "integer",
                    description: "ID do cliente",
                  },
                  id_product: {
                    type: "integer",
                    description: "ID do produto",
                  },
                  value_credit: {
                    type: "integer",
                    description: "Valor do crédito adicional solicitado",
                  },
                },
                required: ["id_client", "id_product", "value_credit"],
              },
            },
          },
        },
        responses: {
          201: {
            description: "Crédito adicionado com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                    },
                    newCredit: {
                      type: "integer",
                      description: "Novo total de crédito do cliente",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Solicitação de crédito inválida ou excessiva",
          },
          404: {
            description: "Cliente ou produto não encontrado",
          },
        },
      },
    },
    "/company": {
      post: {
        tags: ["Company"],
        summary: "Cria uma nova empresa" + count(),
        description:
          "Este endpoint cria um novo registro de empresa com nome, CNPJ, estado, cidade, endereço e setor.",
        operationId: "createCompany",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    description: "Nome da empresa",
                  },
                  cnpj: {
                    type: "string",
                    description: "CNPJ válido da empresa",
                  },
                  state: {
                    type: "string",
                    description: "Estado onde a empresa está localizada",
                  },
                  city: {
                    type: "string",
                    description: "Cidade onde a empresa está localizada",
                  },
                  address: {
                    type: "string",
                    description: "Endereço completo da empresa",
                  },
                  sector: {
                    type: "string",
                    description: "Setor de atuação da empresa",
                  },
                },
                required: [
                  "name",
                  "cnpj",
                  "state",
                  "city",
                  "address",
                  "sector",
                ],
              },
            },
          },
        },
        responses: {
          201: {
            description: "Empresa criada com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                    },
                    company: {
                      type: "object",
                      properties: {
                        id: {
                          type: "integer",
                        },
                        name: {
                          type: "string",
                        },
                        cnpj: {
                          type: "string",
                        },
                        state: {
                          type: "string",
                        },
                        city: {
                          type: "string",
                        },
                        address: {
                          type: "string",
                        },
                        sector: {
                          type: "string",
                        },
                        products: {
                          type: "array",
                          items: {
                            type: "object",
                          },
                        },
                        employees: {
                          type: "array",
                          items: {
                            type: "object",
                          },
                        },
                        services: {
                          type: "array",
                          items: {
                            type: "object",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Dados inválidos fornecidos",
          },
        },
      },
      get: {
        tags: ["Company"],
        summary: "Obtém todas as empresas" + count(),
        description:
          "Este endpoint retorna uma lista de todas as empresas cadastradas.",
        operationId: "getcompany",
        responses: {
          200: {
            description: "Lista de empresas recuperada com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: {
                        type: "integer",
                      },
                      name: {
                        type: "string",
                      },
                      cnpj: {
                        type: "string",
                      },
                      state: {
                        type: "string",
                      },
                      city: {
                        type: "string",
                      },
                      address: {
                        type: "string",
                      },
                      sector: {
                        type: "string",
                      },
                      products: {
                        type: "array",
                        items: {
                          type: "object",
                        },
                      },
                      employees: {
                        type: "array",
                        items: {
                          type: "object",
                        },
                      },
                      services: {
                        type: "array",
                        items: {
                          type: "object",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "Nenhuma empresa encontrada",
          },
        },
      },
      put: {
        tags: ["Company"],
        summary: "Atualiza uma empresa específica" + count(),
        description:
          "Este endpoint atualiza os detalhes de uma empresa específica baseada no ID fornecido.",
        operationId: "updateCompany",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID da empresa a ser atualizada",
            type: "integer",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/definitions/Company",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Empresa atualizada com sucesso",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/definitions/Company",
                },
              },
            },
          },
          400: {
            description: "Dados inválidos fornecidos",
          },
          404: {
            description: "Empresa não encontrada",
          },
        },
      },
    },
    "/company/{companyId}": {
      get: {
        tags: ["Company"],
        summary: "Obtém uma empresa pelo ID" + count(),
        description:
          "Retorna os detalhes de uma empresa específica baseado no ID fornecido.",
        operationId: "getCompanyById",
        parameters: [
          {
            name: "companyId",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            description: "ID numérico da empresa a ser recuperada",
          },
        ],
        responses: {
          200: {
            description: "Detalhes da empresa",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Company",
                },
              },
            },
          },
          400: {
            description: "Erro de validação nos parâmetros de entrada",
          },
          404: {
            description: "Empresa não encontrada",
          },
        },
      },
      delete: {
        tags: ["Company"],
        summary: "Deleta uma empresa específica" + count(),
        description:
          "Este endpoint remove uma empresa específica do sistema baseado no ID fornecido.",
        operationId: "deleteCompany",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID da empresa a ser deletada",
            type: "integer",
          },
        ],
        responses: {
          200: {
            description: "Empresa deletada com sucesso",
          },
          404: {
            description: "Empresa não encontrada",
          },
        },
      },
    },
    "/company/{companyId}/products": {
      get: {
        tags: ["Company"],
        summary: "Lista todos os produtos de uma empresa específica" + count(),
        description:
          "Recupera todos os produtos associados a um ID de empresa especificado.",
        operationId: "getCompanyProducts",
        parameters: [
          {
            name: "companyId",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            description:
              "O ID numérico da empresa cujos produtos serão recuperados",
          },
        ],
        responses: {
          200: {
            description: "Lista de produtos recuperada com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      productId: {
                        type: "integer",
                        description: "O identificador único do produto",
                      },
                      productName: {
                        type: "string",
                        description: "O nome do produto",
                      },
                      productDescription: {
                        type: "string",
                        description: "Uma breve descrição do produto",
                      },
                      price: {
                        type: "integer",
                        description: "O preço do produto em centavos",
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Entrada inválida, objeto inválido",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    errors: {
                      type: "array",
                      items: {
                        type: "string",
                        description: "Lista de erros de validação",
                      },
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "Empresa não encontrada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      description:
                        "Mensagem de erro indicando que a empresa não foi encontrada.",
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Company"],
        summary: "Adiciona um produto a uma empresa específica" + count(),
        description:
          "Este endpoint adiciona um novo produto à lista de produtos de uma empresa específica.",
        operationId: "addProductToCompany",
        parameters: [
          {
            name: "companyId",
            in: "path",
            required: true,
            description: "ID da empresa à qual o produto será adicionado",
            type: "integer",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["productName", "productDescription", "price"],
                properties: {
                  productName: {
                    type: "string",
                    description: "Nome do produto",
                  },
                  productDescription: {
                    type: "string",
                    description: "Descrição do produto",
                  },
                  price: {
                    type: "integer",
                    description: "Preço do produto em centavos",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Produto adicionado com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["productName", "productDescription", "price"],
                  properties: {
                    productName: {
                      type: "string",
                      description: "Nome do produto",
                    },
                    productDescription: {
                      type: "string",
                      description: "Descrição do produto",
                    },
                    price: {
                      type: "integer",
                      description: "Preço do produto em centavos",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Dados inválidos fornecidos",
          },
          404: {
            description: "Empresa não encontrada",
          },
        },
      },
    },
    "/company/{companyId}/products/{productId}": {
      get: {
        tags: ["Company"],
        summary: "Obtém um produto específico de uma empresa" + count(),
        description:
          "Retorna os detalhes de um produto específico de uma empresa baseado nos IDs fornecidos da empresa e do produto.",
        operationId: "getProductById",
        parameters: [
          {
            name: "companyId",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            description: "ID da empresa na qual o produto está localizado",
          },
          {
            name: "productId",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            description: "ID do produto que será recuperado",
          },
        ],
        responses: {
          200: {
            description: "Detalhes do produto",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    productId: {
                      type: "integer",
                      description: "ID do produto",
                    },
                    productName: {
                      type: "string",
                      description: "Nome do produto",
                    },
                    productDescription: {
                      type: "string",
                      description: "Descrição do produto",
                    },
                    price: {
                      type: "integer",
                      description: "Preço do produto em centavos",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Erro de validação nos parâmetros de entrada",
          },
          404: {
            description: "Empresa ou produto não encontrado",
          },
        },
      },
      put: {
        tags: ["Company"],
        summary: "Atualiza um produto específico de uma empresa" + count(),
        description:
          "Este endpoint atualiza os detalhes de um produto específico dentro de uma empresa.",
        operationId: "updateProductInCompany",
        parameters: [
          {
            name: "companyId",
            in: "path",
            required: true,
            description: "ID da empresa na qual o produto está localizado",
            type: "integer",
          },
          {
            name: "productId",
            in: "path",
            required: true,
            description: "ID do produto que será atualizado",
            type: "integer",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  productName: {
                    type: "string",
                    description: "Nome do produto",
                    example: "Novo Software de Gestão",
                  },
                  productDescription: {
                    type: "string",
                    description: "Descrição do produto",
                    example:
                      "Software atualizado para gestão empresarial, incluindo módulos de finanças, vendas e operações.",
                  },
                  price: {
                    type: "integer",
                    description: "Preço do produto em centavos",
                    example: 5500,
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Produto atualizado com sucesso",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Product",
                },
              },
            },
          },
          400: {
            description: "Dados inválidos fornecidos",
          },
          404: {
            description: "Empresa ou produto não encontrado",
          },
        },
      },
      delete: {
        tags: ["Company"],
        summary: "Remove um produto de uma empresa" + count(),
        description:
          "Este endpoint remove um produto específico de uma empresa.",
        operationId: "deleteProductFromCompany",
        parameters: [
          {
            name: "companyId",
            in: "path",
            required: true,
            description: "ID da empresa da qual o produto será removido",
            type: "integer",
          },
          {
            name: "productId",
            in: "path",
            required: true,
            description: "ID do produto a ser removido",
            type: "integer",
          },
        ],
        responses: {
          200: {
            description: "Produto removido com sucesso",
          },
          404: {
            description: "Empresa ou produto não encontrado",
          },
        },
      },
    },
    // employees
    "/company/{companyId}/employees": {
      get: {
        tags: ["Company"],
        summary:
          "Lista todos os funcionários de uma empresa específica" + count(),
        description:
          "Recupera todos os funcionários associados a um ID de empresa especificado.",
        operationId: "getEmployeesByCompany",
        parameters: [
          {
            name: "companyId",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            description:
              "O ID numérico da empresa cujos funcionários serão recuperados",
          },
        ],
        responses: {
          200: {
            description: "Lista de funcionários recuperada com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      employeeId: {
                        type: "integer",
                        description: "O identificador único do funcionário",
                      },
                      name: {
                        type: "string",
                        description: "O nome do funcionário",
                      },
                      position: {
                        type: "string",
                        description: "O cargo do funcionário",
                      },
                      email: {
                        type: "string",
                        format: "email",
                        description: "O endereço de email do funcionário",
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Entrada inválida, objeto inválido",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    errors: {
                      type: "array",
                      items: {
                        type: "string",
                        description: "Lista de erros de validação",
                      },
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "Empresa não encontrada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      description:
                        "Mensagem de erro indicando que a empresa não foi encontrada.",
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Company"],
        summary: "Adiciona um funcionário à empresa" + count(),
        description:
          "Cria um novo funcionário dentro da empresa especificada pelo ID da empresa.",
        operationId: "addEmployee",
        parameters: [
          {
            name: "companyId",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            description: "ID da empresa onde o funcionário será adicionado",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "position", "email"],
                properties: {
                  name: {
                    type: "string",
                    description: "Nome do funcionário",
                  },
                  position: {
                    type: "string",
                    description: "Cargo do funcionário",
                  },
                  email: {
                    type: "string",
                    format: "email",
                    description: "Email do funcionário",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Funcionário adicionado com sucesso",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Employee",
                },
              },
            },
          },
          400: {
            description: "Dados inválidos fornecidos",
          },
          404: {
            description: "Empresa não encontrada",
          },
        },
      },
    },
    "/company/{companyId}/employees/{employeeId}": {
      get: {
        tags: ["Company"],
        summary: "Obtém um funcionário específico" + count(),
        description:
          "Retorna os detalhes de um funcionário específico de uma empresa baseado nos IDs fornecidos.",
        operationId: "getEmployeeById",
        parameters: [
          {
            name: "companyId",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            description: "ID da empresa onde o funcionário está localizado",
          },
          {
            name: "employeeId",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            description: "ID do funcionário que será recuperado",
          },
        ],
        responses: {
          200: {
            description: "Detalhes do funcionário recuperado com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    employeeId: {
                      type: "integer",
                      description: "ID do funcionário",
                    },
                    name: {
                      type: "string",
                      description: "Nome do funcionário",
                    },
                    position: {
                      type: "string",
                      description: "Cargo do funcionário",
                    },
                    email: {
                      type: "string",
                      format: "email",
                      description: "Email do funcionário",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Erro de validação nos parâmetros de entrada",
          },
          404: {
            description: "Empresa ou funcionário não encontrado",
          },
        },
      },
      put: {
        tags: ["Company"],
        summary: "Atualiza um funcionário específico" + count(),
        description:
          "Atualiza os detalhes de um funcionário existente na empresa especificada.",
        operationId: "updateEmployee",
        parameters: [
          {
            name: "companyId",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            description: "ID da empresa onde o funcionário está localizado",
          },
          {
            name: "employeeId",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            description: "ID do funcionário a ser atualizado",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    description: "Nome do funcionário",
                  },
                  position: {
                    type: "string",
                    description: "Cargo do funcionário",
                  },
                  email: {
                    type: "string",
                    format: "email",
                    description: "Email do funcionário",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Funcionário atualizado com sucesso",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Employee",
                },
              },
            },
          },
          400: {
            description: "Dados inválidos fornecidos",
          },
          404: {
            description: "Empresa ou funcionário não encontrado",
          },
        },
      },
      delete: {
        tags: ["Company"],
        summary: "Remove um funcionário específico" + count(),
        description:
          "Remove um funcionário da empresa especificada pelo ID da empresa e do funcionário.",
        operationId: "deleteEmployee",
        parameters: [
          {
            name: "companyId",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            description: "ID da empresa da qual o funcionário será removido",
          },
          {
            name: "employeeId",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            description: "ID do funcionário a ser removido",
          },
        ],
        responses: {
          200: {
            description: "Funcionário removido com sucesso",
          },
          404: {
            description: "Empresa ou funcionário não encontrado",
          },
        },
      },
    },
    // services
    "/company/{companyId}/services": {
      get: {
        tags: ["Company"],
        summary: "Lista todos os serviços de uma empresa específica" + count(),
        description:
          "Recupera todos os serviços associados a um ID de empresa especificado.",
        operationId: "getServicesByCompany",
        parameters: [
          {
            name: "companyId",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            description:
              "O ID numérico da empresa cujos serviços serão recuperados",
          },
        ],
        responses: {
          200: {
            description: "Lista de serviços recuperada com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      serviceId: {
                        type: "integer",
                        description: "O identificador único do serviço",
                      },
                      serviceName: {
                        type: "string",
                        description: "O nome do serviço",
                      },
                      serviceDescription: {
                        type: "string",
                        description: "Uma breve descrição do serviço",
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Entrada inválida, objeto inválido",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    errors: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description: "Lista de erros de validação",
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "Empresa não encontrada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      description:
                        "Mensagem de erro indicando que a empresa não foi encontrada.",
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Company"],
        summary: "Adiciona um serviço à empresa" + count(),
        description:
          "Cria um novo serviço dentro da empresa especificada pelo ID da empresa.",
        operationId: "addService",
        parameters: [
          {
            name: "companyId",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            description: "ID da empresa onde o serviço será adicionado",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["serviceName", "serviceDescription"],
                properties: {
                  serviceName: {
                    type: "string",
                    description: "Nome do serviço",
                  },
                  serviceDescription: {
                    type: "string",
                    description: "Descrição do serviço",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Serviço adicionado com sucesso",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Service",
                },
              },
            },
          },
          400: {
            description: "Dados inválidos fornecidos",
          },
          404: {
            description: "Empresa não encontrada",
          },
        },
      },
    },
    "/company/{companyId}/services/{serviceId}": {
      get: {
        tags: ["Company"],
        summary: "Obtém um serviço específico" + count(),
        description:
          "Retorna os detalhes de um serviço específico de uma empresa baseado nos IDs fornecidos.",
        operationId: "getServiceById",
        parameters: [
          {
            name: "companyId",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            description: "ID da empresa onde o serviço está localizado",
          },
          {
            name: "serviceId",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            description: "ID do serviço que será recuperado",
          },
        ],
        responses: {
          200: {
            description: "Detalhes do serviço recuperado com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    serviceId: {
                      type: "integer",
                      description: "ID do serviço",
                    },
                    serviceName: {
                      type: "string",
                      description: "Nome do serviço",
                    },
                    serviceDescription: {
                      type: "string",
                      description: "Descrição do serviço",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Erro de validação nos parâmetros de entrada",
          },
          404: {
            description: "Empresa ou serviço não encontrado",
          },
        },
      },
      put: {
        tags: ["Company"],
        summary: "Atualiza um serviço específico" + count(),
        description:
          "Atualiza os detalhes de um serviço existente na empresa especificada.",
        operationId: "updateService",
        parameters: [
          {
            name: "companyId",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            description: "ID da empresa onde o serviço está localizado",
          },
          {
            name: "serviceId",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            description: "ID do serviço a ser atualizado",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  serviceName: {
                    type: "string",
                    description: "Nome do serviço",
                    example: "Atualização de Software",
                  },
                  serviceDescription: {
                    type: "string",
                    description: "Descrição do serviço",
                    example:
                      "Serviço atualizado para incluir novos recursos de segurança.",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Serviço atualizado com sucesso",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Service",
                },
              },
            },
          },
          400: {
            description: "Dados inválidos fornecidos",
          },
          404: {
            description: "Empresa ou serviço não encontrado",
          },
        },
      },
      delete: {
        tags: ["Company"],
        summary: "Remove um serviço específico" + count(),
        description:
          "Remove um serviço da empresa especificada pelo ID da empresa e do serviço.",
        operationId: "deleteService",
        parameters: [
          {
            name: "companyId",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            description: "ID da empresa da qual o serviço será removido",
          },
          {
            name: "serviceId",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            description: "ID do serviço a ser removido",
          },
        ],
        responses: {
          200: {
            description: "Serviço removido com sucesso",
          },
          404: {
            description: "Empresa ou serviço não encontrado",
          },
        },
      },
    },
    //
    "/mercado": {
      get: {
        tags: ["Mercado"],
        summary: "Recupera todos os dados do mercado" + count(),
        description:
          "Retorna todos os dados da constante `mercado`, incluindo detalhes completos de todas as categorias e produtos.",
        operationId: "getMercado",
        produces: ["application/json"],
        responses: {
          200: {
            description: "Operação bem-sucedida",
            schema: {
              $ref: "#/definitions/Mercado",
            },
          },
          404: {
            description: "Dados não encontrados",
          },
        },
      },
      post: {
        tags: ["Mercado"],
        summary: "Adiciona um novo mercado" + count(),
        description:
          "Cria um novo registro de mercado com estruturas de categorias e subcategorias de produtos inicialmente vazias.",
        operationId: "addMercado",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            in: "body",
            name: "body",
            description: "Objeto de mercado que precisa ser adicionado à loja",
            required: true,
            schema: {
              $ref: "#/definitions/Mercado",
            },
          },
        ],
        responses: {
          201: {
            description: "Mercado criado",
          },
          400: {
            description: "Erro de validação ou dados faltando",
          },
        },
      },
    },
    "/mercado/{mercadoId}": {
      get: {
        tags: ["Mercado"],
        summary: "Busca um mercado por ID" + count(),
        description: "Retorna um mercado especificado pelo ID.",
        operationId: "getMercadoById",
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID do mercado que precisa ser buscado",
            type: "integer",
          },
        ],
        responses: {
          200: {
            description: "Operação bem-sucedida",
            schema: {
              $ref: "#/definitions/Mercado",
            },
          },
          404: {
            description: "Mercado não encontrado",
          },
        },
      },
      put: {
        tags: ["Mercado"],
        summary: "Atualiza um mercado existente" + count(),
        description:
          "Atualiza um mercado específico pelo ID com as informações fornecidas.",
        operationId: "updateMercado",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            name: "mercadoId",
            in: "path",
            required: true,
            type: "integer",
            description: "ID do mercado que será atualizado",
          },
          {
            name: "body",
            in: "body",
            required: true,
            description: "Objeto de mercado com as atualizações",
            schema: {
              $ref: "#/definitions/Mercado",
            },
          },
        ],
        responses: {
          200: {
            description: "Mercado atualizado com sucesso",
            schema: {
              $ref: "#/definitions/Mercado",
            },
          },
          400: {
            description: "Dados de entrada inválidos",
          },
          404: {
            description: "Mercado não encontrado",
          },
        },
      },
      delete: {
        tags: ["Mercado"],
        summary: "Remove um mercado existente" + count(),
        description: "Remove um mercado específico pelo ID.",
        operationId: "deleteMercado",
        produces: ["application/json"],
        parameters: [
          {
            name: "mercadoId",
            in: "path",
            required: true,
            type: "integer",
            description: "ID do mercado que será removido",
          },
        ],
        responses: {
          200: {
            description: "Mercado removido com sucesso",
          },
          404: {
            description: "Mercado não encontrado",
          },
        },
      },
    },
    "/mercado/{mercadoId}/produtos": {
      get: {
        tags: ["Mercado"],
        summary: "Obtém os produtos de um mercado específico" + count(),
        description:
          "Retorna todos os produtos associados a um mercado específico, identificado pelo ID.",
        operationId: "getProdutosByMercadoId",
        produces: ["application/json"],
        parameters: [
          {
            name: "mercadoId",
            in: "path",
            required: true,
            type: "integer",
            description: "ID do mercado cujos produtos estão sendo solicitados",
          },
        ],
        responses: {
          200: {
            description: "Produtos recuperados com sucesso",
            schema: {
              $ref: "#/definitions/Produtos",
            },
          },
          404: {
            description: "Mercado não encontrado",
          },
        },
      },
    },
    "/mercado/{id}/produtos/hortifruit/frutas": {
      get: {
        tags: ["Mercado"],
        summary:
          "Recupera as frutas de hortifruit de um mercado específico" + count(),
        description:
          "Retorna a lista de frutas da categoria hortifruit do mercado especificado pelo ID.",
        operationId: "getFrutasByMercadoId",
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            type: "integer",
            description: "ID do mercado cujas frutas estão sendo solicitadas",
          },
        ],
        responses: {
          200: {
            description: "Lista de frutas recuperada com sucesso",
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                },
                frutas: {
                  type: "array",
                  items: {
                    $ref: "#/definitions/Fruta",
                  },
                },
              },
            },
          },
          404: {
            description: "Mercado não encontrado ou não há frutas cadastradas",
          },
        },
      },
      post: {
        tags: ["Mercado"],
        summary:
          "Adiciona um produto às frutas de hortifruit de um mercado específico" +
          count(),
        description:
          "Adiciona um novo produto à subcategoria de frutas de hortifruit do mercado identificado pelo ID fornecido na URL.",
        operationId: "addProdutoToFruitCategory",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID do mercado ao qual o produto será adicionado",
            type: "integer",
          },
          {
            name: "body",
            in: "body",
            required: true,
            description:
              "Dados do produto para adicionar à subcategoria de frutas",
            schema: {
              $ref: "#/definitions/Produtos",
            },
          },
        ],
        responses: {
          201: {
            description: "Produto adicionado com sucesso",
            schema: {
              $ref: "#/definitions/Produtos",
            },
          },
          400: {
            description: "Dados de entrada inválidos",
          },
          404: {
            description: "Mercado não encontrado",
          },
        },
      },
    },
    "/mercado/{id}/produtos/hortifruit/frutas/{frutaId}": {
      delete: {
        tags: ["Mercado"],
        summary: "Remove uma fruta específica de um mercado" + count(),
        description:
          "Remove uma fruta específica pelo ID da fruta de dentro da categoria hortifruit de um mercado específico, também identificado por ID.",
        operationId: "deleteFruta",
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            type: "integer",
            description: "ID do mercado do qual a fruta será removida",
          },
          {
            name: "frutaId",
            in: "path",
            required: true,
            type: "integer",
            description: "ID da fruta que será removida",
          },
        ],
        responses: {
          200: {
            description: "Fruta removida com sucesso",
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "Fruta com ID 123 foi removido com sucesso.",
                },
              },
            },
          },
          400: {
            description: "Dados de entrada inválidos",
          },
          404: {
            description: "Mercado não encontrado ou fruta não encontrada",
          },
        },
      },
    },
    // legumes
    "/mercado/{id}/produtos/hortifruit/legumes": {
      get: {
        tags: ["Mercado"],
        summary:
          "Recupera as legumes de hortifruit de um mercado específico" +
          count(),
        description:
          "Retorna a lista de legumes da categoria hortifruit do mercado especificado pelo ID.",
        operationId: "getLegumesByMercadoId",
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            type: "integer",
            description: "ID do mercado cujas legumes estão sendo solicitadas",
          },
        ],
        responses: {
          200: {
            description: "Lista de legumes recuperada com sucesso",
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                },
                legumes: {
                  type: "array",
                  items: {
                    $ref: "#/definitions/Fruta",
                  },
                },
              },
            },
          },
          404: {
            description: "Mercado não encontrado ou não há legumes cadastradas",
          },
        },
      },
      post: {
        tags: ["Mercado"],
        summary:
          "Adiciona um produto aos Legumes de hortifruit de um mercado específico" +
          count(),
        description:
          "Adiciona um novo produto à subcategoria de legumes de hortifruit do mercado identificado pelo ID fornecido na URL.",
        operationId: "addProdutoToFruitCategory",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID do mercado ao qual o produto será adicionado",
            type: "integer",
          },
          {
            name: "body",
            in: "body",
            required: true,
            description:
              "Dados do produto para adicionar à subcategoria de legumes",
            schema: {
              $ref: "#/definitions/Produtos",
            },
          },
        ],
        responses: {
          201: {
            description: "Produto adicionado com sucesso",
            schema: {
              $ref: "#/definitions/Produtos",
            },
          },
          400: {
            description: "Dados de entrada inválidos",
          },
          404: {
            description: "Mercado não encontrado",
          },
        },
      },
    },
    "/mercado/{id}/produtos/hortifruit/legumes/{legumesId}": {
      delete: {
        tags: ["Mercado"],
        summary: "Remove um Legume específica de um mercado" + count(),
        description:
          "Remove um Legume específica pelo ID da Legume de dentro da categoria hortifruit de um mercado específico, também identificado por ID.",
        operationId: "deleteLegume",
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            type: "integer",
            description: "ID do mercado do qual a Legume será removida",
          },
          {
            name: "legumesId",
            in: "path",
            required: true,
            type: "integer",
            description: "ID da Legume que será removida",
          },
        ],
        responses: {
          200: {
            description: "Legume removida com sucesso",
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "Legume com ID 123 foi removido com sucesso.",
                },
              },
            },
          },
          400: {
            description: "Dados de entrada inválidos",
          },
          404: {
            description: "Mercado não encontrado ou legume não encontrada",
          },
        },
      },
    },
    // padaria doces
    "/mercado/{id}/produtos/padaria/doces": {
      get: {
        tags: ["Mercado"],
        summary:
          "Recupera os doces de padaria de um mercado específico" + count(),
        description:
          "Retorna a lista de doces da categoria padaria do mercado especificado pelo ID.",
        operationId: "getDocesByMercadoId",
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            type: "integer",
            description: "ID do mercado cujos doces estão sendo solicitadas",
          },
        ],
        responses: {
          200: {
            description: "Lista de doces recuperada com sucesso",
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                },
                doces: {
                  type: "array",
                  items: {
                    $ref: "#/definitions/Fruta",
                  },
                },
              },
            },
          },
          404: {
            description: "Mercado não encontrado ou não há doces cadastradas",
          },
        },
      },
      post: {
        tags: ["Mercado"],
        summary:
          "Adiciona um produto aos doces de padaria de um mercado específico" +
          count(),
        description:
          "Adiciona um novo produto à subcategoria de doces de padaria do mercado identificado pelo ID fornecido na URL.",
        operationId: "addProdutoToDocesCategory",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID do mercado ao qual o produto será adicionado",
            type: "integer",
          },
          {
            name: "body",
            in: "body",
            required: true,
            description:
              "Dados do produto para adicionar à subcategoria de doces",
            schema: {
              $ref: "#/definitions/Produtos",
            },
          },
        ],
        responses: {
          201: {
            description: "Produto adicionado com sucesso",
            schema: {
              $ref: "#/definitions/Produtos",
            },
          },
          400: {
            description: "Dados de entrada inválidos",
          },
          404: {
            description: "Mercado não encontrado",
          },
        },
      },
    },
    "/mercado/{id}/produtos/padaria/doces/{docesId}": {
      delete: {
        tags: ["Mercado"],
        summary: "Remove um Doces específica de um mercado" + count(),
        description:
          "Remove um doce específico pelo ID de Doces de dentro da categoria padaria de um mercado específico, também identificado por ID.",
        operationId: "deleteDoces",
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            type: "integer",
            description: "ID do mercado do qual o Doces será removida",
          },
          {
            name: "docesId",
            in: "path",
            required: true,
            type: "integer",
            description: "ID do Doces que será removida",
          },
        ],
        responses: {
          200: {
            description: "Doces removido com sucesso",
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "Doces com ID 123 foi removido com sucesso.",
                },
              },
            },
          },
          400: {
            description: "Dados de entrada inválidos",
          },
          404: {
            description: "Mercado não encontrado ou Doces não encontrado",
          },
        },
      },
    },
    // padaria salgados
    "/mercado/{id}/produtos/padaria/salgados": {
      get: {
        tags: ["Mercado"],
        summary:
          "Recupera os salgados de padaria de um mercado específico" + count(),
        description:
          "Retorna a lista de salgados da categoria padaria do mercado especificado pelo ID.",
        operationId: "getsalgadoByMercadoId",
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            type: "integer",
            description: "ID do mercado cujos salgados estão sendo solicitadas",
          },
        ],
        responses: {
          200: {
            description: "Lista de salgados recuperada com sucesso",
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                },
                salgado: {
                  type: "array",
                  items: {
                    $ref: "#/definitions/Fruta",
                  },
                },
              },
            },
          },
          404: {
            description: "Mercado não encontrado ou não há salgado cadastradas",
          },
        },
      },
      post: {
        tags: ["Mercado"],
        summary:
          "Adiciona um produto aos salgados de padaria de um mercado específico" +
          count(),
        description:
          "Adiciona um novo produto à subcategoria de salgado de padaria do mercado identificado pelo ID fornecido na URL.",
        operationId: "addProdutoToSalgadoCategory",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID do mercado ao qual o produto será adicionado",
            type: "integer",
          },
          {
            name: "body",
            in: "body",
            required: true,
            description:
              "Dados do produto para adicionar à subcategoria de salgado",
            schema: {
              $ref: "#/definitions/Produtos",
            },
          },
        ],
        responses: {
          201: {
            description: "Produto adicionado com sucesso",
            schema: {
              $ref: "#/definitions/Produtos",
            },
          },
          400: {
            description: "Dados de entrada inválidos",
          },
          404: {
            description: "Mercado não encontrado",
          },
        },
      },
    },
    "/mercado/{id}/produtos/padaria/salgados/{salgadoId}": {
      delete: {
        tags: ["Mercado"],
        summary: "Remove um salgado específica de um mercado" + count(),
        description:
          "Remove um salgado específica pelo ID do salgado de dentro da categoria padaria de um mercado específico, também identificado por ID.",
        operationId: "deleteSalgado",
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            type: "integer",
            description: "ID do mercado do qual o salgado será removida",
          },
          {
            name: "salgadoId",
            in: "path",
            required: true,
            type: "integer",
            description: "ID do salgado que será removida",
          },
        ],
        responses: {
          200: {
            description: "salgado removido com sucesso",
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "salgado com ID 123 foi removido com sucesso.",
                },
              },
            },
          },
          400: {
            description: "Dados de entrada inválidos",
          },
          404: {
            description: "Mercado não encontrado ou salgado não encontrada",
          },
        },
      },
    },
    // acougue bovinos
    "/mercado/{id}/produtos/acougue/bovinos": {
      get: {
        tags: ["Mercado"],
        summary:
          "Recupera os bovinos de acougue de um mercado específico" + count(),
        description:
          "Retorna a lista de bovinos da categoria acougue do mercado especificado pelo ID.",
        operationId: "getBovinoByMercadoId",
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            type: "integer",
            description: "ID do mercado cujos bovinos estão sendo solicitadas",
          },
        ],
        responses: {
          200: {
            description: "Lista de bovinos recuperada com sucesso",
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                },
                salgado: {
                  type: "array",
                  items: {
                    $ref: "#/definitions/Fruta",
                  },
                },
              },
            },
          },
          404: {
            description: "Mercado não encontrado ou não há bovinos cadastrados",
          },
        },
      },
      post: {
        tags: ["Mercado"],
        summary:
          "Adiciona um produto aos bovinos de acougue de um mercado específico" +
          count(),
        description:
          "Adiciona um novo produto à subcategoria de salgado de acougue do mercado identificado pelo ID fornecido na URL.",
        operationId: "addProdutoToBovinoCategory",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID do mercado ao qual o produto será adicionado",
            type: "integer",
          },
          {
            name: "body",
            in: "body",
            required: true,
            description:
              "Dados do produto para adicionar à subcategoria de salgado",
            schema: {
              $ref: "#/definitions/Produtos",
            },
          },
        ],
        responses: {
          201: {
            description: "Produto adicionado com sucesso",
            schema: {
              $ref: "#/definitions/Produtos",
            },
          },
          400: {
            description: "Dados de entrada inválidos",
          },
          404: {
            description: "Mercado não encontrado",
          },
        },
      },
    },
    "/mercado/{id}/produtos/acougue/bovinos/{bovinosId}": {
      delete: {
        tags: ["Mercado"],
        summary: "Remove um bovino específica de um mercado" + count(),
        description:
          "Remove um bovino específica pelo ID do bovino de dentro da categoria acougue de um mercado específico, também identificado por ID.",
        operationId: "deletebovino",
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            type: "integer",
            description: "ID do mercado do qual o bovino será removida",
          },
          {
            name: "bovinosId",
            in: "path",
            required: true,
            type: "integer",
            description: "ID do bovino que será removida",
          },
        ],
        responses: {
          200: {
            description: "bovino removido com sucesso",
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "bovino com ID 123 foi removido com sucesso.",
                },
              },
            },
          },
          400: {
            description: "Dados de entrada inválidos",
          },
          404: {
            description: "Mercado não encontrado ou bovino não encontrada",
          },
        },
      },
    },
    // acougue suinos
    "/mercado/{id}/produtos/acougue/suinos": {
      get: {
        tags: ["Mercado"],
        summary:
          "Recupera os suinos de acougue de um mercado específico" + count(),
        description:
          "Retorna a lista de suinos da categoria acougue do mercado especificado pelo ID.",
        operationId: "getSuinoByMercadoId",
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            type: "integer",
            description: "ID do mercado cujos suinos estão sendo solicitadas",
          },
        ],
        responses: {
          200: {
            description: "Lista de suinos recuperada com sucesso",
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                },
                salgado: {
                  type: "array",
                  items: {
                    $ref: "#/definitions/Fruta",
                  },
                },
              },
            },
          },
          404: {
            description: "Mercado não encontrado ou não há suínos cadastradas",
          },
        },
      },
      post: {
        tags: ["Mercado"],
        summary:
          "Adiciona um produto aos suinos de acougue de um mercado específico" +
          count(),
        description:
          "Adiciona um novo produto à subcategoria de salgado de acougue do mercado identificado pelo ID fornecido na URL.",
        operationId: "addProdutoToSuinoCategory",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID do mercado ao qual o produto será adicionado",
            type: "integer",
          },
          {
            name: "body",
            in: "body",
            required: true,
            description:
              "Dados do produto para adicionar à subcategoria de salgado",
            schema: {
              $ref: "#/definitions/Produtos",
            },
          },
        ],
        responses: {
          201: {
            description: "Produto adicionado com sucesso",
            schema: {
              $ref: "#/definitions/Produtos",
            },
          },
          400: {
            description: "Dados de entrada inválidos",
          },
          404: {
            description: "Mercado não encontrado",
          },
        },
      },
    },
    "/mercado/{id}/produtos/acougue/suinos/{suinosId}": {
      delete: {
        tags: ["Mercado"],
        summary: "Remove um suíno específica de um mercado" + count(),
        description:
          "Remove um suíno específica pelo ID do suíno de dentro da categoria acougue de um mercado específico, também identificado por ID.",
        operationId: "deletesuíno",
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            type: "integer",
            description: "ID do mercado do qual o suíno será removida",
          },
          {
            name: "suinosId",
            in: "path",
            required: true,
            type: "integer",
            description: "ID do suíno que será removida",
          },
        ],
        responses: {
          200: {
            description: "suíno removido com sucesso",
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "suíno com ID 123 foi removido com sucesso.",
                },
              },
            },
          },
          400: {
            description: "Dados de entrada inválidos",
          },
          404: {
            description: "Mercado não encontrado ou suíno não encontrada",
          },
        },
      },
    },
    // acougue aves
    "/mercado/{id}/produtos/acougue/aves": {
      get: {
        tags: ["Mercado"],
        summary:
          "Recupera as aves de acougue de um mercado específico" + count(),
        description:
          "Retorna a lista de aves da categoria acougue do mercado especificado pelo ID.",
        operationId: "getAvesByMercadoId",
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            type: "integer",
            description: "ID do mercado cujas aves estão sendo solicitadas",
          },
        ],
        responses: {
          200: {
            description: "Lista de aves recuperada com sucesso",
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                },
                salgado: {
                  type: "array",
                  items: {
                    $ref: "#/definitions/Fruta",
                  },
                },
              },
            },
          },
          404: {
            description: "Mercado não encontrado ou não há aves cadastradas",
          },
        },
      },
      post: {
        tags: ["Mercado"],
        summary:
          "Adiciona um produto aos aves de acougue de um mercado específico" +
          count(),
        description:
          "Adiciona um novo produto à subcategoria de salgado de acougue do mercado identificado pelo ID fornecido na URL.",
        operationId: "addProdutoToAvesCategory",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID do mercado ao qual o produto será adicionado",
            type: "integer",
          },
          {
            name: "body",
            in: "body",
            required: true,
            description:
              "Dados do produto para adicionar à subcategoria de salgado",
            schema: {
              $ref: "#/definitions/Produtos",
            },
          },
        ],
        responses: {
          201: {
            description: "Produto adicionado com sucesso",
            schema: {
              $ref: "#/definitions/Produtos",
            },
          },
          400: {
            description: "Dados de entrada inválidos",
          },
          404: {
            description: "Mercado não encontrado",
          },
        },
      },
    },
    "/mercado/{id}/produtos/acougue/aves/{avesId}": {
      delete: {
        tags: ["Mercado"],
        summary: "Remove uma ave específica de um mercado" + count(),
        description:
          "Remove  pelo ID do ave de dentro da categoria acougue de um mercado específico, também identificado por ID.",
        operationId: "deleteave",
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            type: "integer",
            description: "ID do mercado do qual ave será removida",
          },
          {
            name: "avesId",
            in: "path",
            required: true,
            type: "integer",
            description: "ID do ave que será removida",
          },
        ],
        responses: {
          200: {
            description: "ave removido com sucesso",
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "ave com ID 123 foi removido com sucesso.",
                },
              },
            },
          },
          400: {
            description: "Dados de entrada inválidos",
          },
          404: {
            description: "Mercado não encontrado ou ave não encontrada",
          },
        },
      },
    },
    // peixaria peixes
    "/mercado/{id}/produtos/peixaria/peixes": {
      get: {
        tags: ["Mercado"],
        summary:
          "Recupera as peixes de peixaria de um mercado específico" + count(),
        description:
          "Retorna a lista de peixes da categoria peixaria do mercado especificado pelo ID.",
        operationId: "getpeixesByMercadoId",
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            type: "integer",
            description: "ID do mercado cujas peixes estão sendo solicitadas",
          },
        ],
        responses: {
          200: {
            description: "Lista de peixes recuperada com sucesso",
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                },
                salgado: {
                  type: "array",
                  items: {
                    $ref: "#/definitions/Fruta",
                  },
                },
              },
            },
          },
          404: {
            description: "Mercado não encontrado ou não há peixes cadastradas",
          },
        },
      },
      post: {
        tags: ["Mercado"],
        summary:
          "Adiciona um produto aos peixes de peixaria de um mercado específico" +
          count(),
        description:
          "Adiciona um novo produto à subcategoria de salgado de peixaria do mercado identificado pelo ID fornecido na URL.",
        operationId: "addProdutoTopeixesCategory",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID do mercado ao qual o produto será adicionado",
            type: "integer",
          },
          {
            name: "body",
            in: "body",
            required: true,
            description:
              "Dados do produto para adicionar à subcategoria de peixes",
            schema: {
              $ref: "#/definitions/Produtos",
            },
          },
        ],
        responses: {
          201: {
            description: "Produto adicionado com sucesso",
            schema: {
              $ref: "#/definitions/Produtos",
            },
          },
          400: {
            description: "Dados de entrada inválidos",
          },
          404: {
            description: "Mercado não encontrado",
          },
        },
      },
    },
    "/mercado/{id}/produtos/peixaria/peixes/{peixesId}": {
      delete: {
        tags: ["Mercado"],
        summary: "Remove uma ave específica de um mercado" + count(),
        description:
          "Remove  pelo ID do peixe de dentro da categoria peixaria de um mercado específico, também identificado por ID.",
        operationId: "deletepeixe",
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            type: "integer",
            description: "ID do mercado do qual peixe será removida",
          },
          {
            name: "peixesId",
            in: "path",
            required: true,
            type: "integer",
            description: "ID do peixe que será removida",
          },
        ],
        responses: {
          200: {
            description: "peixe removido com sucesso",
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "peixe com ID 123 foi removido com sucesso.",
                },
              },
            },
          },
          400: {
            description: "Dados de entrada inválidos",
          },
          404: {
            description: "Mercado não encontrado ou peixe não encontrada",
          },
        },
      },
    },
    // frutos do mar
    "/mercado/{id}/produtos/peixaria/frutosDoMar": {
      get: {
        tags: ["Mercado"],
        summary:
          "Recupera as frutosDoMar de peixaria de um mercado específico" +
          count(),
        description:
          "Retorna a lista de frutosDoMar da categoria peixaria do mercado especificado pelo ID.",
        operationId: "getfrutosDoMarByMercadoId",
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            type: "integer",
            description:
              "ID do mercado cujas frutosDoMar estão sendo solicitadas",
          },
        ],
        responses: {
          200: {
            description: "Lista de frutosDoMar recuperada com sucesso",
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                },
                salgado: {
                  type: "array",
                  items: {
                    $ref: "#/definitions/Fruta",
                  },
                },
              },
            },
          },
          404: {
            description:
              "Mercado não encontrado ou não há frutosDoMar cadastradas",
          },
        },
      },
      post: {
        tags: ["Mercado"],
        summary:
          "Adiciona um produto aos frutosDoMar de peixaria de um mercado específico" +
          count(),
        description:
          "Adiciona um novo produto à subcategoria de salgado de peixaria do mercado identificado pelo ID fornecido na URL.",
        operationId: "addProdutoTofrutosDoMarCategory",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID do mercado ao qual o produto será adicionado",
            type: "integer",
          },
          {
            name: "body",
            in: "body",
            required: true,
            description:
              "Dados do produto para adicionar à subcategoria de frutosDoMar",
            schema: {
              $ref: "#/definitions/Produtos",
            },
          },
        ],
        responses: {
          201: {
            description: "Produto adicionado com sucesso",
            schema: {
              $ref: "#/definitions/Produtos",
            },
          },
          400: {
            description: "Dados de entrada inválidos",
          },
          404: {
            description: "Mercado não encontrado",
          },
        },
      },
    },
    "/mercado/{id}/produtos/peixaria/frutosDoMar/{frutosDoMarId}": {
      delete: {
        tags: ["Mercado"],
        summary: "Remove uma ave específica de um mercado" + count(),
        description:
          "Remove  pelo ID do frutosDoMar de dentro da categoria peixaria de um mercado específico, também identificado por ID.",
        operationId: "deletefrutosdomar",
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            type: "integer",
            description: "ID do mercado do qual frutosDoMar será removida",
          },
          {
            name: "frutosDoMarsId",
            in: "path",
            required: true,
            type: "integer",
            description: "ID do frutosDoMar que será removida",
          },
        ],
        responses: {
          200: {
            description: "frutosDoMar removido com sucesso",
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "frutosDoMar com ID 123 foi removido com sucesso.",
                },
              },
            },
          },
          400: {
            description: "Dados de entrada inválidos",
          },
          404: {
            description: "Mercado não encontrado ou frutosDoMar não encontrada",
          },
        },
      },
    },

    // frios queijo
    "/mercado/{id}/produtos/frios/queijos": {
      get: {
        tags: ["Mercado"],
        summary:
          "Recupera os queijos de frios de um mercado específico" + count(),
        description:
          "Retorna a lista de queijos da categoria frios do mercado especificado pelo ID.",
        operationId: "getQueijoByMercadoId",
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            type: "integer",
            description: "ID do mercado cujas queijos estão sendo solicitadas",
          },
        ],
        responses: {
          200: {
            description: "Lista de queijos recuperada com sucesso",
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                },
                salgado: {
                  type: "array",
                  items: {
                    $ref: "#/definitions/Fruta",
                  },
                },
              },
            },
          },
          404: {
            description: "Mercado não encontrado ou não há queijos cadastradas",
          },
        },
      },
      post: {
        tags: ["Mercado"],
        summary:
          "Adiciona um produto aos queijos de frios de um mercado específico" +
          count(),
        description:
          "Adiciona um novo produto à subcategoria de salgado de frios do mercado identificado pelo ID fornecido na URL.",
        operationId: "addProdutoToCheeseCategory",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID do mercado ao qual o produto será adicionado",
            type: "integer",
          },
          {
            name: "body",
            in: "body",
            required: true,
            description:
              "Dados do produto para adicionar à subcategoria de frios",
            schema: {
              $ref: "#/definitions/Produtos",
            },
          },
        ],
        responses: {
          201: {
            description: "Produto adicionado com sucesso",
            schema: {
              $ref: "#/definitions/Produtos",
            },
          },
          400: {
            description: "Dados de entrada inválidos",
          },
          404: {
            description: "Mercado não encontrado",
          },
        },
      },
    },
    "/mercado/{id}/produtos/frios/queijos/{queijosId}": {
      delete: {
        tags: ["Mercado"],
        summary: "Remove um queijo específico de um mercado" + count(),
        description:
          "Remove  pelo ID do queijo de dentro da categoria frios de um mercado específico, também identificado por ID.",
        operationId: "deletecheese",
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            type: "integer",
            description: "ID do mercado do qual queijo será removida",
          },
          {
            name: "queijosId",
            in: "path",
            required: true,
            type: "integer",
            description: "ID do queijo que será removida",
          },
        ],
        responses: {
          200: {
            description: "queijo removido com sucesso",
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "queijo com ID 123 foi removido com sucesso.",
                },
              },
            },
          },
          400: {
            description: "Dados de entrada inválidos",
          },
          404: {
            description: "Mercado não encontrado ou queijo não encontrada",
          },
        },
      },
    },
    // frios embutidos
    "/mercado/{id}/produtos/frios/embutidos": {
      get: {
        tags: ["Mercado"],
        summary:
          "Recupera os embutidos de frios de um mercado específico" + count(),
        description:
          "Retorna a lista de embutidos da categoria frios do mercado especificado pelo ID.",
        operationId: "getEmbutByMercadoId",
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            type: "integer",
            description:
              "ID do mercado cujas embutidos estão sendo solicitadas",
          },
        ],
        responses: {
          200: {
            description: "Lista de embutidos recuperada com sucesso",
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                },
                salgado: {
                  type: "array",
                  items: {
                    $ref: "#/definitions/Fruta",
                  },
                },
              },
            },
          },
          404: {
            description:
              "Mercado não encontrado ou não há embutidos cadastradas",
          },
        },
      },
      post: {
        tags: ["Mercado"],
        summary:
          "Adiciona um produto aos embutidos de frios de um mercado específico" +
          count(),
        description:
          "Adiciona um novo produto à subcategoria de frios do mercado identificado pelo ID fornecido na URL.",
        operationId: "addProdutoToFruitCategory",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID do mercado ao qual o produto será adicionado",
            type: "integer",
          },
          {
            name: "body",
            in: "body",
            required: true,
            description:
              "Dados do produto para adicionar à subcategoria de frios",
            schema: {
              $ref: "#/definitions/Produtos",
            },
          },
        ],
        responses: {
          201: {
            description: "Produto adicionado com sucesso",
            schema: {
              $ref: "#/definitions/Produtos",
            },
          },
          400: {
            description: "Dados de entrada inválidos",
          },
          404: {
            description: "Mercado não encontrado",
          },
        },
      },
    },
    "/mercado/{id}/produtos/frios/embutidos/{embutidosId}": {
      delete: {
        tags: ["Mercado"],
        summary: "Remove um embutido específico de um mercado" + count(),
        description:
          "Remove  pelo ID do embutido de dentro da categoria frios de um mercado específico, também identificado por ID.",
        operationId: "deleteEmbut",
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            type: "integer",
            description: "ID do mercado do qual embutido será removida",
          },
          {
            name: "embutidosId",
            in: "path",
            required: true,
            type: "integer",
            description: "ID do embutido que será removida",
          },
        ],
        responses: {
          200: {
            description: "embutido removido com sucesso",
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "embutido com ID 123 foi removido com sucesso.",
                },
              },
            },
          },
          400: {
            description: "Dados de entrada inválidos",
          },
          404: {
            description: "Mercado não encontrado ou embutido não encontrada",
          },
        },
      },
    },
    // frios outros
    "/mercado/{id}/produtos/frios/outros": {
      get: {
        tags: ["Mercado"],
        summary:
          "Recupera os outros de frios de um mercado específico" + count(),
        description:
          "Retorna a lista de outros da categoria frios do mercado especificado pelo ID.",
        operationId: "getOutrosByMercadoId",
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            type: "integer",
            description: "ID do mercado cujas outros estão sendo solicitadas",
          },
        ],
        responses: {
          200: {
            description: "Lista de outros recuperada com sucesso",
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                },
                salgado: {
                  type: "array",
                  items: {
                    $ref: "#/definitions/Fruta",
                  },
                },
              },
            },
          },
          404: {
            description: "Mercado não encontrado ou não há outros cadastradas",
          },
        },
      },
      post: {
        tags: ["Mercado"],
        summary:
          "Adiciona um produto aos outros de frios de um mercado específico" +
          count(),
        description:
          "Adiciona um novo produto à subcategoria de frios do mercado identificado pelo ID fornecido na URL.",
        operationId: "addProdutoToOutrosCategory",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID do mercado ao qual o produto será adicionado",
            type: "integer",
          },
          {
            name: "body",
            in: "body",
            required: true,
            description:
              "Dados do produto para adicionar à subcategoria de frios",
            schema: {
              $ref: "#/definitions/Produtos",
            },
          },
        ],
        responses: {
          201: {
            description: "Produto adicionado com sucesso",
            schema: {
              $ref: "#/definitions/Produtos",
            },
          },
          400: {
            description: "Dados de entrada inválidos",
          },
          404: {
            description: "Mercado não encontrado",
          },
        },
      },
    },
    "/mercado/{id}/produtos/frios/outros/{outrosId}": {
      delete: {
        tags: ["Mercado"],
        summary: "Remove um outros específico de um mercado" + count(),
        description:
          "Remove  pelo ID do outros de dentro da categoria frios de um mercado específico, também identificado por ID.",
        operationId: "deleteOutros",
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            type: "integer",
            description: "ID do mercado do qual outros será removida",
          },
          {
            name: "outrosId",
            in: "path",
            required: true,
            type: "integer",
            description: "ID do outros que será removida",
          },
        ],
        responses: {
          200: {
            description: "outros removido com sucesso",
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "outros com ID 123 foi removido com sucesso.",
                },
              },
            },
          },
          400: {
            description: "Dados de entrada inválidos",
          },
          404: {
            description: "Mercado não encontrado ou outros não encontrada",
          },
        },
      },
    },
    // mercearia graosCereais
    "/mercado/{id}/produtos/mercearia/graosCereais": {
      get: {
        tags: ["Mercado"],
        summary:
          "Recupera os graosCereais de mercearia de um mercado específico" +
          count(),
        description:
          "Retorna a lista de graosCereais da categoria mercearia do mercado especificado pelo ID.",
        operationId: "getgraosCereaisByMercadoId",
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            type: "integer",
            description:
              "ID do mercado cujas graosCereais estão sendo solicitadas",
          },
        ],
        responses: {
          200: {
            description: "Lista de graosCereais recuperada com sucesso",
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                },
                salgado: {
                  type: "array",
                  items: {
                    $ref: "#/definitions/Fruta",
                  },
                },
              },
            },
          },
          404: {
            description:
              "Mercado não encontrado ou não há graosCereais cadastradas",
          },
        },
      },
      post: {
        tags: ["Mercado"],
        summary:
          "Adiciona um produto aos graosCereais de mercearia de um mercado específico" +
          count(),
        description:
          "Adiciona um novo produto à subcategoria de mercearia do mercado identificado pelo ID fornecido na URL.",
        operationId: "addProdutoTograosCereaisCategory",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID do mercado ao qual o produto será adicionado",
            type: "integer",
          },
          {
            name: "body",
            in: "body",
            required: true,
            description:
              "Dados do produto para adicionar à subcategoria de mercearia",
            schema: {
              $ref: "#/definitions/Produtos",
            },
          },
        ],
        responses: {
          201: {
            description: "Produto adicionado com sucesso",
            schema: {
              $ref: "#/definitions/Produtos",
            },
          },
          400: {
            description: "Dados de entrada inválidos",
          },
          404: {
            description: "Mercado não encontrado",
          },
        },
      },
    },
    "/mercado/{id}/produtos/mercearia/graosCereais/{graosCereaisId}": {
      delete: {
        tags: ["Mercado"],
        summary: "Remove um graosCereais específico de um mercado" + count(),
        description:
          "Remove  pelo ID do graosCereais de dentro da categoria mercearia de um mercado específico, também identificado por ID.",
        operationId: "deletegraosCereais",
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            type: "integer",
            description: "ID do mercado do qual graosCereais será removida",
          },
          {
            name: "graosCereaisId",
            in: "path",
            required: true,
            type: "integer",
            description: "ID do graosCereais que será removida",
          },
        ],
        responses: {
          200: {
            description: "graosCereais removido com sucesso",
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "graosCereais com ID 123 foi removido com sucesso.",
                },
              },
            },
          },
          400: {
            description: "Dados de entrada inválidos",
          },
          404: {
            description:
              "Mercado não encontrado ou graosCereais não encontrada",
          },
        },
      },
    },
    // mercearia massas
    "/mercado/{id}/produtos/mercearia/massas": {
      get: {
        tags: ["Mercado"],
        summary:
          "Recupera os massas de mercearia de um mercado específico" + count(),
        description:
          "Retorna a lista de massas da categoria mercearia do mercado especificado pelo ID.",
        operationId: "getmassasByMercadoId",
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            type: "integer",
            description: "ID do mercado cujas massas estão sendo solicitadas",
          },
        ],
        responses: {
          200: {
            description: "Lista de massas recuperada com sucesso",
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                },
                salgado: {
                  type: "array",
                  items: {
                    $ref: "#/definitions/Fruta",
                  },
                },
              },
            },
          },
          404: {
            description: "Mercado não encontrado ou não há massas cadastradas",
          },
        },
      },
      post: {
        tags: ["Mercado"],
        summary:
          "Adiciona um produto aos massas de mercearia de um mercado específico" +
          count(),
        description:
          "Adiciona um novo produto à subcategoria de mercearia do mercado identificado pelo ID fornecido na URL.",
        operationId: "addProdutoTomassasCategory",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID do mercado ao qual o produto será adicionado",
            type: "integer",
          },
          {
            name: "body",
            in: "body",
            required: true,
            description:
              "Dados do produto para adicionar à subcategoria de mercearia",
            schema: {
              $ref: "#/definitions/Produtos",
            },
          },
        ],
        responses: {
          201: {
            description: "Produto adicionado com sucesso",
            schema: {
              $ref: "#/definitions/Produtos",
            },
          },
          400: {
            description: "Dados de entrada inválidos",
          },
          404: {
            description: "Mercado não encontrado",
          },
        },
      },
    },
    "/mercado/{id}/produtos/mercearia/massas/{massasId}": {
      delete: {
        tags: ["Mercado"],
        summary: "Remove um massas específico de um mercado" + count(),
        description:
          "Remove pelo ID de massas de dentro da categoria mercearia de um mercado específico, também identificado por ID.",
        operationId: "deletemassas",
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            type: "integer",
            description: "ID do mercado do qual massas será removida",
          },
          {
            name: "massasId",
            in: "path",
            required: true,
            type: "integer",
            description: "ID do massas que será removida",
          },
        ],
        responses: {
          200: {
            description: "massas removido com sucesso",
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "massas com ID 123 foi removido com sucesso.",
                },
              },
            },
          },
          400: {
            description: "Dados de entrada inválidos",
          },
          404: {
            description: "Mercado não encontrado ou massas não encontrada",
          },
        },
      },
    },
    // merc farinhas
    "/mercado/{id}/produtos/mercearia/farinhas": {
      get: {
        tags: ["Mercado"],
        summary:
          "Recupera os farinhas de mercearia de um mercado específico" +
          count(),
        description:
          "Retorna a lista de farinhas da categoria mercearia do mercado especificado pelo ID.",
        operationId: "getfarinhasByMercadoId",
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            type: "integer",
            description: "ID do mercado cujas farinhas estão sendo solicitadas",
          },
        ],
        responses: {
          200: {
            description: "Lista de farinhas recuperada com sucesso",
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                },
                salgado: {
                  type: "array",
                  items: {
                    $ref: "#/definitions/Fruta",
                  },
                },
              },
            },
          },
          404: {
            description:
              "Mercado não encontrado ou não há farinhas cadastradas",
          },
        },
      },
      post: {
        tags: ["Mercado"],
        summary:
          "Adiciona um produto aos farinhas de mercearia de um mercado específico" +
          count(),
        description:
          "Adiciona um novo produto à subcategoria de mercearia do mercado identificado pelo ID fornecido na URL.",
        operationId: "addProdutoTofarinhasCategory",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID do mercado ao qual o produto será adicionado",
            type: "integer",
          },
          {
            name: "body",
            in: "body",
            required: true,
            description:
              "Dados do produto para adicionar à subcategoria de mercearia",
            schema: {
              $ref: "#/definitions/Produtos",
            },
          },
        ],
        responses: {
          201: {
            description: "Produto adicionado com sucesso",
            schema: {
              $ref: "#/definitions/Produtos",
            },
          },
          400: {
            description: "Dados de entrada inválidos",
          },
          404: {
            description: "Mercado não encontrado",
          },
        },
      },
    },
    "/mercado/{id}/produtos/mercearia/farinhas/{farinhasId}": {
      delete: {
        tags: ["Mercado"],
        summary: "Remove um farinhas específico de um mercado" + count(),
        description:
          "Remove  pelo ID do farinhas de dentro da categoria mercearia de um mercado específico, também identificado por ID.",
        operationId: "deletefarinhas",
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            type: "integer",
            description: "ID do mercado do qual farinhas será removida",
          },
          {
            name: "farinhasId",
            in: "path",
            required: true,
            type: "integer",
            description: "ID do farinhas que será removida",
          },
        ],
        responses: {
          200: {
            description: "farinhas removido com sucesso",
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "farinhas com ID 123 foi removido com sucesso.",
                },
              },
            },
          },
          400: {
            description: "Dados de entrada inválidos",
          },
          404: {
            description: "Mercado não encontrado ou farinhas não encontrada",
          },
        },
      },
    },
    // merc conservados Enlatados
    "/mercado/{id}/produtos/mercearia/conservadosEnlatados": {
      get: {
        tags: ["Mercado"],
        summary:
          "Recupera os conservadosEnlatados de mercearia de um mercado específico" +
          count(),
        description:
          "Retorna a lista de conservadosEnlatados da categoria mercearia do mercado especificado pelo ID.",
        operationId: "getconservadosEnlatadosByMercadoId",
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            type: "integer",
            description:
              "ID do mercado cujas conservadosEnlatados estão sendo solicitadas",
          },
        ],
        responses: {
          200: {
            description: "Lista de conservadosEnlatados recuperada com sucesso",
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                },
                salgado: {
                  type: "array",
                  items: {
                    $ref: "#/definitions/Fruta",
                  },
                },
              },
            },
          },
          404: {
            description:
              "Mercado não encontrado ou não há conservadosEnlatados cadastradas",
          },
        },
      },
      post: {
        tags: ["Mercado"],
        summary:
          "Adiciona um produto aos conservadosEnlatados de mercearia de um mercado específico" +
          count(),
        description:
          "Adiciona um novo produto à subcategoria de mercearia do mercado identificado pelo ID fornecido na URL.",
        operationId: "addProdutoToconservadosEnlatadosCategory",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID do mercado ao qual o produto será adicionado",
            type: "integer",
          },
          {
            name: "body",
            in: "body",
            required: true,
            description:
              "Dados do produto para adicionar à subcategoria de mercearia",
            schema: {
              $ref: "#/definitions/Produtos",
            },
          },
        ],
        responses: {
          201: {
            description: "Produto adicionado com sucesso",
            schema: {
              $ref: "#/definitions/Produtos",
            },
          },
          400: {
            description: "Dados de entrada inválidos",
          },
          404: {
            description: "Mercado não encontrado",
          },
        },
      },
    },
    "/mercado/{id}/produtos/mercearia/conservadosEnlatados/{conservadosEnlatadosId}":
      {
        delete: {
          tags: ["Mercado"],
          summary:
            "Remove um conservadosEnlatados específico de um mercado" + count(),
          description:
            "Remove pelo ID do conservadosEnlatados de dentro da categoria mercearia de um mercado específico, também identificado por ID.",
          operationId: "deleteconservadosEnlatados",
          produces: ["application/json"],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              type: "integer",
              description:
                "ID do mercado do qual conservadosEnlatados será removida",
            },
            {
              name: "conservadosEnlatadosId",
              in: "path",
              required: true,
              type: "integer",
              description: "ID do conservadosEnlatados que será removida",
            },
          ],
          responses: {
            200: {
              description: "conservadosEnlatados removido com sucesso",
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example:
                      "conservadosEnlatados com ID 123 foi removido com sucesso.",
                  },
                },
              },
            },
            400: {
              description: "Dados de entrada inválidos",
            },
            404: {
              description:
                "Mercado não encontrado ou conservadosEnlatados não encontrada",
            },
          },
        },
      },
    // merc oleos
    "/mercado/{id}/produtos/mercearia/oleos": {
      get: {
        tags: ["Mercado"],
        summary:
          "Recupera os oleos de mercearia de um mercado específico" + count(),
        description:
          "Retorna a lista de oleos da categoria mercearia do mercado especificado pelo ID.",
        operationId: "getoleosByMercadoId",
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            type: "integer",
            description: "ID do mercado cujas oleos estão sendo solicitadas",
          },
        ],
        responses: {
          200: {
            description: "Lista de oleos recuperada com sucesso",
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                },
                salgado: {
                  type: "array",
                  items: {
                    $ref: "#/definitions/Fruta",
                  },
                },
              },
            },
          },
          404: {
            description: "Mercado não encontrado ou não há oleos cadastradas",
          },
        },
      },
      post: {
        tags: ["Mercado"],
        summary:
          "Adiciona um produto aos oleos de mercearia de um mercado específico" +
          count(),
        description:
          "Adiciona um novo produto à subcategoria de mercearia do mercado identificado pelo ID fornecido na URL.",
        operationId: "addProdutoTooleosCategory",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID do mercado ao qual o produto será adicionado",
            type: "integer",
          },
          {
            name: "body",
            in: "body",
            required: true,
            description:
              "Dados do produto para adicionar à subcategoria de mercearia",
            schema: {
              $ref: "#/definitions/Produtos",
            },
          },
        ],
        responses: {
          201: {
            description: "Produto adicionado com sucesso",
            schema: {
              $ref: "#/definitions/Produtos",
            },
          },
          400: {
            description: "Dados de entrada inválidos",
          },
          404: {
            description: "Mercado não encontrado",
          },
        },
      },
    },
    "/mercado/{id}/produtos/mercearia/oleos/{oleosId}": {
      delete: {
        tags: ["Mercado"],
        summary: "Remove um oleos específico de um mercado" + count(),
        description:
          "Remove  pelo ID do oleos de dentro da categoria mercearia de um mercado específico, também identificado por ID.",
        operationId: "deleteoleos",
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            type: "integer",
            description: "ID do mercado do qual oleos será removida",
          },
          {
            name: "oleosId",
            in: "path",
            required: true,
            type: "integer",
            description: "ID do oleos que será removida",
          },
        ],
        responses: {
          200: {
            description: "oleos removido com sucesso",
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "oleos com ID 123 foi removido com sucesso.",
                },
              },
            },
          },
          400: {
            description: "Dados de entrada inválidos",
          },
          404: {
            description: "Mercado não encontrado ou oleos não encontrada",
          },
        },
      },
    },
    // merc temperos condimentos
    "/mercado/{id}/produtos/mercearia/temperosCondimentos": {
      get: {
        tags: ["Mercado"],
        summary:
          "Recupera os temperosCondimentos de mercearia de um mercado específico" +
          count(),
        description:
          "Retorna a lista de temperosCondimentos da categoria mercearia do mercado especificado pelo ID.",
        operationId: "gettemperosCondimentosByMercadoId",
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            type: "integer",
            description:
              "ID do mercado cujas temperosCondimentos estão sendo solicitadas",
          },
        ],
        responses: {
          200: {
            description: "Lista de temperosCondimentos recuperada com sucesso",
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                },
                salgado: {
                  type: "array",
                  items: {
                    $ref: "#/definitions/Fruta",
                  },
                },
              },
            },
          },
          404: {
            description:
              "Mercado não encontrado ou não há temperosCondimentos cadastradas",
          },
        },
      },
      post: {
        tags: ["Mercado"],
        summary:
          "Adiciona um produto aos temperosCondimentos de mercearia de um mercado específico" +
          count(),
        description:
          "Adiciona um novo produto à subcategoria de mercearia do mercado identificado pelo ID fornecido na URL.",
        operationId: "addProdutoTotemperosCondimentosCategory",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID do mercado ao qual o produto será adicionado",
            type: "integer",
          },
          {
            name: "body",
            in: "body",
            required: true,
            description:
              "Dados do produto para adicionar à subcategoria de mercearia",
            schema: {
              $ref: "#/definitions/Produtos",
            },
          },
        ],
        responses: {
          201: {
            description: "Produto adicionado com sucesso",
            schema: {
              $ref: "#/definitions/Produtos",
            },
          },
          400: {
            description: "Dados de entrada inválidos",
          },
          404: {
            description: "Mercado não encontrado",
          },
        },
      },
    },
    "/mercado/{id}/produtos/mercearia/temperosCondimentos/{temperosCondimentosId}":
      {
        delete: {
          tags: ["Mercado"],
          summary:
            "Remove um temperosCondimentos específico de um mercado" + count(),
          description:
            "Remove pelo ID do temperosCondimentos de dentro da categoria mercearia de um mercado específico, também identificado por ID.",
          operationId: "deletetemperosCondimentos",
          produces: ["application/json"],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              type: "integer",
              description:
                "ID do mercado do qual temperosCondimentos será removida",
            },
            {
              name: "temperosCondimentosId",
              in: "path",
              required: true,
              type: "integer",
              description: "ID do temperosCondimentos que será removida",
            },
          ],
          responses: {
            200: {
              description: "temperosCondimentos removido com sucesso",
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example:
                      "temperosCondimentos com ID 123 foi removido com sucesso.",
                  },
                },
              },
            },
            400: {
              description: "Dados de entrada inválidos",
            },
            404: {
              description:
                "Mercado não encontrado ou temperosCondimentos não encontrada",
            },
          },
        },
      },
    // bebidas com alcool
    "/mercado/{id}/produtos/bebidas/comAlcool": {
      get: {
        tags: ["Mercado"],
        summary:
          "Recupera os comAlcool de bebidas de um mercado específico" + count(),
        description:
          "Retorna a lista de comAlcool da categoria bebidas do mercado especificado pelo ID.",
        operationId: "getcomAlcoolByMercadoId",
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            type: "integer",
            description:
              "ID do mercado cujas comAlcool estão sendo solicitadas",
          },
        ],
        responses: {
          200: {
            description: "Lista de comAlcool recuperada com sucesso",
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                },
                salgado: {
                  type: "array",
                  items: {
                    $ref: "#/definitions/Fruta",
                  },
                },
              },
            },
          },
          404: {
            description:
              "Mercado não encontrado ou não há comAlcool cadastradas",
          },
        },
      },
      post: {
        tags: ["Mercado"],
        summary:
          "Adiciona um produto aos comAlcool de bebidas de um mercado específico" +
          count(),
        description:
          "Adiciona um novo produto à subcategoria de bebidas do mercado identificado pelo ID fornecido na URL.",
        operationId: "addProdutoTocomAlcoolCategory",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID do mercado ao qual o produto será adicionado",
            type: "integer",
          },
          {
            name: "body",
            in: "body",
            required: true,
            description:
              "Dados do produto para adicionar à subcategoria de bebidas",
            schema: {
              $ref: "#/definitions/Produtos",
            },
          },
        ],
        responses: {
          201: {
            description: "Produto adicionado com sucesso",
            schema: {
              $ref: "#/definitions/Produtos",
            },
          },
          400: {
            description: "Dados de entrada inválidos",
          },
          404: {
            description: "Mercado não encontrado",
          },
        },
      },
    },
    "/mercado/{id}/produtos/bebidas/comAlcool/{comAlcoolId}": {
      delete: {
        tags: ["Mercado"],
        summary: "Remove um comAlcool específico de um mercado" + count(),
        description:
          "Remove  pelo ID do comAlcool de dentro da categoria bebidas de um mercado específico, também identificado por ID.",
        operationId: "deletecomAlcool",
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            type: "integer",
            description: "ID do mercado do qual comAlcool será removida",
          },
          {
            name: "comAlcoolId",
            in: "path",
            required: true,
            type: "integer",
            description: "ID do comAlcool que será removida",
          },
        ],
        responses: {
          200: {
            description: "comAlcool removido com sucesso",
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "comAlcool com ID 123 foi removido com sucesso.",
                },
              },
            },
          },
          400: {
            description: "Dados de entrada inválidos",
          },
          404: {
            description: "Mercado não encontrado ou comAlcool não encontrada",
          },
        },
      },
    },
    // bebidas sem alcool
    "/mercado/{id}/produtos/bebidas/semAlcool": {
      get: {
        tags: ["Mercado"],
        summary:
          "Recupera os semAlcool de bebidas de um mercado específico" + count(),
        description:
          "Retorna a lista de semAlcool da categoria bebidas do mercado especificado pelo ID.",
        operationId: "getsemAlcoolByMercadoId",
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            type: "integer",
            description:
              "ID do mercado cujas semAlcool estão sendo solicitadas",
          },
        ],
        responses: {
          200: {
            description: "Lista de semAlcool recuperada com sucesso",
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                },
                salgado: {
                  type: "array",
                  items: {
                    $ref: "#/definitions/Fruta",
                  },
                },
              },
            },
          },
          404: {
            description:
              "Mercado não encontrado ou não há semAlcool cadastradas",
          },
        },
      },
      post: {
        tags: ["Mercado"],
        summary:
          "Adiciona um produto aos semAlcool de bebidas de um mercado específico" +
          count(),
        description:
          "Adiciona um novo produto à subcategoria de bebidas do mercado identificado pelo ID fornecido na URL.",
        operationId: "addProdutoTosemAlcoolCategory",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID do mercado ao qual o produto será adicionado",
            type: "integer",
          },
          {
            name: "body",
            in: "body",
            required: true,
            description:
              "Dados do produto para adicionar à subcategoria de bebidas",
            schema: {
              $ref: "#/definitions/Produtos",
            },
          },
        ],
        responses: {
          201: {
            description: "Produto adicionado com sucesso",
            schema: {
              $ref: "#/definitions/Produtos",
            },
          },
          400: {
            description: "Dados de entrada inválidos",
          },
          404: {
            description: "Mercado não encontrado",
          },
        },
      },
    },
    "/mercado/{id}/produtos/bebidas/semAlcool/{semAlcoolId}": {
      delete: {
        tags: ["Mercado"],
        summary: "Remove um semAlcool específico de um mercado" + count(),
        description:
          "Remove  pelo ID do semAlcool de dentro da categoria bebidas de um mercado específico, também identificado por ID.",
        operationId: "deletesemAlcool",
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            type: "integer",
            description: "ID do mercado do qual semAlcool será removida",
          },
          {
            name: "semAlcoolId",
            in: "path",
            required: true,
            type: "integer",
            description: "ID do semAlcool que será removida",
          },
        ],
        responses: {
          200: {
            description: "semAlcool removido com sucesso",
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "semAlcool com ID 123 foi removido com sucesso.",
                },
              },
            },
          },
          400: {
            description: "Dados de entrada inválidos",
          },
          404: {
            description: "Mercado não encontrado ou semAlcool não encontrada",
          },
        },
      },
    },
    // higine
    "/mercado/{id}/produtos/higieneLimpeza/higine": {
      get: {
        tags: ["Mercado"],
        summary:
          "Recupera os higine de higieneLimpeza de um mercado específico" +
          count(),
        description:
          "Retorna a lista de higine da categoria higieneLimpeza do mercado especificado pelo ID.",
        operationId: "gethigineByMercadoId",
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            type: "integer",
            description: "ID do mercado cujas higine estão sendo solicitadas",
          },
        ],
        responses: {
          200: {
            description: "Lista de higine recuperada com sucesso",
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                },
                salgado: {
                  type: "array",
                  items: {
                    $ref: "#/definitions/Fruta",
                  },
                },
              },
            },
          },
          404: {
            description: "Mercado não encontrado ou não há higine cadastradas",
          },
        },
      },
      post: {
        tags: ["Mercado"],
        summary:
          "Adiciona um produto aos higine de higieneLimpeza de um mercado específico" +
          count(),
        description:
          "Adiciona um novo produto à subcategoria de higieneLimpeza do mercado identificado pelo ID fornecido na URL.",
        operationId: "addProdutoTohigineCategory",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID do mercado ao qual o produto será adicionado",
            type: "integer",
          },
          {
            name: "body",
            in: "body",
            required: true,
            description:
              "Dados do produto para adicionar à subcategoria de higieneLimpeza",
            schema: {
              $ref: "#/definitions/Produtos",
            },
          },
        ],
        responses: {
          201: {
            description: "Produto adicionado com sucesso",
            schema: {
              $ref: "#/definitions/Produtos",
            },
          },
          400: {
            description: "Dados de entrada inválidos",
          },
          404: {
            description: "Mercado não encontrado",
          },
        },
      },
    },
    "/mercado/{id}/produtos/higieneLimpeza/higine/{higineId}": {
      delete: {
        tags: ["Mercado"],
        summary: "Remove um higine específico de um mercado" + count(),
        description:
          "Remove  pelo ID do higine de dentro da categoria higieneLimpeza de um mercado específico, também identificado por ID.",
        operationId: "deletehigine",
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            type: "integer",
            description: "ID do mercado do qual higine será removida",
          },
          {
            name: "higineId",
            in: "path",
            required: true,
            type: "integer",
            description: "ID do higine que será removida",
          },
        ],
        responses: {
          200: {
            description: "higine removido com sucesso",
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "higine com ID 123 foi removido com sucesso.",
                },
              },
            },
          },
          400: {
            description: "Dados de entrada inválidos",
          },
          404: {
            description: "Mercado não encontrado ou higine não encontrada",
          },
        },
      },
    },
    // limpeza
    "/mercado/{id}/produtos/higieneLimpeza/limpeza": {
      get: {
        tags: ["Mercado"],
        summary:
          "Recupera os limpeza de higieneLimpeza de um mercado específico" +
          count(),
        description:
          "Retorna a lista de limpeza da categoria higieneLimpeza do mercado especificado pelo ID.",
        operationId: "getlimpezaByMercadoId",
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            type: "integer",
            description: "ID do mercado cujas limpeza estão sendo solicitadas",
          },
        ],
        responses: {
          200: {
            description: "Lista de limpeza recuperada com sucesso",
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                },
                salgado: {
                  type: "array",
                  items: {
                    $ref: "#/definitions/Fruta",
                  },
                },
              },
            },
          },
          404: {
            description: "Mercado não encontrado ou não há limpeza cadastradas",
          },
        },
      },
      post: {
        tags: ["Mercado"],
        summary:
          "Adiciona um produto aos limpeza de higieneLimpeza de um mercado específico" +
          count(),
        description:
          "Adiciona um novo produto à subcategoria de higieneLimpeza do mercado identificado pelo ID fornecido na URL.",
        operationId: "addProdutoTolimpezaCategory",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID do mercado ao qual o produto será adicionado",
            type: "integer",
          },
          {
            name: "body",
            in: "body",
            required: true,
            description:
              "Dados do produto para adicionar à subcategoria de higieneLimpeza",
            schema: {
              $ref: "#/definitions/Produtos",
            },
          },
        ],
        responses: {
          201: {
            description: "Produto adicionado com sucesso",
            schema: {
              $ref: "#/definitions/Produtos",
            },
          },
          400: {
            description: "Dados de entrada inválidos",
          },
          404: {
            description: "Mercado não encontrado",
          },
        },
      },
    },
    "/mercado/{id}/produtos/higieneLimpeza/limpeza/{limpezaId}": {
      delete: {
        tags: ["Mercado"],
        summary: "Remove um limpeza específico de um mercado" + count(),
        description:
          "Remove  pelo ID do limpeza de dentro da categoria higieneLimpeza de um mercado específico, também identificado por ID.",
        operationId: "deletelimpeza",
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            type: "integer",
            description: "ID do mercado do qual limpeza será removida",
          },
          {
            name: "limpezaId",
            in: "path",
            required: true,
            type: "integer",
            description: "ID do limpeza que será removida",
          },
        ],
        responses: {
          200: {
            description: "limpeza removido com sucesso",
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "limpeza com ID 123 foi removido com sucesso.",
                },
              },
            },
          },
          400: {
            description: "Dados de entrada inválidos",
          },
          404: {
            description: "Mercado não encontrado ou limpeza não encontrada",
          },
        },
      },
    },
    "/eventos": {
      get: {
        tags: ["Eventos"],
        summary: "Obter a lista de eventos",
        description: "Retorna uma lista de eventos já criados " + count(),
        operationId: "getEventos",
        responses: {
          200: {
            description: "Lista de eventos",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: {
                        type: "integer",
                        example: 1,
                      },
                      nome: {
                        type: "string",
                        example: "Conferência de Tecnologia",
                      },
                      data: {
                        type: "string",
                        format: "date",
                        example: "2024-06-01",
                      },
                      local: {
                        type: "string",
                        example: "Centro de Convenções",
                      },
                      capacidade: {
                        type: "integer",
                        example: 500,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Eventos"],
        summary: "Criar um novo evento",
        description: "Cria um novo evento com validações " + count(),
        operationId: "createEvento",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  nome: {
                    type: "string",
                    example: "Nome do Evento",
                  },
                  data: {
                    type: "string",
                    format: "date",
                    example: "2024-07-01",
                  },
                  local: {
                    type: "string",
                    example: "Local do Evento",
                  },
                  capacidade: {
                    type: "integer",
                    example: 10,
                  },
                },
                required: ["nome", "data", "local", "capacidade"],
              },
            },
          },
        },
        responses: {
          201: {
            description: "Evento criado com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: {
                      type: "integer",
                      example: 3,
                    },
                    nome: {
                      type: "string",
                      example: "Nome do Evento",
                    },
                    data: {
                      type: "string",
                      format: "date",
                      example: "2024-07-01",
                    },
                    local: {
                      type: "string",
                      example: "Local do Evento",
                    },
                    capacidade: {
                      type: "integer",
                      example: 10,
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Erro de validação",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      msg: {
                        type: "string",
                        example: "O nome do evento já existe",
                      },
                      param: {
                        type: "string",
                        example: "nome",
                      },
                      location: {
                        type: "string",
                        example: "body",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/eventos/{id}": {
      get: {
        tags: ["Eventos"],
        summary: "Obter um evento por ID " + count(),
        description: "Retorna um evento específico pelo ID",
        operationId: "getEventoById",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            description: "ID do evento",
          },
        ],
        responses: {
          200: {
            description: "Evento encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: {
                      type: "integer",
                      example: 1,
                    },
                    nome: {
                      type: "string",
                      example: "Conferência de Tecnologia",
                    },
                    data: {
                      type: "string",
                      format: "date",
                      example: "2024-06-01",
                    },
                    local: {
                      type: "string",
                      example: "Centro de Convenções",
                    },
                    capacidade: {
                      type: "integer",
                      example: 500,
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Erro de validação",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      msg: {
                        type: "string",
                        example: "O ID deve ser um número inteiro positivo",
                      },
                      param: {
                        type: "string",
                        example: "id",
                      },
                      location: {
                        type: "string",
                        example: "params",
                      },
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "Evento não encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Evento não encontrado",
                    },
                  },
                },
              },
            },
          },
        },
      },
      put: {
        tags: ["Eventos"],
        summary: "Atualizar um evento por ID " + count(),
        description: "Atualiza um evento específico pelo ID",
        operationId: "updateEventoById",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            description: "ID do evento",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  nome: {
                    type: "string",
                    example: "Nome do Evento Atualizado",
                  },
                  data: {
                    type: "string",
                    format: "date",
                    example: "2024-07-01",
                  },
                  local: {
                    type: "string",
                    example: "Local do Evento Atualizado",
                  },
                  capacidade: {
                    type: "integer",
                    example: 200,
                  },
                },
                required: ["nome", "data", "local", "capacidade"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Evento atualizado com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: {
                      type: "integer",
                      example: 1,
                    },
                    nome: {
                      type: "string",
                      example: "Nome do Evento Atualizado",
                    },
                    data: {
                      type: "string",
                      format: "date",
                      example: "2024-07-01",
                    },
                    local: {
                      type: "string",
                      example: "Local do Evento Atualizado",
                    },
                    capacidade: {
                      type: "integer",
                      example: 200,
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Erro de validação",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      msg: {
                        type: "string",
                        example: "O ID deve ser um número inteiro positivo",
                      },
                      param: {
                        type: "string",
                        example: "id",
                      },
                      location: {
                        type: "string",
                        example: "params",
                      },
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "Evento não encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Evento não encontrado",
                    },
                  },
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Eventos"],
        summary: "Deletar um evento por ID " + count(),
        description: "Deleta um evento específico pelo ID",
        operationId: "deleteEventoById",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            description: "ID do evento",
          },
        ],
        responses: {
          204: {
            description: "Evento deletado com sucesso",
          },
          400: {
            description: "Erro de validação",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      msg: {
                        type: "string",
                        example: "O ID deve ser um número inteiro positivo",
                      },
                      param: {
                        type: "string",
                        example: "id",
                      },
                      location: {
                        type: "string",
                        example: "params",
                      },
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "Evento não encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Evento não encontrado",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/eventos/{id}/participantes": {
      post: {
        tags: ["Eventos"],
        summary:
          "Adicionar um participante a um evento, envia e-mail." + count(),
        description:
          "Adiciona um novo participante a um evento específico, caso o campo email esteja preenchido com e-mail válido, enviará um e-mail de adesão.",
        operationId: "addParticipante",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            description: "ID do evento",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  nome: {
                    type: "string",
                    example: "João Silva",
                  },
                  email: {
                    type: "string",
                    example: "joao.silva@example.com",
                  },
                  idade: {
                    type: "integer",
                    example: 25,
                  },
                },
                required: ["nome", "idade"],
              },
            },
          },
        },
        responses: {
          201: {
            description: "Participante adicionado com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: {
                      type: "integer",
                      example: 1,
                    },
                    nome: {
                      type: "string",
                      example: "João Silva",
                    },
                    email: {
                      type: "string",
                      example: "joao.silva@example.com",
                    },
                    idade: {
                      type: "integer",
                      example: 25,
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Erro de validação",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      msg: {
                        type: "string",
                        example: "O nome é obrigatório",
                      },
                      param: {
                        type: "string",
                        example: "nome",
                      },
                      location: {
                        type: "string",
                        example: "body",
                      },
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "Evento não encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Evento não encontrado",
                    },
                  },
                },
              },
            },
          },
        },
      },
      get: {
        tags: ["Eventos"],
        summary: "Obter a lista de participantes de um evento " + count(),
        description: "Retorna a lista de participantes de um evento específico",
        operationId: "getParticipantes",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            description: "ID do evento",
          },
        ],
        responses: {
          200: {
            description: "Lista de participantes",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: {
                        type: "integer",
                        example: 1,
                      },
                      nome: {
                        type: "string",
                        example: "João Silva",
                      },
                      email: {
                        type: "string",
                        example: "joao.silva@example.com",
                      },
                      idade: {
                        type: "integer",
                        example: 25,
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Erro de validação",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      msg: {
                        type: "string",
                        example:
                          "O ID do evento deve ser um número inteiro positivo",
                      },
                      param: {
                        type: "string",
                        example: "id",
                      },
                      location: {
                        type: "string",
                        example: "params",
                      },
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "Evento não encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Evento não encontrado",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/eventos/{id}/participantes/{participanteId}": {
      delete: {
        tags: ["Eventos"],
        summary: "Remover um participante de um evento " + count(),
        description:
          "Remove um participante específico de um evento específico",
        operationId: "removeParticipante",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            description: "ID do evento",
          },
          {
            name: "participanteId",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            description: "ID do participante",
          },
        ],
        responses: {
          204: {
            description: "Participante removido com sucesso",
          },
          400: {
            description: "Erro de validação",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      msg: {
                        type: "string",
                        example:
                          "O ID do evento deve ser um número inteiro positivo",
                      },
                      param: {
                        type: "string",
                        example: "id",
                      },
                      location: {
                        type: "string",
                        example: "params",
                      },
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "Evento ou participante não encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Evento ou participante não encontrado",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/herois": {
      get: {
        tags: ["Heroes"],
        summary: "Obter todos os heróis " + count(),
        responses: {
          200: {
            description: "Lista de heróis",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Heroi",
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Heroes"],
        summary: "Adicionar um novo herói " + count(),
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Heroi",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Herói adicionado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HeroiResponse",
                },
              },
            },
          },
          400: {
            description: "Erro de validação",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Erro",
                },
              },
            },
          },
        },
      },
    },
    "/herois/{id}": {
      get: {
        tags: ["Heroes"],
        summary: "Obter um herói por ID " + count(),
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            description: "ID do herói",
          },
        ],
        responses: {
          200: {
            description: "Herói encontrado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Heroi",
                },
              },
            },
          },
          404: {
            description: "Herói não encontrado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Erro",
                },
              },
            },
          },
          400: {
            description: "Erro de validação",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Erro",
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Heroes"],
        summary: "Deletar um herói por ID " + count(),
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            description: "ID do herói",
          },
        ],
        responses: {
          200: {
            description: "Herói deletado com sucesso",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Mensagem",
                },
              },
            },
          },
          404: {
            description: "Herói não encontrado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Erro",
                },
              },
            },
          },
          400: {
            description: "Erro de validação",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Erro",
                },
              },
            },
          },
          500: {
            description: "Erro interno",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Erro",
                },
              },
            },
          },
        },
      },
    },
    "/herois-inuteis": {
      get: {
        tags: ["Heroes"],
        summary: "Obter todos os heróis " + count(),
        responses: {
          200: {
            description: "Lista de heróis",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Heroi",
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Heroes"],
        summary: "Adicionar um novo herói " + count(),
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Heroi",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Herói adicionado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HeroiResponse",
                },
              },
            },
          },
          400: {
            description: "Erro de validação",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Erro",
                },
              },
            },
          },
        },
      },
    },
    "/herois-inuteis/{id}": {
      get: {
        tags: ["Heroes"],
        summary: "Obter um herói por ID " + count(),
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            description: "ID do herói",
          },
        ],
        responses: {
          200: {
            description: "Herói encontrado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Heroi",
                },
              },
            },
          },
          404: {
            description: "Herói não encontrado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Erro",
                },
              },
            },
          },
          400: {
            description: "Erro de validação",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Erro",
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Heroes"],
        summary: "Deletar um herói por ID " + count(),
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            description: "ID do herói",
          },
        ],
        responses: {
          200: {
            description: "Herói deletado com sucesso",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Mensagem",
                },
              },
            },
          },
          404: {
            description: "Herói não encontrado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Erro",
                },
              },
            },
          },
          400: {
            description: "Erro de validação",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Erro",
                },
              },
            },
          },
          500: {
            description: "Erro interno",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Erro",
                },
              },
            },
          },
        },
      },
    },
    "/animes": {
      get: {
        tags: ["Animes"],
        summary: "Get all animes  " + count(),
        description: "Retrieves a list of all animes in the database.",
        responses: {
          200: {
            description: "A list of animes",
            schema: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string", example: "-uniqueGeneratedId" },
                  name: { type: "string", example: "Naruto" },
                  yearOfCreation: { type: "integer", example: 2002 },
                  topCharacters: {
                    type: "array",
                    items: { type: "string" },
                    example: [
                      "Naruto Uzumaki",
                      "Sasuke Uchiha",
                      "Sakura Haruno",
                      "Kakashi Hatake",
                      "Itachi Uchiha",
                    ],
                  },
                },
              },
            },
          },
          500: {
            description: "Internal server error",
          },
        },
      },
      post: {
        tags: ["Animes"],
        summary: "Create a new anime " + count(),
        description: "Adds a new anime to the database.",
        parameters: [
          {
            in: "body",
            name: "body",
            description: "Anime object that needs to be added to the database",
            required: true,
            schema: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  example: "Naruto",
                },
                yearOfCreation: {
                  type: "integer",
                  example: 2002,
                },
                topCharacters: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  example: [
                    "Naruto Uzumaki",
                    "Sasuke Uchiha",
                    "Sakura Haruno",
                    "Kakashi Hatake",
                    "Itachi Uchiha",
                  ],
                },
              },
              required: ["name", "yearOfCreation", "topCharacters"],
            },
          },
        ],
        responses: {
          201: {
            description: "Anime created successfully",
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "Anime added successfully!",
                },
                anime: {
                  type: "object",
                  properties: {
                    id: {
                      type: "string",
                      example: "-uniqueGeneratedId",
                    },
                    name: {
                      type: "string",
                      example: "Naruto",
                    },
                    yearOfCreation: {
                      type: "integer",
                      example: 2002,
                    },
                    topCharacters: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      example: [
                        "Naruto Uzumaki",
                        "Sasuke Uchiha",
                        "Sakura Haruno",
                        "Kakashi Hatake",
                        "Itachi Uchiha",
                      ],
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Invalid input",
            schema: {
              type: "object",
              properties: {
                errors: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      msg: {
                        type: "string",
                      },
                      param: {
                        type: "string",
                      },
                      location: {
                        type: "string",
                      },
                    },
                  },
                },
              },
            },
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },
    "/animes/{id}": {
      get: {
        tags: ["Animes"],
        summary: "Get a specific anime by ID " + count(),
        description: "Retrieve a specific anime from the database by its ID.",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "ID of the anime to retrieve",
            required: true,
            type: "string",
          },
        ],
        responses: {
          200: {
            description: "A specific anime",
            schema: {
              type: "object",
              properties: {
                id: { type: "string", example: "-uniqueGeneratedId" },
                name: { type: "string", example: "Naruto" },
                yearOfCreation: { type: "integer", example: 2002 },
                topCharacters: {
                  type: "array",
                  items: { type: "string" },
                  example: [
                    "Naruto Uzumaki",
                    "Sasuke Uchiha",
                    "Sakura Haruno",
                    "Kakashi Hatake",
                    "Itachi Uchiha",
                  ],
                },
              },
            },
          },
          404: {
            description: "Anime not found",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
      put: {
        tags: ["Animes"],
        summary: "Update an existing anime " + count(),
        description: "Updates an existing anime in the database.",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "ID of the anime to update",
            required: true,
            type: "string",
          },
          {
            in: "body",
            name: "body",
            description: "Anime object that needs to be updated",
            required: true,
            schema: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  example: "Naruto Shippuden",
                },
                yearOfCreation: {
                  type: "integer",
                  example: 2007,
                },
                topCharacters: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  example: [
                    "Naruto Uzumaki",
                    "Sasuke Uchiha",
                    "Sakura Haruno",
                    "Kakashi Hatake",
                    "Itachi Uchiha",
                  ],
                },
              },
            },
          },
        ],
        responses: {
          200: {
            description: "Anime updated successfully",
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "Anime updated successfully!",
                },
                anime: {
                  type: "object",
                  properties: {
                    id: {
                      type: "string",
                      example: "-uniqueGeneratedId",
                    },
                    name: {
                      type: "string",
                      example: "Naruto Shippuden",
                    },
                    yearOfCreation: {
                      type: "integer",
                      example: 2007,
                    },
                    topCharacters: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      example: [
                        "Naruto Uzumaki",
                        "Sasuke Uchiha",
                        "Sakura Haruno",
                        "Kakashi Hatake",
                        "Itachi Uchiha",
                      ],
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Invalid input",
            schema: {
              type: "object",
              properties: {
                errors: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      msg: {
                        type: "string",
                      },
                      param: {
                        type: "string",
                      },
                      location: {
                        type: "string",
                      },
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "Anime not found",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
      delete: {
        tags: ["Animes"],
        summary: "Delete an anime " + count(),
        description: "Deletes an anime from the database.",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "ID of the anime to delete",
            required: true,
            type: "string",
          },
        ],
        responses: {
          200: {
            description: "Anime deleted successfully",
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "Anime deleted successfully!",
                },
              },
            },
          },
          404: {
            description: "Anime not found",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },
    "/level1": {
      get: {
        tags: ["FOR Challenger"],
        summary: "challenger for   " + count(),
        description: "",
        responses: {
          200: {
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },
    "/level2": {
      get: {
        tags: ["FOR Challenger"],
        summary: "challenger for   " + count(),
        description: "",
        responses: {
          200: {
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Client: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            format: "int64",
            description: "ID único do cliente",
          },
          name: {
            type: "string",
            description: "Nome completo do cliente",
          },
          cpf: {
            type: "string",
            description: "CPF do cliente sem pontos ou traços",
          },
          card: {
            type: "object",
            properties: {
              flag: {
                type: "string",
                enum: ["MASTER", "VISA"],
                description: "Bandeira do cartão de crédito do cliente",
              },
              credit: {
                type: "number",
                format: "float",
                description: "Valor de crédito disponível para o cliente",
              },
            },
          },
        },
      },
      Products: {
        type: "object",
        required: ["id", "name", "description", "price"],
        properties: {
          id: {
            type: "integer",
            format: "int64",
            description: "Identificador único do produto",
          },
          name: {
            type: "string",
            description: "Nome do produto",
          },
          description: {
            type: "string",
            description: "Descrição do produto",
          },
          price: {
            type: "integer",
            description:
              "Preço do produto em centavos, representando custos associados",
          },
        },
      },
      Employee: {
        type: "object",
        properties: {
          employeeId: {
            type: "integer",
            description: "ID do funcionário",
          },
          name: {
            type: "string",
            description: "Nome do funcionário",
          },
          position: {
            type: "string",
            description: "Cargo do funcionário",
          },
          email: {
            type: "string",
            format: "email",
            description: "Email válido do funcionário",
          },
        },
      },
      Service: {
        type: "object",
        properties: {
          serviceId: {
            type: "integer",
            description: "ID do serviço",
          },
          serviceName: {
            type: "string",
            description: "Nome do serviço",
          },
          serviceDescription: {
            type: "string",
            description: "Descrição detalhada do serviço",
          },
        },
      },
      Company: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            description: "ID da empresa",
          },
          name: {
            type: "string",
            description: "Nome da empresa",
          },
          address: {
            type: "string",
            description: "Endereço da empresa",
          },
          services: {
            type: "array",
            items: {
              type: "object",
              properties: {
                serviceId: {
                  type: "integer",
                  description: "ID do serviço",
                },
                serviceName: {
                  type: "string",
                  description: "Nome do serviço",
                },
                serviceDescription: {
                  type: "string",
                  description: "Descrição do serviço",
                },
              },
            },
            description: "Lista de serviços oferecidos pela empresa",
          },
        },
      },
      Heroi: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            example: 1,
          },
          nome: {
            type: "string",
            example: "Homem-Sombra",
          },
          habilidade: {
            type: "string",
            example: "Pode se transformar em uma sombra",
          },
          problema: {
            type: "string",
            example:
              "Só pode usar seus poderes em áreas bem iluminadas, ficando invisível",
          },
        },
      },
      HeroiResponse: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "Herói adicionado com sucesso",
          },
          newUser: {
            $ref: "#/components/schemas/Heroi",
          },
        },
      },
      Erro: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "Erro de validação",
          },
          errors: {
            type: "array",
            items: {
              type: "object",
              properties: {
                msg: {
                  type: "string",
                  example: "O campo nome é obrigatório",
                },
                param: {
                  type: "string",
                  example: "nome",
                },
                location: {
                  type: "string",
                  example: "body",
                },
              },
            },
          },
        },
      },
      Mensagem: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "Herói com ID 1 foi removido com sucesso.",
          },
        },
      },
    },
  },
  definitions: {
    Mercado: {
      type: "object",
      required: ["nome", "cnpj", "endereco"],
      properties: {
        nome: {
          type: "string",
        },
        cnpj: {
          type: "string",
        },
        endereco: {
          type: "string",
        },
      },
    },
    Fruta: {
      type: "object",
      required: ["nome", "valor"],
      properties: {
        nome: {
          type: "string",
          example: "Maçã",
        },
        valor: {
          type: "integer",
          example: 5,
          description: "Valor deve ser um número inteiro e não negativo",
        },
      },
    },
    Produtos: {
      type: "object",
      properties: {
        nome: {
          type: "string",
          example: "Maçã",
        },
        valor: {
          type: "integer",
          example: 3,
          description: "Valor do produto em reais.",
        },
      },
    },
    CategoriaProduto: {
      type: "object",
      properties: {
        frutas: {
          type: "array",
          items: {
            $ref: "#/definitions/Produtos",
          },
        },
        legumes: {
          type: "array",
          items: {
            $ref: "#/definitions/Produtos",
          },
        },
        doces: {
          type: "array",
          items: {
            $ref: "#/definitions/Produtos",
          },
        },
        salgados: {
          type: "array",
          items: {
            $ref: "#/definitions/Produtos",
          },
        },
        bovinos: {
          type: "array",
          items: {
            $ref: "#/definitions/Produtos",
          },
        },
        suinos: {
          type: "array",
          items: {
            $ref: "#/definitions/Produtos",
          },
        },
        aves: {
          type: "array",
          items: {
            $ref: "#/definitions/Produtos",
          },
        },
        queijos: {
          type: "array",
          items: {
            $ref: "#/definitions/Produtos",
          },
        },
        embutidos: {
          type: "array",
          items: {
            $ref: "#/definitions/Produtos",
          },
        },
        outros_frios: {
          type: "array",
          items: {
            $ref: "#/definitions/Produtos",
          },
        },
        graos_cereais: {
          type: "array",
          items: {
            $ref: "#/definitions/Produtos",
          },
        },
        massas: {
          type: "array",
          items: {
            $ref: "#/definitions/Produtos",
          },
        },
        farinhas: {
          type: "array",
          items: {
            $ref: "#/definitions/Produtos",
          },
        },
        conservados_enlatados: {
          type: "array",
          items: {
            $ref: "#/definitions/Produtos",
          },
        },
        oleos: {
          type: "array",
          items: {
            $ref: "#/definitions/Produtos",
          },
        },
        temperos_condimentos: {
          type: "array",
          items: {
            $ref: "#/definitions/Produtos",
          },
        },
        com_alcool: {
          type: "array",
          items: {
            $ref: "#/definitions/Produtos",
          },
        },
        sem_alcool: {
          type: "array",
          items: {
            $ref: "#/definitions/Produtos",
          },
        },
        doces_congelados: {
          type: "array",
          items: {
            $ref: "#/definitions/Produtos",
          },
        },
        salgados_congelados: {
          type: "array",
          items: {
            $ref: "#/definitions/Produtos",
          },
        },
        higiene: {
          type: "array",
          items: {
            $ref: "#/definitions/Produtos",
          },
        },
        limpeza: {
          type: "array",
          items: {
            $ref: "#/definitions/Produtos",
          },
        },
        cozinha_util_domestica: {
          type: "array",
          items: {
            $ref: "#/definitions/Produtos",
          },
        },
        diversos_util_domestica: {
          type: "array",
          items: {
            $ref: "#/definitions/Produtos",
          },
        },
        telefonia: {
          type: "array",
          items: {
            $ref: "#/definitions/Produtos",
          },
        },
        outros_eletronicos: {
          type: "array",
          items: {
            $ref: "#/definitions/Produtos",
          },
        },
        alimentos_petShop: {
          type: "array",
          items: {
            $ref: "#/definitions/Produtos",
          },
        },
        acessorios_petShop: {
          type: "array",
          items: {
            $ref: "#/definitions/Produtos",
          },
        },
        higiene_petShop: {
          type: "array",
          items: {
            $ref: "#/definitions/Produtos",
          },
        },
        medicamentos_livre: {
          type: "array",
          items: {
            $ref: "#/definitions/Produtos",
          },
        },
        cuidado_pessoal: {
          type: "array",
          items: {
            $ref: "#/definitions/Produtos",
          },
        },
        outros_farmacia: {
          type: "array",
          items: {
            $ref: "#/definitions/Produtos",
          },
        },
        material_escolar: {
          type: "array",
          items: {
            $ref: "#/definitions/Produtos",
          },
        },
        decoracao: {
          type: "array",
          items: {
            $ref: "#/definitions/Produtos",
          },
        },
        outros_bazar_papelaria: {
          type: "array",
          items: {
            $ref: "#/definitions/Produtos",
          },
        },
        peixes: {
          type: "array",
          items: {
            $ref: "#/definitions/Produtos",
          },
        },
        frutos_do_mar: {
          type: "array",
          items: {
            $ref: "#/definitions/Produtos",
          },
        },
      },
    },
  },
};

export default swaggerDocument;
// "/exmample":{
// 	get:{
// 		tags: ["Others"],
//         summary: "JSON com profundidade de validações" + count(),
//         description: "JSON para treino de validação",
// 		parameters:[{
// 			name: "body",
// 			in: "body",
// 			schema:{}
// 		}],
// 		responses: {
// 			200: {
// 			  description: "success",
// 			},
// 		  },
// 	}
// }
