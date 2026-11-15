# EconomizaLista (nome provisório)

Aplicação Web para dispositivos móveis de lista de compras com comparação de preços entre mercados.

> Projeto acadêmico da disciplina **Introdução ao Desenvolvimento para Dispositivos Móveis** — Afya Centro Universitário Ji-Paraná/RO. Professor: Romário Vitorino Ferreira.
> Etapa atual: **planejamento inicial** (12/11/2026). Os dados usados são fictícios.

## Integrantes

| Integrante | GitHub | Responsabilidade preliminar |
|---|---|---|
| NOME COMPLETO 1 | @usuario1 | Navegação entre telas, estrutura HTML e Service Worker |
| NOME COMPLETO 2 | @usuario2 | Formulário, validação e mensagens de erro/sucesso |
| NOME COMPLETO 3 | @usuario3 | Estado, localStorage, filtros e comparação de preços |
| NOME COMPLETO 4 | @usuario4 | CSS responsivo, acessibilidade, recurso do dispositivo, README e relatório |

## Problema

Ao fazer compras, muitas pessoas anotam a lista em papel ou de memória e não sabem em qual mercado cada produto está mais barato. Isso gera esquecimentos, gasto acima do planejado e perda de tempo. Faltam uma lista organizada por categoria e uma forma simples de comparar preços entre mercados.

## Objetivo

Desenvolver um aplicativo Web responsivo que permita montar uma lista de compras organizada por categorias e comparar os preços informados para cada produto em diferentes mercados, indicando a opção mais econômica. Deve funcionar offline.

## Funcionalidades previstas

- Adicionar e remover itens da lista (formulário com validação)
- Marcar item como comprado
- Filtrar itens por categoria (alimentos, limpeza, higiene, bebidas, outros) e por situação
- Registrar o preço de um produto em diferentes mercados
- Comparar preços e destacar o mercado mais barato
- Salvar os dados no `localStorage`
- Carregar categorias e dados iniciais de `data/dados.json` com `fetch`
- Compartilhar a lista (Web Share API) com alternativa de copiar para a área de transferência
- Indicar o estado da conexão (online/offline)
- Funcionar offline com Service Worker e Cache API

## Recurso do dispositivo

Compartilhamento (Web Share API) com alternativa de área de transferência (Clipboard API), além da detecção de conexão (`navigator.onLine`). Se o recurso não existir ou a permissão for negada, o aplicativo continua utilizável.

## Tecnologias

HTML5, CSS3, JavaScript (ES6+), localStorage, fetch, Service Worker e Cache API. Sem frameworks.

## Estrutura de pastas

```
economiza-lista/
├── assets/imagens/
├── css/style.css
├── data/dados.json
├── docs/evidencias/
├── js/app.js
├── index.html
└── README.md
```

Nas próximas etapas serão adicionados `service-worker.js` e os módulos em `js/` (navegacao, estado, armazenamento, interface, validacao).

## Como executar

1. Clone o repositório: `git clone URL_DO_REPOSITORIO`
2. Abra a pasta no VS Code.
3. Execute com a extensão Live Server (ou outro servidor local) e faça o primeiro carregamento online.
4. Navegador utilizado nos testes: a definir.

## Cuidados éticos e legais

- Todos os dados (produtos, mercados e preços) são fictícios.
- O aplicativo não coleta dados pessoais, localização de terceiros, imagens de pessoas ou dados financeiros.
- Não há senhas, tokens, chaves de API ou credenciais no repositório.
- Imagens, ícones e fontes externas, se usados, terão licença compatível e serão listados aqui.
- Os preços não representam valores reais de nenhum estabelecimento. Finalidade exclusivamente acadêmica.

## Roteiro de testes, limitações, relatório e vídeo

A preencher nas próximas etapas (protótipo em 19/11/2026 e entrega final em 26/11/2026).

## Referências

- MDN Web Docs: https://developer.mozilla.org/pt-BR/
- GitHub Docs: https://docs.github.com/pt
- OLIVEIRA, C. L. V.; ZANETTI, H. A. P. *JavaScript descomplicado*. São Paulo: Érica, 2020.
