const ARQUIVO = "data/dados.json";

export async function carregarDados() {
  let resposta;

  try {
    resposta = await fetch(ARQUIVO);
  } catch (erro) {
    throw new Error("Não foi possível carregar os dados. Verifique a conexão e tente novamente.");
  }

  if (!resposta.ok) {
    throw new Error("O arquivo de dados não foi encontrado.");
  }

  let dados;

  try {
    dados = await resposta.json();
  } catch (erro) {
    throw new Error("O arquivo de dados está em formato inválido.");
  }

  if (!Array.isArray(dados.categorias) || !Array.isArray(dados.mercados)) {
    throw new Error("O arquivo de dados está incompleto.");
  }

  return {
    categorias: dados.categorias,
    mercados: dados.mercados,
    itensIniciais: Array.isArray(dados.itensIniciais) ? dados.itensIniciais : []
  };
}
