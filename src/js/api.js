// =============================================================
//  INTEGRAÇÃO COM TheSportsDB (API gratuita, chave pública 123)
//  Liga FIFA World Cup: ID 4429 | Temporada 2026
// =============================================================

const API_BASE  = 'https://www.thesportsdb.com/api/v1/json/123';
const LEAGUE_ID = 4429;
const SEASON    = 2026;

// ── Grupos (obtidos via API server-side — lookupevent bloqueia CORS do browser) ──
// Rodada 1 + Rodada 2, Copa do Mundo 2026
const GRUPOS_POR_EVENTO = {
  // Rodada 1
  2391728: 'A',  2461103: 'A',  // Grupo A
  2461104: 'B',  2391732: 'B',  // Grupo B
  2391730: 'C',  2391731: 'C',  // Grupo C
  2391729: 'D',  2461105: 'D',  // Grupo D
  2391733: 'E',  2391734: 'E',  // Grupo E
  2391735: 'F',  2461106: 'F',  // Grupo F
  2391736: 'G',                  // Grupo G (rodada 1)
  2391738: 'H',  2391739: 'H',  // Grupo H
  // Rodada 2
  2461109: 'A',  2391747: 'A',  // Grupo A
  2461110: 'B',  2391746: 'B',  // Grupo B
  2391749: 'C',  2391748: 'C',  // Grupo C
  2391750: 'D',  2461111: 'D',  // Grupo D
  2391752: 'E',  2391751: 'E',  // Grupo E
  2461112: 'F',  2391753: 'F',  // Grupo F
  2391754: 'G',  2391755: 'G',  // Grupo G
  2391756: 'H',  2391757: 'H',  // Grupo H
  2461113: 'I',  2391760: 'I',  // Grupo I
  2391758: 'J',  2391759: 'J',  // Grupo J
  2391763: 'K',  2461114: 'K',  // Grupo K
  2391761: 'L',  2391762: 'L',  // Grupo L
};

// ── Códigos ISO para bandeiras (flagcdn.com) ─────────────────
const CODIGO_PAIS = {
  'Mexico': 'mx',         'South Africa': 'za',   'South Korea': 'kr',
  'Czech Republic': 'cz', 'Canada': 'ca',         'Bosnia-Herzegovina': 'ba',
  'USA': 'us',            'Paraguay': 'py',        'Brazil': 'br',
  'Morocco': 'ma',        'Qatar': 'qa',           'Switzerland': 'ch',
  'Haiti': 'ht',          'Scotland': 'gb-sct',    'Germany': 'de',
  'Curaçao': 'cw',        'Ivory Coast': 'ci',     'Ecuador': 'ec',
  'Netherlands': 'nl',    'Japan': 'jp',           'Sweden': 'se',
  'Tunisia': 'tn',        'Belgium': 'be',         'Egypt': 'eg',
  'Saudi Arabia': 'sa',   'Uruguay': 'uy',         'Spain': 'es',
  'Cape Verde': 'cv',     'Australia': 'au',       'Turkey': 'tr',
  'Iran': 'ir',           'New Zealand': 'nz',     'Argentina': 'ar',
  'Austria': 'at',        'France': 'fr',          'Iraq': 'iq',
  'Jordan': 'jo',         'Algeria': 'dz',         'Norway': 'no',
  'Senegal': 'sn',        'England': 'gb-eng',     'Ghana': 'gh',
  'Panama': 'pa',         'Croatia': 'hr',         'Portugal': 'pt',
  'Uzbekistan': 'uz',     'Colombia': 'co',        'DR Congo': 'cd',
  'Italy': 'it',          'Denmark': 'dk',         'Poland': 'pl',
  'Serbia': 'rs',         'Ukraine': 'ua',         'Wales': 'gb-wls',
  'Ireland': 'ie',        'Greece': 'gr',          'Slovenia': 'si',
  'Slovakia': 'sk',       'Hungary': 'hu',         'Romania': 'ro',
  'Albania': 'al',        'Georgia': 'ge',         'Armenia': 'am',
  'China': 'cn',          'Indonesia': 'id',       'Thailand': 'th',
  'Vietnam': 'vn',        'Philippines': 'ph',     'Nigeria': 'ng',
  'Cameroon': 'cm',       'Kenya': 'ke',           'Mali': 'ml',
  'Angola': 'ao',         'Tanzania': 'tz',        'Zimbabwe': 'zw',
  'Chile': 'cl',          'Venezuela': 've',       'Bolivia': 'bo',
  'Honduras': 'hn',       'Costa Rica': 'cr',      'El Salvador': 'sv',
  'Guatemala': 'gt',      'Jamaica': 'jm',         'Cuba': 'cu',
  'Bahrain': 'bh',        'Kuwait': 'kw',          'Oman': 'om',
  'UAE': 'ae',            'Libya': 'ly',
};

