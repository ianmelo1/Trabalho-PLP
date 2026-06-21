// =============================================================
//  PARADIGMA ORIENTADO A OBJETOS
//  Classes que modelam o domínio do sistema de apostas
// =============================================================

class Jogo {
  constructor({ id, time1, time2, bandeira1, bandeira2, bandeiraUrl1, bandeiraUrl2, badgeUrl1, badgeUrl2, grupo, fase, data, hora, odds }) {
    this.id = id;
    this.time1 = time1;
    this.time2 = time2;
    this.bandeira1 = bandeira1;
    this.bandeira2 = bandeira2;
    this.bandeiraUrl1 = bandeiraUrl1 || null;  // imagem flagcdn.com
    this.bandeiraUrl2 = bandeiraUrl2 || null;
    this.badgeUrl1 = badgeUrl1 || null;
    this.badgeUrl2 = badgeUrl2 || null;
    this.grupo = grupo;
    this.fase = fase;
    this.data = data;
    this.hora = hora;
    this.odds = odds;           // { time1, empate, time2 }
    this.resultado = null;      // 'time1' | 'empate' | 'time2'
    this.placar1 = null;
    this.placar2 = null;
    this.status = 'agendado';   // 'agendado' | 'ao_vivo' | 'finalizado'
  }

  definirResultado(resultado, placar1, placar2) {
    this.resultado = resultado;
    this.placar1 = placar1;
    this.placar2 = placar2;
    this.status = 'finalizado';
  }

  getPlacar() {
    if (this.status === 'agendado') return 'vs';
    return `${this.placar1} x ${this.placar2}`;
  }

  getNomeVencedor() {
    if (!this.resultado) return null;
    if (this.resultado === 'time1') return this.time1;
    if (this.resultado === 'time2') return this.time2;
    return 'Empate';
  }

  getDescricaoEscolha(escolha) {
    if (escolha === 'time1') return `${this.bandeira1} ${this.time1}`;
    if (escolha === 'time2') return `${this.bandeira2} ${this.time2}`;
    return 'Empate';
  }
}

// -------------------------------------------------------

class Usuario {
  constructor({ id, nome, email, senha, saldo = 1000 }) {
    this.id = id;
    this.nome = nome;
    this.email = email;
    this.senha = senha;
    this.saldo = saldo;
    this.apostas = [];
    this.dataCriacao = new Date();
  }

  adicionarAposta(aposta) {
    if (aposta.valor > this.saldo) throw new Error('Saldo insuficiente');
    this.apostas.push(aposta);
    this.saldo = Math.round((this.saldo - aposta.valor) * 100) / 100;
  }

  receberPagamento(valor) {
    this.saldo = Math.round((this.saldo + valor) * 100) / 100;
  }

  getTotalApostado() {
    return this.apostas.reduce((acc, a) => acc + a.valor, 0);
  }

  getTotalGanho() {
    return this.apostas
      .filter(a => a.resultado === 'ganhou')
      .reduce((acc, a) => acc + a.ganho, 0);
  }

  getLucroTotal() {
    return Math.round((this.getTotalGanho() - this.getTotalApostado()) * 100) / 100;
  }

  getApostasPendentes() {
    return this.apostas.filter(a => a.resultado === 'pendente');
  }

  getApostasResolvidas() {
    return this.apostas.filter(a => a.resultado !== 'pendente');
  }
}

// -------------------------------------------------------

class Aposta {
  constructor({ id, usuario, jogo, escolha, valor }) {
    this.id = id;
    this.usuario = usuario;
    this.jogo = jogo;
    this.escolha = escolha;       // 'time1' | 'empate' | 'time2'
    this.valor = valor;
    this.odd = jogo.odds[escolha];
    this.retornoPotencial = Math.round(valor * this.odd * 100) / 100;
    this.resultado = 'pendente';  // 'pendente' | 'ganhou' | 'perdeu'
    this.ganho = 0;
    this.dataCriacao = new Date();
  }

  resolver() {
    if (this.jogo.resultado === null) return;
    if (this.escolha === this.jogo.resultado) {
      this.resultado = 'ganhou';
      this.ganho = this.retornoPotencial;
      this.usuario.receberPagamento(this.retornoPotencial);
    } else {
      this.resultado = 'perdeu';
      this.ganho = 0;
    }
  }
}

// -------------------------------------------------------

class SistemaApostas {
  constructor() {
    this.jogos = [];
    this.usuarios = [];
    this.apostas = [];
    this._idJogo = 1;
    this._idUsuario = 1;
    this._idAposta = 1;
    this.usuarioLogado = null;
  }

  carregarJogos(dados) {
    this.jogos = dados.map(d => {
      const j = new Jogo(d);
      if (d.status === 'finalizado') j.definirResultado(d.resultado, d.placar1, d.placar2);
      if (d.status === 'ao_vivo') { j.status = 'ao_vivo'; j.placar1 = d.placar1; j.placar2 = d.placar2; }
      this._idJogo = Math.max(this._idJogo, d.id + 1);
      return j;
    });
  }

  registrar(nome, email, senha) {
    if (this.usuarios.find(u => u.email === email)) throw new Error('E-mail já cadastrado');
    const usuario = new Usuario({ id: this._idUsuario++, nome, email, senha });
    this.usuarios.push(usuario);
    return usuario;
  }

  login(email, senha) {
    const usuario = this.usuarios.find(u => u.email === email && u.senha === senha);
    if (!usuario) throw new Error('E-mail ou senha inválidos');
    this.usuarioLogado = usuario;
    return usuario;
  }

  logout() {
    this.usuarioLogado = null;
  }

  fazerAposta(jogoId, escolha, valor) {
    if (!this.usuarioLogado) throw new Error('Faça login para apostar');
    if (valor <= 0) throw new Error('O valor deve ser maior que zero');

    const jogo = this.jogos.find(j => j.id === jogoId);
    if (!jogo) throw new Error('Jogo não encontrado');
    if (jogo.status === 'finalizado') throw new Error('Este jogo já foi encerrado');

    const aposta = new Aposta({
      id: this._idAposta++,
      usuario: this.usuarioLogado,
      jogo,
      escolha,
      valor: parseFloat(valor)
    });

    this.usuarioLogado.adicionarAposta(aposta);
    this.apostas.push(aposta);
    return aposta;
  }

  definirResultadoJogo(jogoId, resultado, placar1, placar2) {
    const jogo = this.jogos.find(j => j.id === jogoId);
    if (!jogo) throw new Error('Jogo não encontrado');
    jogo.definirResultado(resultado, placar1, placar2);

    // Resolve todas as apostas pendentes deste jogo
    this.apostas
      .filter(a => a.jogo.id === jogoId && a.resultado === 'pendente')
      .forEach(a => a.resolver());
  }

  getRankingUsuarios() {
    return [...this.usuarios]
      .filter(u => u.apostas.length > 0)
      .map(u => ({
        id: u.id,
        nome: u.nome,
        saldo: u.saldo,
        apostas: u.apostas.length,
        ganhas: u.apostas.filter(a => a.resultado === 'ganhou').length,
        lucro: u.getLucroTotal()
      }))
      .sort((a, b) => b.lucro - a.lucro);
  }

  getJogoPorId(id) {
    return this.jogos.find(j => j.id === id) || null;
  }
}
