// =============================================================
//  CONTROLADOR DA APLICAÇÃO
//  Orquestra UI, OOP (models.js) e Funcional (functional.js)
// =============================================================

const sistema = new SistemaApostas();
let _intervaloAtualizacao = null;

// Inicia com dados locais imediatamente, depois substitui pelos reais da API
sistema.carregarJogos(JOGOS_INICIAIS);
try {
  const demo = sistema.registrar(USUARIO_DEMO.nome, USUARIO_DEMO.email, USUARIO_DEMO.senha);
  demo.saldo = USUARIO_DEMO.saldo;
} catch (_) {}

const iniciarAPI = async () => {
  const banner = $('banner-api');
  try {
    show(banner);
    banner.textContent = '⏳ Carregando jogos reais da Copa 2026...';
    const jogosAPI = await buscarJogosTemporada();
    if (jogosAPI.length > 0) {
      sistema.jogos = [];
      sistema.carregarJogos(jogosAPI);
      banner.textContent = `✅ ${jogosAPI.length} jogos carregados da API — Copa 2026 ao vivo!`;
      setTimeout(() => hide(banner), 3000);
      renderizarPagina(paginaAtual);
      // Atualiza placares a cada 60s
      _intervaloAtualizacao = setInterval(async () => {
        await atualizarPlacares(sistema);
        renderizarPagina(paginaAtual);
        if (sistema.usuarioLogado) atualizarSaldo();
      }, 60000);
    } else {
      banner.textContent = '⚠️ API sem dados — usando jogos de demonstração';
      setTimeout(() => hide(banner), 4000);
    }
  } catch (e) {
    banner.textContent = '⚠️ API indisponível — usando jogos de demonstração';
    setTimeout(() => hide(banner), 4000);
  }
};

// ── Estado da UI ──────────────────────────────────────────────
let paginaAtual = 'home';
let grupoAtivo = 'A';
let jogoSelecionado = null;

// ── Utilitários de UI ─────────────────────────────────────────

const $ = id => document.getElementById(id);
const show = el => el && el.classList.remove('hidden');
const hide = el => el && el.classList.add('hidden');

const toast = (msg, tipo = 'sucesso') => {
  const t = $('toast');
  t.textContent = msg;
  t.className = `toast show ${tipo}`;
  setTimeout(() => t.classList.remove('show'), 3500);
};

const atualizarSaldo = () => {
  const u = sistema.usuarioLogado;
  if (!u) return;
  $('saldo-valor').textContent = formatarMoeda(u.saldo);
};

// ── Navegação ─────────────────────────────────────────────────

const navegar = pagina => {
  paginaAtual = pagina;
  document.querySelectorAll('.pagina').forEach(p => hide(p));
  show($(`pag-${pagina}`));
  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('ativo', l.dataset.pagina === pagina);
  });
  renderizarPagina(pagina);
};

const renderizarPagina = pagina => {
  const mapa = {
    home: renderHome,
    grupos: renderGrupos,
    apostas: renderApostas,
    minhas: renderMinhasApostas,
    ranking: renderRanking,
    admin: renderAdmin
  };
  mapa[pagina]?.();
};

// ── Auth ──────────────────────────────────────────────────────

const atualizarBarraAuth = () => {
  const u = sistema.usuarioLogado;
  if (u) {
    hide($('area-login'));
    show($('area-usuario'));
    $('nome-usuario').textContent = u.nome.split(' ')[0];
    atualizarSaldo();
  } else {
    show($('area-login'));
    hide($('area-usuario'));
  }
};

const fazerLogin = () => {
  const email = $('login-email').value.trim();
  const senha = $('login-senha').value;
  try {
    sistema.login(email, senha);
    fecharModal('modal-login');
    atualizarBarraAuth();
    toast(`Bem-vindo, ${sistema.usuarioLogado.nome.split(' ')[0]}!`);
    renderizarPagina(paginaAtual);
  } catch (e) {
    toast(e.message, 'erro');
  }
};

const fazerRegistro = () => {
  const nome  = $('reg-nome').value.trim();
  const email = $('reg-email').value.trim();
  const senha = $('reg-senha').value;
  if (!nome || !email || !senha) { toast('Preencha todos os campos', 'erro'); return; }
  try {
    sistema.registrar(nome, email, senha);
    sistema.login(email, senha);
    fecharModal('modal-registro');
    atualizarBarraAuth();
    toast(`Conta criada! Saldo inicial: ${formatarMoeda(sistema.usuarioLogado.saldo)} 🎉`);
    renderizarPagina(paginaAtual);
  } catch (e) {
    toast(e.message, 'erro');
  }
};

