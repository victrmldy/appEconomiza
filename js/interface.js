import { calcularEconomia, menorValor, ordenarPrecos } from "./comparacao.js";
import { formatarMoeda, pluralizar } from "./formatacao.js";

const CAMPOS_FORMULARIO = ["nome", "categoria", "quantidade", "mercado", "preco"];

export function atualizarStatusConexao(online) {
  const status = document.querySelector("#status-conexao");
  status.textContent = online
    ? "Conexão disponível"
    : "Sem conexão: dados salvos neste aparelho";
  status.className = online ? "status online" : "status offline";
}

export function mostrarMensagem(seletor, texto, tipo = "") {
  const mensagem = document.querySelector(seletor);
  mensagem.textContent = texto;
  mensagem.className = tipo;
}

export function definirEstadoDados(situacao, texto) {
  const status = document.querySelector("#status-dados");
  const formulario = document.querySelector("#form-item");
  const falhou = situacao === "erro";

  document.querySelector("#aviso-dados").hidden = !falhou;
  document.querySelector("#texto-aviso-dados").textContent = falhou ? texto : "";
  status.textContent = falhou ? "" : texto;
  status.className = situacao === "pronto" ? "sucesso" : "secundario";

  Array.from(formulario.elements).forEach((campo) => {
    campo.disabled = situacao !== "pronto";
  });
}

export function preencherOpcoes(select, valores, rotuloInicial) {
  select.replaceChildren(
    new Option(rotuloInicial, ""),
    ...valores.map((valor) => new Option(valor, valor))
  );
}

export function mostrarErrosFormulario(erros) {
  CAMPOS_FORMULARIO.forEach((campo) => {
    const entrada = document.querySelector(`#${campo}`);
    document.querySelector(`#erro-${campo}`).textContent = erros[campo] ?? "";

    if (erros[campo]) {
      entrada.setAttribute("aria-invalid", "true");
    } else {
      entrada.removeAttribute("aria-invalid");
    }
  });
}

export function limparErroCampo(campo) {
  if (!CAMPOS_FORMULARIO.includes(campo)) return;
  document.querySelector(`#erro-${campo}`).textContent = "";
  document.querySelector(`#${campo}`).removeAttribute("aria-invalid");
}

export function focarPrimeiroErro(erros) {
  const campo = CAMPOS_FORMULARIO.find((nome) => erros[nome]);
  if (campo) document.querySelector(`#${campo}`).focus();
}

export function renderizarResumo({ total, pendentes, mercados, estimativa, semPreco }) {
  document.querySelector("#indicador-itens").textContent = total;
  document.querySelector("#indicador-pendentes").textContent = pendentes;
  document.querySelector("#indicador-mercados").textContent = mercados;
  document.querySelector("#indicador-estimativa").textContent = formatarMoeda(estimativa);

  document.querySelector("#nota-estimativa").textContent = semPreco > 0
    ? `${semPreco} ${pluralizar(semPreco, "item pendente sem preço fica", "itens pendentes sem preço ficam")} fora da estimativa.`
    : "Estimativa pelo menor preço registrado de cada item pendente.";

  document.querySelector("#resumo-inicio").textContent = total === 0
    ? "Sua lista está vazia."
    : `Você tem ${pendentes} ${pluralizar(pendentes, "item pendente", "itens pendentes")} em ${total} na lista.`;
}

export function renderizarLista(itens, mercados, abertos) {
  const lista = document.querySelector("#lista-itens");
  lista.replaceChildren();

  if (itens.length === 0) {
    const vazio = document.createElement("li");
    vazio.className = "secundario";
    vazio.textContent = "Nenhum item encontrado. Adicione itens ou altere os filtros.";
    lista.append(vazio);
    return;
  }

  itens.forEach((item) => {
    lista.append(criarItem(item, mercados, abertos.has(item.id)));
  });
}

