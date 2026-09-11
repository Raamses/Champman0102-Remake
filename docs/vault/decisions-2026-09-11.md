# Decisions — 2026-09-11 (Ram, via Telegram group)

**Status:** Decisions locked. Supersedes conflicting rows in plan-v2 and the open items in `docs/vault/reviews/creative-decisions-verdict.md` (F6/H05, F8, F11/H16). Feeds plan v3 (CM-R10).

---

## 1. Storage — RESOLVED: in-memory + IndexedDB, end-of-turn writes (D3 / F6 / H05)

Walk back plan-v2's SQLite-WASM/OPFS choice. Ram's requirement locks the model the original games used:

- **End-of-turn write:** the full game state is written to disk when the turn ends (match day / "Continue"), exactly like CM01/02's save behavior. Not streaming, not live relational persistence.
- **Why this kills SQLite-WASM for MVP:** SQLite's superpower is random-access querying, which only matters if data is NOT held in memory. With a RAM-resident database + end-of-turn full-state dumps, a live SQL engine adds worker + COOP/COEP + OPFS complexity for no benefit at MVP scope. (The audit's P0-2 fix stays on record as the repair path if SQLite is ever adopted.)
- **Working set:** compact struct-of-arrays typed buffers for .dat data (est. 10–20MB — to be measured in CM-R03, D16) + JS game state. Struct-of-arrays parsing avoids D1's 242k-object allocation blowup entirely.
- **Persistence:** transactional full-state write to IndexedDB at turn end; rotate an autosave slot (previous turn preserved) + manual save slots (the old save-slot feel); `navigator.storage.persist()` + export-save-to-file button (H14 mitigation, iOS eviction).
- **Zustand:** UI-state only — unchanged from plan v2.
- **Hosting:** GitHub Pages stays. The COOP/COEP limitation only existed for SQLite-WASM/OPFS; with in-memory + IndexedDB, Pages serves the app as-is. A Pi-hosted origin (Tailscale) remains an easy option later.
- **SQLite-WASM:** documented Phase-2 upgrade path only, if heavy cross-database querying is ever needed.
- **CM-R03 falsification tests still run:** heap + filter-latency on real retail data validate the typed-buffer approach before CM-012 design.

## 2. Name — "Injury Time" (F8)

Ram's pick, 2026-09-11. Vetted by search: no existing game/app carries the title (referee utility apps use different names; the term is a common match mechanic, not a brand).

- "Championship Royale" is retired along with the cyberpunk theme (design-pass P1: it alienates the nostalgic demographic this game is for).
- Pending before branding: USPTO/EUIPO + app-store clearance pass; GitHub repo rename is Ram's button.

## 3. Timeline — no ship date, quality-first (F11 / H16)

Side project; Ram: "ship date isn't a thing… I want it to be good. I used to love playing this."

- Plan v3 (CM-R10) replaces date-based milestones with milestone-based progression: Exhibition Match → Career MVP → Competitions.
- No scope-cut forced by calendar. Sustainable pace; the CM-R03 calibration work stays in.
- **First-class use case (Ram's stated dream): playing on mobile against a friend, like the old network CM days.** Consequences for plan v3:
  - Mobile PWA experience is day-one (CM-R08 already covers this).
  - Hot-seat exhibition (pass-and-play on one phone) is a near-free early win — pure state handoff, zero netcode; propose for Phase 1/2 boundary.
  - Remote play-vs-a-friend follows the host-authoritative + async play-by-mail design in `architecture/multiplayer.md` — the end-of-turn serializable state model above is exactly what makes that cheap.

## Process notes

- PR #6 (CM-010 scaffold cleanup) closed as superseded by PR #8 (scaffold rebuild, merged 2026-09-11T20:12Z).
- Security carry-over: the deleted `firebase-applet-config.json` API key remains in git history — rotate in the Firebase console (Ram); history scrub optional after.