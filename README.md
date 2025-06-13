# 📱 FotoSabor - Aplicativo de Receitas com IA

![React Native](https://img.shields.io/badge/React%20Native-0.79.2-blue.svg)
![Expo](https://img.shields.io/badge/Expo-~53.0.9-black.svg)
![Firebase](https://img.shields.io/badge/Firebase-11.9.0-orange.svg)
![ESLint](https://img.shields.io/badge/ESLint-✅%200%20errors-green.svg)

Um aplicativo React Native que utiliza Inteligência Artificial para detectar ingredientes em fotos e gerar receitas personalizadas.

## 📋 Índice

- [🎯 Sobre o Projeto](#-sobre-o-projeto)
- [🚀 Funcionalidades Principais](#-funcionalidades-principais)
- [🛠️ Tecnologias Utilizadas](#️-tecnologias-utilizadas)
- [📱 Telas do Aplicativo](#-telas-do-aplicativo)
- [🏗️ Arquitetura do Projeto](#️-arquitetura-do-projeto)
- [⚙️ Configuração e Instalação](#️-configuração-e-instalação)
- [🔧 Scripts Disponíveis](#-scripts-disponíveis)
- [📊 Qualidade de Código](#-qualidade-de-código)
- [🗃️ Estrutura de Dados](#️-estrutura-de-dados)
- [🔒 Segurança e Validação](#-segurança-e-validação)
- [📱 Compatibilidade](#-compatibilidade)
- [🚀 Deploy e Distribuição](#-deploy-e-distribuição)
- [🔧 Troubleshooting](#-troubleshooting)
- [⚡ Performance e Otimizações](#-performance-e-otimizações)
- [🗺️ Roadmap e Funcionalidades Futuras](#️-roadmap-e-funcionalidades-futuras)
- [📚 Documentação Adicional](#-documentação-adicional)
- [🤝 Contribuição](#-contribuição)
- [📜 Licença](#-licença)
- [👨‍💻 Autor](#-autor)
- [🙏 Agradecimentos](#-agradecimentos)

## 🎯 Sobre o Projeto

O **FotoSabor** é um projeto acadêmico inovador que combina tecnologias modernas para criar uma experiência única de culinária. O aplicativo permite ao usuário tirar uma foto dos ingredientes disponíveis e receber sugestões de receitas personalizadas geradas por Inteligência Artificial.

### 🎯 Objetivos Acadêmicos
- Demonstrar integração com APIs de IA (Google Gemini)
- Implementar autenticação e banco de dados em tempo real
- Aplicar boas práticas de desenvolvimento React Native
- Criar uma interface de usuário moderna e responsiva
- Demonstrar qualidade de código com ESLint e arquitetura limpa

## 🚀 Funcionalidades Principais

- **📸 Detecção de Ingredientes**: Análise de imagens usando Google Gemini AI
- **🤖 Geração de Receitas**: Criação automática de receitas baseadas nos ingredientes detectados
- **✏️ Edição de Ingredientes**: Adicionar, remover e editar ingredientes detectados
- **👤 Sistema de Autenticação**: Login/registro com Firebase Auth
- **⭐ Favoritos**: Salvar e gerenciar receitas favoritas
- **🔍 Busca**: Pesquisar receitas no banco de dados
- **📱 Interface Moderna**: Design responsivo e intuitivo
- **🔄 Sincronização**: Dados sincronizados em tempo real com Firestore
- **📊 Validação**: Validação robusta de dados com schemas personalizados

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React Native** 0.79.2 - Framework principal para desenvolvimento móvel
- **Expo** ~53.0.9 - Plataforma de desenvolvimento e build
- **React Navigation** 7.x - Navegação entre telas com stack navigation
- **React Native Elements** - Biblioteca de componentes de UI
- **React Native Vector Icons** - Ícones vetoriais para interface

### Backend & Serviços
- **Firebase** 11.9.0
  - **Authentication** - Autenticação de usuários com email/senha
  - **Firestore** - Banco de dados NoSQL em tempo real
  - **Security Rules** - Regras de segurança para dados
- **Google Gemini AI** - Análise de imagens e geração de receitas com IA

### Desenvolvimento & Qualidade
- **ESLint** - Linting e qualidade de código (0 erros)
- **Babel** - Transpilação de código JavaScript
- **Metro** - Bundler do React Native
- **Expo CLI** - Ferramentas de desenvolvimento

## 📱 Telas do Aplicativo

### 🔐 Autenticação
- **LoginScreen**: Tela de login com validação de email
- **RegisterScreen**: Cadastro de novos usuários com validação de senha
- **ForgotPasswordScreen**: Recuperação de senha via email

### 🏠 Principais
- **HomeScreen**: Listagem de receitas públicas com busca
- **CameraScreen**: Captura de fotos e análise de ingredientes com IA
- **RecipeResultsScreen**: Exibição de receitas geradas com cards modernos
- **RecipeDetailsScreen**: Detalhes completos da receita com ingredientes e instruções
- **FavoritesScreen**: Receitas salvas pelo usuário com sincronização
- **ProfileScreen**: Perfil do usuário e configurações da conta

### 🎨 Componentes Reutilizáveis
- **BottomNavigation**: Navegação inferior com ícones
- **ModernRecipeCard**: Card de receita com design moderno
- **RecipeCard**: Card simples para listagem de receitas

## 🏗️ Arquitetura do Projeto

```
src/
├── components/           # Componentes reutilizáveis
│   ├── BottomNavigation.js    # Navegação inferior
│   ├── ModernRecipeCard.js    # Card moderno de receita
│   └── RecipeCard.js          # Card simples de receita
├── config/              # Configurações da aplicação
│   ├── appConfig.js          # Configurações do app
│   ├── constants.js          # Constantes centralizadas
│   ├── firebaseConfig.js     # Configuração do Firebase
│   └── geminiPrompts.js      # Prompts para IA
├── hooks/               # Custom hooks
│   └── useFirebaseAuth.js    # Hook de autenticação
├── schemas/             # Validação de dados
│   └── recipeSchemas.js      # Schemas de receitas
├── screens/             # Telas da aplicação (9 telas)
│   ├── CameraScreen.js       # Análise de ingredientes
│   ├── FavoritesScreen.js    # Receitas favoritas
│   ├── HomeScreen.js         # Tela inicial
│   └── ...                   # Outras telas
├── services/            # Serviços externos
│   ├── firestoreService.js   # Operações do Firestore
│   └── geminiService.js      # Integração com Gemini AI
└── utils/               # Funções utilitárias
    └── helpers.js            # Helpers reutilizáveis
```

### 🏛️ Padrões de Arquitetura
- **Separação de Responsabilidades**: Cada pasta tem uma função específica
- **Reutilização de Código**: Componentes e funções modulares
- **Configuração Centralizada**: Constantes e configurações em arquivos dedicados
- **Validação de Dados**: Schemas para garantir integridade dos dados

## ⚙️ Configuração e Instalação

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn
- Expo CLI
- Dispositivo móvel com Expo Go ou emulador

### 1. Clonagem e Instalação
```bash
git clone [URL_DO_REPOSITORIO]
cd FotoSabor
npm install
```

### 2. Configuração de Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto com suas chaves de API:
```env
# Firebase Configuration
FIREBASE_API_KEY=sua_api_key_firebase
FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
FIREBASE_PROJECT_ID=seu_projeto_id
FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
FIREBASE_APP_ID=seu_app_id
FIREBASE_MEASUREMENT_ID=seu_measurement_id

# Google Gemini AI Configuration
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent
GEMINI_API_KEY=sua_api_key_gemini
```

> **📝 Nota**: Para obter as chaves de API:
> - **Firebase**: Acesse o [Console do Firebase](https://console.firebase.google.com/)
> - **Gemini AI**: Acesse o [Google AI Studio](https://makersuite.google.com/app/apikey)

### 3. Execução do Projeto
```bash
# Inicia o servidor de desenvolvimento
npx expo start

# Opções específicas por plataforma
npx expo start --android     # Para Android
npx expo start --ios         # Para iOS  
npx expo start --web         # Para Web
```

### 4. Testando o Aplicativo
- **Dispositivo Físico**: Instale o Expo Go e escaneie o QR code
- **Emulador Android**: Configure o Android Studio e AVD
- **Simulador iOS**: Configure o Xcode (apenas no macOS)
- **Navegador Web**: Acesse a URL fornecida pelo Expo

## 🔧 Scripts Disponíveis

```bash
npm start          # Inicia o servidor Expo
npm run android    # Executa no Android
npm run ios        # Executa no iOS
npm run web        # Executa na web
npm run lint       # Verifica qualidade do código
npm run lint:fix   # Corrige problemas automaticamente
```

## 📊 Qualidade de Código

O projeto mantém altos padrões de qualidade com ESLint:

- ✅ **0 erros** de linting
- ✅ **0 warnings** 
- ✅ Indentação de 2 espaços
- ✅ Single quotes para strings
- ✅ Trailing commas habilitadas
- ✅ React Hooks dependencies validadas
- ✅ Imports organizados e otimizados

### 🏗️ Arquitetura e Boas Práticas

- **Constantes Centralizadas**: Configurações em `src/config/constants.js`
- **Funções Utilitárias**: Helpers reutilizáveis em `src/utils/helpers.js`
- **Validações Robustas**: Validação de email, senha e entrada de dados
- **Código Reutilizável**: Componentes modulares e funções compartilhadas
- **Formatação Automática**: Tempo de preparo, ingredientes e dados
- **Tratamento de Erros**: Catch de erros com feedback ao usuário
- **Sanitização**: Prevenção XSS em inputs de texto

### 📈 Métricas de Qualidade
| Métrica | Status | Detalhes |
|---------|--------|----------|
| ESLint Errors | ✅ 0 | Código 100% limpo |
| ESLint Warnings | ✅ 0 | Sem avisos pendentes |
| Code Coverage | 🔄 Implementado | Cobertura de validações |
| Security | ✅ Implementado | Sanitização e validação |

Para mais detalhes sobre as melhorias implementadas, consulte [CODE_QUALITY_IMPROVEMENTS.md](./CODE_QUALITY_IMPROVEMENTS.md).

## 🗃️ Estrutura de Dados

### Receita
```javascript
{
  id: string,
  name: string,
  description: string,
  ingredients: Array<string | object>,
  instructions: Array<string> | string,
  preparationTime: string,
  servings: string,
  difficulty: 'Fácil' | 'Médio' | 'Difícil',
  imageUrl?: string
}
```

### Usuário
```javascript
{
  uid: string,
  email: string,
  displayName?: string,
  photoURL?: string
}
```

## 🔒 Segurança e Validação

### 🛡️ Medidas de Segurança Implementadas
- **Autenticação Firebase**: Sistema robusto de login/registro
- **Validação de Dados**: Schemas personalizados para receitas e usuários
- **Sanitização de Inputs**: Prevenção contra XSS em campos de texto
- **Variáveis de Ambiente**: Chaves de API protegidas em arquivos .env
- **Regras do Firestore**: Controle de acesso aos dados do usuário
- **Validação de Email**: Regex para formato de email válido
- **Critérios de Senha**: Mínimo 6 caracteres, máximo 128

### 🔐 Fluxo de Autenticação
1. Usuário insere credenciais
2. Validação local (email/senha)
3. Autenticação via Firebase Auth
4. Retorno do token de acesso
5. Navegação para área autenticada

## 📱 Compatibilidade

- **Android**: API 21+ (Android 5.0+)
- **iOS**: iOS 11.0+
- **Web**: Navegadores modernos

## 🚀 Deploy e Distribuição

### 📦 Opções de Deploy
- **Expo Application Services (EAS)**
  ```bash
  npm install -g eas-cli
  eas build --platform android
  eas build --platform ios
  ```
- **Google Play Store** (Android) - APK/AAB
- **Apple App Store** (iOS) - IPA
- **Expo Go** (Desenvolvimento) - Publicação instantânea

### 🔧 Build de Produção
```bash
# Build para Android
eas build --platform android --profile production

# Build para iOS  
eas build --platform ios --profile production

# Build para ambas as plataformas
eas build --platform all
```

### 🌐 Deploy Web
```bash
# Build para web
npx expo export --platform web

# Hospedagem (Netlify, Vercel, etc.)
npm run build:web
```

## 🔧 Troubleshooting

### ❗ Problemas Comuns

#### 📱 Erro de Conexão com Firebase
```bash
# Verifique se as variáveis de ambiente estão corretas
cat .env

# Reinicie o servidor Expo
npx expo start --clear
```

#### 🤖 Erro na API do Gemini
- Verifique se a chave de API está válida
- Confirme se a cota da API não foi excedida
- Teste a conectividade com internet

#### 📦 Erro de Dependências
```bash
# Limpe o cache e reinstale
rm -rf node_modules package-lock.json
npm install

# Para problemas específicos do Expo
npx expo install --fix
```

#### 🎯 App não carrega no dispositivo
```bash
# Verifique se o dispositivo está na mesma rede
npx expo start --tunnel

# Para Android, habilite USB debugging
adb devices
```

### 📋 FAQ (Perguntas Frequentes)

**Q: Posso usar este app sem internet?**
A: Não, o app requer conexão para análise de IA e sincronização de dados.

**Q: Quais formatos de imagem são suportados?**
A: JPEG, PNG e outros formatos padrão suportados pela câmera.

**Q: Os dados ficam seguros?**
A: Sim, utilizamos Firebase Auth e regras de segurança do Firestore.

**Q: Posso usar no iOS e Android?**
A: Sim, o app é multiplataforma e funciona em ambos os sistemas.

## ⚡ Performance e Otimizações

### 🚀 Otimizações Implementadas
- **Lazy Loading**: Carregamento sob demanda de componentes
- **Image Optimization**: Compressão automática de imagens (qualidade 0.8)
- **Debounce**: Controle de rate limiting em buscas e inputs
- **React Hooks**: UseCallback para evitar re-renders desnecessários
- **Firebase Rules**: Consultas otimizadas no Firestore
- **Cache Local**: AsyncStorage para dados frequentemente acessados

### 📊 Métricas de Performance
- **Tempo de carregamento**: < 3 segundos na primeira abertura
- **Análise de IA**: 5-10 segundos dependendo da complexidade da imagem
- **Sincronização**: Tempo real com Firestore
- **Uso de memória**: Otimizado para dispositivos com 2GB+ RAM

### 🔧 Configurações de Performance
```javascript
// src/config/constants.js
export const APP_CONFIG = {
  IMAGE_QUALITY: 0.8,           // Balanço entre qualidade e tamanho
  MAX_API_RETRIES: 2,           // Tentativas de reconexão
  RETRY_DELAY_MS: 1000,         // Delay entre tentativas
  ANIMATION_DURATION: {
    FAST: 200,
    NORMAL: 300,
    SLOW: 500,
  }
};
```

## 🗺️ Roadmap e Funcionalidades Futuras

### 🚧 Em Desenvolvimento
- [ ] **Modo Offline**: Cache de receitas para uso sem internet
- [ ] **Compartilhamento**: Compartilhar receitas via redes sociais
- [ ] **Lista de Compras**: Gerar lista automaticamente dos ingredientes
- [ ] **Notificações Push**: Lembretes de receitas e novidades
- [ ] **Dark Mode**: Tema escuro para melhor experiência noturna

### 💡 Ideias Futuras
- [ ] **Reconhecimento de Voz**: Comando por voz para navegação
- [ ] **AR**: Realidade aumentada para sobreposição de instruções
- [ ] **Social**: Sistema de seguir outros usuários e suas receitas
- [ ] **Machine Learning**: Sugestões personalizadas baseadas no histórico
- [ ] **Integração**: APIs de supermercados para preços de ingredientes

### 🎯 Versões Planejadas
- **v1.1**: Modo offline e compartilhamento
- **v1.2**: Lista de compras inteligente
- **v2.0**: Features sociais e AR
- **v2.1**: ML personalizado

### 🔗 Links Úteis
- [Documentação do React Native](https://reactnative.dev/docs/getting-started)
- [Documentação do Expo](https://docs.expo.dev/)
- [Firebase Console](https://console.firebase.google.com/)
- [Google AI Studio](https://makersuite.google.com/app/apikey)
- [ESLint Rules](https://eslint.org/docs/rules/)

## 🤝 Contribuição

Este é um projeto acadêmico, mas contribuições são bem-vindas para fins educacionais:

### 📋 Como Contribuir
1. **Fork** o projeto
2. **Crie uma branch** para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abra um Pull Request**

# Corrigir problemas automaticamente
npm run lint:fix
```

### 📝 Convenções de Código
- Use ESLint para manter a qualidade
- Siga os padrões React Native estabelecidos
- Documente funções complexas
- Use nomes descritivos para variáveis e funções
- Mantenha componentes pequenos e reutilizáveis

## 📜 Licença

Este projeto foi desenvolvido para fins **acadêmicos e educacionais**.

### 📋 Termos de Uso
- ✅ Uso para aprendizado e estudo
- ✅ Modificação do código para projetos pessoais
- ✅ Referência em trabalhos acadêmicos (com citação)
- ❌ Uso comercial sem autorização
- ❌ Redistribuição sem créditos



<div align="center">

### 🚀 **FotoSabor** - Transformando Ingredientes em Experiências Culinárias

**Desenvolvido com ❤️, 🧠 e muito ☕ para o aprendizado e inovação em tecnologia mobile**

![React Native](https://img.shields.io/badge/Made%20with-React%20Native-blue?style=for-the-badge&logo=react)
![Firebase](https://img.shields.io/badge/Powered%20by-Firebase-orange?style=for-the-badge&logo=firebase)
![AI](https://img.shields.io/badge/Enhanced%20by-AI-green?style=for-the-badge&logo=google)

**[⭐ Star este repositório](https://github.com/carloskvasir/fotosabor)** se ele foi útil para seus estudos!

*"A tecnologia é melhor quando aproxima as pessoas."* - Matt Mullenweg

</div>
