// EconomizaLista - ponto de entrada (versão inicial do planejamento).
// Nas próximas etapas, a lógica será separada em módulos
// (navegacao, estado, armazenamento, interface e validacao).

const ROTAS = ["inicio", "adicionar", "lista", "sobre"];

function rotaAtual() {
  const rota = window.location.hash.replace("#", "");
  return ROTAS.includes(rota) ? rota : "inicio";
}

function mostrarRota() {
  const rota = rotaAtual();
  document.querySelectorAll(".tela").forEach((tela) => {
    tela.hidden = tela.id !== rota;
  });
  document.querySelectorAll(".menu a").forEach((link) => {
    const ativo = link.dataset.rota === rota;
    link.classList.toggle("ativo", ativo);
    if (ativo) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function atualizarConexao() {
  const elemento = document.getElementById("status-conexao");
  elemento.textContent = navigator.onLine ? "Online" : "Offline";
}

window.addEventListener("hashchange", mostrarRota);
window.addEventListener("online", atualizarConexao);
window.addEventListener("offline", atualizarConexao);

mostrarRota();
atualizarConexao();
