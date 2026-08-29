# ChampMan 01/02 Remake — Counsel Review (4th pass)

**Date:** 2026-08-29 23:16
**Reviewers:** Gemini 3.1 Pro (via agy) + NVIDIA Nemotron 3 Ultra (via OpenRouter free tier)
**Context:** Ram asked for a counsel review using Claude + a free OpenRouter rung. Claude's OAuth expired, so we used agy (Gemini) + Nemotron free. Both reviewed the full docket: plan v1 + Gemini review + AmosBot review + .dat format notes + match engine redesign + P2P multiplayer architecture.

---

## Gemini 3.1 Pro (agy) — 4th Review

### What All Three Reviewers Missed
**Mobile Background Execution Limits.** PWAs are aggressively suspended by iOS/Android when the user switches apps or locks screen. If you rely on background simulation, the OS will freeze the thread, breaking the simulation loop.

### P2P Host-Authoritative WebRTC for PWA?
**No, it is highly brittle.** If the "host" switches apps to answer a text, the OS suspends their PWA. The WebRTC connection will instantly drop, freezing the game for all connected peers. For mobile-friendly PWA, you need a cheap centralized state server ($5 VPS) or a purely asynchronous architecture.

### 4-Week MVP Realistic?
**No, extremely optimistic.** Even scoped down to "One League, No Transfers, Hardcoded JSON," building a state machine, UI, and a seeded PRNG match engine that feels authentic takes longer than 4 weeks for a side project. Budget 8-12 weeks for a playable MVP to avoid burnout.

### Legal/IP with .dat Files
Writing a parser is legal under reverse-engineering interoperability exemptions. However, **distributing** the original `.dat` files (or a JSON conversion of them) is a massive copyright risk, as Sega/Sports Interactive owns the compilation rights. The PWA must operate as "Bring Your Own Data" (BYOD) — user supplies their own legally acquired `.dat` file.

### Rust→WASM vs Python/TS?
**No.** For a side project, Rust→WASM introduces unnecessary toolchain friction. A pure TypeScript parser using `DataView` and `ArrayBuffer` can parse a 50MB binary file in milliseconds in the browser. For MVP, a local Python script to pre-convert is the fastest route.

### One Thing Differently
**Use SQLite-WASM (with OPFS persistence) instead of in-memory state.** Don't hold 50,000 players in Zustand/IndexedDB. CM is essentially a massive relational database. SQLite-WASM lets you run complex scouting/transfer/history queries instantly without memory bloat.

---

## NVIDIA Nemotron 3 Ultra (OpenRouter free) — 4th Review

### What All Three Missed
1. **iOS PWA reality:** Safari caps IndexedDB at ~50MB unless user "Adds to Home Screen" *and* engages repeatedly. 10-15MB save fits, but match replay storage breaks this.
2. **Community data is legally toxic:** `.dat` packs with 2024/25 rosters are unauthorized derivative works of SI/SEGA IP. Building a parser is likely legal; distributing/facilitating updated rosters is not. None addressed C&D risk.
3. **WASM/JS float determinism:** Seeded PRNG sync across host/peer P2P requires *bit-identical* simulation. Rust `f64` vs JS `number` transcendental ops (sin, sqrt, log) diverge. Deterministic multiplayer will desync on first `Math.sin()` call.
4. **Save migration strategy:** Zero plan for schema evolution. You will change the data model — how do v1 saves load in v3?
5. **`player_setup.cfg` integration:** Starting loans/injuries/retirements live here, not `.dat`. Parser must merge both sources.
6. **International job system:** Plan mentions World Cup but not the core loop: apply for jobs → pick squad → friendlies → qualifiers. This is half the game.
7. **Accessibility:** Text-commentary-only is a screen reader nightmare. No a11y consideration.

