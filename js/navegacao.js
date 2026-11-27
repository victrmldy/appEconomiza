const ROTAS = ["inicio", "adicionar", "lista", "sobre"];

function obterRota() {
  const rota = location.hash.replace("#", "");
  return ROTAS.includes(rota) ? rota : "inicio";
}

function exibirRota(rota) {
  document.querySelectorAll("[data-tela]").forEach((tela) => {
    tela.hidden = tela.dataset.tela !== rota;
  });

  document.querySelectorAll("[data-rota]").forEach((link) => {
    if (link.dataset.rota === rota) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function sincronizar() {
  const rota = obterRota();
  if (location.hash !== `#${rota}`) {
    history.replaceState(null, "", `#${rota}`);
  }
  exibirRota(rota);
  return rota;
}

export function iniciarNavegacao(aoNavegar) {
  aoNavegar(sincronizar());

  window.addEventListener("hashchange", () => {
    const rota = sincronizar();
    document.querySelector(`[data-tela="${rota}"] h2`).focus();
    aoNavegar(rota);
  });
}
