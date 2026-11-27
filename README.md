# EconomizaLista

Aplicação Web para dispositivos móveis de lista de compras com comparação de preços entre mercados.

Projeto da disciplina **Introdução ao Desenvolvimento para Dispositivos Móveis**, Afya Centro Universitário Ji-Paraná/RO. Professor: Romário Vitorino Ferreira. Todos os dados são fictícios.

## Integrantes e responsabilidades

| Integrante | GitHub | Responsabilidade |
|---|---|---|
| Lucas Clameirich da Silveira | @shori-ih | Estrutura HTML, navegação entre telas e Service Worker |
| João Pedro Souza Santos | @pedroojka | Formulário, validação e mensagens de erro e sucesso |
| Carlos Victor Estevam Lenk | @victrmldy | Estado, localStorage, filtros e comparação de preços |
| Ryan Freitas Lima | @ryan1Freitas | CSS responsivo, acessibilidade, recurso do dispositivo, README e relatório |

## Problema

Muitas pessoas anotam a lista de compras em papel ou de memória, esquecem itens e não sabem em qual mercado cada produto custa menos. Sem essa comparação, o gasto fica acima do necessário e o tempo de compra aumenta.

## Objetivo

Permitir que o usuário monte uma lista de compras organizada por categorias e compare os preços de cada produto em diferentes mercados, destacando a opção mais econômica, mesmo sem conexão.

## Funcionalidades

- Adicionar itens por formulário (nome, categoria, quantidade e, opcionalmente, mercado e preço)
- Validar os campos com mensagens de erro, preservando o que já foi digitado
- Marcar itens como comprados e remover itens com confirmação
- Filtrar por categoria e por situação (pendentes ou comprados)
- Registrar o preço de um produto em vários mercados e destacar o mais barato, com a economia por unidade
- Indicadores de itens, pendentes, mercados comparados e estimativa pelo menor preço
- Salvar tudo no `localStorage` e recuperar ao atualizar a página
- Carregar categorias, mercados e itens de exemplo de `data/dados.json` com `fetch`
- Compartilhar a lista pelo aparelho, com cópia para a área de transferência como alternativa
- Indicar o estado da conexão e abrir sem rede depois do primeiro carregamento

## Telas

1. **Início**: apresentação e resumo da lista
2. **Adicionar**: formulário de cadastro
3. **Lista**: indicadores, filtros, itens e comparação de preços
4. **Sobre**: informações do projeto

## Recurso do dispositivo

Compartilhamento (`navigator.share`) com alternativa pela área de transferência (`navigator.clipboard`) e detecção de conexão (`navigator.onLine` e eventos `online` e `offline`). Se o recurso não existir ou a permissão for negada, a aplicação informa o usuário e continua utilizável.

## Funcionamento offline

O `service-worker.js` usa a estratégia cache first para os arquivos da aplicação. O nome do cache é versionado em `CACHE_ATUAL`. Ao alterar qualquer arquivo, troque `economiza-lista-v1` por `economiza-lista-v2` para que o cache antigo seja removido na ativação.

## Tecnologias

HTML5, CSS3, JavaScript (módulos ES), localStorage, fetch, Service Worker e Cache API. Sem frameworks.

## Estrutura de pastas

```
economiza-lista/
├── assets/imagens/icone.svg
├── css/style.css
├── data/dados.json
├── docs/evidencias/
├── js/
│   ├── app.js
│   ├── armazenamento.js
│   ├── comparacao.js
│   ├── conexao.js
│   ├── dados.js
│   ├── dispositivo.js
│   ├── estado.js
│   ├── formatacao.js
│   ├── interface.js
│   ├── navegacao.js
│   └── validacao.js
├── index.html
├── service-worker.js
└── README.md
```

| Arquivo | Responsabilidade |
|---|---|
| `app.js` | Coordena eventos e fluxo geral |
| `navegacao.js` | Lê a rota, troca as telas e marca o menu |
| `estado.js` | Mantém e altera os itens e persiste os dados |
| `armazenamento.js` | Lê e grava JSON no localStorage com tratamento de erros |
| `validacao.js` | Normaliza e valida os dados dos formulários |
| `comparacao.js` | Cálculos de menor preço, economia, estimativa e mercados |
| `interface.js` | Cria e atualiza os elementos da tela |
| `formatacao.js` | Moeda, plural e texto da lista compartilhada |
| `dados.js` | Carrega `data/dados.json` com fetch |
| `dispositivo.js` | Compartilhamento e área de transferência |
| `conexao.js` | Observa o estado da conexão |

## Como executar

1. Clone o repositório: `git clone URL_DO_REPOSITORIO`
2. Abra a pasta completa no Visual Studio Code.
3. Instale a extensão Live Server (autor Ritwick Dey).
4. Clique com o botão direito em `index.html` e escolha **Open with Live Server**.
5. Confirme que o endereço começa com `http://` (por exemplo `http://127.0.0.1:5500/index.html`). Não abra o arquivo por `file://`, pois os módulos e o Service Worker não funcionam.
6. Faça o primeiro carregamento com internet para o cache ser criado.