const fazerLogout = () => {
  sistema.logout();
  atualizarBarraAuth();
  toast('Até logo!');
  navegar('home');
};

// ── Modais ────────────────────────────────────────────────────

const abrirModal = id => {
  show($(id));
  $(id).querySelector('input')?.focus();
};
const fecharModal = id => hide($(id));

// ── Render: HOME ──────────────────────────────────────────────

const renderHome = () => {
  const jogosLive = filtrarJogosPorStatus(sistema.jogos, 'ao_vivo');
  const proximosJogos = ordenarJogosPorData(
    filtrarJogosPorStatus(sistema.jogos, 'agendado')
  ).slice(0, 6);

  // Jogos ao vivo
  const liveEl = $('jogos-ao-vivo');
  if (jogosLive.length > 0) {
    show($('secao-ao-vivo'));
    liveEl.innerHTML = jogosLive.map(cardJogoHome).join('');
  } else {
    hide($('secao-ao-vivo'));
  }

  // Próximos jogos (ou resultados recentes se não há agendados)
  const tituloProximos = $('titulo-proximos');
  if (proximosJogos.length > 0) {
    if (tituloProximos) tituloProximos.textContent = '📅 Próximos Jogos';
    $('proximos-jogos').innerHTML = proximosJogos.map(cardJogoHome).join('');
  } else {
    const recentes = ordenarJogosPorData(filtrarJogosFinalizados(sistema.jogos)).slice(-6).reverse();
    if (tituloProximos) tituloProximos.textContent = '🏁 Resultados Recentes';
    $('proximos-jogos').innerHTML = recentes.map(cardJogoHome).join('') ||
      '<p class="sem-dados">Nenhum jogo disponível ainda.</p>';
  }

  // Estatísticas globais (programação funcional)
  const finalizados = filtrarJogosFinalizados(sistema.jogos);
  $('stat-jogos').textContent = finalizados.length;
  $('stat-apostas').textContent = sistema.apostas.length;
  $('stat-apostado').textContent = formatarMoeda(somarValores(sistema.apostas));
};

const renderBandeira = (jogo, lado) => {
  const url   = lado === 1 ? jogo.bandeiraUrl1 : jogo.bandeiraUrl2;
  const emoji = lado === 1 ? jogo.bandeira1    : jogo.bandeira2;
  const nome  = lado === 1 ? jogo.time1        : jogo.time2;
  return url
    ? `<img src="${url}" class="bandeira-img" alt="${nome}" loading="lazy" onerror="this.style.display='none';this.nextSibling.style.display='inline'">`
      + `<span class="bandeira" style="display:none">${emoji}</span>`
    : `<span class="bandeira">${emoji}</span>`;
};

const cardJogoHome = jogo => {
  const badgeStatus = jogo.status === 'ao_vivo'
    ? '<span class="badge-live">● AO VIVO</span>'
    : `<span class="badge-data">${formatarData(jogo.data)} ${jogo.hora}</span>`;
  const placar = jogo.status !== 'agendado'
    ? `<span class="placar">${jogo.placar1 ?? 0} - ${jogo.placar2 ?? 0}</span>`
    : `<span class="vs-texto">vs</span>`;

  return `
    <div class="card-jogo ${jogo.status}" onclick="abrirAposta(${jogo.id})">
      <div class="jogo-header">
        ${jogo.grupo ? `<span class="grupo-tag">Grupo ${jogo.grupo}</span>` : `<span class="grupo-tag fase-tag">${nomeFase(jogo.fase)}</span>`}
        ${badgeStatus}
      </div>
      <div class="jogo-times">
        <div class="time">
          ${renderBandeira(jogo, 1)}
          <span class="nome-time">${jogo.time1}</span>
          <span class="odd-label">Odd: ${formatarOdd(jogo.odds.time1)}</span>
        </div>
        ${placar}
        <div class="time time-direita">
          ${renderBandeira(jogo, 2)}
          <span class="nome-time">${jogo.time2}</span>
          <span class="odd-label">Odd: ${formatarOdd(jogo.odds.time2)}</span>
        </div>
      </div>
      ${jogo.status !== 'finalizado' ? '<div class="apostar-cta">Clique para apostar</div>' : `<div class="resultado-final">Resultado: ${jogo.getNomeVencedor()}</div>`}
    </div>`;
};

