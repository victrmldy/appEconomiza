export function ordenarPrecos(precos) {
  return [...precos].sort((a, b) => a.valor - b.valor);
}

export function menorValor(precos) {
  return Math.min(...precos.map((preco) => preco.valor));
}

export function calcularEconomia(precos) {
  if (precos.length < 2) return 0;
  const maior = Math.max(...precos.map((preco) => preco.valor));
  return Math.round((maior - menorValor(precos)) * 100) / 100;
}

export function estimarTotal(itens) {
  const pendentes = itens.filter((item) => !item.comprado);
  const comPreco = pendentes.filter((item) => item.precos.length > 0);
  const total = comPreco.reduce(
    (soma, item) => soma + menorValor(item.precos) * item.quantidade,
    0
  );
  return {
    total: Math.round(total * 100) / 100,
    semPreco: pendentes.length - comPreco.length
  };
}

export function listarMercados(itens) {
  const nomes = itens.flatMap((item) => item.precos.map((preco) => preco.mercado));
  return [...new Set(nomes)];
}
