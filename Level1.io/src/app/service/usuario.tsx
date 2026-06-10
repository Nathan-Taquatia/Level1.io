 export async function login2(email: string, senha: string) {
    const resposta = await fetch(
      `https://level1-io-service.onrender.com/login?emailusuario=${encodeURIComponent(email)}&mdsenha=${encodeURIComponent(senha)}`
    );
    if (!resposta.ok) throw new Error(`Erro na requisição: ${resposta.status}`);
    return await resposta.json();
  }