Navegador utilizado nos testes: Chromium.

## Roteiro de testes

| # | Teste | Resultado esperado | Resultado observado |
|---|---|---|---|
| 1 | Abrir a aplicação | Tela Início, URL `#inicio`, indicador "Conexão disponível" | Conforme esperado |
| 2 | Navegar pelo menu e pelo botão voltar | Só a tela da rota fica visível; URL e menu sincronizados | Conforme esperado |
| 3 | Acessar uma rota inexistente (`#abc`) | Volta para `#inicio` | Conforme esperado |
| 4 | Enviar o formulário vazio | Erros em nome e categoria, foco no primeiro campo | Conforme esperado |
| 5 | Quantidade `0`, preço `abc`, preço `0`, preço sem mercado, nome com 1 letra | Mensagem de erro em cada campo; dados preservados | Conforme esperado |
| 6 | Cadastrar `  Arroz    5 kg  ` com preço `27,90` | Espaços removidos, item adicionado, formulário limpo | Conforme esperado |
| 7 | Cadastrar `arroz 5 KG` de novo | Erro "Este produto já está na lista." | Conforme esperado |
| 8 | Carregar exemplos (duas vezes) | Itens do JSON adicionados sem duplicar | Conforme esperado |
| 9 | Ver a comparação de um item com três preços | Menor preço destacado com selo e economia por unidade | Conforme esperado |
| 10 | Filtrar por categoria e por situação | Somente os itens correspondentes aparecem | Conforme esperado |
| 11 | Marcar itens como comprados | Item riscado e contagem de pendentes atualizada | Conforme esperado |
| 12 | Registrar preço sem mercado; depois em dois mercados; depois repetir um mercado | Erro; comparação criada; valor do mercado atualizado | Conforme esperado |
| 13 | Atualizar a página | Itens e situações recuperados do localStorage | Conforme esperado |
| 14 | Compartilhar a lista | Texto da lista compartilhado ou copiado para a área de transferência | Conforme esperado (cópia) |
| 15 | Compartilhamento negado e sem área de transferência | Mensagem clara; aplicação continua utilizável | Conforme esperado |
| 16 | Remover item (confirmar e cancelar) e remover comprados | Remove somente ao confirmar | Conforme esperado |
| 17 | Gravar JSON inválido no localStorage e atualizar | Aplicação abre com lista vazia, sem travar | Conforme esperado |
| 18 | Verificar Service Worker e Cache Storage | Cache `economiza-lista-v1` com 16 arquivos | Conforme esperado |
| 19 | Colocar o navegador offline e atualizar | Página abre; indicador "Sem conexão"; cadastro funciona | Conforme esperado |
| 20 | Falha ao carregar `dados.json` | Aviso, formulário bloqueado e botão "Tentar novamente" | Conforme esperado |
| 21 | Tela de 320 px e de 1280 px | Sem rolagem horizontal; leitura confortável | Conforme esperado |

As capturas e registros desses testes estão em `docs/evidencias/`.

Para repetir o teste offline: abra as ferramentas do navegador (F12), aba Network, selecione Offline e atualize a página. Para conferir o cache, abra Application, Cache Storage.

## Limitações

- Os dados ficam apenas no navegador em que foram criados; não há sincronização entre aparelhos.
- Os preços são digitados pelo usuário; não há consulta a mercados reais.
- `navigator.onLine` indica a rede percebida pelo navegador, não garante acesso a um serviço.
- Alterações no código só aparecem depois de trocar a versão do cache.
- O compartilhamento nativo depende do navegador; no computador costuma usar a cópia para a área de transferência.

## Cuidados éticos e legais

- Produtos, mercados e preços são fictícios e não representam estabelecimentos reais.
- Não são coletados senhas, documentos, endereços, dados financeiros, informações médicas, imagens de pessoas, localização de terceiros nem dados de crianças e adolescentes.
- Os dados permanecem no aparelho e não são enviados a servidores.
- O repositório não contém tokens, chaves de API, credenciais ou dados pessoais.
- O ícone `assets/imagens/icone.svg` é de autoria do grupo. Não há outros recursos externos.
- Finalidade exclusivamente acadêmica.

## Referências

- OLIVEIRA, Cláudio Luís Vieira; ZANETTI, Humberto Augusto Piovesana. *JavaScript descomplicado*: programação para Web, IoT e dispositivos móveis. São Paulo: Érica, 2020.
- MDN WEB DOCS. Documentação das APIs Web. Disponível em: https://developer.mozilla.org/pt-BR/.
- GITHUB DOCS. Documentação sobre repositórios, commits, colaboração e arquivos README. Disponível em: https://docs.github.com/pt.