### P2P WebRTC in PWA?
**Technically sound, operationally fragile.** iOS throttles background tabs → host simulation pauses when user switches apps. ~15% connections need TURN relay. Free TURN is unreliable; self-hosted Coturn on Pi costs ~$5/mo bandwidth. Not "free." Works for friend groups who stay tab-active. Fails for "play on the bus."

### 4-Week MVP?
**No.** Honest breakdown:
- `.dat` spike + parser: 2 weeks
- Match engine (chance creation + conversion + tactics + stamina): 2 weeks
- UI + Zustand + IndexedDB + PWA shell: 1.5 weeks
- Single-league season loop + save/load: 1.5 weeks
- **Total: 7 weeks minimum** for a playable, non-embarrassing MVP.
- 4 weeks only if you hardcode one team, dummy match engine, and skip parser (use static JSON).

### Legal/IP with .dat Files
**High risk.** Format reverse-engineering: likely legal (clean room, interoperability). Community roster packs: unauthorized derivative works. Ship with BYOD approach — minimal public-domain dataset, user supplies own `.dat`.

### Rust→WASM vs Python/TS?
Skip WASM entirely for MVP. Python converter → JSON → ship. Add WASM later only if runtime parsing is needed.

### One Thing Differently
**SQLite-WASM with OPFS persistence.** Treat the browser like a backend server. Complex queries without memory bloat.

---

## AmosBot Synthesis — What the Counsel Changes

Both counsel reviewers converge on five new points that modify the plan:

1. **P2P WebRTC is fragile on mobile** — host's PWA gets suspended by iOS/Android when backgrounded. This breaks the "host-authoritative" model. **Fix:** Either (a) document "host must stay foreground" as a limitation (acceptable for friends playing at home), or (b) use async play-by-mail where host only simulates when all peers have submitted "Continue" — host opens app, sims, broadcasts, closes. This matches the original CM01/02 network game behavior.

2. **4-week MVP is unrealistic — budget 7-8 weeks.** Both reviewers independently said 4 weeks is too optimistic. Revise to 7-8 weeks for a side project with day jobs.

3. **Legal: BYOD approach is mandatory.** Ship with a minimal public-domain sample dataset. User supplies their own `.dat` file. No in-app downloader, no bundled rosters. Parser is legal; distribution of data is not.

4. **Skip Rust→WASM for MVP.** Both reviewers said WASM is overkill for a side project. Python script converts `.dat` → JSON offline. Game reads JSON. Add WASM later only if runtime parsing is needed. This also avoids the float determinism issue (no Rust↔JS cross-arch RNG needed if everything is TS).

5. **SQLite-WASM + OPFS for storage.** Both reviewers independently suggested this. Don't hold 50K players in Zustand. Use SQLite-WASM as the in-browser database with OPFS persistence. This solves the IndexedDB volatility issue (OPFS is more durable) and enables complex scouting queries.

### Updated Action Items (add to the original 12)

| # | Priority | Action | Source |
|---|----------|--------|--------|
| 13 | CRITICAL | BYOD: ship with sample dataset, user supplies .dat file. No bundled rosters. | Both counsel |
| 14 | CRITICAL | Revise MVP timeline from 4 weeks to 7-8 weeks | Both counsel |
| 15 | IMPORTANT | Use SQLite-WASM + OPFS for storage, not Zustand+IndexedDB | Both counsel |
| 16 | IMPORTANT | Skip Rust→WASM for MVP. Python .dat→JSON converter. Add WASM later if needed. | Both counsel |
| 17 | IMPORTANT | Document P2P limitation: host must stay foreground on mobile. Async play-by-mail is the fallback. | Gemini counsel |
| 18 | IMPORTANT | Add save migration strategy — versioned schema, migration functions | Nemotron counsel |
| 19 | NICE | Merge `player_setup.cfg` with .dat data (starting injuries/loans/retirements) | Nemotron counsel |
| 20 | NICE | Add international job system to roadmap (apply → squad → friendlies → qualifiers) | Nemotron counsel |