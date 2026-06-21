# -*- coding: utf-8 -*-
"""Gera o PDF de apoio à apresentação do Trabalho T2 - PLP (BetCopa 2026)."""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle,
    HRFlowable, ListFlowable, ListItem
)

# ── Paleta (mesma identidade do site) ─────────────────────────
VERDE_ESC = colors.HexColor("#064e3b")
VERDE     = colors.HexColor("#10b981")
VERDE_NEO = colors.HexColor("#059669")
ESCURO    = colors.HexColor("#0a0f1e")
CINZA     = colors.HexColor("#374151")
CINZA_CL  = colors.HexColor("#6b7280")
AMARELO   = colors.HexColor("#d97706")

# ── Estilos ───────────────────────────────────────────────────
styles = getSampleStyleSheet()

def style(name, **kw):
    return ParagraphStyle(name, parent=styles["Normal"], **kw)

s_capa_titulo = style("capa_titulo", fontName="Helvetica-Bold", fontSize=34,
                      textColor=VERDE_ESC, alignment=TA_CENTER, leading=40)
s_capa_sub    = style("capa_sub", fontName="Helvetica", fontSize=15,
                      textColor=CINZA_CL, alignment=TA_CENTER, leading=22)
s_h1 = style("h1", fontName="Helvetica-Bold", fontSize=19, textColor=VERDE_ESC,
             spaceBefore=6, spaceAfter=10, leading=23)
s_h2 = style("h2", fontName="Helvetica-Bold", fontSize=13.5, textColor=VERDE_NEO,
             spaceBefore=12, spaceAfter=5, leading=17)
s_body = style("body", fontName="Helvetica", fontSize=10.5, textColor=colors.black,
               alignment=TA_JUSTIFY, leading=15, spaceAfter=6)
s_bullet = style("bullet", fontName="Helvetica", fontSize=10.5, textColor=colors.black,
                 leading=15, leftIndent=4)
s_fala = style("fala", fontName="Helvetica-Oblique", fontSize=10.5,
               textColor=colors.HexColor("#1f2937"), alignment=TA_JUSTIFY,
               leading=15, leftIndent=10, rightIndent=6, spaceAfter=4, spaceBefore=2,
               borderColor=VERDE, borderWidth=0, backColor=colors.HexColor("#ecfdf5"))
s_code = style("code", fontName="Courier", fontSize=9, textColor=colors.HexColor("#065f46"),
               leading=12, leftIndent=8, backColor=colors.HexColor("#f0fdf4"),
               spaceBefore=3, spaceAfter=6)
s_slide_tag = style("slide_tag", fontName="Helvetica-Bold", fontSize=9,
                    textColor=colors.white, alignment=TA_LEFT)

story = []

def hr(color=VERDE, w=1.2, sb=4, sa=10):
    story.append(Spacer(1, sb))
    story.append(HRFlowable(width="100%", thickness=w, color=color))
    story.append(Spacer(1, sa))

def fala(texto):
    """Bloco 'o que dizer' destacado."""
    story.append(Paragraph("🗣️ <b>O que dizer:</b> " + texto, s_fala))

def bullets(itens, st=s_bullet):
    items = [ListItem(Paragraph(t, st), leftIndent=14, value="•") for t in itens]
    story.append(ListFlowable(items, bulletType="bullet", bulletColor=VERDE,
                              bulletFontSize=10, start="•", leftIndent=12))
    story.append(Spacer(1, 4))

def slide_header(num, titulo):
    """Cabeçalho estilo 'slide N'."""
    t = Table([[Paragraph(f"SLIDE {num}", s_slide_tag),
                Paragraph(f"<b>{titulo}</b>",
                          style("st", fontName="Helvetica-Bold", fontSize=12.5,
                                textColor=VERDE_ESC))]],
              colWidths=[2.4*cm, 13.6*cm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (0,0), VERDE_ESC),
        ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
        ("LEFTPADDING", (0,0), (0,0), 8),
        ("TOPPADDING", (0,0), (-1,-1), 6),
        ("BOTTOMPADDING", (0,0), (-1,-1), 6),
        ("LINEBELOW", (1,0), (1,0), 1, VERDE),
    ]))
    story.append(t)
    story.append(Spacer(1, 8))

