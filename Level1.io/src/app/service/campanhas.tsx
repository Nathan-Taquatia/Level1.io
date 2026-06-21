const BASE_URL = 'https://level1-io-service.onrender.com';

export async function getCampanhasGrupo(idgrupo: number) {
  const resposta = await fetch(`${BASE_URL}/campanhas/${idgrupo}`);
  if (!resposta.ok) throw new Error(`Erro ao buscar campanhas: ${resposta.status}`);
  return await resposta.json();
}

export async function getCampanhasUsuario(idusuario: number) {
  const resposta = await fetch(`${BASE_URL}/minhas-campanhas/${idusuario}`);
  if (!resposta.ok) throw new Error(`Erro ao buscar campanhas do usuário: ${resposta.status}`);
  return await resposta.json();
}

export async function criarCampanha(dados: {
  campanhanome: string;
  datajogo?: string;
  idsistema?: number;
  grupos_idgrupos: number;
  descricao?: string;
  tipo?: 'original' | 'oficial';
  dm_idusuario?: number;
}) {
  const resposta = await fetch(`${BASE_URL}/campanha`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
  if (!resposta.ok) throw new Error(`Erro ao criar campanha: ${resposta.status}`);
  return await resposta.json();
}
