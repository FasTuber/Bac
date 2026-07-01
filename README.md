# BacMate — Antrenorul tău AI pentru BAC-ul la Matematică

Platformă web **complet funcțională** pentru pregătirea la examenul de **Bacalaureat la Matematică** (România), construită după conceptul [algebo.ai](https://algebo.ai/) și îmbunătățită pe baza unei analize de piață și competitori.

> **Propunere de valoare:** platformele clasice îți dau răspunsul; BacMate te face să-l înțelegi — cu un tutore AI socratic, exerciții pas cu pas verificate determinist, simulări corectate pe baremul oficial și un plan personalizat care prioritizează exact capitolele care îți strică nota.

---

## ✨ Funcționalități

| Funcție | Descriere |
|---|---|
| **Tutore AI socratic 24/7** | Te ghidează cu întrebări (nu îți dă rezolvarea gata), localizat pe notația și baremul românesc. Rulează pe Claude; **fallback offline** complet funcțional fără cheie API. |
| **Exerciții pas cu pas** | Pe profil (M1–M4), cu hint-uri progresive, rezolvare completă și **verificare deterministă** a răspunsului (numeric + simbolic, prin `mathjs`) — nu doar „pare corect”. |
| **Simulator BAC** | Examen complet (3 subiecte × 6 itemi), **cronometrat 3h**, **corectat automat pe baremul oficial** (+10 puncte din oficiu), cu feedback pe fiecare item. |
| **Mastery & plan personalizat** | Motor de mastery (rule-based EWMA) care urmărește stăpânirea pe fiecare temă și recomandă ce să exersezi. |
| **Notă BAC estimată** | Estimează nota din nivelul de mastery, cu interval de încredere și comparație cu ținta ta. |
| **Repetiție spațiată** | Fișe de memorat pentru formule/teoreme (algoritm **SM-2**). |
| **Temă light/dark** | Design system propriu, responsive, accesibil. |

---

## 🧱 Stack tehnic

- **Next.js 16** (App Router, Turbopack) + **React 19.2** + **TypeScript**
- **TailwindCSS v4** (design tokens în CSS, dark mode pe clasă)
- **Prisma 7** + **SQLite** (driver adapter `better-sqlite3`) — portabil, swap ușor pe Postgres
- **Claude API** (`@anthropic-ai/sdk`) pentru tutore — cu fallback offline
- **KaTeX** + `react-markdown` + `remark-math` + `rehype-katex` pentru matematică
- **Autentificare** proprie: `jose` (JWT în cookie httpOnly) + `bcryptjs`
- **`mathjs`** — stratul determinist de verificare a calculului
- **`zod`** — validare

---

## 🚀 Pornire rapidă

```bash
# 1. Instalează dependențele
npm install

# 2. Creează baza de date + clientul Prisma
npx prisma migrate dev

# 3. Populează conținutul (curriculum BAC M1, exerciții, simulare)
npm run db:seed

# 4. Pornește în development
npm run dev          # http://localhost:3000
```

Pentru un build de producție:

```bash
npm run build
npm run start
```

### Teste

Logica de domeniu (verificatorul de calcul, SM-2, mastery, estimarea notei, scoringul pe barem, nivelurile) e acoperită de teste unitare Vitest:

```bash
npm test           # rulează suita (18 teste)
npm run test:watch # mod watch
```

### Variabile de mediu (`.env`)

```bash
DATABASE_URL="file:./dev.db"      # baza de date SQLite
AUTH_SECRET="<secret aleator>"     # semnarea sesiunilor JWT
# ANTHROPIC_API_KEY="sk-ant-..."   # OPȚIONAL: activează tutorele AI (altfel: mod offline)
# AI_MODEL="claude-sonnet-4-6"     # opțional: modelul folosit de tutore
```

> Fără `ANTHROPIC_API_KEY`, tutorele rulează în **mod offline** (ghidare socratică din indiciile exercițiilor) — platforma e 100% funcțională și fără cheie.

---

## 📁 Structura proiectului

```
src/
  app/
    (auth)/            login, register (layout split brand/formular)
    (app)/             zona autentificată (dashboard, invata, exercitii, tutore, simulare, progres)
    onboarding/        alegere profil + notă țintă
    api/               auth, onboarding, exercise attempt, tutor, simulation submit
  components/
    ui/                Button, Card, Input, Badge, Progress
    Math, MarkdownMath renderere LaTeX (KaTeX)
    app/ auth/ onboarding/ practice/ tutor/ sim/ learn/ ...
  lib/
    auth/              parole (bcrypt) + sesiuni (jose JWT)
    domain/            mastery, srs (SM-2), grade, mathcheck, scoring
    ai/                client Claude + tutore socratic (cu fallback offline)
    db.ts content.ts validation.ts utils.ts
  generated/prisma/    client Prisma generat
prisma/
  schema.prisma        15 modele (User, Chapter, Topic, Lesson, Exercise, Attempt,
                       MasteryState, Concept, SrsCard, Simulation, SimulationItem,
                       SimAttempt, SimItemAnswer, ChatSession, ChatMessage)
  seed.mts             curriculum BAC M1 + simulare completă
```

---

## 🧠 Decizii de arhitectură (pe baza cercetării)

- **Tutore = LLM + verificare deterministă.** LLM-urile greșesc la aritmetică (cf. Khan Academy), așa că răspunsurile se verifică separat cu `mathjs` (egalitate numerică + simbolică prin eșantionare).
- **Mastery scalat pe etape.** Rule-based (EWMA) la MVP; se poate înlocui cu BKT/IRT la ~500 elevi și DKT peste ~50.000 secvențe.
- **Metoda socratică** (stil Khanmigo): tutorele reține răspunsul și ghidează — diferențiator față de solverele clasice (Photomath/Mathway).
- **Corectare pe baremul oficial RO** (structură M1/M2: 3 subiecte × 30p + 10p din oficiu).

Analiza completă de piață și competitori: `../bacmate-CERCETARE.md`.

---

## 🔌 API (rezumat)

| Rută | Metodă | Rol |
|---|---|---|
| `/api/auth/register` `/login` `/logout` | POST | autentificare (cookie sesiune) |
| `/api/onboarding` | POST | setează profil + notă țintă |
| `/api/exercise/[id]/attempt` | POST | corectează un exercițiu + actualizează mastery |
| `/api/tutor` | POST | mesaj către tutorele AI (cu context exercițiu) |
| `/api/simulation/[slug]/submit` | POST | corectează o simulare pe barem |

---

*Proiect educațional. Făcut cu ❤ pentru elevii de BAC.*