# ══════════════════════════════════════════════════════════════
#  CAPA
# ══════════════════════════════════════════════════════════════
story.append(Spacer(1, 4.5*cm))
story.append(Paragraph("⚽ BetCopa 2026", s_capa_titulo))
story.append(Spacer(1, 0.4*cm))
story.append(Paragraph("Sistema de Apostas da Copa do Mundo", s_capa_sub))
story.append(Spacer(1, 1.2*cm))
hr(VERDE, 2, 0, 14)
story.append(Paragraph("Guia de Apresentação", style("g", fontName="Helvetica-Bold",
             fontSize=18, textColor=VERDE_NEO, alignment=TA_CENTER)))
story.append(Spacer(1, 0.3*cm))
story.append(Paragraph("Trabalho T2 — Paradigmas de Linguagens de Programação (PLP)",
             s_capa_sub))
story.append(Spacer(1, 3*cm))
story.append(Paragraph("Comparação entre Programação Orientada a Objetos, "
             "Funcional e Imperativa", style("c", fontName="Helvetica-Oblique",
             fontSize=11, textColor=CINZA_CL, alignment=TA_CENTER, leading=16)))
story.append(PageBreak())

# ══════════════════════════════════════════════════════════════
#  1. VISÃO GERAL
# ══════════════════════════════════════════════════════════════
story.append(Paragraph("1. Visão Geral do Projeto", s_h1))
hr()
story.append(Paragraph(
    "O <b>BetCopa 2026</b> é um sistema web de apostas esportivas para os jogos da "
    "Copa do Mundo 2026 (EUA, Canadá e México). O usuário se cadastra, recebe um saldo "
    "virtual e aposta nos resultados das partidas. O sistema consome dados <b>reais e ao "
    "vivo</b> da API pública TheSportsDB — placares, grupos e status das partidas são "
    "atualizados automaticamente.", s_body))

story.append(Paragraph("Tecnologias", s_h2))
bullets([
    "<b>HTML, CSS e JavaScript puro</b> (sem frameworks) — roda em qualquer navegador.",
    "<b>API TheSportsDB</b> — dados reais da Copa 2026 (72 jogos, grupos A–L).",
    "<b>flagcdn.com</b> — bandeiras oficiais dos países.",
])

story.append(Paragraph("Por que esse tema?", s_h2))
fala("Escolhemos um sistema de apostas porque ele junta três coisas que mostram bem os "
     "paradigmas: <b>entidades do mundo real</b> (jogos, usuários, apostas) que pedem "
     "Orientação a Objetos; <b>cálculos e transformações de dados</b> (estatísticas, "
     "ranking, tabela de grupos) que ficam elegantes em estilo Funcional; e um "
     "<b>fluxo de tela</b> que é naturalmente Imperativo. Assim conseguimos comparar os "
     "três no mesmo projeto.")

story.append(Paragraph("Requisitos do trabalho atendidos", s_h2))
tabela_req = [
    ["Requisito", "Como atendemos"],
    ["3+ funcionalidades", "Apostas, classificação de grupos, ranking, painel admin"],
    ["Orientação a Objetos", "Classes Jogo, Usuario, Aposta, SistemaApostas"],
    ["Recurso Funcional", "map / filter / reduce, funções puras, imutabilidade"],
    ["Relatório comparativo", "Seção 5 deste material"],
    ["Demonstração prática", "Roteiro na seção 4"],
]
t = Table(tabela_req, colWidths=[5*cm, 11*cm])
t.setStyle(TableStyle([
    ("BACKGROUND", (0,0), (-1,0), VERDE_ESC),
    ("TEXTCOLOR", (0,0), (-1,0), colors.white),
    ("FONTNAME", (0,0), (-1,0), "Helvetica-Bold"),
    ("FONTNAME", (0,1), (-1,-1), "Helvetica"),
    ("FONTSIZE", (0,0), (-1,-1), 9.5),
    ("GRID", (0,0), (-1,-1), 0.5, CINZA),
    ("ROWBACKGROUNDS", (0,1), (-1,-1), [colors.white, colors.HexColor("#f0fdf4")]),
    ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
    ("TOPPADDING", (0,0), (-1,-1), 6),
    ("BOTTOMPADDING", (0,0), (-1,-1), 6),
    ("LEFTPADDING", (0,0), (-1,-1), 8),
]))
story.append(t)
story.append(PageBreak())

