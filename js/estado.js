import { lerJson, salvarJson } from "./armazenamento.js";
import { estimarTotal, listarMercados } from "./comparacao.js";

const CHAVE = "economiza-lista-itens";

function precoValido(preco) {
  return preco
    && typeof preco.mercado === "string"
    && Number.isFinite(preco.valor)
    && preco.valor > 0;
}

function itemValido(item) {
  return item
    && typeof item.id === "string"
    && typeof item.nome === "string"
    && typeof item.categoria === "string"
    && Number.isInteger(item.quantidade)
    && Array.isArray(item.precos);
}

function carregar() {
  const dados = lerJson(CHAVE, []);
  if (!Array.isArray(dados)) return [];
  return dados.filter(itemValido).map((item) => ({
    ...item,
    comprado: Boolean(item.comprado),
    precos: item.precos.filter(precoValido)
  }));
}

let itens = carregar();

function gravar(novosItens) {
  if (!salvarJson(CHAVE, novosItens)) {
    throw new Error("Não foi possível salvar os dados neste aparelho.");
  }
  itens = novosItens;
}

function gerarId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function criarItem({ nome, categoria, quantidade, precos = [] }) {
  return {
    id: gerarId(),
    nome,
    categoria,
    quantidade,
    comprado: false,
    precos,
    criadoEm: new Date().toISOString()
  };
}

function compararItens(a, b) {
  return Number(a.comprado) - Number(b.comprado) || a.nome.localeCompare(b.nome, "pt-BR");
}

export function listarItens({ categoria = "", situacao = "todos" } = {}) {
  return itens
    .filter((item) => !categoria || item.categoria === categoria)
    .filter((item) => situacao === "todos" || item.comprado === (situacao === "comprados"))
    .sort(compararItens);
}

export function resumir() {
  const estimativa = estimarTotal(itens);
  return {
    total: itens.length,
    pendentes: itens.filter((item) => !item.comprado).length,
    mercados: listarMercados(itens).length,
    estimativa: estimativa.total,
    semPreco: estimativa.semPreco
  };
}

export function adicionarItem({ nome, categoria, quantidade, mercado, preco }) {
  const precos = mercado ? [{ mercado, valor: preco }] : [];
  gravar([...itens, criarItem({ nome, categoria, quantidade, precos })]);
}

export function alternarComprado(id) {
  gravar(itens.map((item) => (
    item.id === id ? { ...item, comprado: !item.comprado } : item
  )));
}

export function registrarPreco(id, mercado, valor) {
  gravar(itens.map((item) => {
    if (item.id !== id) return item;
    const outros = item.precos.filter((preco) => preco.mercado !== mercado);
    return { ...item, precos: [...outros, { mercado, valor }] };
  }));
}

export function removerItem(id) {
  gravar(itens.filter((item) => item.id !== id));
}

export function removerComprados() {
  gravar(itens.filter((item) => !item.comprado));
}

export function carregarExemplos(exemplos) {
  const nomes = new Set(itens.map((item) => item.nome.toLocaleLowerCase("pt-BR")));
  const novos = exemplos
    .filter((exemplo) => exemplo && typeof exemplo.nome === "string")
    .filter((exemplo) => !nomes.has(exemplo.nome.toLocaleLowerCase("pt-BR")))
    .map((exemplo) => criarItem({
      nome: exemplo.nome,
      categoria: exemplo.categoria,
      quantidade: exemplo.quantidade,
      precos: (exemplo.precos ?? []).filter(precoValido)
    }));

  if (novos.length > 0) gravar([...itens, ...novos]);
  return novos.length;
}