const nomeFase = fase => ({
  grupos: 'Fase de Grupos', oitavas: 'Oitavas', quartas: 'Quartas',
  semifinal: 'Semifinal', final: '🏆 FINAL'
}[fase] || fase);

// ── Render: GRUPOS ────────────────────────────────────────────

const renderGrupos = () => {
  const grupos = [...new Set(sistema.jogos.filter(j => j.grupo).map(j => j.grupo))].sort();

  $('tabs-grupos').innerHTML = grupos.map(g =>
    `<button class="tab-btn ${g === grupoAtivo ? 'ativo' : ''}" onclick="mudarGrupo('${g}')">Grupo ${g}</button>`
  ).join('');

  const jogosGrupo = filtrarJogosPorGrupo(sistema.jogos, grupoAtivo);
  const tabela = calcularClassificacaoGrupo(sistema.jogos, grupoAtivo);

  $('jogos-grupo').innerHTML = jogosGrupo.map(cardJogoHome).join('');

  $('tabela-grupo').innerHTML = tabela.length === 0
    ? '<p class="sem-dados">Nenhuma partida finalizada neste grupo ainda.</p>'
    : `<table class="tabela-class">
        <thead><tr><th>#</th><th>Seleção</th><th>J</th><th>V</th><th>E</th><th>D</th><th>GP</th><th>GC</th><th>SG</th><th>Pts</th></tr></thead>
        <tbody>${tabela.map((t, i) => `
          <tr class="${i < 2 ? 'classificado' : ''}">
            <td>${i + 1}</td><td>${t.time}</td><td>${t.jogos}</td>
            <td>${t.vitorias}</td><td>${t.empates}</td><td>${t.derrotas}</td>
            <td>${t.gp}</td><td>${t.gc}</td><td>${t.saldo > 0 ? '+' : ''}${t.saldo}</td>
            <td><strong>${t.pontos}</strong></td>
          </tr>`).join('')}
        </tbody>
      </table>`;
};

const mudarGrupo = g => { grupoAtivo = g; renderGrupos(); };

// ── Render: APOSTAS ───────────────────────────────────────────

const renderApostas = () => {
  const disponiveis = ordenarJogosPorData(filtrarJogosDisponiveis(sistema.jogos));
  $('lista-apostas').innerHTML = disponiveis.length === 0
    ? '<p class="sem-dados">Nenhum jogo disponível para apostas no momento.</p>'
    : disponiveis.map(cardApostaDetalhado).join('');
};

const cardApostaDetalhado = jogo => {
  const bloqueado = !sistema.usuarioLogado;
  return `
    <div class="card-aposta-det ${jogo.status === 'ao_vivo' ? 'ao-vivo' : ''}">
      <div class="card-aposta-header">
        <div>
          ${jogo.grupo ? `<span class="grupo-tag">Grupo ${jogo.grupo}</span>` : `<span class="grupo-tag fase-tag">${nomeFase(jogo.fase)}</span>`}
          ${jogo.status === 'ao_vivo' ? '<span class="badge-live">● AO VIVO</span>' : ''}
        </div>
        <span class="data-hora">${formatarData(jogo.data)} às ${jogo.hora}</span>
      </div>
      <div class="opcoes-aposta">
        <button class="btn-opcao" onclick="${bloqueado ? "abrirModal('modal-login')" : `abrirApostaModal(${jogo.id},'time1')`}">
          <span class="bandeira-op">${jogo.bandeiraUrl1 ? `<img src="${jogo.bandeiraUrl1}" class="bandeira-img-op" alt="${jogo.time1}" loading="lazy">` : jogo.bandeira1}</span>
          <span>${jogo.time1}</span>
          <span class="odd-destaque">${formatarOdd(jogo.odds.time1)}</span>
        </button>
        <button class="btn-opcao empate" onclick="${bloqueado ? "abrirModal('modal-login')" : `abrirApostaModal(${jogo.id},'empate')`}">
          <span>Empate</span>
          <span class="odd-destaque">${formatarOdd(jogo.odds.empate)}</span>
        </button>
        <button class="btn-opcao" onclick="${bloqueado ? "abrirModal('modal-login')" : `abrirApostaModal(${jogo.id},'time2')`}">
          <span class="bandeira-op">${jogo.bandeiraUrl2 ? `<img src="${jogo.bandeiraUrl2}" class="bandeira-img-op" alt="${jogo.time2}">` : jogo.bandeira2}</span>
          <span>${jogo.time2}</span>
          <span class="odd-destaque">${formatarOdd(jogo.odds.time2)}</span>
        </button>
      </div>
      ${bloqueado ? '<p class="aviso-login">⚠️ Faça login para apostar</p>' : ''}
    </div>`;
};