# ══════════════════════════════════════════════════════════════
#  2. FUNCIONALIDADES
# ══════════════════════════════════════════════════════════════
story.append(Paragraph("2. Funcionalidades Principais", s_h1))
hr()
funcs = [
    ("🎰 Apostas", "O usuário escolhe time 1, empate ou time 2, define o valor e o "
     "sistema calcula o retorno potencial pela odd. O saldo é debitado na hora."),
    ("📊 Classificação dos Grupos", "Tabela de pontos calculada automaticamente a partir "
     "dos resultados reais — vitórias, empates, saldo de gols e pontuação."),
    ("🏆 Ranking de Apostadores", "Leaderboard ordenado por lucro, com taxa de acerto "
     "de cada jogador."),
    ("⚙️ Painel Admin", "Permite inserir resultados manualmente; ao salvar, todas as "
     "apostas pendentes daquele jogo são resolvidas automaticamente."),
    ("🔴 Dados ao vivo", "Integração com a API real: jogos ao vivo, placares e status "
     "atualizam sozinhos a cada 60 segundos."),
]
for titulo, desc in funcs:
    story.append(Paragraph(titulo, s_h2))
    story.append(Paragraph(desc, s_body))

story.append(PageBreak())

# ══════════════════════════════════════════════════════════════
#  3. OS PARADIGMAS
# ══════════════════════════════════════════════════════════════
story.append(Paragraph("3. Os Paradigmas Utilizados", s_h1))
hr()
story.append(Paragraph(
    "Este é o <b>coração da apresentação</b>. O projeto combina três paradigmas, "
    "cada um em um arquivo diferente, o que torna a comparação muito clara.", s_body))

# --- OOP ---
story.append(Paragraph("3.1 — Orientação a Objetos  (arquivo: models.js)", s_h2))
story.append(Paragraph(
    "Modelamos o mundo real como <b>objetos</b> que juntam dados e comportamentos. "
    "Cada entidade vira uma classe.", s_body))
story.append(Paragraph(
    "class Aposta {<br/>"
    "&nbsp;&nbsp;constructor(usuario, jogo, escolha, valor) { ... }<br/>"
    "&nbsp;&nbsp;resolver() { /* a própria aposta sabe se ganhou */ }<br/>"
    "}", s_code))
bullets([
    "<b>Encapsulamento:</b> usuario.adicionarAposta() cuida do saldo internamente.",
    "<b>Abstração:</b> jogo.getNomeVencedor() esconde a lógica de comparação.",
    "<b>Composição:</b> uma Aposta contém referências a um Jogo e a um Usuario.",
])
fala("Usamos OOP para as entidades do domínio. A classe <b>Aposta</b>, por exemplo, "
     "sabe como se resolver sozinha quando o jogo termina — chamamos aposta.resolver() "
     "e ela verifica o resultado, paga o usuário se ganhou e atualiza o próprio estado. "
     "Cada classe tem uma responsabilidade clara, o que facilita manter o código.")

# --- Funcional ---
story.append(Paragraph("3.2 — Programação Funcional  (arquivo: functional.js)", s_h2))
story.append(Paragraph(
    "Funções <b>puras</b>: dado o mesmo input, sempre retornam o mesmo output, sem "
    "alterar nada fora delas. Os dados são transformados encadeando funções.", s_body))
story.append(Paragraph(
    "const calcularLucroTotal = apostas =&gt;<br/>"
    "&nbsp;&nbsp;apostas<br/>"
    "&nbsp;&nbsp;&nbsp;&nbsp;.filter(a =&gt; a.resultado === 'ganhou')<br/>"
    "&nbsp;&nbsp;&nbsp;&nbsp;.reduce((acc, a) =&gt; acc + a.ganho, 0);", s_code))
