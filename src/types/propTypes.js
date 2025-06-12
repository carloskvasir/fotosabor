import PropTypes from 'prop-types';

// Definição de tipos para ingredientes
export const IngredienteType = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.shape({
    nome: PropTypes.string.isRequired,
    quantidade: PropTypes.string.isRequired,
  }),
]);

// Definição de tipos para receita completa
export const ReceitaType = PropTypes.shape({
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  ingredientes: PropTypes.arrayOf(IngredienteType).isRequired,
  modoPreparo: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
  tempoPreparo: PropTypes.string,
  porcoes: PropTypes.string,
  dificuldade: PropTypes.oneOf(['Fácil', 'Médio', 'Difícil']),
  image: PropTypes.string,
});

// Definição de tipos para receita da lista
export const ReceitaListaType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string,
  tempoPreparo: PropTypes.string,
  dificuldade: PropTypes.oneOf(['Fácil', 'Médio', 'Difícil']),
});

// Definição de tipos para usuário
export const UsuarioType = PropTypes.shape({
  uid: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  displayName: PropTypes.string,
  photoURL: PropTypes.string,
  metadata: PropTypes.shape({
    creationTime: PropTypes.string,
    lastSignInTime: PropTypes.string,
  }),
});

// Função helper para validar objetos usando PropTypes
export const validarPropTypes = (data, propType, nomeObjeto = 'objeto') => {
  try {
    // Simular validação do PropTypes
    const resultado = PropTypes.checkPropTypes(
      { [nomeObjeto]: propType },
      { [nomeObjeto]: data },
      'prop',
      'ValidadorPropTypes',
    );

    return {
      valido: resultado === undefined, // PropTypes retorna undefined quando válido
      erros: resultado ? [resultado] : [],
    };
  } catch (error) {
    return {
      valido: false,
      erros: [error.message],
    };
  }
};

// Exemplos de uso
export const exemploValidacao = {
  // Validar ingredientes detectados
  validarIngredientes: (ingredientes) => {
    return validarPropTypes(
      ingredientes,
      PropTypes.arrayOf(PropTypes.string).isRequired,
      'ingredientes',
    );
  },

  // Validar receita completa
  validarReceita: (receita) => {
    return validarPropTypes(receita, ReceitaType, 'receita');
  },

  // Validar lista de receitas
  validarListaReceitas: (receitas) => {
    return validarPropTypes(
      receitas,
      PropTypes.arrayOf(ReceitaListaType).isRequired,
      'receitas',
    );
  },

  // Validar usuário
  validarUsuario: (usuario) => {
    return validarPropTypes(usuario, UsuarioType, 'usuario');
  },
};