// ── Modal de Aposta ───────────────────────────────────────────

const abrirAposta = id => {
  const jogo = sistema.getJogoPorId(id);
  if (!jogo || jogo.status === 'finalizado') return;
  if (!sistema.usuarioLogado) { abrirModal('modal-login'); return; }
  navegar('apostas');
};

const abrirApostaModal = (jogoId, escolha) => {
  if (!sistema.usuarioLogado) { abrirModal('modal-login'); return; }
  jogoSelecionado = { jogoId, escolha };
  const jogo = sistema.getJogoPorId(jogoId);
  const odd = jogo.odds[escolha];
  $('aposta-desc').textContent = `${jogo.time1} x ${jogo.time2}`;
  $('aposta-escolha').textContent = jogo.getDescricaoEscolha(escolha);
  $('aposta-odd').textContent = formatarOdd(odd);
  $('aposta-valor').value = '';
  $('aposta-retorno').textContent = formatarMoeda(0);
  $('aposta-saldo-disp').textContent = formatarMoeda(sistema.usuarioLogado.saldo);
  abrirModal('modal-aposta');
};

const calcularPreview = () => {
  if (!jogoSelecionado) return;
  const jogo = sistema.getJogoPorId(jogoSelecionado.jogoId);
  const valor = parseFloat($('aposta-valor').value) || 0;
  const retorno = calcularRetorno(valor, jogo.odds[jogoSelecionado.escolha]);
  $('aposta-retorno').textContent = formatarMoeda(retorno);
};

const confirmarAposta = () => {
  if (!jogoSelecionado) return;
  const valor = parseFloat($('aposta-valor').value);
  if (!valor || valor <= 0) { toast('Informe um valor válido', 'erro'); return; }
  try {
    sistema.fazerAposta(jogoSelecionado.jogoId, jogoSelecionado.escolha, valor);
    fecharModal('modal-aposta');
    atualizarSaldo();
    toast(`Aposta de ${formatarMoeda(valor)} realizada com sucesso! 🎉`);
    jogoSelecionado = null;
    renderizarPagina(paginaAtual);
  } catch (e) {
    toast(e.message, 'erro');
  }
};

// ── Render: MINHAS APOSTAS ────────────────────────────────────

const renderMinhasApostas = () => {
  const u = sistema.usuarioLogado;
  if (!u) {
    $('minhas-apostas-content').innerHTML = '<p class="sem-dados">Faça login para ver suas apostas.</p>';
    return;
  }

  const apostas = u.apostas;
  const pendentes = apostas.filter(a => a.resultado === 'pendente');
  const resolvidas = apostas.filter(a => a.resultado !== 'pendente');

  // Estatísticas usando programação funcional
  const taxaAcerto = calcularTaxaAcerto(apostas);
  const totalGanho = somarGanhos(apostas);
  const totalApostado = somarValores(apostas);
  const lucro = calcularLucroTotal(apostas);

  $('minhas-apostas-content').innerHTML = `
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-num">${apostas.length}</div><div class="stat-label">Total de Apostas</div></div>
      <div class="stat-card"><div class="stat-num">${taxaAcerto}%</div><div class="stat-label">Taxa de Acerto</div></div>
      <div class="stat-card"><div class="stat-num">${formatarMoeda(totalApostado)}</div><div class="stat-label">Total Apostado</div></div>
      <div class="stat-card ${lucro >= 0 ? 'positivo' : 'negativo'}">
        <div class="stat-num">${lucro >= 0 ? '+' : ''}${formatarMoeda(lucro)}</div>
        <div class="stat-label">Lucro / Prejuízo</div>
      </div>
    </div>

    ${pendentes.length > 0 ? `
      <h3 class="secao-titulo">⏳ Apostas Pendentes (${pendentes.length})</h3>
      <div class="lista-apostas">${pendentes.map(cardAposta).join('')}</div>
    ` : ''}

    ${resolvidas.length > 0 ? `
      <h3 class="secao-titulo">📋 Histórico</h3>
      <div class="lista-apostas">${resolvidas.map(cardAposta).join('')}</div>
    ` : ''}

    ${apostas.length === 0 ? '<p class="sem-dados">Você ainda não fez nenhuma aposta. <a onclick="navegar(\'apostas\')" style="cursor:pointer;color:var(--verde-claro)">Apostar agora →</a></p>' : ''}
  `;
};

