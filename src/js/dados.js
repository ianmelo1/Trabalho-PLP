// =============================================================
//  DADOS INICIAIS — Copa do Mundo 2026
//  EUA, Canadá e México  |  48 seleções  |  12 grupos
// =============================================================

const JOGOS_INICIAIS = [
  // ── GRUPO A ──────────────────────────────────────────────
  { id: 1,  time1: 'Brasil',    bandeira1: '🇧🇷', time2: 'México',    bandeira2: '🇲🇽', grupo: 'A', fase: 'grupos', data: '2026-06-11', hora: '16:00', odds: { time1: 1.80, empate: 3.60, time2: 4.20 }, status: 'finalizado', resultado: 'time1', placar1: 3, placar2: 1 },
  { id: 2,  time1: 'Alemanha',  bandeira1: '🇩🇪', time2: 'Japão',     bandeira2: '🇯🇵', grupo: 'A', fase: 'grupos', data: '2026-06-11', hora: '20:00', odds: { time1: 1.65, empate: 3.80, time2: 5.00 }, status: 'finalizado', resultado: 'time2', placar1: 1, placar2: 2 },
  { id: 3,  time1: 'Brasil',    bandeira1: '🇧🇷', time2: 'Alemanha',  bandeira2: '🇩🇪', grupo: 'A', fase: 'grupos', data: '2026-06-15', hora: '16:00', odds: { time1: 2.10, empate: 3.30, time2: 3.10 }, status: 'finalizado', resultado: 'empate', placar1: 1, placar2: 1 },
  { id: 4,  time1: 'Japão',     bandeira1: '🇯🇵', time2: 'México',    bandeira2: '🇲🇽', grupo: 'A', fase: 'grupos', data: '2026-06-15', hora: '20:00', odds: { time1: 2.80, empate: 3.10, time2: 2.50 }, status: 'ao_vivo',   resultado: null,    placar1: 0, placar2: 0 },
  { id: 5,  time1: 'Brasil',    bandeira1: '🇧🇷', time2: 'Japão',     bandeira2: '🇯🇵', grupo: 'A', fase: 'grupos', data: '2026-06-19', hora: '16:00', odds: { time1: 1.50, empate: 4.00, time2: 6.00 }, status: 'agendado',  resultado: null,    placar1: null, placar2: null },
  { id: 6,  time1: 'México',    bandeira1: '🇲🇽', time2: 'Alemanha',  bandeira2: '🇩🇪', grupo: 'A', fase: 'grupos', data: '2026-06-19', hora: '20:00', odds: { time1: 3.50, empate: 3.20, time2: 2.00 }, status: 'agendado',  resultado: null,    placar1: null, placar2: null },

  // ── GRUPO B ──────────────────────────────────────────────
  { id: 7,  time1: 'França',    bandeira1: '🇫🇷', time2: 'Argentina', bandeira2: '🇦🇷', grupo: 'B', fase: 'grupos', data: '2026-06-12', hora: '16:00', odds: { time1: 2.20, empate: 3.10, time2: 3.00 }, status: 'finalizado', resultado: 'time1', placar1: 2, placar2: 0 },
  { id: 8,  time1: 'Portugal',  bandeira1: '🇵🇹', time2: 'Marrocos',  bandeira2: '🇲🇦', grupo: 'B', fase: 'grupos', data: '2026-06-12', hora: '20:00', odds: { time1: 1.90, empate: 3.50, time2: 4.00 }, status: 'finalizado', resultado: 'empate', placar1: 1, placar2: 1 },
  { id: 9,  time1: 'França',    bandeira1: '🇫🇷', time2: 'Portugal',  bandeira2: '🇵🇹', grupo: 'B', fase: 'grupos', data: '2026-06-16', hora: '16:00', odds: { time1: 2.00, empate: 3.30, time2: 3.50 }, status: 'agendado',  resultado: null,    placar1: null, placar2: null },
  { id: 10, time1: 'Argentina', bandeira1: '🇦🇷', time2: 'Marrocos',  bandeira2: '🇲🇦', grupo: 'B', fase: 'grupos', data: '2026-06-16', hora: '20:00', odds: { time1: 1.60, empate: 3.80, time2: 5.50 }, status: 'agendado',  resultado: null,    placar1: null, placar2: null },
  { id: 11, time1: 'França',    bandeira1: '🇫🇷', time2: 'Marrocos',  bandeira2: '🇲🇦', grupo: 'B', fase: 'grupos', data: '2026-06-20', hora: '16:00', odds: { time1: 1.75, empate: 3.60, time2: 4.50 }, status: 'agendado',  resultado: null,    placar1: null, placar2: null },
  { id: 12, time1: 'Argentina', bandeira1: '🇦🇷', time2: 'Portugal',  bandeira2: '🇵🇹', grupo: 'B', fase: 'grupos', data: '2026-06-20', hora: '20:00', odds: { time1: 2.50, empate: 3.10, time2: 2.70 }, status: 'agendado',  resultado: null,    placar1: null, placar2: null },

  // ── GRUPO C ──────────────────────────────────────────────
  { id: 13, time1: 'Espanha',   bandeira1: '🇪🇸', time2: 'Holanda',   bandeira2: '🇳🇱', grupo: 'C', fase: 'grupos', data: '2026-06-13', hora: '16:00', odds: { time1: 2.10, empate: 3.20, time2: 3.20 }, status: 'finalizado', resultado: 'time1', placar1: 2, placar2: 1 },
  { id: 14, time1: 'Inglaterra',bandeira1: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', time2: 'EUA',       bandeira2: '🇺🇸', grupo: 'C', fase: 'grupos', data: '2026-06-13', hora: '20:00', odds: { time1: 1.80, empate: 3.50, time2: 4.50 }, status: 'finalizado', resultado: 'empate', placar1: 0, placar2: 0 },
  { id: 15, time1: 'Espanha',   bandeira1: '🇪🇸', time2: 'Inglaterra',bandeira2: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', grupo: 'C', fase: 'grupos', data: '2026-06-17', hora: '16:00', odds: { time1: 2.30, empate: 3.10, time2: 2.90 }, status: 'agendado',  resultado: null,    placar1: null, placar2: null },
  { id: 16, time1: 'Holanda',   bandeira1: '🇳🇱', time2: 'EUA',       bandeira2: '🇺🇸', grupo: 'C', fase: 'grupos', data: '2026-06-17', hora: '20:00', odds: { time1: 1.70, empate: 3.70, time2: 4.80 }, status: 'agendado',  resultado: null,    placar1: null, placar2: null },
  { id: 17, time1: 'Espanha',   bandeira1: '🇪🇸', time2: 'EUA',       bandeira2: '🇺🇸', grupo: 'C', fase: 'grupos', data: '2026-06-21', hora: '16:00', odds: { time1: 1.55, empate: 4.00, time2: 5.50 }, status: 'agendado',  resultado: null,    placar1: null, placar2: null },
  { id: 18, time1: 'Inglaterra',bandeira1: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', time2: 'Holanda',   bandeira2: '🇳🇱', grupo: 'C', fase: 'grupos', data: '2026-06-21', hora: '20:00', odds: { time1: 2.40, empate: 3.10, time2: 2.80 }, status: 'agendado',  resultado: null,    placar1: null, placar2: null },

  // ── GRUPO D ──────────────────────────────────────────────
  { id: 19, time1: 'Itália',    bandeira1: '🇮🇹', time2: 'Croácia',   bandeira2: '🇭🇷', grupo: 'D', fase: 'grupos', data: '2026-06-14', hora: '16:00', odds: { time1: 2.00, empate: 3.30, time2: 3.60 }, status: 'agendado',  resultado: null,    placar1: null, placar2: null },
  { id: 20, time1: 'Bélgica',   bandeira1: '🇧🇪', time2: 'Senegal',   bandeira2: '🇸🇳', grupo: 'D', fase: 'grupos', data: '2026-06-14', hora: '20:00', odds: { time1: 1.75, empate: 3.60, time2: 4.20 }, status: 'agendado',  resultado: null,    placar1: null, placar2: null },
  { id: 21, time1: 'Itália',    bandeira1: '🇮🇹', time2: 'Bélgica',   bandeira2: '🇧🇪', grupo: 'D', fase: 'grupos', data: '2026-06-18', hora: '16:00', odds: { time1: 2.50, empate: 3.10, time2: 2.70 }, status: 'agendado',  resultado: null,    placar1: null, placar2: null },
  { id: 22, time1: 'Croácia',   bandeira1: '🇭🇷', time2: 'Senegal',   bandeira2: '🇸🇳', grupo: 'D', fase: 'grupos', data: '2026-06-18', hora: '20:00', odds: { time1: 2.20, empate: 3.20, time2: 3.10 }, status: 'agendado',  resultado: null,    placar1: null, placar2: null },
  { id: 23, time1: 'Itália',    bandeira1: '🇮🇹', time2: 'Senegal',   bandeira2: '🇸🇳', grupo: 'D', fase: 'grupos', data: '2026-06-22', hora: '16:00', odds: { time1: 1.65, empate: 3.80, time2: 4.80 }, status: 'agendado',  resultado: null,    placar1: null, placar2: null },
  { id: 24, time1: 'Bélgica',   bandeira1: '🇧🇪', time2: 'Croácia',   bandeira2: '🇭🇷', grupo: 'D', fase: 'grupos', data: '2026-06-22', hora: '20:00', odds: { time1: 2.30, empate: 3.20, time2: 2.90 }, status: 'agendado',  resultado: null,    placar1: null, placar2: null },

  // ── OITAVAS DE FINAL ─────────────────────────────────────
  { id: 25, time1: '1º Grupo A', bandeira1: '🏆', time2: '2º Grupo B', bandeira2: '🥈', grupo: null, fase: 'oitavas', data: '2026-07-01', hora: '16:00', odds: { time1: 2.00, empate: 3.30, time2: 3.30 }, status: 'agendado', resultado: null, placar1: null, placar2: null },
  { id: 26, time1: '1º Grupo C', bandeira1: '🏆', time2: '2º Grupo D', bandeira2: '🥈', grupo: null, fase: 'oitavas', data: '2026-07-01', hora: '20:00', odds: { time1: 2.00, empate: 3.30, time2: 3.30 }, status: 'agendado', resultado: null, placar1: null, placar2: null },

  // ── QUARTAS DE FINAL ─────────────────────────────────────
  { id: 27, time1: 'Vencedor 25', bandeira1: '🏆', time2: 'Vencedor 26', bandeira2: '🏆', grupo: null, fase: 'quartas', data: '2026-07-08', hora: '20:00', odds: { time1: 2.00, empate: 3.30, time2: 3.30 }, status: 'agendado', resultado: null, placar1: null, placar2: null },

  // ── SEMIFINAL ────────────────────────────────────────────
  { id: 28, time1: 'Vencedor QF1', bandeira1: '🏆', time2: 'Vencedor QF2', bandeira2: '🏆', grupo: null, fase: 'semifinal', data: '2026-07-14', hora: '20:00', odds: { time1: 2.00, empate: 3.30, time2: 3.30 }, status: 'agendado', resultado: null, placar1: null, placar2: null },

  // ── FINAL ────────────────────────────────────────────────
  { id: 29, time1: 'Finalista 1', bandeira1: '🏆', time2: 'Finalista 2', bandeira2: '🏆', grupo: null, fase: 'final', data: '2026-07-19', hora: '17:00', odds: { time1: 2.00, empate: 3.30, time2: 3.30 }, status: 'agendado', resultado: null, placar1: null, placar2: null },
];

const USUARIO_DEMO = {
  nome: 'Torcedor Demo',
  email: 'demo@copa2026.com',
  senha: '123456',
  saldo: 500
};