const getBandeiraUrl = nome => {
  const codigo = CODIGO_PAIS[nome];
  return codigo ? `https://flagcdn.com/w40/${codigo}.png` : null;
};

// ── Mapeamento de nomes para bandeiras emoji ──────────────────
const BANDEIRAS = {
  'Mexico': '🇲🇽', 'South Africa': '🇿🇦', 'South Korea': '🇰🇷',
  'Czech Republic': '🇨🇿', 'Canada': '🇨🇦', 'Bosnia-Herzegovina': '🇧🇦',
  'USA': '🇺🇸', 'Paraguay': '🇵🇾', 'Brazil': '🇧🇷', 'Morocco': '🇲🇦',
  'Qatar': '🇶🇦', 'Switzerland': '🇨🇭', 'Haiti': '🇭🇹', 'Scotland': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  'Germany': '🇩🇪', 'Curaçao': '🇨🇼', 'Curacao': '🇨🇼',
  'Ivory Coast': '🇨🇮', 'Ecuador': '🇪🇨', 'Netherlands': '🇳🇱',
  'Japan': '🇯🇵', 'Australia': '🇦🇺', 'Turkey': '🇹🇷',
  'Belgium': '🇧🇪', 'Egypt': '🇪🇬', 'Saudi Arabia': '🇸🇦',
  'Uruguay': '🇺🇾', 'Spain': '🇪🇸', 'Cape Verde': '🇨🇻',
  'Sweden': '🇸🇪', 'Tunisia': '🇹🇳', 'Argentina': '🇦🇷',
  'France': '🇫🇷', 'Portugal': '🇵🇹', 'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  'Italy': '🇮🇹', 'Croatia': '🇭🇷', 'Senegal': '🇸🇳',
  'Nigeria': '🇳🇬', 'Ghana': '🇬🇭', 'Cameroon': '🇨🇲',
  'Colombia': '🇨🇴', 'Chile': '🇨🇱', 'Peru': '🇵🇪',
  'Venezuela': '🇻🇪', 'Bolivia': '🇧🇴', 'Honduras': '🇭🇳',
  'Costa Rica': '🇨🇷', 'Panama': '🇵🇦', 'Guatemala': '🇬🇹',
  'Jamaica': '🇯🇲', 'El Salvador': '🇸🇻', 'New Zealand': '🇳🇿',
  'China': '🇨🇳', 'Iran': '🇮🇷', 'Iraq': '🇮🇶',
  'Jordan': '🇯🇴', 'Bahrain': '🇧🇭', 'Kuwait': '🇰🇼',
  'Oman': '🇴🇲', 'UAE': '🇦🇪', 'Algeria': '🇩🇿',
  'Mali': '🇲🇱', 'Guinea': '🇬🇳', 'Tanzania': '🇹🇿',
  'Congo': '🇨🇩', 'Angola': '🇦🇴', 'Kenya': '🇰🇪',
  'Ethiopia': '🇪🇹', 'Zimbabwe': '🇿🇼', 'Zambia': '🇿🇲',
  'Denmark': '🇩🇰', 'Norway': '🇳🇴', 'Finland': '🇫🇮',
  'Poland': '🇵🇱', 'Romania': '🇷🇴', 'Hungary': '🇭🇺',
  'Serbia': '🇷🇸', 'Ukraine': '🇺🇦', 'Greece': '🇬🇷',
  'Austria': '🇦🇹', 'Wales': '🏴󠁧󠁢󠁷󠁬󠁳󠁿', 'Ireland': '🇮🇪',
  'Slovakia': '🇸🇰', 'Slovenia': '🇸🇮', 'Albania': '🇦🇱',
  'Uzbekistan': '🇺🇿', 'Kazakhstan': '🇰🇿', 'Indonesia': '🇮🇩',
  'Thailand': '🇹🇭', 'Vietnam': '🇻🇳', 'Philippines': '🇵🇭',
  'Montenegro': '🇲🇪', 'North Macedonia': '🇲🇰', 'Kosovo': '🇽🇰',
  'Georgia': '🇬🇪', 'Armenia': '🇦🇲', 'Azerbaijan': '🇦🇿',
};

