const BASE_URL = 'https://level1-io-service.onrender.com';

export async function getFichasUsuario(idusuario: number) {
  const resposta = await fetch(`${BASE_URL}/fichas/${idusuario}`);
  if (!resposta.ok) throw new Error(`Erro ao buscar fichas: ${resposta.status}`);
  return await resposta.json();
}

export async function criarFicha(dados: {
  nomepersonagem: string;
  classe?: string;
  nivel?: number;
  raca?: string;
  idusuario: number;
  idcampanha?: number;
}) {
  const resposta = await fetch(`${BASE_URL}/ficha`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
  if (!resposta.ok) throw new Error(`Erro ao criar ficha: ${resposta.status}`);
  return await resposta.json();
}

export async function deletarFicha(idficha: number) {
  const resposta = await fetch(`${BASE_URL}/ficha/${idficha}`, {
    method: 'DELETE',
  });
  if (!resposta.ok) throw new Error(`Erro ao deletar ficha: ${resposta.status}`);
  return await resposta.json();
}
