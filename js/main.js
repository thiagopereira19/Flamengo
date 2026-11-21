import { TITULOS, ERAS, IDOLOS, AGORA, ATUALIZADO_EM } from "./data.js";
import { h } from "./dom.js";
import { iniciarJogo } from "./game.js";
import { iniciarCena, ligarAnalisador } from "./cena3d.js";

window.__flaOk = true;
const aviso = document.getElementById("aviso");
if (aviso) aviso.hidden = true;
const $ = (s) => document.querySelector(s);
const calmo = matchMedia("(prefers-reduced-motion: reduce)").matches;
const total = (t) => t.total ?? t.anos.length;

// hino e portão
const hino = $("#hino"),
  botaoSom = $("#som");
function somLigado(on) {
  botaoSom.setAttribute("aria-pressed", on);
  botaoSom.setAttribute("aria-label", "Hino: " + (on ? "ligado" : "desligado"));
  botaoSom.classList.toggle("mudo", !on);
}
function entrar(comSom) {
  $("#portao").classList.add("some");
  document.body.classList.remove("trancado");
  if (comSom) {
    hino.volume = 0.6;
    if (!hino.dataset.ok) {
      ligarAnalisador(hino);
      hino.dataset.ok = 1;
    }
    hino
      .play()
      .then(() => somLigado(true))
      .catch(() => somLigado(false));
  } else somLigado(false);
}
$("#entrar").addEventListener("click", () => entrar(true));
$("#entrar-mudo").addEventListener("click", () => entrar(false));
botaoSom.addEventListener("click", () => {
  if (hino.paused) {
    if (!hino.dataset.ok) {
      ligarAnalisador(hino);
      hino.dataset.ok = 1;
    }
    hino.play();
    somLigado(true);
  } else {
    hino.pause();
    somLigado(false);
  }
});

// cena 3D (se o WebGL ou o CDN falhar, fica o escudo plano)
try {
  if (!iniciarCena($("#cena"), $("#topo"))) $("#topo").classList.add("sem3d");
} catch (e) {
  console.error("Cena 3D falhou:", e);
  $("#topo").classList.add("sem3d");
}

// 2026 e contagem regressiva
$("#agora-lede").textContent = AGORA.lede;
$("#agora-cards").replaceChildren(
  ...AGORA.cards.map((c) =>
    h(
      "article",
      { class: "agora-card rv" },
      h("h3", {}, c.titulo),
      h("p", {}, c.texto),
    ),
  ),
);
const jogo = Date.parse("2026-11-21T16:30:00-03:00");
function contar() {
  const f = jogo - Date.now(),
    m = $("#contagem-msg");
  if (f <= 0) {
    ["d", "h", "m", "s"].forEach((k) => ($("#c-" + k).textContent = "0"));
    m.textContent =
      Date.now() < jogo + 3 * 3600e3
        ? "A bola está rolando. Vai, Mengão!"
        : "A decisão já aconteceu. Confira o resultado e a tabela.";
    return;
  }
  const v = {
    d: f / 864e5,
    h: (f % 864e5) / 36e5,
    m: (f % 36e5) / 6e4,
    s: (f % 6e4) / 1e3,
  };
  for (const k in v)
    $("#c-" + k).textContent = String(Math.floor(v[k])).padStart(
      k === "d" ? 1 : 2,
      "0",
    );
  m.textContent = "Falta pouco para o jogo que pode valer o título.";
}
contar();
setInterval(contar, 1000);

// linha do tempo
$("#eras").replaceChildren(
  ...ERAS.map((era) =>
    h(
      "section",
      { class: "era" },
      h("h3", { class: "rv" }, era.nome),
      h(
        "ol",
        { class: "tl" },
        ...era.itens.map((i, n) => {
          const txt = h("p", { class: "tl-txt" }, i.texto);
          return h(
            "li",
            { class: "rv" },
            h("div", { class: "tl-l" }, n % 2 ? null : txt),
            h("span", { class: "ano" }, String(i.ano)),
            h("div", { class: "tl-r" }, n % 2 ? txt : null),
          );
        }),
      ),
    ),
  ),
);

// títulos
const painel = $("#titulo-painel"),
  tiles = [];
