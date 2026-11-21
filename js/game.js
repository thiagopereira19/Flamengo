// pênaltis em canvas. o gol é uma grade 3x2 e o goleiro pula num quadrado sorteado
const G = { x: 110, y: 60, w: 500, h: 210 }, COLS = 3, ROWS = 2, TOTAL = 5, BOLA = { x: 360, y: 370 };
const centro = (c, r) => ({ x: G.x + (c + .5) * G.w / COLS, y: G.y + (r + .5) * G.h / ROWS });

export function iniciarJogo(cv, placar, botao) {
  const cx = cv.getContext("2d");
  let chute = 0, gols = 0, ocupado = false, mira = null, goleiro = { x: 360, y: 190, t: 1, de: null, para: null }, bola = { ...BOLA, s: 1 }, marcas = [];

  function desenhar() {
    const g = cx.createLinearGradient(0, 0, 0, 420); g.addColorStop(0, "#0d2a14"); g.addColorStop(1, "#1d5a2a");
    cx.fillStyle = g; cx.fillRect(0, 0, 720, 420);
    cx.fillStyle = "#0b0b0b"; cx.fillRect(0, 0, 720, 60); // arquibancada
    for (let i = 0; i < 72; i++) { cx.fillStyle = i % 2 ? "#C8102E" : "#111"; cx.fillRect(i * 10, 40, 10, 20); }
    cx.strokeStyle = "rgba(255,255,255,.25)"; cx.lineWidth = 1;
    for (let i = 0; i <= 12; i++) { cx.beginPath(); cx.moveTo(G.x + i * G.w / 12, G.y); cx.lineTo(G.x + i * G.w / 12, G.y + G.h); cx.stroke(); }
    for (let j = 0; j <= 7; j++) { cx.beginPath(); cx.moveTo(G.x, G.y + j * G.h / 7); cx.lineTo(G.x + G.w, G.y + j * G.h / 7); cx.stroke(); }
    cx.strokeStyle = "#fff"; cx.lineWidth = 7; cx.strokeRect(G.x, G.y, G.w, G.h);
    // goleiro
    cx.fillStyle = "#ffc845"; cx.fillRect(goleiro.x - 24, goleiro.y - 34, 48, 68);
    cx.fillStyle = "#e0b090"; cx.beginPath(); cx.arc(goleiro.x, goleiro.y - 44, 12, 0, 7); cx.fill();
    cx.strokeStyle = "#ffc845"; cx.lineWidth = 9; cx.beginPath(); cx.moveTo(goleiro.x - 24, goleiro.y - 20); cx.lineTo(goleiro.x - 52, goleiro.y - 46); cx.moveTo(goleiro.x + 24, goleiro.y - 20); cx.lineTo(goleiro.x + 52, goleiro.y - 46); cx.stroke();
    // mira
    if (mira && !ocupado) { cx.strokeStyle = "#E8323C"; cx.lineWidth = 3; cx.beginPath(); cx.arc(mira.x, mira.y, 16, 0, 7); cx.moveTo(mira.x - 24, mira.y); cx.lineTo(mira.x + 24, mira.y); cx.moveTo(mira.x, mira.y - 24); cx.lineTo(mira.x, mira.y + 24); cx.stroke(); }
    // bola
    cx.fillStyle = "#fff"; cx.beginPath(); cx.arc(bola.x, bola.y, 18 * bola.s, 0, 7); cx.fill();
    cx.strokeStyle = "#000"; cx.lineWidth = 2; cx.stroke();
    // bolinhas do placar
    marcas.forEach((m, i) => { cx.fillStyle = m ? "#2ecc71" : "#E8323C"; cx.beginPath(); cx.arc(30 + i * 26, 400, 9, 0, 7); cx.fill(); });
    requestAnimationFrame(desenhar);
  }

  const pos = (e) => { const r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) * 720 / r.width, y: (e.clientY - r.top) * 420 / r.height }; };
  cv.addEventListener("pointermove", (e) => (mira = pos(e)));
  cv.addEventListener("pointerdown", (e) => { if (!ocupado && chute < TOTAL) cobrar(pos(e)); });

  function cobrar(alvo) {
    ocupado = true;
    const dentro = alvo.x > G.x && alvo.x < G.x + G.w && alvo.y > G.y && alvo.y < G.y + G.h;
    const c = Math.min(COLS - 1, Math.max(0, Math.floor((alvo.x - G.x) / (G.w / COLS)))), r = alvo.y < G.y + G.h / 2 ? 0 : 1;
    const gc = Math.floor(Math.random() * COLS), gr = Math.floor(Math.random() * ROWS), gp = centro(gc, gr);
    const defendeu = dentro && gc === c && gr === r;
    const ini = performance.now(), b0 = { x: BOLA.x, y: BOLA.y }, g0 = { x: goleiro.x, y: goleiro.y };
    (function anima(t) {
      const k = Math.min(1, (t - ini) / 520), e = 1 - Math.pow(1 - k, 3);
      bola.x = b0.x + (alvo.x - b0.x) * e; bola.y = b0.y + (alvo.y - b0.y) * e; bola.s = 1 - .45 * e;
      goleiro.x = g0.x + (gp.x - g0.x) * e; goleiro.y = g0.y + (gp.y - g0.y) * e;
      if (k < 1) return requestAnimationFrame(anima);
      const gol = dentro && !defendeu; chute++; if (gol) { gols++; cv.classList.add('gol'); setTimeout(() => cv.classList.remove('gol'), 700); } marcas.push(gol);
      const msg = !dentro ? "Pra fora!" : defendeu ? "Defendeu! O goleiro foi no canto certo." : "GOOOL do Mengão!";
      if (chute === TOTAL) {
        placar.textContent = `${msg} Fim: ${gols} gol${gols === 1 ? "" : "s"} em ${TOTAL}. ` + (gols >= 4 ? "Digno de Maracanã lotado." : gols >= 2 ? "Dá pra melhorar, mas a Nação perdoa." : "Hoje o goleiro estava inspirado.");
        botao.hidden = false; ocupado = false; return;
      }
      placar.textContent = `${msg} Cobrança ${chute + 1} de ${TOTAL}. Gols: ${gols}.`;
      setTimeout(() => { bola = { ...BOLA, s: 1 }; goleiro = { x: 360, y: 190 }; ocupado = false; }, 800);
    })(ini);
  }

  botao.addEventListener("click", () => { chute = 0; gols = 0; marcas = []; bola = { ...BOLA, s: 1 }; goleiro = { x: 360, y: 190 }; botao.hidden = true; placar.textContent = "Cobrança 1 de 5. Clique no gol."; });
  desenhar();
}
