<div align="center">

# ⚽ BetCopa 2026

### Sistema de Apostas da Copa do Mundo 2026

*Aposte nos jogos, suba no ranking e acompanhe a Copa em tempo real.*

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![API](https://img.shields.io/badge/API-TheSportsDB-10b981?style=for-the-badge)

</div>

---

## 📖 Sobre

O **BetCopa 2026** é um sistema web de apostas esportivas para os jogos da Copa do Mundo 2026 (EUA · Canadá · México). O usuário se cadastra, recebe um **saldo virtual** e aposta nos resultados das partidas — com **placares reais e ao vivo** consumidos da API pública [TheSportsDB](https://www.thesportsdb.com/).

> 🎓 Projeto desenvolvido para o **Trabalho T2 de PLP** (Paradigmas de Linguagens de Programação), demonstrando a combinação de **três paradigmas** no mesmo sistema.

---

## ✨ Funcionalidades

| | Funcionalidade | Descrição |
|---|---|---|
| 🎰 | **Apostas** | Escolha time, empate ou visitante; o retorno é calculado pela odd em tempo real |
| 📊 | **Classificação** | Tabela de pontos dos grupos calculada automaticamente pelos resultados |
| 🏆 | **Ranking** | Leaderboard de apostadores ordenado por lucro e taxa de acerto |
| ⚙️ | **Painel Admin** | Insere resultados e resolve todas as apostas pendentes automaticamente |
| 🔴 | **Ao vivo** | 72 jogos reais da Copa 2026, atualizados a cada 60 segundos |

---

## 🚀 Como rodar

> Precisa de um servidor local para a API funcionar (CORS).

```bash
# Na pasta do projeto:
npx serve -p 3000 .
```

Depois abra **http://localhost:3000** no navegador.

<details>
<summary>Sem Node? Use Python 🐍</summary>

```bash
python -m http.server 3000
```
</details>

### 🔑 Conta de demonstração

```
E-mail: demo@copa2026.com
Senha:  123456
```

---

## 🧠 Os Paradigmas

O coração do projeto. Cada paradigma vive em um arquivo separado, no contexto onde ele brilha:

### 🟦 Orientação a Objetos — `src/js/models.js`
Modela o mundo real como **objetos** que unem dados e comportamento.
```js
class Aposta {
  resolver() { /* a própria aposta sabe se ganhou e paga o usuário */ }
}
```
> Classes `Jogo`, `Usuario`, `Aposta`, `SistemaApostas` — encapsulamento, abstração e composição.

### 🟩 Funcional — `src/js/functional.js`
Funções **puras**, sem efeitos colaterais, encadeando transformações.
```js
const calcularLucroTotal = apostas =>
  apostas
    .filter(a => a.resultado === 'ganhou')
    .reduce((acc, a) => acc + a.ganho, 0);
```
> `map` / `filter` / `reduce`, imutabilidade e higher-order functions — sem um único laço `for`.

### 🟨 Imperativo — `src/js/app.js`
Controla a interface **passo a passo**: pega o jogo, valida o valor, debita o saldo, atualiza a tela.

---

## 📁 Estrutura

```
Trabalho-PLP/
├── index.html              # Página principal
├── README.md
├── gerar_pdf.py            # Gera o guia de apresentação em PDF
├── BetCopa2026_Apresentacao.pdf
└── src/
    ├── css/
    │   └── style.css       # Estilos (tema escuro + verde)
    └── js/
        ├── models.js       # 🟦 OOP — classes do domínio
        ├── functional.js   # 🟩 Funcional — funções puras
        ├── app.js          # 🟨 Imperativo — controlador da UI
        ├── api.js          # Integração com TheSportsDB
        └── dados.js        # Dados locais de fallback
```

---

## 🛠️ Tecnologias

- **HTML5 + CSS3 + JavaScript** puro (sem frameworks)
- **[TheSportsDB API](https://www.thesportsdb.com/)** — dados reais da Copa 2026
- **[flagcdn.com](https://flagcdn.com/)** — bandeiras oficiais dos países

---

## 📊 Comparação dos Paradigmas

| Critério | OOP | Funcional | Imperativo |
|---|---|---|---|
| **Foco** | Entidades | Transformar dados | Fluxo de tela |
| **Estado** | Mutável | Imutável | Mutável |
| **Legibilidade** | Boa | Excelente | Boa (cai ao crescer) |
| **Mais indicado para** | Modelar domínio | Estatísticas/relatórios | Scripts e telas |

> 💡 **Conclusão:** nenhum paradigma é o melhor em absoluto — o ideal é **combiná-los**, usando cada um onde ele se destaca. Foi exatamente o que fizemos aqui.

---

<div align="center">

⚽ **BetCopa 2026** · Trabalho T2 — PLP

</div>