function escolher(i) {
  const t = TITULOS[i];
  tiles.forEach((b, j) => b.setAttribute("aria-pressed", j === i));
  painel.replaceChildren(
    ...[
      h("h3", {}, t.nome),
      t.anos
        ? h(
            "ul",
            { class: "anos" },
            ...t.anos.map((a) => h("li", {}, String(a))),
          )
        : null,
      t.nota ? h("p", {}, t.nota) : null,
    ].filter(Boolean),
  );
  painel.classList.remove("troca");
  void painel.offsetWidth;
  painel.classList.add("troca");
}
TITULOS.forEach((t, i) =>
  tiles.push(
    h(
      "button",
      { class: "tile rv", type: "button", onclick: () => escolher(i) },
      h("b", {}, String(total(t))),
      h("span", {}, t.nome),
    ),
  ),
);
$("#titulos-lista").replaceChildren(...tiles);
escolher(0);

// busca por ano
const range = $("#ano"),
  saida = $("#ano-saida"),
  anoGrande = $("#ano-valor");
function mostrarAno() {
  const ano = Number(range.value);
  anoGrande.textContent = ano;
  range.style.setProperty("--p", ((ano - 1940) / 86) * 100 + "%");
  const achados = TITULOS.filter(
    (t) => t.buscavel !== false && t.anos?.includes(ano),
  );
  saida.replaceChildren(
    achados.length
      ? h(
          "ul",
          { class: "achados" },
          ...achados.map((t) => h("li", {}, "🏆 " + t.nome)),
        )
      : h(
          "p",
          { class: "vazio" },
          `Nenhum título da lista em ${ano}. Os estaduais ficam de fora desta busca.`,
        ),
  );
}
range.addEventListener("input", mostrarAno);
mostrarAno();

// ídolos (galeria 3D)
const lista = $("#idolos-lista"),
  info = $("#idolo-info"),
  fundo = $("#fundo-nome"),
  secao = $("#idolos");
let at = 0,
  mexeu = false;
const limitar = (n) => Math.max(0, Math.min(IDOLOS.length - 1, n));
const cards = IDOLOS.map((i, n) => {
  const li = h(
    "li",
    {
      class: "idolo",
      onclick: () => {
        if (!mexeu) ir(n);
      },
    },
    h(
      "div",
      { class: "idolo-in" },
      h("img", {
        src: "assets/img/" + i.img,
        alt: "Foto de " + i.nome,
        draggable: "false",
        style: "object-position:center " + i.pos,
      }),
      h("i", { class: "brilho-c" }),
    ),
  );
  if (!calmo) {
    li.addEventListener("pointermove", (e) => {
      if (!li.classList.contains("ativo") || e.buttons) return;
      const r = li.getBoundingClientRect(),
        x = (e.clientX - r.left) / r.width,
        y = (e.clientY - r.top) / r.height;
      li.style.setProperty("--ry", (x - 0.5) * 18 + "deg");
      li.style.setProperty("--rx", (0.5 - y) * 14 + "deg");
      li.style.setProperty("--mx", x * 100 + "%");
      li.style.setProperty("--my", y * 100 + "%");
    });
    li.addEventListener("pointerleave", () => {
      li.style.setProperty("--ry", "0deg");
      li.style.setProperty("--rx", "0deg");
    });
  }
  return li;
});
lista.replaceChildren(...cards);

// f = quanto a galeria já andou durante o arrasto (em cartões); 0 quando solta
function posicionar(f = 0) {
  cards.forEach((c, i) => {
    const o = i - at + f;
    c.style.setProperty("--o", o.toFixed(3));
    c.style.setProperty("--a", Math.abs(o).toFixed(3));
    c.style.setProperty("--s", Math.max(-1, Math.min(1, o)).toFixed(3));
  });
}
function ir(n) {
  at = limitar(n);
  posicionar(0);
  cards.forEach((c, i) => {
    c.classList.toggle("ativo", i === at);
    c.setAttribute("aria-hidden", i !== at);
  });
  const i = IDOLOS[at];
  info.replaceChildren(
    h("span", { class: "cont" }, `${at + 1} / ${IDOLOS.length}`),
    h("h3", {}, i.nome),
    h("span", { class: "era" }, i.era),
    h("p", {}, i.texto),
  );
  info.classList.remove("troca");
  void info.offsetWidth;
  info.classList.add("troca");
  fundo.textContent = i.nome;
  $("#ant").disabled = at === 0;
  $("#prox").disabled = at === IDOLOS.length - 1;
}
$("#ant").addEventListener("click", () => ir(at - 1));
$("#prox").addEventListener("click", () => ir(at + 1));
lista.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    ir(at - 1);
    e.preventDefault();
  }
  if (e.key === "ArrowRight") {
    ir(at + 1);
    e.preventDefault();
  }
});