// Força aproximada dos times (FIFA ranking-based, maior = mais forte)
const FORCA_TIME = {
  'Argentina': 92, 'France': 91, 'Spain': 90, 'England': 88,
  'Brazil': 87, 'Portugal': 86, 'Netherlands': 85, 'Germany': 84,
  'Belgium': 82, 'Italy': 81, 'Uruguay': 80, 'Colombia': 78,
  'USA': 76, 'Mexico': 75, 'Switzerland': 74, 'Croatia': 73,
  'Morocco': 72, 'Senegal': 71, 'Japan': 70, 'South Korea': 69,
  'Australia': 67, 'Ecuador': 66, 'Canada': 65, 'Turkey': 65,
  'Denmark': 78, 'Sweden': 70, 'Norway': 68, 'Poland': 68,
  'Serbia': 72, 'Ukraine': 70, 'Austria': 73, 'Czech Republic': 67,
  'Slovakia': 64, 'Hungary': 65, 'Romania': 63, 'Scotland': 67,
  'Wales': 66, 'Ireland': 62, 'Albania': 60, 'Slovenia': 64,
  'Georgia': 61, 'Saudi Arabia': 64, 'Iran': 65, 'Iraq': 60,
  'Qatar': 55, 'Algeria': 64, 'Egypt': 63, 'Cameroon': 67,
  'Nigeria': 68, 'Ghana': 63, 'Ivory Coast': 66, 'Tunisia': 62,
  'South Africa': 58, 'Morocco': 72, 'Cape Verde': 56,
  'Uzbekistan': 59, 'Indonesia': 52, 'New Zealand': 55,
  'Paraguay': 64, 'Bolivia': 52, 'Venezuela': 56, 'Peru': 60,
  'Chile': 68, 'Honduras': 55, 'Costa Rica': 58, 'Panama': 57,
  'Jamaica': 54, 'El Salvador': 52, 'Haiti': 50, 'Cuba': 48,
  'Guatemala': 51, 'Curaçao': 49, 'Bosnia-Herzegovina': 62,
  'Montenegro': 58, 'Bahrain': 53, 'Kuwait': 52, 'Oman': 53,
  'UAE': 54, 'Jordan': 56, 'Tanzania': 47, 'Guinea': 55,
  'Mali': 60, 'Angola': 53, 'Zambia': 50, 'Zimbabwe': 48,
};

const getBandeira = nome => BANDEIRAS[nome] || '🏳️';

const getForca = nome => FORCA_TIME[nome] || 60;

// Gera odds baseadas na força relativa dos times
const gerarOdds = (time1, time2) => {
  const f1 = getForca(time1);
  const f2 = getForca(time2);
  const total = f1 + f2 + (f1 + f2) * 0.3; // margem da casa
  const p1 = f1 / total;
  const pe = 0.28 / (1 + Math.abs(f1 - f2) / 40); // empate mais provável entre times iguais
  const p2 = f2 / total;
  const normalizar = p1 + pe + p2;
  return {
    time1: parseFloat((1 / (p1 / normalizar)).toFixed(2)),
    empate: parseFloat((1 / (pe / normalizar)).toFixed(2)),
    time2: parseFloat((1 / (p2 / normalizar)).toFixed(2)),
  };
};

