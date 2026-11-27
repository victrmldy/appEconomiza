async function copiar(texto) {
  if (!navigator.clipboard?.writeText) return false;

  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch (erro) {
    return false;
  }
}

export async function compartilharTexto(titulo, texto) {
  if (navigator.share) {
    try {
      await navigator.share({ title: titulo, text: texto });
      return "compartilhado";
    } catch (erro) {
      if (erro.name === "AbortError") return "cancelado";
    }
  }

  if (await copiar(texto)) return "copiado";

  throw new Error("Não foi possível compartilhar nem copiar a lista neste navegador.");
}
