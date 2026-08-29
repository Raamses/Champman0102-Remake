# Multiplayer Architecture — P2P + Minimal Relay (v2, cost-revised)

**Status:** DRAFT v2 — proposed by AmosBot, 2026-08-29
**Supersedes:** v1 (Cloud Functions + Firestore) — too expensive for a side project
**Incorporates:** AGy's play-by-mail suggestion, Ram's P2P suggestion

## Philosophy: Match the Original Game

CM01/02's network play was P2P: one player hosted, others joined via IP (or Hamachi for internet). The host's machine was authoritative. No server. This is the right model for a side project.

## Architecture: Host-Authoritative P2P + Lightweight Relay

```
┌─────────────────────────────────────────────┐
│  Host (PWA, one player's browser)            │
│  - Authoritative match simulation             │
│  - Authoritative transfer resolution           │
│  - Holds the canonical league state           │
│  - Uses WebRTC DataChannel to peers           │
└──────────────┬──────────────────────────────┘
               │ WebRTC (P2P, no server cost)
┌──────────────▼──────────────────────────────┐
│  Peers (other players' browsers)              │
│  - Send actions (tactics, transfers, continue)│
│  - Receive match results + league updates      │
│  - Optimistic local UI, host is truth          │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│  Signaling Server (minimal, free tier)        │
│  - WebRTC signaling only (match peers)         │
│  - Can be: free PubNub, Firebase, or even       │
│    a simple WebSocket relay on the Pi          │
│  - NOT in the data path during gameplay        │
│  - Cost: $0 (free tiers handle signaling)     │
└──────────────────────────────────────────────┘
```

## How It Works

### Match Simulation
- Host simulates all matches (authoritative)
- Peers send "Continue" when ready
- Host simulates the week, broadcasts results via DataChannel
- No server computation needed — host's browser does the work

### Transfers
- Peer sends bid to host via DataChannel
- Host resolves sequentially (first-come-first-served, or deadline-based)
- Host broadcasts updated transfer list
- No race conditions — host is single-threaded for game logic

### Async Play (AGy's play-by-mail suggestion)
- Don't require everyone online simultaneously
- Host holds the week open until all peers send "Continue"
- If someone is AWOL, host can force-sim after a timeout
- This matches how the original CM01/02 network game worked

### Save/Resume
- Host saves league state to IndexedDB
- If host disconnects, any peer can become host (state was broadcast)
- Reconnect via signaling server, resume from last synced state

## What You Need from a Server (Bare Minimum)

| Function | Purpose | Cost |
|----------|---------|------|
| WebRTC signaling | Peer discovery + connection setup | $0 (free PubNub/Firebase/PI WebSocket) |
| NAT traversal (STUN) | P2P connection through routers | $0 (Google's free STUN servers) |
| TURN (fallback) | Relay if P2P fails (symmetric NAT) | ~$0 with free Coturn on Pi, or Twilio's free tier |

**Total server cost: $0.** The Pi can run the signaling relay if needed. No Cloud Functions, no Firestore reads/writes per match, no per-action server calls.

## What We Drop from v1

- Firebase Auth → use a simple "enter your name" for P2P (trust-based, like the original)
- Firestore → not needed at all for P2P
- Cloud Functions → not needed, host is authoritative
- Security rules → P2P among friends, not public matchmaking

## Optional: Analytics + Version Updates (Minimal Server)

If you want crash reports or "new version available" notifications:
- One Cloud Function endpoint: `POST /crash` → writes to Firestore (1 write/crash, negligible cost)
- Version check: static JSON file on GitHub Pages (free) with latest version number
- That's it. No game state on any server.

## When You'd Need a Real Server (Later)

Only if you want:
- Public matchmaking with strangers (need auth + anti-cheat)
- Persistent online leagues that survive all players being offline
- Ranked/competitive play

For a side project with friends, P2P is the right answer. Ship this, add server later only if needed.