function criarItem(item, mercados, aberto) {
  const elemento = document.createElement("li");
  elemento.className = item.comprado ? "item comprado" : "item";
  elemento.dataset.id = item.id;
  elemento.dataset.nome = item.nome;

  elemento.append(
    criarTopoItem(item),
    criarCategoria(item),
    ...criarPrecos(item.precos),
    criarRegistroPreco(item, mercados, aberto),
    criarBotaoRemover(item)
  );

  return elemento;
}

function criarTopoItem(item) {
  const topo = document.createElement("div");
  topo.className = "item-topo";

  const marcar = document.createElement("label");
  marcar.className = "marcar";

  const caixa = document.createElement("input");
  caixa.type = "checkbox";
  caixa.id = `comprado-${item.id}`;
  caixa.checked = item.comprado;
  caixa.dataset.acao = "alternar";
  caixa.setAttribute("aria-label", `Marcar ${item.nome} como comprado`);

  const nome = document.createElement("span");
  nome.className = "nome-item";
  nome.textContent = item.nome;

  const quantidade = document.createElement("span");
  quantidade.className = "quantidade";
  quantidade.textContent = `Qtd: ${item.quantidade}`;

  marcar.append(caixa, nome);
  topo.append(marcar, quantidade);
  return topo;
}

function criarCategoria(item) {
  const categoria = document.createElement("span");
  categoria.className = "categoria";
  categoria.textContent = item.categoria;
  return categoria;
}

function criarPrecos(precos) {
  if (precos.length === 0) {
    const vazio = document.createElement("p");
    vazio.className = "sem-preco";
    vazio.textContent = "Nenhum preço registrado.";
    return [vazio];
  }

  const menor = menorValor(precos);
  const comparando = precos.length > 1;
  const lista = document.createElement("ul");
  lista.className = "precos";

  ordenarPrecos(precos).forEach((preco) => {
    const linha = document.createElement("li");
    const maisBarato = comparando && preco.valor === menor;
    linha.className = maisBarato ? "preco menor" : "preco";

    const mercado = document.createElement("span");
    mercado.textContent = preco.mercado;

    const valor = document.createElement("strong");
    valor.textContent = formatarMoeda(preco.valor);

    linha.append(mercado, valor);

    if (maisBarato) {
      const selo = document.createElement("span");
      selo.className = "selo";
      selo.textContent = "Mais barato";
      linha.append(selo);
    }

    lista.append(linha);
  });

  const economia = calcularEconomia(precos);
  if (economia === 0) return [lista];

  const resumo = document.createElement("p");
  resumo.className = "economia";
  resumo.textContent = `Economia de ${formatarMoeda(economia)} por unidade em relação ao mais caro.`;
  return [lista, resumo];
}

function criarRotulo(texto, controle) {
  const rotulo = document.createElement("label");
  rotulo.append(texto, controle);
  return rotulo;
}

function criarRegistroPreco(item, mercados, aberto) {
  const detalhes = document.createElement("details");
  detalhes.className = "registro-preco";
  detalhes.dataset.id = item.id;
  detalhes.open = aberto;

  const titulo = document.createElement("summary");
  titulo.textContent = "Registrar preço";

  const mercado = document.createElement("select");
  mercado.name = "mercado";
  preencherOpcoes(mercado, mercados, "Selecione");

  const preco = document.createElement("input");
  preco.name = "preco";
  preco.inputMode = "decimal";
  preco.maxLength = 9;
  preco.autocomplete = "off";
  preco.placeholder = "0,00";

  const salvar = document.createElement("button");
  salvar.type = "submit";
  salvar.textContent = "Salvar preço";

  const formulario = document.createElement("form");
  formulario.className = "form-preco";
  formulario.dataset.id = item.id;
  formulario.noValidate = true;
  formulario.append(
    criarRotulo("Mercado", mercado),
    criarRotulo("Preço unitário (R$)", preco),
    salvar
  );

  detalhes.append(titulo, formulario);
  return detalhes;
}

function criarBotaoRemover(item) {
  const botao = document.createElement("button");
  botao.type = "button";
  botao.className = "perigo";
  botao.dataset.acao = "remover";
  botao.textContent = "Remover";
  botao.setAttribute("aria-label", `Remover ${item.nome}`);
  return botao;
}
