# Projeto Malagueta — Um chip brasileiro para inferência de IA

### Dossiê técnico-industrial e estratégico de viabilidade
*Pesquisa profunda sobre arquitetura, cadeia de suprimentos e ecossistema nacional de semicondutores*

> **Analogia de partida:** em junho de 2026 a OpenAI e a Broadcom apresentaram o **"Jalapeño"**, um ASIC de inferência para LLMs, arquitetura de *systolic array*, memória HBM, fabricado pela TSMC em **3 nm**, com deploy previsto para o fim de 2026 e time de silício de ~40 pessoas liderado por Richard Ho (ex-Google TPU). Este documento faz a pergunta inversa: **o que seria, de forma realista, um "Jalapeño brasileiro"?** A resposta não é copiar o chip da OpenAI — é desenhar um chip cuja arquitetura, foco de mercado e cadeia de suprimentos joguem com as forças reais do Brasil, e não com as forças que o Brasil não tem.
>
> O nome escolhido segue o mesmo espírito (Jalapeño é uma pimenta): **Malagueta**, a pimenta brasileira.

---

## 1. Sumário executivo

**Tese central:** o Brasil **não** deve tentar construir uma fábrica de ponta (leading-edge, 3–5 nm, litografia EUV) para competir com a OpenAI/TSMC. Isso custaria dezenas de bilhões de dólares, dependeria de equipamentos sob controle de exportação (ASML/EUV) e levaria uma década só para começar. Em vez disso, o caminho viável é um chip **fabless**, projetado no Brasil, fabricado em foundry estrangeira em **nó maduro**, e **encapsulado, testado e integrado no Brasil** — onde o país já tem capacidade real e única na América Latina.

**As quatro alavancas reais do Brasil:**

| Alavanca | Situação | Papel no projeto |
|---|---|---|
| **Matéria-prima (silício/quartzo)** | 2º maior exportador mundial de silício grau metalúrgico; maiores reservas de quartzo do mundo; 94% do nióbio; 23% das terras-raras | Base soberana de longo prazo; hoje só grau metalúrgico |
| **Encapsulamento e teste (OSAT)** | HT Micron (São Leopoldo) e Smart Modular (Atibaia) — **único parque de packaging de semicondutores em escala da América Latina** | **Onde o "made in Brazil" acontece de fato** |
| **Design (design houses)** | ~22 design houses no CI-Brasil; Chipus, Eldorado, CTI Renato Archer, IDEA!, SMDH; parceria Eldorado–Barcelona em unidade matricial RISC-V | O cérebro do projeto |
| **Energia limpa + demanda** | ~88–90% da matriz elétrica renovável; mercado de data centers de US$ 2,8 bi (2025) → US$ 6,5 bi (2030) | Cliente-âncora e vantagem ESG para inferência em nuvem |

**O que propomos:** a família **Malagueta**, baseada em **RISC-V** (ISA aberta, sem royalties, soberana) com uma **extensão de aceleração matricial/tensorial** (aproveitando o projeto Eldorado–BSC e geradores abertos tipo Gemmini). Em três gerações:

- **Malagueta-E (Edge)** — SoC de inferência na borda, nó 12–22 nm, memória LPDDR5X, dezenas de TOPS, encapsulado na HT Micron. Alvo: agronegócio, IoT industrial, vigilância, setor público, automotivo.
- **Malagueta-D (Data)** — acelerador de datacenter em *chiplets*, chiplet de compute em 5–7 nm (foundry estrangeira), memória de alta banda importada, centenas de TOPS/PFLOPS, cartão PCIe/OAM para a nuvem soberana e o supercomputador do PBIA.
- **Malagueta-P (Power/SiC)** — trilha paralela via CEITEC em carbeto de silício, para a infraestrutura de energia dos próprios data centers (não é chip de IA, mas fecha a cadeia).

**Ordem de grandeza de investimento:** primeiro silício de prova (MPW) ~US$ 1–5 mi; Malagueta-E em produção ~R$ 300–500 mi; programa completo de 10 anos na casa de **R$ 3–8 bi** — plenamente compatível com os instrumentos já existentes (PADIS/Brasil Semicon ~R$ 7 bi/ano; PBIA R$ 23 bi; BNDES/Finep).

**A verdade incômoda:** três dependências permanecem estrangeiras e não há como evitá-las no médio prazo — **(1)** a fabricação do wafer avançado, **(2)** a memória de alta banda (HBM, monopólio SK Hynix/Samsung/Micron) e **(3)** as ferramentas de EDA (Synopsys/Cadence/Siemens). A estratégia não é eliminar essas dependências, é **construir soberania onde ela é alcançável** (design, IP, packaging, integração, aplicação) e **gerenciar** o resto com diversificação de fornecedores e EDA de código aberto.

---

## 2. Por que fazer isso — e por que agora

