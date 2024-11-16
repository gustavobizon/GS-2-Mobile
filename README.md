📲 App de Autenticação -
Este projeto contém três telas principais: Login, Registro e Recuperação de Senha, todas implementadas em React Native com chamadas de API. Abaixo estão as funcionalidades principais de cada tela com explicações dos trechos mais importantes do código.

-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

💥 Estrutura do Projeto 💥
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

📂 LoginScreen
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
A tela de Login permite que o usuário entre com seu username e password. Abaixo estão os trechos de código essenciais para autenticação e navegação.


    const handleLogin = async () => {
      try {
        const response = await fetch('http://localhost:3000/login', { // Realiza uma chamada POST para autenticar
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });
        const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.token); // Armazena o token de autenticação
      localStorage.setItem('role', username.startsWith('admin_') ? 'admin' : 'user'); // Define role baseada no nome de usuário
      localStorage.setItem('username', username); // Armazena o nome do usuário
      navigation.navigate('GraphScreen', { token: data.token, username }); // Navega para a tela principal
    } else {
      setErrorMessage(data.message || 'Erro no login');
    }
      } catch (error) {
        setErrorMessage('Erro ao conectar-se ao servidor.');
      }
    };
Explicação:

Autenticação: O código envia um username e password para o servidor via fetch e, se autenticado com sucesso, armazena o token recebido para uso futuro.
Definição de Role: Verifica o prefixo do username para definir se o usuário é admin ou user.
Navegação: Após o login bem-sucedido, o usuário é redirecionado para a tela GraphScreen.

-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

📝 RegisterScreen
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
A tela de Registro permite o cadastro de novos usuários. Inclui campos para um dogName, que atua como pergunta de segurança, e um seletor para definir o tipo de usuário.


    const handleRegister = async () => {
      if (role === 'admin' && !username.startsWith('admin_')) { // Validação para role "admin"
        setErrorMessage('Você não pode ser admin');
        return;
      }
    
     try {
       const response = await fetch('http://localhost:3000/register', { // Chamada de API para registrar
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, dogName, role }),
        });

    const data = await response.json();
    if (response.ok) {
      navigation.navigate('LoginScreen'); // Redireciona para a tela de login ao sucesso
    } else {
      setErrorMessage(data.message || 'Erro no registro');
    }
    } catch (error) {
      setErrorMessage('Erro ao conectar-se ao servidor.');
    }
    };
Explicação:

Validação da Role: Para ser admin, o username deve iniciar com admin_, prevenindo usuários comuns de se registrarem como administradores.
Registro no Servidor: Os dados de registro são enviados para o servidor, que retorna uma resposta com sucesso ou erro.
Redirecionamento para Login: Após o registro, o usuário é redirecionado para a tela de login.

-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

🔑 RecoverScreen
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
A tela de Recuperação de Senha verifica o usuário com base no username e na pergunta de segurança (dogName). Se a verificação for bem-sucedida, permite ao usuário definir uma nova senha.


    const handleRecoverPassword = async () => {
      try {
        const response = await fetch('http://localhost:3000/recover-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, dogName }),
        });

    const data = await response.json();
    if (response.ok) {
      setErrorMessage('Usuário verificado com sucesso!');
      setIsPasswordRecovered(true); // Ativa a opção para definir nova senha
    } else {
      setErrorMessage(data.message);
    }
    } catch (error) {
      setErrorMessage('Erro ao recuperar a senha.');
    }
    };

    const handleChangePassword = async () => {
      try {
        const response = await fetch('http://localhost:3000/change-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, newPassword }),
        });

    const data = await response.json();
    if (response.ok) {
      setErrorMessage('Senha alterada com sucesso!');
      setIsPasswordRecovered(false); // Reinicia o fluxo após sucesso
      navigation.navigate('LoginScreen');
    } else {
      setErrorMessage(data.message);
    }
    } catch (error) {
      setErrorMessage('Erro ao mudar a senha.');
    }
    };
Explicação:

Verificação de Segurança: A primeira função (handleRecoverPassword) verifica o usuário e, se a resposta for bem-sucedida, permite que o usuário defina uma nova senha.
Redefinição de Senha: handleChangePassword redefine a senha do usuário e o redireciona de volta ao login após o sucesso.
Controle de Fluxo: isPasswordRecovered permite alternar entre o formulário de verificação e o de redefinição de senha.

-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
