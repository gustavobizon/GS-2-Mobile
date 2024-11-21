# 🖥️ Front-End do Sistema de Monitoramento de Sensores

Este projeto é o front-end que consome a [API de Monitoramento de Sensores](#). Ele foi desenvolvido em **React Native**

---

## 📂 Estrutura do Projeto

O projeto está dividido em 4 arquivos principais:

1. `LoginScreen.js` - Tela de login e autenticação.
2. `RegisterScreen.js` - Tela de cadastro de novos usuários.
3. `RecoverScreen.js` - Tela de recuperação de senha.
4. `IotScreen.js` - Tela principal de controle IoT.
   
---

## 🌟 Componentes Implementados

### **LoginScreen.js**

Tela de login, onde o usuário pode:

- Inserir seu nome de usuário e senha.
- Navegar para a tela de registro ou recuperação de senha.
- Autenticar-se e obter um token JWT para acesso às rotas protegidas.
---
### **RegisterScreen.js**

A `RegisterScreen` é a tela de registro que permite que novos usuários sejam cadastrados no sistema

---

#### 📋 **Principais Funcionalidades**
- **Campos de entrada de dados:**
  - `username`: Nome de usuário do sistema.
  - `password`: Senha do usuário, enviada de forma segura.
  - `dogName`: Nome que o usuário daria para um cachorro, usado como dado de validação.

- **Registro de Usuário:**
  - Os dados são enviados via **requisição POST** para a rota `/register` da API.
  - Em caso de sucesso, o usuário é redirecionado para a tela de login.
  - Se ocorrer erro (como usuário já existente), é exibida uma mensagem de erro.

---

### **RecoverScreen.js**

A `RecoverScreen` é a tela responsável por oferecer uma funcionalidade de recuperação de senha

---

#### 📋 **Principais Funcionalidades**
1. **Validação de identidade:**
   - Usuário informa seu `username` e o `dogName`.
   - A API verifica se as informações batem com os dados armazenados.
   - Se a validação for bem-sucedida, o usuário pode definir uma nova senha.

2. **Alteração de senha:**
   - Após a validação, o usuário insere uma nova senha.
   - A API atualiza a senha no banco de dados.

---

#### 🛠️ **Fluxo de Funcionamento**
1. **Validação inicial:**
   - Requisição `POST` para a rota `/recover-password`.
   - Em caso de sucesso:
     - Feedback positivo ao usuário.
     - Transição para o modo de redefinição de senha.
   - Em caso de erro:
     - Exibição de mensagens de erro em vermelho.

2. **Redefinição de senha:**
   - Requisição `POST` para a rota `/change-password`.
   - Se a senha for alterada com sucesso:
     - Feedback de sucesso.
     - Campos são limpos e o estado da tela é redefinido.

---

### **IotSCreen.js**

Permite o controle de temperatura e luzes em diferentes ambientes da casa. Ele também monitora valores de sensores de temperatura e luz e envia esses dados para o servidor.

---

## 🏠 Ambientes Controlados

Os ambientes controlados são:
- **Quarto**
- **Sala**
- **Cozinha**
- **Banheiro**

---

## 🔌 Funções Principais

- **Controle de Temperatura**: Aumente ou diminua a temperatura dos ambientes clicando nos botões "+" ou "-". O status da temperatura é mostrado ao lado de cada controle.
- **Controle de Luz**: Ative ou desative a luz de cada ambiente tocando nos botões de luz. A cor dos botões indica se a luz está ligada (amarela) ou desligada (cinza).
- **Presença**: Verifica se tem alguém presente no ambiente, se o ícone estiver azul significa que tem alguém.
- **Envio de Dados**: Envia os dados de temperatura e status de luz para o servidor através de um pedido HTTP POST.

---

### **GraphScreen**

A `GraphScreen` é uma tela projetada para exibir gráficos de temperatura e status de luz coletados de sensores visando mostrar o consumo e eficiência energética.

---

## 🚀 Funcionalidades

### 📈 Exibição de Gráficos
- **Temperatura**:
  - Gráficos de linha ou barra mostram os valores de temperatura registrados em diferentes ambientes (quarto e sala).
- **Estado da Luz**:
  - Gráficos de linha ou barra indicam se a luz estava ligada ou desligada em cada ambiente (quarto, sala, cozinha, banheiro).

### 🛠️ Opções de Personalização
- **Tipo de Gráfico**:
  - Alterna entre gráficos de linha e gráficos de barra.
- **Intervalo de Tempo**:
  - Permite filtrar os dados exibidos pelos intervalos:
    - Última Hora
    - Últimas 24 Horas
    - Última Semana
    - Últimos 30 Dias
    - Todos os Dados

### 🔄 Atualização Dinâmica
- Os gráficos são atualizados automaticamente.

### 🔐 Integração com API
- Busca os dados de sensores do servidor via requisição HTTP com autenticação baseada em token.

---

## 🛠️ Estrutura do Código

1. **`fetchSensorData`**:
   - Recupera os dados do servidor e organiza-os para uso nos gráficos de temperatura e luz.

2. **`renderTemperatureChart`**:
   - Renderiza o gráfico de temperatura com base no tipo de gráfico selecionado.

3. **`renderLightChart`**:
   - Renderiza o gráfico de estado de luz com base no tipo de gráfico selecionado.

4. **`options`**:
   - Configurações para os eixos X e Y, como títulos e início no zero.

---

# 🛠️ Tecnologias Utilizadas

- **React Native**: Framework principal para desenvolvimento de aplicativos móveis multiplataforma.
- **react-native-vector-icons**: Ícones interativos para navegação e botões, garantindo uma interface mais intuitiva.
- **@react-native-picker/picker**: Componente para seleção de opções, usado em filtros e configurações.
- **react-chartjs-2**: Bibliotecas para renderização de gráficos dinâmicos, como gráficos de linha e barra.
- **TouchableOpacity**: Elemento para botões interativos, com feedback visual ao toque.
- **ScrollView**: Permite rolagem fluida em telas com conteúdo extenso.

---

## ▶️ Como Rodar o Projeto <br/>
- **Instalar dependências:**
npm install
- **Iniciar o servidor:**
npm start
- Depois esperar carregar e clicar "W" para abrir o site em seu navegador.