1. **Custo de inferência é o novo campo de batalha.** O próprio racional da OpenAI para o Jalapeño é que "cada ganho de custo, velocidade e confiabilidade aparece como uma resposta mais rápida do ChatGPT". Inferência (rodar o modelo) é 80–90% do custo de vida de um modelo em produção — muito maior que o treino. É exatamente aqui, e não no treino de fronteira, que um chip nacional pode ter ROI.

2. **Inferência não exige o nó mais avançado.** Treinar GPT-5 exige 3 nm e HBM4. **Rodar** um modelo quantizado (INT8/INT4/FP8) na borda ou em datacenter regional roda muito bem em nós maduros (12–22 nm) com LPDDR. Isso coloca o jogo dentro do alcance industrial do Brasil.

3. **O Brasil tem demanda soberana crescente.** PBIA (R$ 23 bi), supercomputador nacional (~5.000 GPUs, previsto para 2026), nuvem soberana, e um mercado de data centers dobrando até 2030 — tudo isso hoje é 100% dependente de GPUs importadas (Nvidia). Há um comprador-âncora nacional.

4. **A janela de política pública está aberta.** A Lei 14.968/2024 (Brasil Semicon), em vigor desde 1º/1/2025, estende o PADIS até 2029 (com possibilidade até 2073), zera IOF em crédito BNDES/Finep e injeta ~R$ 7 bi/ano no ecossistema. O Decreto 13.065/2026 ampliou o PADIS para software, firmware, licenciamento de IP e transferência de tecnologia — exatamente o que um projeto fabless precisa.

5. **Energia limpa é um diferencial de inferência.** Com ~88–90% de matriz renovável (vs. ~24% nos EUA), inferência rodada no Brasil tem menor pegada de carbono — ativo comercial real para hyperscalers sob pressão ESG. Um chip *e* uma nuvem verdes se reforçam.

---

## 3. Diagnóstico frio da cadeia de suprimentos brasileira

A produção de um chip tem ~8 camadas. Abaixo, onde o Brasil está **forte (🟢)**, **parcial (🟡)** ou **ausente (🔴)** — este é o mapa que dita toda a estratégia.

