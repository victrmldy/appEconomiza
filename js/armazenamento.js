export function lerJson(chave, padrao) {
  try {
    const texto = localStorage.getItem(chave);
    return texto === null ? padrao : JSON.parse(texto);
  } catch (erro) {
    console.error(`Falha ao ler "${chave}".`, erro);
    return padrao;
  }
}

export function salvarJson(chave, valor) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
    return true;
  } catch (erro) {
    console.error(`Falha ao salvar "${chave}".`, erro);
    return false;
  }
}
