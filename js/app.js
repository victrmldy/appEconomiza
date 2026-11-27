import { observarConexao } from "./conexao.js";
import { carregarDados } from "./dados.js";
import { compartilharTexto } from "./dispositivo.js";
import {
  adicionarItem,
  alternarComprado,
  carregarExemplos,
  listarItens,
  registrarPreco,
  removerComprados,
  removerItem,
  resumir
} from "./estado.js";
import { montarTextoLista, pluralizar } from "./formatacao.js";
import {
  atualizarStatusConexao,
  definirEstadoDados,
  focarPrimeiroErro,
  limparErroCampo,
  mostrarErrosFormulario,
  mostrarMensagem,
  preencherOpcoes,
  renderizarLista,
  renderizarResumo
} from "./interface.js";
import { iniciarNavegacao } from "./navegacao.js";
import { validarItem, validarPreco } from "./validacao.js";

const MENSAGEM_FORMULARIO = "#mensagem-formulario";
const MENSAGEM_LISTA = "#mensagem-lista";

const RESULTADOS_COMPARTILHAMENTO = {
  compartilhado: "Lista compartilhada.",
  copiado: "Lista copiada para a área de transferência.",
  cancelado: "Compartilhamento cancelado."
};

const formulario = document.querySelector("#form-item");
const campoCategoria = document.querySelector("#categoria");
const campoMercado = document.querySelector("#mercado");
const filtroCategoria = document.querySelector("#filtro-categoria");
const filtroSituacao = document.querySelector("#filtro-situacao");
const listaItens = document.querySelector("#lista-itens");
const botaoCompartilhar = document.querySelector("#compartilhar");
const botaoExemplos = document.querySelector("#carregar-exemplos");
const botaoRemoverComprados = document.querySelector("#remover-comprados");
const botaoRecarregar = document.querySelector("#recarregar-dados");

let dados = { categorias: [], mercados: [], itensIniciais: [] };
const filtros = { categoria: "", situacao: "todos" };
const detalhesAbertos = new Set();

function atualizarLista() {
  renderizarLista(listarItens(filtros), dados.mercados, detalhesAbertos);
  renderizarResumo(resumir());
}

function executar(acao, seletorMensagem) {
  try {
    mostrarMensagem(seletorMensagem, acao(), "sucesso");
    return true;
  } catch (erro) {
    mostrarMensagem(seletorMensagem, erro.message, "erro");
    return false;
  } finally {
    atualizarLista();
  }
}

async function iniciarDados() {
  definirEstadoDados("carregando", "Carregando categorias e mercados...");

  try {
    dados = await carregarDados();
    preencherOpcoes(campoCategoria, dados.categorias, "Selecione");
    preencherOpcoes(campoMercado, dados.mercados, "Selecione");
    preencherOpcoes(filtroCategoria, dados.categorias, "Todas");
    filtros.categoria = "";
    definirEstadoDados("pronto", "Categorias e mercados carregados.");
    atualizarLista();
  } catch (erro) {
    definirEstadoDados("erro", erro.message);
  }
}

formulario.addEventListener("input", (evento) => {
  limparErroCampo(evento.target.id);
});

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const entrada = Object.fromEntries(new FormData(formulario));
  const { erros, valores } = validarItem(entrada, {
    categorias: dados.categorias,
    mercados: dados.mercados,
    itens: listarItens()
  });

  mostrarErrosFormulario(erros);

  if (Object.keys(erros).length > 0) {
    mostrarMensagem(MENSAGEM_FORMULARIO, "Corrija os campos destacados.", "erro");
    focarPrimeiroErro(erros);
    return;
  }

  const adicionado = executar(() => {
    adicionarItem(valores);
    return `"${valores.nome}" foi adicionado à lista.`;
  }, MENSAGEM_FORMULARIO);

  if (adicionado) {
    formulario.reset();
    document.querySelector("#nome").focus();
  }
});

filtroCategoria.addEventListener("change", () => {
  filtros.categoria = filtroCategoria.value;
  atualizarLista();
});

filtroSituacao.addEventListener("change", () => {
  filtros.situacao = filtroSituacao.value;
  atualizarLista();
});

