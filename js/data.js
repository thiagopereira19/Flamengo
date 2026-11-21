// os dados da página estão todos aqui; pra corrigir ou atualizar algo é só mexer neste arquivo.
// conferido em 20/11/2026, com a temporada ainda rolando. fontes no README.
export const ATUALIZADO_EM = "20 de novembro de 2026";

// anos = anos dos títulos. total = pra quando a lista é longa demais (estaduais).
// buscavel: false tira o título da busca por ano.
export const TITULOS = [
  { id: "libertadores", nome: "Copa Libertadores", anos: [1981, 2019, 2022, 2025],
    nota: "Com a conquista de 2025, o Flamengo virou o primeiro clube brasileiro tetracampeão da competição." },
  { id: "mundial", nome: "Mundial Interclubes", anos: [1981],
    nota: "Em Tóquio, 3 a 0 no Liverpool. Foi o ponto mais alto da era Zico." },
  { id: "brasileiro", nome: "Campeonato Brasileiro", anos: [1980, 1982, 1983, 1987, 1992, 2009, 2019, 2020, 2025],
    nota: "Eneacampeão brasileiro: nove títulos, de 1980 a 2025, contando a Copa União de 1987." },
  { id: "copa-do-brasil", nome: "Copa do Brasil", anos: [1990, 2006, 2013, 2022, 2024] },
  { id: "carioca", nome: "Campeonato Carioca", total: 40, buscavel: false,
    nota: "O primeiro veio em 1914. O 40º foi em 2026, nos pênaltis contra o Fluminense, fechando um tricampeonato (2024, 2025 e 2026)." },
  { id: "supercopa", nome: "Supercopa do Brasil", anos: [2020, 2021, 2025] },
  { id: "recopa", nome: "Recopa Sul-Americana", anos: [2020] },
  { id: "mercosul", nome: "Copa Mercosul", anos: [1999] },
  { id: "ouro", nome: "Copa Ouro", anos: [1996] },
  { id: "rio-sp", nome: "Torneio Rio–São Paulo", anos: [1940, 1961] },
];

export const ERAS = [
  { nome: "Do remo à bola", itens: [
    { ano: 1895, texto: "Em 15 de novembro, um grupo de jovens apaixonados por remo funda o Clube de Regatas do Flamengo. Ainda não existe futebol." },
    { ano: 1911, texto: "O futebol chega ao clube, com jogadores que saem do Fluminense." },
    { ano: 1914, texto: "Primeiro título do Campeonato Carioca." },
    { ano: 1940, texto: "Campeão do Torneio Rio–São Paulo, que repete em 1961." },
  ]},
  { nome: "A era Zico", itens: [
    { ano: 1978, texto: "Começa a sequência de cariocas que atravessa o fim dos anos 1970 e chega a 1981." },
    { ano: 1980, texto: "Primeiro Campeonato Brasileiro." },
    { ano: 1981, texto: "Campeão da Libertadores e, em dezembro, do Mundial Interclubes, com 3 a 0 no Liverpool." },
    { ano: 1982, texto: "Bicampeão brasileiro. Em 1983, vem o terceiro título." },
  ]},
  { nome: "Entre Zico e 2019", itens: [
    { ano: 1987, texto: "Copa União: o Flamengo é campeão brasileiro em um dos campeonatos mais disputados da história." },
    { ano: 1990, texto: "Primeira Copa do Brasil. O Brasileiro de 1992 vem logo depois." },
    { ano: 1996, texto: "Copa Ouro. Em 1999, a Copa Mercosul." },
    { ano: 2006, texto: "Segunda Copa do Brasil. A terceira vem em 2013, e o Brasileiro de 2009 fica entre as duas." },
  ]},
  { nome: "A geração de 2019", itens: [
    { ano: 2019, texto: "Com Jorge Jesus, o Flamengo ganha a Libertadores e o Brasileiro no mesmo ano." },
    { ano: 2020, texto: "Brasileiro, Supercopa, Recopa e Carioca." },
    { ano: 2021, texto: "Supercopa do Brasil e Carioca." },
    { ano: 2022, texto: "Terceira Libertadores e quarta Copa do Brasil." },
    { ano: 2024, texto: "Quinta Copa do Brasil." },
  ]},
  { nome: "2025 e 2026", itens: [
    { ano: 2025, texto: "Supercopa, Carioca, Libertadores (contra o Palmeiras) e Brasileiro: a melhor temporada da história do clube. Em dezembro, perdeu a final da Copa Intercontinental para o PSG, nos pênaltis." },
    { ano: 2026, texto: "Campeão carioca pela 40ª vez, em 8 de março. Eliminado da Libertadores (semifinal) e da Copa do Brasil, chega à reta final do Brasileirão na liderança." },
  ]},
];