// arrastar com dedo ou mouse; continua mesmo se o ponteiro sair da galeria
const freio = (f) =>
  Math.max(at - (IDOLOS.length - 1) - 0.3, Math.min(at + 0.3, f));
let arr = null;
lista.addEventListener("pointerdown", (e) => {
  arr = { x: e.clientX, f: 0, id: e.pointerId };
  mexeu = false;
});
lista.addEventListener("pointermove", (e) => {
  if (!arr) return;
  const dx = e.clientX - arr.x;
  if (!mexeu && Math.abs(dx) > 6) {
    mexeu = true;
    lista.classList.add("arrastando");
    try {
      lista.setPointerCapture(arr.id);
    } catch {}
  }
  if (mexeu) {
    arr.f = freio(dx / 140);
    posicionar(arr.f);
  }
});
function soltar() {
  if (!arr) return;
  const f = arr.f,
    foi = mexeu;
  arr = null;
  lista.classList.remove("arrastando");
  if (foi) ir(at - (Math.abs(f) < 0.25 ? 0 : Math.round(f) || Math.sign(f)));
  setTimeout(() => (mexeu = false), 0);
}
lista.addEventListener("pointerup", soltar);
lista.addEventListener("pointercancel", soltar);
lista.addEventListener("lostpointercapture", soltar);

// touchpad: dois dedos pro lado troca de ídolo, a rolagem vertical segue normal
let acc = 0,
  trava = 0,
  tw;
secao.addEventListener(
  "wheel",
  (e) => {
    const lado = Math.abs(e.deltaX) > Math.abs(e.deltaY) * 0.8 || e.shiftKey;
    if (!lado) return;
    e.preventDefault();
    if (performance.now() < trava) return;
    acc += e.deltaX || e.deltaY;
    if (Math.abs(acc) >= 140) {
      lista.classList.remove("arrastando");
      ir(at + Math.sign(acc));
      acc = 0;
      trava = performance.now() + 450;
      return;
    }
    lista.classList.add("arrastando");
    posicionar(freio((-acc / 140) * 0.7));
    clearTimeout(tw);
    tw = setTimeout(() => {
      acc = 0;
      lista.classList.remove("arrastando");
      posicionar(0);
    }, 180);
  },
  { passive: false },
);
ir(0);

document
  .querySelectorAll(".atualizado")
  .forEach((el) => (el.textContent = ATUALIZADO_EM));

// barra de progresso e animações ao rolar
const barra = $("#progresso");
function rolar() {
  barra.style.transform = `scaleX(${scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight)})`;
}
addEventListener("scroll", rolar, { passive: true });
rolar();
document
  .querySelectorAll(
    ".sec h2, .lede, .contagem, .campo, .busca, .painel, .flow-wrap, .flow-ctl",
  )
  .forEach((el) => el.classList.add("rv"));
const obs = new IntersectionObserver(
  (es) =>
    es.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("vis");
        obs.unobserve(e.target);
      }
    }),
  { threshold: 0.12 },
);
document.querySelectorAll(".rv").forEach((el, i) => {
  el.style.setProperty("--d", (i % 5) * 70 + "ms");
  obs.observe(el);
});

// cursor customizado e botões que seguem o mouse
if (matchMedia("(pointer: fine)").matches && !calmo) {
  const c = $("#cursor");
  let x = 0,
    y = 0,
    cx = 0,
    cy = 0;
  document.body.classList.add("cursor-on");
  addEventListener("pointermove", (e) => {
    x = e.clientX;
    y = e.clientY;
    c.classList.toggle(
      "alvo",
      !!e.target.closest("a,button,input,canvas,.idolo"),
    );
  });
  (function seguir() {
    cx += (x - cx) * 0.2;
    cy += (y - cy) * 0.2;
    c.style.transform = `translate(${cx}px,${cy}px)`;
    requestAnimationFrame(seguir);
  })();
  document.querySelectorAll(".btn,.som,.seta,.tile").forEach((b) => {
    b.addEventListener("pointermove", (e) => {
      const r = b.getBoundingClientRect();
      b.style.translate = `${(e.clientX - r.left - r.width / 2) * 0.18}px ${(e.clientY - r.top - r.height / 2) * 0.25}px`;
    });
    b.addEventListener("pointerleave", () => (b.style.translate = ""));
  });
}

iniciarJogo($("#gol"), $("#placar"), $("#de-novo"));