bullets([
    "<b>Funções puras:</b> sem efeitos colaterais, fáceis de testar isoladamente.",
    "<b>Imutabilidade:</b> [...array].sort() cria uma cópia em vez de alterar o original.",
    "<b>Higher-order functions:</b> filter, map e reduce recebem funções como argumento.",
    "<b>Arrow functions:</b> sintaxe enxuta para transformar dados.",
])
fala("No arquivo functional.js todas as funções são puras. Para calcular o lucro de um "
     "jogador, por exemplo, encadeamos <b>filter</b> e <b>reduce</b> — primeiro filtramos "
     "só as apostas vencedoras, depois somamos os ganhos. Não tem nenhum laço 'for' nem "
     "variável sendo modificada. O código fica quase como uma frase em inglês: 'filtre as "
     "ganhas e reduza somando'. A tabela de classificação dos grupos também é feita assim.")

# --- Imperativo ---
story.append(Paragraph("3.3 — Programação Imperativa  (arquivo: app.js)", s_h2))
story.append(Paragraph(
    "O controlador da interface segue o estilo imperativo: comandos passo a passo, "
    "estado mutável e fluxo de controle explícito — o paradigma mais familiar.", s_body))
fala("O app.js é imperativo: ele descreve o passo a passo — 'pegue o jogo, valide o "
     "valor, debite o saldo, atualize a tela'. É o jeito mais intuitivo de pensar, mas "
     "quando o sistema cresce ele tende a misturar responsabilidades. Por isso isolamos "
     "as regras de negócio nas classes e os cálculos nas funções puras.")

story.append(PageBreak())

# ══════════════════════════════════════════════════════════════
#  4. ROTEIRO DA DEMONSTRAÇÃO
# ══════════════════════════════════════════════════════════════
story.append(Paragraph("4. Roteiro da Demonstração Prática", s_h1))
hr()
story.append(Paragraph(
    "Sequência sugerida para mostrar o sistema funcionando ao vivo. "
    "Deixe o servidor já rodando antes de começar (npx serve -p 3000).", s_body))

passos = [
    ("Tela inicial", "Mostre o banner '72 jogos carregados da API' e os jogos ao vivo. "
     "Destaque que os placares são REAIS, vindos da Copa 2026."),
    ("Login", "Entre com a conta demo (demo@copa2026.com / 123456). Mostre o saldo "
     "aparecendo no topo."),
    ("Fazer uma aposta", "Vá em Apostas, escolha um jogo, selecione um time, digite o "
     "valor. Mostre o retorno potencial calculado em tempo real e confirme."),
    ("Grupos", "Abra a aba Grupos e mostre a tabela de classificação calculada "
     "automaticamente a partir dos resultados — esse cálculo é 100% funcional."),
    ("Admin resolve um jogo", "No painel Admin, defina o resultado de um jogo em que "
     "você apostou. Mostre que a aposta foi resolvida e o saldo atualizado sozinho."),
    ("Ranking", "Finalize mostrando o ranking de apostadores ordenado por lucro."),
]
for i, (titulo, desc) in enumerate(passos, 1):
    story.append(Paragraph(f"Passo {i} — {titulo}", s_h2))
    story.append(Paragraph(desc, s_body))

fala("Dica: aposte de propósito em um time e depois, no Admin, marque esse time como "
     "vencedor. Assim a plateia vê o saldo subir na hora — é o momento que conecta "
     "todos os paradigmas: a classe Aposta se resolve (OOP), as estatísticas recalculam "
     "(Funcional) e a tela atualiza (Imperativo).")

story.append(PageBreak())

# ══════════════════════════════════════════════════════════════
#  5. RELATÓRIO COMPARATIVO (respostas)
# ══════════════════════════════════════════════════════════════
story.append(Paragraph("5. Comparação dos Paradigmas (Relatório)", s_h1))
hr()
story.append(Paragraph("Respostas diretas às perguntas pedidas no trabalho.", s_body))