listaItens.addEventListener("change", (evento) => {
  const caixa = evento.target.closest("input[data-acao='alternar']");
  if (!caixa) return;

  const { id, nome } = caixa.closest("li").dataset;

  executar(() => {
    alternarComprado(id);
    return caixa.checked
      ? `"${nome}" marcado como comprado.`
      : `"${nome}" voltou para os pendentes.`;
  }, MENSAGEM_LISTA);

  document.querySelector(`#comprado-${id}`)?.focus();
});

listaItens.addEventListener("click", (evento) => {
  const botao = evento.target.closest("button[data-acao='remover']");
  if (!botao) return;

  const { id, nome } = botao.closest("li").dataset;
  if (!window.confirm(`Deseja remover "${nome}" da lista?`)) return;

  executar(() => {
    removerItem(id);
    return `"${nome}" foi removido da lista.`;
  }, MENSAGEM_LISTA);

  document.querySelector("#titulo-lista").focus();
});

listaItens.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const formularioPreco = evento.target;
  const { id } = formularioPreco.dataset;
  const { erros, valores } = validarPreco(
    Object.fromEntries(new FormData(formularioPreco)),
    dados.mercados
  );

  if (erros.mercado || erros.preco) {
    mostrarMensagem(MENSAGEM_LISTA, erros.mercado ?? erros.preco, "erro");
    formularioPreco.elements[erros.mercado ? "mercado" : "preco"].focus();
    return;
  }

  detalhesAbertos.add(id);

  executar(() => {
    registrarPreco(id, valores.mercado, valores.preco);
    return "Preço registrado.";
  }, MENSAGEM_LISTA);

  document.querySelector(`details[data-id="${id}"] summary`)?.focus();
});

listaItens.addEventListener("toggle", (evento) => {
  const { id } = evento.target.dataset;
  if (evento.target.open) {
    detalhesAbertos.add(id);
  } else {
    detalhesAbertos.delete(id);
  }
}, true);

botaoCompartilhar.addEventListener("click", async () => {
  const itens = listarItens();

  if (itens.length === 0) {
    mostrarMensagem(MENSAGEM_LISTA, "Adicione itens antes de compartilhar a lista.", "erro");
    return;
  }

  botaoCompartilhar.disabled = true;

  try {
    const resultado = await compartilharTexto("Lista de compras", montarTextoLista(itens));
    mostrarMensagem(
      MENSAGEM_LISTA,
      RESULTADOS_COMPARTILHAMENTO[resultado],
      resultado === "cancelado" ? "" : "sucesso"
    );
  } catch (erro) {
    mostrarMensagem(MENSAGEM_LISTA, erro.message, "erro");
  } finally {
    botaoCompartilhar.disabled = false;
  }
});

botaoExemplos.addEventListener("click", () => {
  executar(() => {
    const adicionados = carregarExemplos(dados.itensIniciais);
    if (adicionados === 0) return "Não há novos itens de exemplo para adicionar.";
    return `${adicionados} ${pluralizar(adicionados, "item de exemplo adicionado", "itens de exemplo adicionados")}.`;
  }, MENSAGEM_LISTA);
});

botaoRemoverComprados.addEventListener("click", () => {
  const { total, pendentes } = resumir();
  const comprados = total - pendentes;

  if (comprados === 0) {
    mostrarMensagem(MENSAGEM_LISTA, "Não há itens comprados para remover.", "erro");
    return;
  }

  const pergunta = `Deseja remover ${comprados} ${pluralizar(comprados, "item comprado", "itens comprados")} da lista?`;
  if (!window.confirm(pergunta)) return;

  executar(() => {
    removerComprados();
    return `${comprados} ${pluralizar(comprados, "item removido", "itens removidos")}.`;
  }, MENSAGEM_LISTA);
});

botaoRecarregar.addEventListener("click", iniciarDados);

iniciarNavegacao(() => {
  mostrarMensagem(MENSAGEM_FORMULARIO, "");
  mostrarMensagem(MENSAGEM_LISTA, "");
});

observarConexao(atualizarStatusConexao);
atualizarLista();
iniciarDados();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      await navigator.serviceWorker.register("./service-worker.js");
    } catch (erro) {
      console.error("Falha ao registrar o Service Worker.", erro);
    }
  });
}