// fotos em assets/img. "era" é só um rótulo curto.
export const IDOLOS = [
  { nome: "Zico", era: "Meia · anos 1970 e 80", img: "zico.jpg", pos: "top",
    texto: "O Galinho de Quintino é o maior artilheiro da história do clube e a cara do time de 1981." },
  { nome: "Júnior", era: "Lateral e meia · 1974–84 e 1989–93", img: "junior.jpg", pos: "top",
    texto: "Jogou no clube de 1974 a 1984 e voltou de 1989 a 1993. Foi campeão da Libertadores e do Mundial de 1981." },
  { nome: "Petkovic", era: "Meia · 2001–02 e 2009–10", img: "petkovic.jpg", pos: "center",
    texto: "O sérvio entrou para a história com um gol de falta na final do Carioca de 2001, contra o Vasco. Voltou ao clube em 2009." },
  { nome: "Adriano", era: "Atacante · 2009", img: "adriano.jpg", pos: "center",
    texto: "O Imperador foi o grande nome do Brasileiro de 2009, o sexto título nacional do Flamengo, com 19 gols." },
  { nome: "Diego Ribas", era: "Meia · 2016–2020", img: "diego.jpg", pos: "center",
    texto: "Capitão e maestro da geração 2019: Libertadores, Brasileiro, Recopa e Supercopa." },
  { nome: "Filipe Luís", era: "Lateral e técnico", img: "filipe-luis.jpg", pos: "top",
    texto: "Campeão como lateral em 2019 e como técnico em 2025, com a Libertadores e o Brasileiro." },
  { nome: "Gabigol", era: "Atacante · 2019–2024", img: "gabigol.jpg", pos: "top",
    texto: "Atacante da geração 2019–2021. Soma 13 títulos pelo Flamengo, entre eles duas Libertadores." },
  { nome: "Bruno Henrique", era: "Atacante · desde 2019", img: "bruno-henrique.jpg", pos: "top",
    texto: "Chegou em 2019 e virou peça de todas as grandes conquistas da década. Ainda veste a camisa em 2026." },
  { nome: "Arrascaeta", era: "Meia · desde 2019", img: "arrascaeta.jpg", pos: "top",
    texto: "O uruguaio é o armador do time desde 2019 e segue decisivo na reta final de 2026." },
];

// seção "O Flamengo em 2026" (conferida em 20/11/2026)
export const AGORA = {
  lede: "O Flamengo completou 131 anos em 15 de novembro e chega ao fim da temporada com um objetivo só: o Brasileirão. O time de Leonardo Jardim foi eliminado da Libertadores e da Copa do Brasil, mas lidera a tabela com seis pontos de vantagem sobre o Palmeiras, faltando três rodadas.",
  cards: [
    { titulo: "Sábado, 21/11, 16h30", texto: "Palmeiras x Flamengo, no Nubank Parque, pela 36ª rodada. É o confronto direto que pode decidir o título. Léo Pereira e Pulgar estão suspensos, e De la Cruz não viajou." },
    { titulo: "Depois do clássico", texto: "Coritiba e Chapecoense encerram a campanha. O Palmeiras ainda disputa a final da Libertadores (28/11) e a Copa do Brasil." },
    { titulo: "Quem faz a diferença", texto: "Pedro briga pela artilharia do Brasileirão, Arrascaeta e Paquetá comandam o meio, e Samuel Lino e Bruno Henrique completam o ataque. O River vendeu Freitas ao clube no meio do ano." },
    { titulo: "O que já veio em 2026", texto: "Carioca: o 40º título, nos pênaltis contra o Fluminense. Também perdeu a Supercopa e a Recopa e caiu na semifinal da Libertadores diante do Estudiantes." },
  ],
};
