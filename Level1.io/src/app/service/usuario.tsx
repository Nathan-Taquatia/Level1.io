// URL base do servico backend hospedado no Render
const BASE_URL = 'https://level1-io-service.onrender.com';

// Autentica o usuario enviando email e senha via POST
export async function login2(email: string, senha: string) {
  const resposta = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ emailusuario: email, mdsenha: senha }),
  });
  if (!resposta.ok) throw new Error(`Erro na requisição: ${resposta.status}`);
  return await resposta.json();
}

// Registra um novo usuario no banco de dados
export async function cadastrar(nomeusuario: string, email: string, senha: string, apelido?: string) {
  const resposta = await fetch(`${BASE_URL}/cadastro`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nomeusuario, emailusuario: email, mdsenha: senha, apelido: apelido ?? null }),
  });
  if (!resposta.ok) throw new Error(`Erro no cadastro: ${resposta.status}`);
  return await resposta.json();
}
