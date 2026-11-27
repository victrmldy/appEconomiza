import { menorValor } from "./comparacao.js";

const formatoMoeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});

export function formatarMoeda(valor) {
  return formatoMoeda.format(valor);
}

export function pluralizar(quantidade, singular, plural) {
  return quantidade === 1 ? singular : plural;
}

export function montarTextoLista(itens) {
  const linhas = itens.map((item) => {
    const marca = item.comprado ? "[x]" : "[ ]";
    const base = `${marca} ${item.quantidade}x ${item.nome} (${item.categoria})`;
    if (item.precos.length === 0) return base;
    const menor = menorValor(item.precos);
    const melhor = item.precos.find((preco) => preco.valor === menor);
    return `${base} - menor preço: ${formatarMoeda(menor)} em ${melhor.mercado}`;
  });
  return ["Lista de compras", "", ...linhas].join("\n");
}
