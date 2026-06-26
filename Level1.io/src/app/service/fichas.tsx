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
  idsistema?: number;
}) {
  const resposta = await fetch(`${BASE_URL}/ficha`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
  if (!resposta.ok) throw new Error(`Erro ao criar ficha: ${resposta.status}`);
  return await resposta.json();
}

export async function atualizarFicha(idficha: number, dados: {
  nomepersonagem: string;
  classe?: string;
  nivel?: number;
  raca?: string;
  idcampanha?: number;
  idsistema?: number;
}) {
  const resposta = await fetch(`${BASE_URL}/ficha/${idficha}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
  if (!resposta.ok) throw new Error(`Erro ao atualizar ficha: ${resposta.status}`);
  return await resposta.json();
}

export async function uploadPDFFicha(idficha: number, file: File) {
  const resposta = await fetch(`${BASE_URL}/ficha/pdf/${idficha}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${file.name}"`,
    },
    body: file,
  });
  if (!resposta.ok) throw new Error(`Erro ao fazer upload do PDF: ${resposta.status}`);
  return await resposta.json();
}

export function getPDFUrl(idficha: number) {
  return `${BASE_URL}/ficha/pdf/${idficha}`;
}

export async function deletarFicha(idficha: number) {
  const resposta = await fetch(`${BASE_URL}/ficha/${idficha}`, {
    method: 'DELETE',
  });
  if (!resposta.ok) throw new Error(`Erro ao deletar ficha: ${resposta.status}`);
  return await resposta.json();
}