// Converte status da API para status interno
const mapStatus = strStatus => {
  if (!strStatus || strStatus === 'NS' || strStatus === '') return 'agendado';
  if (strStatus === 'FT' || strStatus === 'AET' || strStatus === 'PEN') return 'finalizado';
  return 'ao_vivo'; // 1H, 2H, HT, ET, P, etc.
};

// Determina resultado com base nos placares
const mapResultado = (h, a) => {
  const ph = parseInt(h), pa = parseInt(a);
  if (isNaN(ph) || isNaN(pa)) return null;
  if (ph > pa) return 'time1';
  if (ph < pa) return 'time2';
  return 'empate';
};

// Converte evento da API para formato do sistema
const apiEventoParaJogo = ev => {
  const id = parseInt(ev.idEvent);
  const grupo = ev.strGroup || GRUPOS_POR_EVENTO[id] || null;
  const status = mapStatus(ev.strStatus);
  const p1 = ev.intHomeScore !== null && ev.intHomeScore !== '' ? parseInt(ev.intHomeScore) : null;
  const p2 = ev.intAwayScore !== null && ev.intAwayScore !== '' ? parseInt(ev.intAwayScore) : null;
  return {
    id,
    time1: ev.strHomeTeam,
    time2: ev.strAwayTeam,
    bandeira1: getBandeira(ev.strHomeTeam),     // emoji (fallback)
    bandeira2: getBandeira(ev.strAwayTeam),
    bandeiraUrl1: getBandeiraUrl(ev.strHomeTeam), // imagem flagcdn.com
    bandeiraUrl2: getBandeiraUrl(ev.strAwayTeam),
    badgeUrl1: ev.strHomeTeamBadge || null,       // escudo do time (não usado)
    badgeUrl2: ev.strAwayTeamBadge || null,
    grupo,
    fase: grupo ? 'grupos' : mapFase(ev.intRound),
    data: ev.dateEvent,
    hora: (ev.strTime || '00:00').slice(0, 5),
    odds: gerarOdds(ev.strHomeTeam, ev.strAwayTeam),
    status,
    resultado: status === 'finalizado' ? mapResultado(p1, p2) : null,
    placar1: p1,
    placar2: p2,
  };
};

const mapFase = round => {
  const r = parseInt(round);
  if (r <= 3) return 'grupos';
  if (r === 4) return 'oitavas';
  if (r === 5) return 'quartas';
  if (r === 6) return 'semifinal';
  return 'final';
};

// ── Funções de fetch ──────────────────────────────────────────

// Busca jogos de uma rodada específica
const buscarRodada = async rodada => {
  const resp = await fetch(`${API_BASE}/eventsround.php?id=${LEAGUE_ID}&r=${rodada}&s=${SEASON}`);
  if (!resp.ok) return [];
  const data = await resp.json();
  return data.events || [];
};

// Busca rodadas 1, 2 e 3 em paralelo e mescla sem duplicatas
const buscarJogosTemporada = async () => {
  const [r1, r2, r3] = await Promise.all([
    buscarRodada(1),
    buscarRodada(2),
    buscarRodada(3),
  ]);

  // Mescla eliminando duplicatas por idEvent
  const vistos = new Set();
  const todos = [...r1, ...r2, ...r3].filter(ev => {
    if (vistos.has(ev.idEvent)) return false;
    vistos.add(ev.idEvent);
    return true;
  });

  return todos.map(apiEventoParaJogo);
};

// Atualiza todos os placares buscando a lista da temporada novamente
const atualizarPlacares = async (sistema) => {
  try {
    const jogosAtualizados = await buscarJogosTemporada();
    jogosAtualizados.forEach(atualizado => {
      const jogo = sistema.getJogoPorId(atualizado.id);
      if (!jogo) return;
      if (atualizado.status === 'finalizado' && jogo.status !== 'finalizado') {
        sistema.definirResultadoJogo(jogo.id, atualizado.resultado, atualizado.placar1, atualizado.placar2);
      } else if (atualizado.status === 'ao_vivo') {
        jogo.status = 'ao_vivo';
        jogo.placar1 = atualizado.placar1;
        jogo.placar2 = atualizado.placar2;
      }
    });
  } catch (_) { /* ignora erros de rede em updates */ }
};
