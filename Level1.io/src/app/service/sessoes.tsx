const BASE_URL = 'https://level1-io-service.onrender.com';

export async function getSessoesUsuario(idusuario: number) {
  const resposta = await fetch(`${BASE_URL}/sessoes/${idusuario}`);
  if (!resposta.ok) throw new Error(`Erro ao buscar sessões: ${resposta.status}`);
  return await resposta.json();
}

export async function criarSessao(dados: {
  titulo: string;
  data_jogo: string;
  horario: string;
  descricao?: string;
  idcampanha?: number;
  idgrupo?: number;
  criado_por: number;
}) {
  const resposta = await fetch(`${BASE_URL}/sessao`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
  if (!resposta.ok) throw new Error(`Erro ao criar sessão: ${resposta.status}`);
  return await resposta.json();
}

export async function deletarSessao(idsessao: number) {
  const resposta = await fetch(`${BASE_URL}/sessao/${idsessao}`, {
    method: 'DELETE',
  });
  if (!resposta.ok) throw new Error(`Erro ao deletar sessão: ${resposta.status}`);
  return await resposta.json();
}
