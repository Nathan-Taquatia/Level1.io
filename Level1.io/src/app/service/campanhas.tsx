const BASE_URL = 'https://level1-io-service.onrender.com';

export async function getCampanhasGrupo(idgrupo: number) {
  const resposta = await fetch(`${BASE_URL}/campanhas/${idgrupo}`);
  if (!resposta.ok) throw new Error(`Erro ao buscar campanhas: ${resposta.status}`);
  return await resposta.json();
}