qa = [
    ("Qual paradigma foi mais fácil de utilizar?",
     "O <b>Imperativo</b>, porque é o mais intuitivo — você escreve na ordem em que as "
     "coisas acontecem, igual ao raciocínio do dia a dia."),
    ("Qual gerou o código mais legível?",
     "O <b>Funcional</b>. Expressões como apostas.filter(...).reduce(...) são curtas e "
     "quase se leem como linguagem natural, sem variáveis de controle e sem laços."),
    ("Quais vantagens e limitações foram observadas?",
     "<b>OOP:</b> ótima organização e reúso, mas o estado mutável compartilhado pode "
     "gerar bugs difíceis de rastrear. "
     "<b>Funcional:</b> previsível e fácil de testar, mas tem curva de aprendizado e "
     "pode custar mais memória em listas enormes. "
     "<b>Imperativo:</b> simples de começar, mas vira 'código espaguete' quando cresce."),
    ("Em quais situações cada um é mais indicado?",
     "<b>OOP</b> para modelar entidades complexas de um domínio (jogos, usuários). "
     "<b>Funcional</b> para transformar e analisar dados (estatísticas, relatórios, "
     "pipelines). <b>Imperativo</b> para scripts diretos e controle de fluxo de tela."),
]
for pergunta, resposta in qa:
    story.append(Paragraph(pergunta, s_h2))
    story.append(Paragraph(resposta, s_body))

# Tabela resumo final
story.append(Paragraph("Resumo comparativo", s_h2))
tab = [
    ["Critério", "OOP", "Funcional", "Imperativo"],
    ["Onde no projeto", "models.js", "functional.js", "app.js"],
    ["Foco", "Entidades", "Transformar dados", "Fluxo de tela"],
    ["Estado", "Mutável", "Imutável", "Mutável"],
    ["Legibilidade", "Boa", "Excelente", "Boa (cai ao crescer)"],
    ["Facilidade de teste", "Média", "Alta", "Baixa"],
]
t = Table(tab, colWidths=[3.6*cm, 3.6*cm, 4.4*cm, 4.4*cm])
t.setStyle(TableStyle([
    ("BACKGROUND", (0,0), (-1,0), VERDE_ESC),
    ("TEXTCOLOR", (0,0), (-1,0), colors.white),
    ("FONTNAME", (0,0), (-1,0), "Helvetica-Bold"),
    ("FONTNAME", (0,1), (0,-1), "Helvetica-Bold"),
    ("FONTNAME", (1,1), (-1,-1), "Helvetica"),
    ("FONTSIZE", (0,0), (-1,-1), 9),
    ("GRID", (0,0), (-1,-1), 0.5, CINZA),
    ("ROWBACKGROUNDS", (0,1), (-1,-1), [colors.white, colors.HexColor("#f0fdf4")]),
    ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
    ("TOPPADDING", (0,0), (-1,-1), 6),
    ("BOTTOMPADDING", (0,0), (-1,-1), 6),
    ("LEFTPADDING", (0,0), (-1,-1), 6),
]))
story.append(t)

story.append(Spacer(1, 0.8*cm))
hr(VERDE, 1.5, 0, 8)
story.append(Paragraph(
    "Conclusão: nenhum paradigma é 'melhor' em absoluto. O projeto mostra que o ideal é "
    "<b>combiná-los</b> — usar cada um onde ele brilha. Foi exatamente o que fizemos no "
    "BetCopa 2026.",
    style("conc", fontName="Helvetica", fontSize=10.5, textColor=VERDE_ESC,
          alignment=TA_JUSTIFY, leading=15)))

# ── Rodapé com numeração ──────────────────────────────────────
def rodape(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(CINZA_CL)
    canvas.drawString(2*cm, 1.2*cm, "BetCopa 2026 — Guia de Apresentação | Trabalho T2 PLP")
    canvas.drawRightString(A4[0]-2*cm, 1.2*cm, f"Página {doc.page}")
    canvas.setStrokeColor(VERDE)
    canvas.setLineWidth(0.5)
    canvas.line(2*cm, 1.5*cm, A4[0]-2*cm, 1.5*cm)
    canvas.restoreState()

doc = SimpleDocTemplate(
    "BetCopa2026_Apresentacao.pdf", pagesize=A4,
    leftMargin=2*cm, rightMargin=2*cm, topMargin=2*cm, bottomMargin=2*cm,
    title="BetCopa 2026 - Guia de Apresentacao", author="Trabalho T2 PLP")
doc.build(story, onFirstPage=lambda c, d: None, onLaterPages=rodape)
print("PDF gerado com sucesso: BetCopa2026_Apresentacao.pdf")