const cardAposta = a => {
  const icone = a.resultado === 'ganhou' ? '✅' : a.resultado === 'perdeu' ? '❌' : '⏳';
  const cls = a.resultado === 'ganhou' ? 'ganhou' : a.resultado === 'perdeu' ? 'perdeu' : 'pendente';
  return `
    <div class="card-hist ${cls}">
      <div class="hist-jogo">${a.jogo.time1} x ${a.jogo.time2}</div>
      <div class="hist-escolha">Sua escolha: <strong>${a.jogo.getDescricaoEscolha(a.escolha)}</strong></div>
      <div class="hist-nums">
        <span>Valor: ${formatarMoeda(a.valor)}</span>
        <span>Odd: ${formatarOdd(a.odd)}</span>
        <span>Retorno potencial: ${formatarMoeda(a.retornoPotencial)}</span>
        ${a.resultado !== 'pendente' ? `<span>Resultado: ${icone} ${a.resultado === 'ganhou' ? formatarMoeda(a.ganho) : 'Perdido'}</span>` : ''}
      </div>
    </div>`;
};

// ── Render: RANKING ───────────────────────────────────────────

const renderRanking = () => {
  const ranking = sistema.getRankingUsuarios();
  $('ranking-content').innerHTML = ranking.length === 0
    ? '<p class="sem-dados">Nenhum apostador no ranking ainda. Seja o primeiro!</p>'
    : `<div class="tabela-ranking-wrap">
        <table class="tabela-rank">
          <thead><tr><th>Pos.</th><th>Apostador</th><th>Saldo</th><th>Apostas</th><th>Acertos</th><th>Lucro/Prejuízo</th></tr></thead>
          <tbody>${ranking.map((u, i) => `
            <tr class="${i === 0 ? 'ouro' : i === 1 ? 'prata' : i === 2 ? 'bronze' : ''}">
              <td>${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</td>
              <td><strong>${u.nome}</strong></td>
              <td>${formatarMoeda(u.saldo)}</td>
              <td>${u.apostas}</td>
              <td>${u.ganhas}</td>
              <td class="${u.lucro >= 0 ? 'positivo' : 'negativo'}">${u.lucro >= 0 ? '+' : ''}${formatarMoeda(u.lucro)}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>`;
};

// ── Render: ADMIN ─────────────────────────────────────────────

const renderAdmin = () => {
  const todos = sistema.jogos.filter(j => j.status !== 'finalizado');
  $('admin-jogos').innerHTML = todos.map(j => `
    <div class="card-admin">
      <div class="admin-jogo-nome">${j.time1} x ${j.time2}
        <span class="badge-status-${j.status}">${j.status.toUpperCase()}</span>
      </div>
      <div class="admin-form">
        <select id="res-${j.id}">
          <option value="">Resultado...</option>
          <option value="time1">${j.time1} vence</option>
          <option value="empate">Empate</option>
          <option value="time2">${j.time2} vence</option>
        </select>
        <input type="number" id="p1-${j.id}" placeholder="${j.time1} gols" min="0" max="20">
        <input type="number" id="p2-${j.id}" placeholder="${j.time2} gols" min="0" max="20">
        <button class="btn-admin" onclick="salvarResultado(${j.id})">Salvar</button>
      </div>
    </div>`).join('') || '<p class="sem-dados">Todos os jogos já foram finalizados.</p>';
};

const salvarResultado = id => {
  const res = $(`res-${id}`).value;
  const p1  = parseInt($(`p1-${id}`).value);
  const p2  = parseInt($(`p2-${id}`).value);
  if (!res) { toast('Selecione o resultado', 'erro'); return; }
  if (isNaN(p1) || isNaN(p2)) { toast('Informe o placar', 'erro'); return; }
  sistema.definirResultadoJogo(id, res, p1, p2);
  toast('Resultado salvo e apostas resolvidas! ✅');
  renderAdmin();
  if (sistema.usuarioLogado) atualizarSaldo();
};

// ── Inicialização ─────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  atualizarBarraAuth();
  navegar('home');

  document.querySelectorAll('.modal-overlay').forEach(m => {
    m.addEventListener('click', e => { if (e.target === m) hide(m); });
  });

  // Carrega dados reais da Copa 2026
  iniciarAPI();
});
