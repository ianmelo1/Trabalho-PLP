// =============================================================
//  PARADIGMA FUNCIONAL
//  Funções puras, higher-order functions, imutabilidade
//  Sem efeitos colaterais — cada função retorna um novo valor
// =============================================================

// --- Funções puras de cálculo ---

const calcularRetorno = (valor, odd) => Math.round(valor * odd * 100) / 100;

const calcularLucro = (valor, odd) => Math.round((valor * odd - valor) * 100) / 100;

const formatarMoeda = valor => `R$ ${Number(valor).toFixed(2)}`;

const formatarOdd = odd => `x${Number(odd).toFixed(2)}`;

const formatarData = dataStr => {
  const [ano, mes, dia] = dataStr.split('-');
  return `${dia}/${mes}/${ano}`;
};

// --- Filtragem de jogos (funções puras, retornam novos arrays) ---

const filtrarJogosPorGrupo = (jogos, grupo) =>
  jogos.filter(j => j.grupo === grupo);

const filtrarJogosPorFase = (jogos, fase) =>
  jogos.filter(j => j.fase === fase);

const filtrarJogosPorStatus = (jogos, status) =>
  jogos.filter(j => j.status === status);

const filtrarJogosDisponiveis = jogos =>
  jogos.filter(j => j.status !== 'finalizado');

const filtrarJogosFinalizados = jogos =>
  jogos.filter(j => j.status === 'finalizado');

// --- Agrupamento ---

const agruparJogosPorGrupo = jogos =>
  jogos.reduce((acc, jogo) => {
    const grupo = jogo.grupo || 'Eliminatórias';
    return { ...acc, [grupo]: [...(acc[grupo] || []), jogo] };
  }, {});

const agruparJogosPorFase = jogos =>
  jogos.reduce((acc, jogo) => {
    return { ...acc, [jogo.fase]: [...(acc[jogo.fase] || []), jogo] };
  }, {});

// --- Estatísticas de apostas (reduce / map / filter encadeados) ---

const somarValores = apostas =>
  apostas.reduce((acc, a) => acc + a.valor, 0);

const somarGanhos = apostas =>
  apostas.filter(a => a.resultado === 'ganhou')
         .reduce((acc, a) => acc + a.ganho, 0);

const calcularTaxaAcerto = apostas => {
  const resolvidas = apostas.filter(a => a.resultado !== 'pendente');
  if (resolvidas.length === 0) return 0;
  const ganhas = resolvidas.filter(a => a.resultado === 'ganhou').length;
  return Math.round((ganhas / resolvidas.length) * 100);
};

const calcularLucroTotal = apostas =>
  Math.round((somarGanhos(apostas) - somarValores(apostas)) * 100) / 100;

// --- Ordenação (retorna novo array, não muta o original) ---

const ordenarPorLucro = usuarios =>
  [...usuarios].sort((a, b) => b.lucro - a.lucro);

const ordenarJogosPorData = jogos =>
  [...jogos].sort((a, b) => {
    const da = new Date(`${a.data}T${a.hora}`);
    const db = new Date(`${b.data}T${b.hora}`);
    return da - db;
  });

// --- Cálculo de odds favoritas (higher-order: recebe função) ---

const encontrarMelhorOdd = (jogos, seletor) =>
  jogos
    .map(j => ({ jogo: j, odd: seletor(j.odds) }))
    .reduce((melhor, atual) => atual.odd > melhor.odd ? atual : melhor, { odd: 0 });

// --- Tabela de classificação do grupo ---

const calcularClassificacaoGrupo = (jogos, grupo) => {
  const jogosDoGrupo = filtrarJogosPorGrupo(
    filtrarJogosFinalizados(jogos),
    grupo
  );

  const times = [...new Set(jogosDoGrupo.flatMap(j => [j.time1, j.time2]))];

  const estadoInicial = time => ({
    time,
    pontos: 0, jogos: 0, vitorias: 0, empates: 0, derrotas: 0,
    gp: 0, gc: 0, saldo: 0
  });

  const atualizarTime = (stats, gols, golsAdversario, resultado) => ({
    ...stats,
    jogos: stats.jogos + 1,
    vitorias: stats.vitorias + (resultado === 'vitoria' ? 1 : 0),
    empates: stats.empates + (resultado === 'empate' ? 1 : 0),
    derrotas: stats.derrotas + (resultado === 'derrota' ? 1 : 0),
    pontos: stats.pontos + (resultado === 'vitoria' ? 3 : resultado === 'empate' ? 1 : 0),
    gp: stats.gp + gols,
    gc: stats.gc + golsAdversario,
    saldo: stats.saldo + gols - golsAdversario
  });

  const tabela = times.reduce((acc, time) => {
    const stats = jogosDoGrupo.reduce((s, j) => {
      if (j.time1 === time) {
        const res = j.placar1 > j.placar2 ? 'vitoria' : j.placar1 < j.placar2 ? 'derrota' : 'empate';
        return atualizarTime(s, j.placar1, j.placar2, res);
      }
      if (j.time2 === time) {
        const res = j.placar2 > j.placar1 ? 'vitoria' : j.placar2 < j.placar1 ? 'derrota' : 'empate';
        return atualizarTime(s, j.placar2, j.placar1, res);
      }
      return s;
    }, estadoInicial(time));
    return [...acc, stats];
  }, []);

  return [...tabela].sort((a, b) =>
    b.pontos - a.pontos || b.saldo - a.saldo || b.gp - a.gp
  );
};
