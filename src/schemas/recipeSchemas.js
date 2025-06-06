import Ajv from 'ajv';

// Instância do validador AJV
const ajv = new Ajv();

// Schema para ingredientes detectados
export const ingredientesDetectadosSchema = {
  type: "object",
  properties: {
    ingredientes: {
      type: "array",
      items: {
        type: "string"
      },
      minItems: 1
    }
  },
  required: ["ingredientes"],
  additionalProperties: false
};

// Schema para uma receita completa
export const receitaCompletaSchema = {
  type: "object",
  properties: {
    receita: {
      type: "object",
      properties: {
        title: {
          type: "string",
          minLength: 1
        },
        description: {
          type: "string",
          minLength: 1
        },
        ingredientes: {
          type: "array",
          items: {
            oneOf: [
              { type: "string" },
              {
                type: "object",
                properties: {
                  nome: { type: "string" },
                  quantidade: { type: "string" }
                },
                required: ["nome", "quantidade"],
                additionalProperties: false
              }
            ]
          },
          minItems: 1
        },
        modoPreparo: {
          oneOf: [
            { type: "string" },
            {
              type: "array",
              items: { type: "string" }
            }
          ]
        },
        tempoPreparo: {
          type: "string"
        },
        porcoes: {
          type: "string"
        },
        dificuldade: {
          type: "string",
          enum: ["Fácil", "Médio", "Difícil"]
        }
      },
      required: ["title", "description", "ingredientes", "modoPreparo"],
      additionalProperties: false
    }
  },
  required: ["receita"],
  additionalProperties: false
};

// Schema para lista de receitas
export const receitasListaSchema = {
  type: "object",
  properties: {
    receitas: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "number" },
          title: { type: "string", minLength: 1 },
          description: { type: "string", minLength: 1 },
          image: { type: "string" },
          tempoPreparo: { type: "string" },
          dificuldade: {
            type: "string",
            enum: ["Fácil", "Médio", "Difícil"]
          }
        },
        required: ["id", "title", "description"],
        additionalProperties: false
      },
      minItems: 1
    }
  },
  required: ["receitas"],
  additionalProperties: false
};

// Schema para dados do usuário
export const usuarioSchema = {
  type: "object",
  properties: {
    uid: { type: "string", minLength: 1 },
    email: { type: "string", format: "email" },
    displayName: { type: "string" },
    photoURL: { type: "string" },
    metadata: {
      type: "object",
      properties: {
        creationTime: { type: "string" },
        lastSignInTime: { type: "string" }
      }
    }
  },
  required: ["uid", "email"],
  additionalProperties: true
};

// Compilar os schemas para melhor performance
export const validateIngredientesDetectados = ajv.compile(ingredientesDetectadosSchema);
export const validateReceitaCompleta = ajv.compile(receitaCompletaSchema);
export const validateReceitasLista = ajv.compile(receitasListaSchema);
export const validateUsuario = ajv.compile(usuarioSchema);

// Função helper para validar com mensagens de erro mais amigáveis
export const validarComMensagem = (validator, data, tipoSchema) => {
  const isValid = validator(data);
  
  if (!isValid) {
    const errors = validator.errors;
    console.error(`❌ Erro de validação no schema ${tipoSchema}:`, errors);
    
    // Criar mensagens de erro mais amigáveis
    const mensagensErro = errors.map(error => {
      switch (error.keyword) {
        case 'required':
          return `Campo obrigatório ausente: ${error.params.missingProperty}`;
        case 'type':
          return `Tipo inválido em ${error.instancePath}: esperado ${error.params.type}`;
        case 'minLength':
          return `Campo ${error.instancePath} deve ter pelo menos ${error.params.limit} caracteres`;
        case 'minItems':
          return `Array ${error.instancePath} deve ter pelo menos ${error.params.limit} itens`;
        case 'enum':
          return `Valor inválido em ${error.instancePath}: deve ser um de ${error.params.allowedValues.join(', ')}`;
        default:
          return `Erro em ${error.instancePath}: ${error.message}`;
      }
    });
    
    return {
      valido: false,
      erros: mensagensErro
    };
  }
  
  return {
    valido: true,
    erros: []
  };
};

// Função para validar dados da API Gemini
export const validarRespostaGemini = (data, tipo) => {
  switch (tipo) {
    case 'ingredientes':
      return validarComMensagem(validateIngredientesDetectados, data, 'ingredientes detectados');
    case 'receita':
      return validarComMensagem(validateReceitaCompleta, data, 'receita completa');
    case 'receitas':
      return validarComMensagem(validateReceitasLista, data, 'lista de receitas');
    default:
      return { valido: false, erros: ['Tipo de validação não reconhecido'] };
  }
};
