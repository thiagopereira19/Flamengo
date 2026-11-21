# Flamengo · história e títulos

Site sobre a história do Flamengo, feito só com HTML, CSS e JavaScript (sem framework, sem build). É um projeto de torcedor, pra estudo, e não tem ligação oficial com o clube. O escudo e o hino são do clube e dos autores, então vale confirmar os direitos antes de transformar isso em produto.

## O que tem

- linha do tempo por eras, do remo em 1895 até 2026
- títulos por competição, com os anos de cada um
- busca por ano: arrasta o slider e aparecem os títulos daquele ano (estaduais ficam de fora)
- galeria 3D com nove ídolos, que dá pra arrastar, trocar pelas setas ou pelo teclado
- hino tocando enquanto você navega (começa no botão "Entrar no Maracanã", porque o navegador bloqueia som automático)
- seção de 2026 com a reta final do Brasileirão (fica em `AGORA`, no `data.js`)
- jogo de pênaltis em canvas (`js/game.js`)

## Tecnologia

- **Three.js** faz o escudo 3D e as 1.700 partículas do topo. Vem de um CDN, então precisa de internet. Sem ele, aparece o escudo plano.
- **Web Audio** faz o grave do hino mexer com o escudo, o brilho e as partículas. Só funciona com servidor local ou hospedagem, não com duplo clique no arquivo.
- **Canvas 2D** no jogo de pênaltis.
- Cursor próprio, botões que seguem o mouse, barra de progresso e animações ao rolar. Tudo respeita `prefers-reduced-motion`.

## Como rodar

O site usa módulos ES, então não abre com duplo clique. No VS Code, clique com o botão direito no `index.html` e escolha **Open with Live Server**. Ou, na pasta do projeto:

```
python3 -m http.server 8000
```

e abra http://localhost:8000.

## Estrutura

```
index.html      estrutura da página
css/style.css   visual (as cores ficam em variáveis no :root)
js/data.js      todos os dados: títulos, linha do tempo, ídolos
js/main.js      monta a página a partir do data.js e controla a busca por ano
js/dom.js       mini createElement (texto entra como texto, nunca como HTML)
js/cena3d.js    escudo 3D e partículas
js/game.js      jogo de pênaltis
```

Pra atualizar um título (uma conquista nova em 2026, por exemplo), mexa só no `js/data.js` e troque a data de `ATUALIZADO_EM`.

## De onde vêm os dados

Conferi tudo em 20/11/2026 em reportagens do Goal, 90min, Lance, Band, Itatiaia, Gazeta Esportiva e ESPN. Alguns pontos dependem de quem conta:

- **Brasileiro de 1987:** o clube conta a Copa União, então a página mostra 9 títulos (eneacampeão). A Justiça, porém, reconhece o Sport como campeão de 1987, e isso importa se o site virar produto.
- **Carioca:** são 40 títulos até 2026. Faltam os anos de alguns deles no projeto, então aparece só o total e a busca por ano ignora os estaduais.
- Os números de troféus "no total" mudam de um levantamento pra outro, por isso a página não mostra um número geral.

## Pra fazer

- [ ] completar os anos do Carioca e incluir na busca
- [ ] uma página pra cada título, com a final (placar, local, elenco)
- [ ] buscar os dados de uma API própria em vez do `data.js`
- [ ] testes e GitHub Actions
