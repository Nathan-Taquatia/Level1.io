const BASE_URL = 'https://level1-io-service.onrender.com';

export async function getGruposUsuario(idusuario: number) {
  const resposta = await fetch(`${BASE_URL}/grupos/${idusuario}`);
  if (!resposta.ok) throw new Error(`Erro ao buscar grupos: ${resposta.status}`);
  return await resposta.json();
}

export async function criarGrupo(gruponomes: string, descricao: string, idusuario: number) {
  const resposta = await fetch(`${BASE_URL}/grupo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ gruponomes, descricao, idusuario }),
  });
  if (!resposta.ok) throw new Error(`Erro ao criar grupo: ${resposta.status}`);
  return await resposta.json();
}
