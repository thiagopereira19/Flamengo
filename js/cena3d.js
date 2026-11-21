// cena 3D do topo (Three.js pelo CDN). escudo e partículas mexem com o grave do hino (Web Audio)
const T = window.THREE;
let analisador, dados, grave = 0;

// só em http(s): em file:// o navegador muta o áudio quando ele passa pelo analisador
export function ligarAnalisador(el) {
  if (!location.protocol.startsWith("http")) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const fonte = ctx.createMediaElementSource(el);
    analisador = ctx.createAnalyser(); analisador.fftSize = 256;
    fonte.connect(analisador); analisador.connect(ctx.destination);
    dados = new Uint8Array(analisador.frequencyBinCount);
    ctx.resume();
  } catch { analisador = null; }
}

function bolinha(cor) {
  const c = document.createElement("canvas"); c.width = c.height = 64;
  const g = c.getContext("2d"), r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  r.addColorStop(0, cor); r.addColorStop(.35, cor.replace("1)", ".35)")); r.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = r; g.fillRect(0, 0, 64, 64); return new T.CanvasTexture(c);
}

export function iniciarCena(canvas, hero) {
  const calmo = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let r;
  if (!T) return false;
  try { r = new T.WebGLRenderer({ canvas, alpha: true, antialias: true }); } catch { return false; }
  r.setPixelRatio(Math.min(devicePixelRatio, 2));
  const cena = new T.Scene(), cam = new T.PerspectiveCamera(40, 1, .1, 100); cam.position.z = 9;
  const grupo = new T.Group(); cena.add(grupo);

  // efeito de volume: 8 cópias do escudo empilhadas, só a da frente com a cor normal
  const tex = new T.TextureLoader().load("assets/img/escudo.png"), h = 3.7, w = h * 434 / 538;
  for (let i = 0; i < 8; i++) {
    const m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, color: i === 0 ? 0xffffff : i % 2 ? 0x4a0009 : 0x14000a }));
    m.position.z = -i * .05; m.renderOrder = 10 - i; grupo.add(m);
  }
  const brilho = new T.Sprite(new T.SpriteMaterial({ map: bolinha("rgba(255,40,60,1)"), blending: T.AdditiveBlending, depthWrite: false, transparent: true }));
  brilho.scale.set(9, 9, 1); brilho.position.z = -.7; grupo.add(brilho);

  // partículas (brasas/confete) nas cores do time
  const N = 1700, pos = new Float32Array(N * 3), cor = new Float32Array(N * 3), ang = new Float32Array(N), raio = new Float32Array(N), vel = new Float32Array(N);
  const paleta = [[1, .1, .2], [1, .35, .1], [1, .78, .27], [1, 1, 1]];
  for (let i = 0; i < N; i++) {
    ang[i] = Math.random() * 6.283; raio[i] = 1.8 + Math.random() * 6; vel[i] = .004 + Math.random() * .012;
    pos[i * 3 + 1] = Math.random() * 12 - 6;
    const c = paleta[(Math.random() * 4.2) | 0]; cor.set(c, i * 3);
  }
  const geo = new T.BufferGeometry(); geo.setAttribute("position", new T.BufferAttribute(pos, 3)); geo.setAttribute("color", new T.BufferAttribute(cor, 3));
  const pts = new T.Points(geo, new T.PointsMaterial({ size: .14, map: bolinha("rgba(255,255,255,1)"), vertexColors: true, transparent: true, depthWrite: false, blending: T.AdditiveBlending }));
  cena.add(pts);

  function medir() {
    const W = hero.clientWidth, H = hero.clientHeight, a = W / H;
    r.setSize(W, H, false); cam.aspect = a; cam.updateProjectionMatrix();
    grupo.scale.setScalar(Math.min(1.15, Math.max(.55, a * 1.1)));
    grupo.position.y = a < 1 ? 1.5 : .85;
  }
  medir(); addEventListener("resize", medir);

  let visivel = true; new IntersectionObserver(([e]) => (visivel = e.isIntersecting)).observe(hero);
  const mouse = { x: 0, y: 0, sx: 0, sy: 0 };
  addEventListener("pointermove", (e) => { mouse.x = e.clientX / innerWidth * 2 - 1; mouse.y = e.clientY / innerHeight * 2 - 1; });
  const raiz = document.documentElement.style;

  (function quadro(t) {
    requestAnimationFrame(quadro);
    let alvo = .1 + .08 * Math.sin(t / 650);
    if (analisador && !document.getElementById("hino").paused) {
      analisador.getByteFrequencyData(dados);
      let s = 0; for (let i = 1; i < 8; i++) s += dados[i]; alvo = s / 7 / 255;
    }
    grave += (alvo - grave) * .25; raiz.setProperty("--grave", grave.toFixed(3));
    if (!visivel) return;
    const sy = Math.min(1, scrollY / hero.clientHeight), k = calmo ? .2 : 1;
    mouse.sx += (mouse.x - mouse.sx) * .06; mouse.sy += (mouse.y - mouse.sy) * .06;
    grupo.rotation.y = mouse.sx * .55 + sy * 1.4 + Math.sin(t / 2200) * .18 * k;
    grupo.rotation.x = mouse.sy * .3;
    const pulso = 1 + grave * .22; for (let i = 0; i < 8; i++) grupo.children[i].scale.setScalar(pulso);
    brilho.material.opacity = .45 + grave * 1.1; brilho.scale.setScalar(8 + grave * 7);
    const p = geo.attributes.position.array;
    for (let i = 0; i < N; i++) {
      ang[i] += vel[i] * (1 + grave * 5) * k; let y = p[i * 3 + 1] + vel[i] * 14 * (1 + grave * 6) * k; if (y > 6) y = -6;
      p[i * 3] = Math.cos(ang[i]) * raio[i]; p[i * 3 + 1] = y; p[i * 3 + 2] = Math.sin(ang[i]) * raio[i] * .6 - 1;
    }
    geo.attributes.position.needsUpdate = true; pts.rotation.y = sy * .8 + mouse.sx * .1;
    cam.position.z = 9 + sy * 4; r.render(cena, cam);
  })(0);
  return true;
}
