const BASE_URL = 'https://level1-io-service.onrender.com';

export async function criarSolicitacao(idusuario: number, idcampanha: number) {
  const resposta = await fetch(`${BASE_URL}/solicitacao`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idusuario, idcampanha }),
  });
  if (!resposta.ok) throw new Error(`Erro ao enviar solicitação: ${resposta.status}`);
  return await resposta.json();
}

export async function getSolicitacoesPendentes(idusuario: number) {
  const resposta = await fetch(`${BASE_URL}/solicitacoes/${idusuario}`);
  if (!resposta.ok) throw new Error(`Erro ao buscar solicitações: ${resposta.status}`);
  return await resposta.json();
}

export async function responderSolicitacao(idsolicitacao: number, status: 'aceito' | 'negado') {
  const resposta = await fetch(`${BASE_URL}/solicitacao/${idsolicitacao}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!resposta.ok) throw new Error(`Erro ao responder solicitação: ${resposta.status}`);
  return await resposta.json();
}