| # | Camada | Situação BR | Atores nacionais | Gargalo |
|---|---|---|---|---|
| 1 | **Matéria-prima bruta** (quartzo, silício metálico, minerais críticos) | 🟢 | Rima (4º maior produtor mundial de silício metálico), Minasligas, Ferbasa; CBMM (nióbio); Vale | Exporta commodity; não agrega valor |
| 2 | **Silício grau eletrônico / polisilício** (>99,9999999%) | 🔴 | IPT e Unicamp chegaram a grau **solar** (>99,999%) em piloto; **não há planta de grau eletrônico** | Ausência total em escala |
| 3 | **Wafer / front-end (fabricação)** | 🟡→🔴 | **CEITEC** (única fab da América Latina; CMOS 600 nm, wafer 6", ~10 mil wafers/ano) | Nó antigo (600 nm) é 20+ gerações atrás do necessário para IA |
| 4 | **Projeto de circuito (design/IP)** | 🟢🟡 | Chipus, Instituto Eldorado, CTI Renato Archer, IDEA!, SMDH + ~22 design houses (CI-Brasil) | Analógico/mixed-signal forte; digital de alto desempenho é incipiente |
| 5 | **Ferramentas de projeto (EDA)** | 🔴 | Uso de Synopsys/Cadence/Siemens (licenças estrangeiras) | Dependência + risco de controle de exportação |
| 6 | **Encapsulamento e teste (OSAT/back-end)** | 🟢 | **HT Micron** (até 360 mi chips/ano, sala limpa 7.500 m²), **Smart Modular** (Atibaia, >150 mi CIs/ano), Brasil Componentes (Multilaser) | **Maior força real**; ainda sem packaging avançado 2.5D/chiplet |
| 7 | **Memória (DRAM/LPDRAM/Flash — CI e módulo)** | 🟡 | **Zilia Technologies** (ex-Smart Modular do Brasil) produz CIs de DRAM, LPDRAM e Flash e módulos em Atibaia/SP e Manaus/AM; roadmap DDR5/LPDDR5. **Die (front-end) ainda importado; HBM inexistente** | Sem fab de die de memória; HBM é o gargalo global mais crítico |
| 8 | **Talento / P&D** | 🟢🟡 | CI-Brasil/Softex, Unicamp (CCS), USP (LSI), UFRGS (GME/LME), UFMG, UFCG, UFPE, UFRN, UFSC | Volume insuficiente; fuga de cérebros |

**Leitura estratégica do mapa:**
- As camadas **1, 4, 6 e 8** são jogáveis pelo Brasil **hoje**. É onde o projeto deve concentrar soberania.
- As camadas **2, 3 (avançado), 5 e 7** são estruturalmente estrangeiras no médio prazo. É onde o projeto deve **comprar, parcerizar e diversificar**, não tentar reinventar.
- O erro histórico brasileiro (e a armadilha da CEITEC) foi tentar resolver a camada 3 (fabricação) — a mais cara e a menos acessível. A tese Malagueta **contorna** a camada 3 avançada via foundry estrangeira e ancora o "made in Brazil" na camada 6 (packaging), que o país domina.

---

## 4. A tese arquitetural: fabless + RISC-V + chiplets + nó maduro

### 4.1 Por que fabless (e não uma fab)
Um conjunto de máscaras em 28 nm custa ~US$ 800 mil; em 5 nm, US$ 5–8 mi; em 3 nm, US$ 10–20 mi — **e isso é só a máscara**, não a fábrica (uma fab de ponta custa US$ 20–40 bi). Uma rodada MPW (*multi-project wafer*, várias empresas dividindo um wafer) sai por US$ 10–50 mil em nós maduros. Ou seja: **projetar** um chip está ao alcance de um orçamento nacional; **fabricá-lo em casa** não está. Logo, Malagueta é fabless: projeta no Brasil, tapeout em TSMC/GlobalFoundries/UMC/Samsung.

### 4.2 Por que RISC-V (a decisão mais importante)
- **Soberania jurídica:** ISA aberta, sem royalties nem licença de IP proprietária (evita depender de Arm/x86 e do risco geopolítico associado).
- **Já é política de Estado:** o supercomputador do PBIA prevê arquitetura RISC-V; a parceria **Instituto Eldorado + Barcelona Supercomputing Center (BSC)** desenvolve uma **Unidade de Aceleração de Multiplicação de Matrizes** integrada a um processador RISC-V — e "multiplicação de matrizes é a operação mais importante das aplicações de IA, incluindo LLMs como o ChatGPT". **Este é o embrião real de um acelerador de IA brasileiro.** Malagueta o industrializa.
- **Ecossistema aberto:** geradores como **Gemmini** (systolic array, ecossistema Rocket/BOOM de Berkeley) permitem partir de IP aberto e customizar, em vez de começar do zero.

### 4.3 Por que chiplets
Em vez de um único die monolítico grande (baixo yield, caro), separar o chip em pastilhas menores:
- **Chiplet de compute** (a matriz sistólica) no melhor nó que o orçamento permitir;
- **Chiplet de I/O e memória** em nó mais barato/maduro;
- interligados por *interposer* (2.5D) e interface aberta **UCIe**.

Vantagem para o Brasil: **cada chiplet pode vir de um nó/foundry diferente**, a montagem 2.5D é exatamente a fronteira que a HT Micron pode subir, e o mesmo chiplet de compute serve tanto o Edge quanto o Data (reuso). É a arquitetura que melhor casa com um ecossistema fragmentado e de baixa escala.

### 4.4 Núcleo de cálculo
- **Matriz sistólica** (estilo TPU/Jalapeño): grade de *Processing Elements* que faz multiply-accumulate em fluxo, ótima em latência e eficiência energética para DNN/transformers.
- **Precisões de inferência:** INT8, INT4 e FP8 (não FP32/BF16 de treino) — cabe em nó maduro e reduz drasticamente área e consumo.
- **Extensão vetorial/matricial RISC-V** (RVV + extensão matricial custom, herdando o trabalho Eldorado–BSC) para atender diferentes formatos de modelo sem ASIC rígido.

---

## 5. Especificação técnica proposta da família Malagueta

> Metas de engenharia — realistas para o ecossistema, não aspiracionais de marketing.

### Malagueta-E (Edge) — o primeiro produto real
| Parâmetro | Meta |
|---|---|
| Aplicação | Inferência na borda: visão computacional agro, IoT industrial, câmeras inteligentes, terminais do setor público, ADAS básico |
| Nó de fabricação | 22 nm (1ª versão) → 12/16 nm FinFET (versão comercial) — foundry estrangeira |
| Arquitetura | SoC: cluster RISC-V (RVV) + NPU matriz sistólica + extensão matricial |
| Desempenho-alvo | 20–80 TOPS (INT8) |
| Memória | LPDDR5X — die importado, mas **CI/módulo produzido no Brasil pela Zilia** (que já tem roadmap LPDDR5) e co-encapsulado via SiP na HT Micron — **evita HBM de propósito** |
| Potência | 5–25 W (envelope de borda) |
| Packaging | SiP / Fan-out na **HT Micron (São Leopoldo)** — este é o "made in Brazil" |
| Prazo | Primeiro tapeout MPW em ~18 meses; produção em ~3 anos |

### Malagueta-D (Data) — o acelerador soberano de nuvem
| Parâmetro | Meta |
|---|---|
| Aplicação | Inferência de LLM/visão em datacenter; nuvem soberana; PBIA/supercomputador nacional |
| Arquitetura | **Chiplets**: 1–4 chiplets de compute (5–7 nm) + chiplet de I/O + memória de alta banda |
| Desempenho-alvo | Centenas de TOPS a poucos PFLOPS (INT8/FP8) por pacote |
| Memória | HBM3E (importada) **ou** bancos LPDDR5X largos (rota de contingência sem HBM, com CI/módulo pela Zilia) |
| Interconexão | UCIe entre chiplets; PCIe Gen5/CXL e formato OAM para o host |
| Packaging | 2.5D com interposer — meta de médio prazo da HT Micron (parceria com a matriz coreana Hana Micron) |
| Prazo | 3–6 anos (depende de escala de compra do Estado) |

### Malagueta-P (Power/SiC) — trilha CEITEC, fechando a cadeia
Aproveita o pivô já aprovado da CEITEC para **carbeto de silício (SiC)** — semicondutores de potência para conversores, fontes e a distribuição de energia dos próprios data centers e de veículos elétricos. Não é um chip de IA, mas é o único elo em que o Brasil pode ter **fabricação de wafer própria** no horizonte, e alimenta a infraestrutura que a IA consome.

### Diagrama conceitual (Malagueta-D, chiplet)
```
        ┌──────────────────────────────────────────────┐
        │              PACOTE (2.5D, HT Micron)          │
        │   ┌──────────┐  ┌──────────┐   ┌───────────┐  │
        │   │ Compute   │  │ Compute   │   │  HBM/LPDDR │  │
        │   │ chiplet   │  │ chiplet   │   │  (import.) │  │
        │   │ 5–7nm     │  │ 5–7nm     │   └───────────┘  │
        │   │ ┌───────┐ │  │ systolic  │                  │
        │   │ │RISC-V │ │  │ array     │   ┌───────────┐  │
        │   │ │ +RVV  │ │  │ INT8/FP8  │   │ I/O chiplet│  │
        │   │ │ +MMU  │ │  └────┬──────┘   │ PCIe5/CXL  │  │
        │   │ └───────┘ │       │ UCIe     │ 12–22nm    │  │
        │   └─────┬─────┘       │          └─────┬──────┘  │
        │         └────── interposer de silício ──┘         │
        └──────────────────────────────────────────────┘
   Projeto: Eldorado/Chipus/CTI/universidades · Fab: TSMC/GF/Samsung
   Montagem/teste: HT Micron (BR) · Cliente-âncora: nuvem soberana/PBIA
```

---

## 6. Quem faz o quê — a cadeia de suprimentos nacional, empresa por empresa

### 6.1 Matéria-prima (camada soberana de longo prazo) 🟢
- **Rima Industrial / Grupo Rima** — maior produtor brasileiro de silício metálico, **4º maior do mundo**. Ponto de partida da rota metalúrgica.
- **Minasligas, Ferbasa, Dow Corning (Breu Branco/PA)** — silício metálico e ligas.
- **CBMM (Araxá/MG)** — controla ~94% das reservas mundiais de **nióbio** (dopantes, ligas, supercondutores); ativo geopolítico de barganha.
- **Reservas de quartzo** — as maiores do mundo; insumo do polisilício.
- **Terras-raras** (23% das reservas mundiais), **gálio e germânio** (subexplorados — essenciais para RF e optoeletrônica).
- **Lacuna crítica:** não há planta de **silício grau eletrônico/polisilício**. IPT e Unicamp já purificaram silício a grau **solar** (>99,999%) por rota metalúrgica em piloto — uma ponte tecnológica nacional para, no longo prazo, subir ao grau eletrônico.

### 6.2 Design houses (o cérebro) 🟢🟡
- **Instituto Eldorado (Campinas)** — ~60 projetistas de CI, laboratório de prototipagem, e o **parceiro do BSC na unidade matricial RISC-V**. Candidato natural a **integrador-líder de arquitetura** do Malagueta.
- **Chipus Microeletrônica (Florianópolis)** — fabless desde 2008, forte em analógico/mixed-signal e blocos de IP, subsidiária no Vale do Silício. Faz os PHYs, PLLs, reguladores e IP analógico que todo SoC precisa.
- **CTI Renato Archer (Campinas)** — instituto público (desde 1982), microeletrônica, encapsulamento avançado, confiabilidade. Papel de P&D e validação.
- **IDEA! e SMDH (Santa Maria Design House)** — design houses digitais/verificação.
- **CI-Brasil / Softex** — coordena a rede de ~22 design houses e a formação (programas CI Expert, CI Digital, CI Inovador — 250 vagas de residência).

### 6.3 Fabricação de wafer 🟡→🔴
- **CEITEC (Porto Alegre)** — única fab de wafer da América Latina; CMOS 600 nm (processo XC06 transferido da alemã X-FAB), wafer 6", ~10 mil wafers/ano, até ~100 mi chips/ano. **Não serve para o chip de IA** (nó antigo demais), mas: (a) serve para chips auxiliares/RFID/sensores da cadeia, e (b) o pivô para **SiC** a torna peça da trilha Malagueta-P.
- **Fabricação do chip de IA:** obrigatoriamente em **foundry estrangeira** (TSMC, GlobalFoundries, UMC, Samsung). 28 nm é o último nó planar com ampla disponibilidade e custo/yield razoáveis; 12–16 nm FinFET para a versão comercial do Edge; 5–7 nm para os chiplets do Data.

### 6.4 Encapsulamento, teste e montagem — a MAIOR força brasileira 🟢
- **HT Micron (São Leopoldo/RS)** — JV Hana Micron (Coreia) + Parit; **único parque de encapsulamento e teste de semicondutores em escala da América Latina**; sala limpa de 7.500 m², capacidade de até 360 mi chips/ano; já domina **SiP (System-in-Package)** para IoT (chip iMCP-HT32SX) e lançou nova linha de encapsulamento/teste com apoio da Finep. **É aqui que o Malagueta vira "made in Brazil".** A conexão com a Hana Micron abre caminho para subir a escada rumo ao packaging avançado (fan-out, 2.5D).
- **Zilia Technologies (Atibaia/SP + Manaus/AM)** — **ex-Smart Modular do Brasil**, rebatizada em dez/2023 como empresa nacional; **pioneira e líder na produção de CIs de memória DRAM, LPDRAM e Flash e de módulos no Brasil** (uMCP, eMCP, UFS, eMMC, LPDRAM, DRAM IC, Flash IC, SSDs). Encapsula DRAM DDR4 16 Gbit no país e tem roadmap para **DDR5 e LPDDR5**; expansão anunciada (R$ 143 mi de ampliação, ~R$ 475 mi em máquinas, apoio BNDES Mais Inovação), mirando exportação. **Ressalva técnica:** produz o CI/módulo (back-end de alto valor — encapsulamento e montagem do *die*); a fabricação do *die* de memória (front-end) segue importada. Ainda assim, é **o parceiro nacional que torna viável o LPDDR5X "montado no Brasil" do Malagueta-E**.
- **Brasil Componentes (Grupo Multilaser)** — empresa 100% nacional de encapsulamento de CIs.

### 6.5 Talento e P&D 🟢🟡
Unicamp (Centro de Componentes e Semicondutores), USP (Laboratório de Sistemas Integráveis), UFRGS (GME/LME), UFMG, UFCG, UFPE, UFRN, UFSC — todas com grupos de microeletrônica e vínculo ao CI-Brasil. O gargalo é **volume e retenção** (fuga de cérebros), não capacidade individual.

---

## 7. Roadmap em 4 fases (0 → 10 anos)

### Fase 0 — Prova de silício (0–18 meses) · ~US$ 3–8 mi
- Consolidar a **extensão matricial RISC-V** (Eldorado–BSC + Gemmini aberto) num bloco NPU sintetizável.
- **Tapeout MPW** em 22–28 nm de um chip de prova (poucos TOPS) para validar a arquitetura em silício real.
- Encapsular e testar o protótipo **na HT Micron** — provando a cadeia BR ponta-a-ponta em pequena escala.
- Entregável: *first silicon* funcional rodando um modelo de visão quantizado (ex.: detecção de pragas/gado no agro).

### Fase 1 — Malagueta-E em produção (18–42 meses) · ~R$ 300–500 mi
- SoC de borda em 12/16 nm, LPDDR5X, 20–80 TOPS, SiP na HT Micron.
- Mercado-âncora: **agronegócio** (visão embarcada, pulverização seletiva, monitoramento de rebanho — casos já em campo no Brasil), IoT industrial, câmeras do setor público, terminais.
- Modelo de negócio: venda de SoC + kit de referência + SDK/compilador (o software é tão decisivo quanto o silício).

### Fase 2 — Malagueta-D, acelerador de datacenter (3–6 anos) · R$ 1–3 bi
- Chiplets 5–7 nm + memória de alta banda; cartão OAM/PCIe.
- **Cliente-âncora garantido pelo Estado:** nuvem soberana, supercomputador do PBIA, órgãos públicos (compras públicas como demanda inicial — o fator que resolve o problema de escala).
- Meta: subir a HT Micron para **packaging 2.5D** (interposer) com a Hana Micron.

### Fase 3 — Aprofundamento da cadeia (6–10 anos) · trilha contínua
- Piloto de **silício grau eletrônico** (IPT/Unicamp → escala industrial).
- **CEITEC/SiC** para eletrônica de potência dos data centers e VEs (Malagueta-P).
- EDA de código aberto (OpenROAD) para reduzir dependência de ferramentas.
- Meta de longo prazo: primeira linha de packaging avançado 100% nacional.

---

## 8. Financiamento — o dinheiro já existe

| Instrumento | Escala | Uso no Malagueta |
|---|---|---|
| **Brasil Semicon (Lei 14.968/2024) + PADIS** | ~R$ 7 bi/ano até 2029 (possível 2073) | Incentivo fiscal a design, IP, transferência de tecnologia (Decreto 13.065/2026 ampliou para software/firmware) |
| **PBIA 2024–2028** | R$ 23 bi | Supercomputador nacional = **cliente-âncora** do Malagueta-D |
| **BNDES + Finep** | Crédito com IOF zerado (Brasil Semicon) | Capex de linha de packaging, P&D (Finep já apoia a HT Micron) |
| **Nova Indústria Brasil (Missão 4)** | Mandato de política industrial | Guarda-chuva de chips, data centers e robótica |
| **Capital privado + hyperscalers** | Mercado de DC dobrando até 2030 | Co-investimento em troca de capacidade de inferência verde |

**Racional:** o programa completo (R$ 3–8 bi/10 anos) cabe **dentro de um único ano** do orçamento Brasil Semicon. O problema nunca foi dinheiro — foi **foco, governança e um cliente-âncora**. O PBIA resolve o cliente-âncora.

---

## 9. Gargalos, riscos e mitigações (a parte honesta)

| Risco | Severidade | Mitigação realista |
|---|---|---|
| **Memória HBM** — monopólio SK Hynix/Samsung/Micron; yield HBM4 ~60%; demanda > oferta global | 🔴 Alta | **Projetar o Edge para LPDDR5X** (evita HBM por completo); usar HBM só no Data e via contrato de suprimento; rota de contingência com bancos largos de LPDDR |
| **Nós avançados / EUV** — impossível fabricar em casa; ASML/EUV sob controle de exportação | 🔴 Alta | **Aceitar a dependência**: fabless em foundry estrangeira; diversificar entre TSMC/GF/Samsung/UMC para não depender de um só |
| **EDA (Synopsys/Cadence/Siemens)** — licenças estrangeiras, risco de sanção | 🟡 Média | Migração gradual para **OpenROAD/EDA aberto**; negociar licenças via PADIS; formar competência interna |
| **Foundation IP / PHYs** — HBM PHY, SerDes, UCIe são IP caro e estrangeiro | 🟡 Média | Licenciar via parceiros; desenvolver IP analógico nacional na **Chipus** onde viável |
| **Escala / volume** — sem >1.000 wafers/ano não há acesso direto à TSMC | 🟡 Média | **Compras públicas** (PBIA, nuvem soberana) como demanda-âncora; MPW/multiproduto na largada |
| **Talento e fuga de cérebros** | 🟡 Média | CI-Brasil/residências; parceria universidade-empresa; salários competitivos ancorados no projeto |
| **Software/compilador** — sem stack de software (kernels, compilador, runtime) o silício é inútil | 🔴 Alta | Investir **tanto** em SDK/compilador quanto no chip; aproveitar MLIR/IREE e o ecossistema RISC-V aberto |
| **Descontinuidade política** — o Brasil já quase liquidou a CEITEC | 🔴 Alta | Blindagem via marco legal (PADIS até 2073); cliente-âncora estatal cria dependência institucional que protege o programa |

**A lição CEITEC:** a única fab do país passou anos "à espera de dinheiro para pagar a conta de luz e manter a sala limpa" e chegou perto da extinção antes do pivô para SiC. Qualquer projeto nacional de chip **tem que** ser estruturado para sobreviver a ciclos políticos — daí a ênfase em cliente-âncora estatal contratual e marco legal de longo prazo, e não em subsídio discricionário.

---

## 10. Casos de uso âncora (por que alguém compraria o Malagueta)

1. **Agronegócio (o mais forte).** Visão embarcada para pulverização seletiva, contagem/saúde de rebanho, detecção de pragas — com conectividade intermitente no campo, **inferência na borda** (não na nuvem) reduz custo e latência. Máquinas da Stara, sensores IoT, irrigação inteligente já demandam hardware embarcado nacional.
2. **Soberania e setor público.** Terminais, biometria, câmeras urbanas, defesa — casos em que rodar IA em silício **auditável e nacional** é requisito, não luxo.
3. **Data centers verdes de inferência.** Combinar chip nacional + matriz elétrica 88–90% renovável = inferência de menor pegada de carbono, exportável como serviço digital a hyperscalers.
4. **Nuvem soberana / PBIA.** Reduzir dependência de GPUs Nvidia importadas para cargas de inferência do Estado.
5. **Automotivo e industrial.** ADAS de entrada, manutenção preditiva, visão de linha de produção.

---

## 11. Malagueta × Jalapeño — comparação honesta

| Dimensão | OpenAI Jalapeño | Malagueta (proposta) |
|---|---|---|
| Foco | Inferência de LLM em datacenter, escala de 10 GW | Inferência na borda (E) e datacenter regional/soberano (D) |
| Nó | 3 nm (TSMC) | 12–22 nm (Edge) → 5–7 nm chiplet (Data) |
| Memória | HBM | LPDDR5X (Edge) / HBM ou LPDDR largo (Data) |
| ISA | Custom (Broadcom) | **RISC-V aberto** |
| Fabricação | TSMC | Foundry estrangeira (fabless) |
| Packaging | Avançado (EUA/TSMC) | **HT Micron / Brasil** ← diferencial soberano |
| Time | ~40 pessoas + Broadcom | Consórcio Eldorado + Chipus + CTI + universidades |
| Vantagem estrutural | Capital e acesso a nó de ponta | **Matéria-prima, packaging nacional e energia limpa** |

**Não se trata de vencer o Jalapeño em TOPS.** Trata-se de construir um chip *soberano, suficiente e barato* para os casos de uso brasileiros, com a maior parcela possível de valor agregado dentro do país — e de estabelecer a **competência** que, em 10–15 anos, permite subir na cadeia.

---

## 12. Recomendações finais

1. **Comece pela borda, não pelo datacenter.** Malagueta-E é a aposta de menor risco, com mercado real (agro) e cadeia 100% executável hoje.
2. **Ancore em RISC-V + o trabalho Eldorado–BSC.** Não reinvente o acelerador matricial — industrialize o que já existe.
3. **Faça do packaging o coração do "made in Brazil".** A HT Micron é o ativo mais subestimado e mais soberano da cadeia. Priorize investimento para ela subir ao packaging avançado.
4. **Garanta o cliente-âncora via PBIA e compras públicas.** É o que quebra o problema de escala e blinda o projeto politicamente.
5. **Invista em software tanto quanto em silício.** Sem compilador/SDK, o melhor chip é inútil.
6. **Aceite as três dependências (fab avançada, HBM, EDA) e gerencie-as** — não gaste capital político tentando eliminá-las cedo demais.
7. **Trate a matéria-prima e o SiC (CEITEC) como trilha de longo prazo**, não como pré-requisito da Fase 1.

> **Síntese em uma frase:** o Brasil não vai fabricar o próximo chip de 3 nm — mas **pode projetar, encapsular, testar e implantar** um chip de inferência RISC-V soberano, alimentado por energia limpa e ancorado no agronegócio e na nuvem estatal, usando exatamente as forças (silício, packaging, design houses, demanda pública) que já tem. Esse chip se chama **Malagueta**.

---

## Fontes

- CEITEC — situação e pivô para SiC: [Poder360](https://www.poder360.com.br/governo/unica-fabricante-de-chips-da-america-latina-ceitec-esta-perto-da-extincao/), [Brasil de Fato](https://www.brasildefato.com.br/2024/12/13/com-investimentos-de-r-220-mi-empresa-publica-ceitec-se-prepara-para-entrar-em-mercado-que-esta-nascendo/), [Convergência Digital](https://convergenciadigital.com.br/inovacao/ceitec-a-espera-de-dinheiro-para-pagar-conta-de-luz-e-manter-sala-limpa/), [Wikipedia — CEITEC](https://en.wikipedia.org/wiki/CEITEC), [Inovação Tecnológica](https://www.inovacaotecnologica.com.br/noticias/noticia.php?artigo=chip-identificacao-radiofrequencia)
- HT Micron — encapsulamento e teste: [Finep](https://www.finep.gov.br/noticia/5481-ht-micron-lanca-nova-linha-de-encapsulamento-e-teste-de-semicondutores-com-apoio-da-finep), [Governo RS](https://www.estado.rs.gov.br/empresa-lanca-linha-de-encapsulamento-e-teste-de-semicondutores), [HT Micron](https://htmicron.com.br/en/)
- Design houses e CI-Brasil: [Pesquisa FAPESP](https://revistapesquisa.fapesp.br/en/brazils-chip-making-dream/), [Semiconductor Engineering](https://semiengineering.com/brazil-paves-new-semiconductor-path/), [Chipus/CI-Brasil](https://cibrasil.sbmicro.org.br/index.php/en/ci-brasil-program), [Softex ChipTech](https://chiptech.softex.br/en/), [CTI Renato Archer](https://www.cti.gov.br)
- Política (Brasil Semicon / PADIS): [Global Trade Alert](https://globaltradealert.org/intervention/140461), [UNCTAD Investment Policy Hub](https://investmentpolicy.unctad.org/investment-policy-monitor/measures/4814/brazil-extension-and-expansion-of-incentive-regime-for-semiconductor-industry), [IEA — PADIS](https://www.iea.org/policies/19974-support-program-for-the-technological-development-of-the-semiconductor-industry-padis)
- Matéria-prima (silício/quartzo): [BNDES — rota metalúrgica](https://web.bndes.gov.br/bib/jspui/bitstream/1408/2901/1/A%20rota%20metal%C3%BArgica%20de%20produ%C3%A7%C3%A3o%20de%20sil%C3%ADcio%20grau%20solar.pdf), [MME](https://www.gov.br/mme/pt-br/assuntos/noticias/importante-para-a-construcao-de-placas-solares-silicio-tambem-e-muito-utilizado-na-construcao-civil-e-no-setor-automobilistico), [IPT — silício grau solar](https://www.inovacaotecnologica.com.br/noticias/noticia.php?artigo=ipt-obtem-silicio-grau-solar-rota-metalurgica), [Unicamp](https://unicamp.br/unicamp/ju/530/grupo-purifica-silicio-para-fabricacao-de-celulas-solares)
- Minerais críticos (nióbio/terras-raras/gálio): [IBASE](https://ibase.br/wp-content/uploads/2022/02/Terras-raras-e-niobio_Julio-Holanda.pdf), [Times Brasil/CNBC](https://timesbrasil.com.br/brasil/da-cbmm-a-vale-quem-domina-os-minerais-estrategicos-que-colocam-o-brasil-no-centro-da-disputa-global/), [ANM](https://www.gov.br/anm/pt-br/acesso-a-informacao/perguntas-frequentes/minerais-criticos-e-estrategicos)
- RISC-V nacional e acelerador matricial: [Softex](https://softex.br/brasil-e-europa-assinam-projeto-inovador-com-tecnologia-risc-v-para-hpc/), [Instituto Eldorado](https://www.eldorado.org.br/en/noticia/brazil-and-europe-sign-innovative-project-whit-risc-v-technology-for-hpc/), [BSC](https://www.bsc.es/news/bsc-news/brazil-and-europe-sign-innovative-project-risc-v-technology-hpc), [IC Unicamp](https://ic.unicamp.br/en/noticia/10027/), [Convergência Digital — supercomputador PBIA](https://convergenciadigital.com.br/governo/exclusivo-supercomputador-do-pbia-tera-5-mil-gpus-arquitetura-risc-v-e-inauguracao-prevista-para-2026/)
- Arquitetura de chip de inferência: [Medium — RISC-V AI/ML inference](https://medium.com/@jonah_27996/risc-vs-open-source-innovation-advantage-in-ai-ml-inference-workloads-a4b70eec5400), [Tandfonline — NN inference engine RISC-V](https://www.tandfonline.com/doi/full/10.1080/23335777.2025.2584291), [Design&Reuse — chiplet revolution](https://www.design-reuse.com/news/202529865-the-chiplet-revolution-how-advanced-packaging-and-ucie-are-redefining-ai-hardware-in-2025/)
- Custos de foundry/tapeout: [Silicon Analysts](https://siliconanalysts.com/guide/foundry-engagement), [VLSI Shuttle — MPW](https://www.vlsishuttle.com/en/learn/mpw-guide)
- Packaging avançado / HBM / LPDDR: [Marvell](https://www.marvell.com/company/newsroom/marvell-delivers-advanced-packaging-platform-custom-ai-accelerators.html), [Semiconductor Engineering — memória para aceleradores](https://semiengineering.com/choosing-the-right-memory-solution-for-ai-accelerators/), [Wevolver — HBM](https://www.wevolver.com/article/what-is-hbm-high-bandwidth-memory-deep-dive-into-architecture-packaging-and-applications)
- Memória/OSAT no Brasil (Zilia, ex-Smart Modular): [Zilia Technologies](https://ziliatech.com/en/), [Times Brasil/CNBC — expansão R$ 143 mi](https://timesbrasil.com.br/brasil/zilia-technologies-amplia-producao-de-semicondutores-no-brasil-com-investimento-de-r-143-milhoes/), [Teletime/Telesíntese — mercado externo](https://telesintese.com.br/apos-expansao-local-zilia-mira-mercado-externo-de-semicondutores/), [Investing/Reuters — R$ 650 mi](https://br.investing.com/news/technology-news/fabricante-de-semicondutores-zilia-anuncia-investimento-de-r650-mi-ate-o-final-de-2025-1272948), [SMART Modular — DRAM DDR4 16 Gbit](https://smartmodular.com.br/blog/a-smart-modular-technologies-comeca-a-produzir-no-brasil-circuitos-integrados-dram-do-tipo-ddr4-de-ultima-geracao-de-16gbit/), [Plano Brasil Semicondutores (MDIC)](https://www.gov.br/mdic/pt-br/assuntos/sdic/setor-automotivo/PlanoBrasilSemicondutores.pdf)
- PBIA e energia/data centers: [PBIA — MCTI](https://www.gov.br/mcti/pt-br/acompanhe-o-mcti/transformacaodigital/plano-brasileiro-de-inteligencia-artificial), [Claro Próximo Nível — R$ 23 bi](https://proximonivel.claro.com.br/pbia-brasil-aporta-r-23-bilhoes-em-investimentos-em-ia/), [CNN Brasil — energia e data centers](https://www.cnnbrasil.com.br/infra/energia-renovavel-e-data-centers-a-vantagem-competitiva-do-brasil/), [Câmara dos Deputados](https://www.camara.leg.br/noticias/1196158-matriz-de-energia-limpa-e-renovavel-torna-o-brasil-atraente-para-instalacao-de-data-centers/)
- Edge AI / agronegócio: [IT Forum — agro movido a chips](https://itforum.com.br/colunas/algoritmo-agro-chips/), [Computer Weekly — edge-to-satellite](https://www.computerweekly.com/br/reportagen/Como-a-arquitetura-Edge-to-Satellite-redefine-a-TI-do-agro-e-da-logistica-no-Brasil)
- Referência OpenAI Jalapeño: [OpenAI](https://openai.com/index/openai-broadcom-jalapeno-inference-chip/), [TechCrunch](https://techcrunch.com/2026/06/24/openai-unveils-its-first-custom-chip-built-by-broadcom/), [DataCenterDynamics](https://www.datacenterdynamics.com/en/news/openai-building-first-custom-ai-inference-chip-with-tsmc-and-broadcom-report/)
