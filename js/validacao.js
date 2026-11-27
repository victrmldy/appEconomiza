const TAMANHO_MINIMO_NOME = 2;
const QUANTIDADE_MAXIMA = 99;
const PADRAO_PRECO = /^\d{1,6}([.,]\d{1,2})?$/;

export function normalizarTexto(texto) {
  return String(texto ?? "").trim().replace(/\s+/g, " ");
}

function converterPreco(texto) {
  if (!PADRAO_PRECO.test(texto)) return null;
  const valor = Number(texto.replace(",", "."));
  return valor > 0 ? valor : null;
}

export function validarPreco(dados, mercados, obrigatorio = true) {
  const erros = {};
  const mercado = dados.mercado ?? "";
  const texto = normalizarTexto(dados.preco);
  const preco = converterPreco(texto);
  const preenchido = mercado !== "" || texto !== "";

  if (obrigatorio || preenchido) {
    if (!mercados.includes(mercado)) erros.mercado = "Selecione o mercado.";
    if (preco === null) erros.preco = "Informe um preço maior que zero, por exemplo 4,99.";
  }

  return { erros, valores: { mercado, preco } };
}

export function validarItem(dados, contexto) {
  const erros = {};
  const nome = normalizarTexto(dados.nome);
  const quantidade = Number(dados.quantidade);
  const nomeEmUso = contexto.itens.some(
    (item) => item.nome.toLocaleLowerCase("pt-BR") === nome.toLocaleLowerCase("pt-BR")
  );

  if (nome.length < TAMANHO_MINIMO_NOME) {
    erros.nome = `Informe o nome do produto com pelo menos ${TAMANHO_MINIMO_NOME} caracteres.`;
  } else if (nomeEmUso) {
    erros.nome = "Este produto já está na lista.";
  }

  if (!contexto.categorias.includes(dados.categoria)) {
    erros.categoria = "Selecione uma categoria.";
  }

  if (!Number.isInteger(quantidade) || quantidade < 1 || quantidade > QUANTIDADE_MAXIMA) {
    erros.quantidade = `Informe uma quantidade inteira de 1 a ${QUANTIDADE_MAXIMA}.`;
  }

  const preco = validarPreco(dados, contexto.mercados, false);

  return {
    erros: { ...erros, ...preco.erros },
    valores: {
      nome,
      categoria: dados.categoria,
      quantidade,
      mercado: preco.valores.mercado,
      preco: preco.valores.preco
    }
  };
}
