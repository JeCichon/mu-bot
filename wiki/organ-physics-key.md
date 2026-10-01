# Trickno · Organ — Physics Key
*The simple, complete reference. Last settled: Oct 2026. Carry this into every chat touching the Organ's physics.*

---

## The picture underneath all of it

Each card is a **hyperdimensional square** — built by a scientist, carrying one element to be understood. In the Organ, striking a card's space sends an **electrical charge**, sized by the velocity slider, into that element — modeled like a **piano hammer strike**. The goal isn't just to make sounds. It's to build a system logical enough that it makes *discoveries* — strange, true things about sound that nobody put there on purpose.

Two readings of the same object, always both true at once:
- *"This particle obeys Maxwell's equations."*
- *"This particle belongs to Fire."*

---

## 1. Color = identity, read two ways

| Reading | Source | Meaning |
|---|---|---|
| **CMYK → FRTVI** | subtractive, matter | intrinsic identity — what the particle **is** |
| **RGB → dynamic state** | additive, spirit | observed state — what the particle **is doing** |

**FRTVI** = Force · Resistance · Terminal Velocity · Inertia — the envelope:

| FRTVI | Audio role | Meaning |
|---|---|---|
| Force | Attack | the push at trigger — the hammer strike |
| Resistance | Decay | fluid drag opposing motion |
| Terminal Velocity | Sustain | equilibrium where drive = drag |
| Inertia | Release | momentum carrying on after the force stops |

CMYK↔ADSR (C=Attack, M=Decay, Y=Sustain, K=Release) is kept for now. Origin: both had four slots — not yet confirmed as deep. Still undecided whether it stays.

---

## 2. Suits = Platonic solids = drag coefficients

| Suit | Solid | Cd (drag) |
|---|---|---|
| Wands / Fire | Tetrahedron | ≈ 0.55 |
| Cups / Water | Icosahedron | ≈ 0.45 |
| Swords / Air | Octahedron | ≈ 0.50 |
| Disks / Earth | Hexahedron (Cube) | ≈ 1.05 |
| Major / Aether | Dodecahedron | ≈ 0.48 |

A shape having both a drag coefficient *and* a volume (next section) is not a conflict — same way an object has both a weight and a height.

---

## 3. Mass — settled, and it's exact

```
value = max(r, g, b) / 255        (HSV Value / brightness)
mass  = 1 - value
```

This is **identical to K** (Key/Black) in the existing CMYK ontology. Black → mass 1 (ceiling). White → mass 0. Mass itself never exceeds 1 — it does not go to infinity (density does, see below).

---

## 4. Volume — the sphere model (confirmed, not the edge or cube model)

```
dist  = distance of (r,g,b) from (0,0,0)
R     = dist / (255·√3)           → the sphere's radius, 0 to 1
aSuit = R × (unitEdgeLen / unitCircumradius)   → this suit's solid, scaled so its
                                                  corners sit exactly on that sphere
volume = k × aSuit³
```

| Suit | Solid | k (volume coefficient) | Fills its sphere | Negative space |
|---|---|---|---|---|
| Wands | Tetrahedron | √2⁄12 | 12.3% | 87.7% |
| Swords | Octahedron | √2⁄3 | 31.8% | 68.2% |
| Disks | Cube | 1 | 36.8% | 63.2% |
| Cups | Icosahedron | 5(3+√5)⁄12 | 60.5% | 39.5% |
| Major | Dodecahedron | (15+7√5)⁄4 | 66.5% | 33.5% |

Why sphere, not edge-length or cube: it's the one true form each solid simplifies. Every suit becomes legible by its vertex count and placement alone. It compresses the density spread between densest (Wands) and least dense (Major) from ~65× (edge model) down to ~5.4× (sphere model) — same order, gentler curve.

**Open, not urgent:** the curved gaps between a solid's flat faces and the sphere (noted, not resolved). The "negative space" — sphere volume the suit's solid doesn't use — is felt to deserve its own meaning eventually; not solved yet.

## 5. Density

```
density = mass / volume
```

The *only* place infinity appears — and only at pure black, where mass climbs to its ceiling (1) at the same moment volume collapses toward 0. Mass alone is never infinite. Near white, density collapses toward 0 (big volume, vanishing mass).

---

## 6. Gravity — Galileo's rule stays intact, and it's now built

Gravity pulls everything at the same rate regardless of mass. A heavy (dark) and light (bright) card dropped together hit the floor together — Jupiter's preset doesn't care what's falling. What mass *does* change, wired into `tarot_sequencer.html` as of Oct 2026:

- **Force needed to lift off** — a heavy card needs a harder strike to reach full peak amplitude against a given planet's pull. A weak strike on a heavy card gets visibly held down; a hard strike mostly overcomes it. (`liftRatio = strikeForce/(strikeForce+liftCost)`, `liftCost = mass·gNorm·(depth/100)·GRAV_LIFT_K`)
- **Inertia (release) — heavier resists stopping longer, independent of which planet it's on** (inertia is the particle's own property, not the field's). (`R *= 1 + mass·GRAV_INERTIA_K`)

Both gated by the existing Physics Engine + per-channel Gravity toggle (both default OFF) — zero effect on any existing song unless a channel explicitly turns both on. Tuning constants: `GRAV_LIFT_K = 0.6`, `GRAV_INERTIA_K = 1.2` — live in `tarot_sequencer.html` just above `scheduleCardNote`, documented in-line there.

Mass does **not** enter the existing TV equation this round — `TV = sqrt(2F/ρCdA)` is untouched; F stays the Force/attack parameter it already is. Real mass folding into a literal terminal-velocity-under-gravity equation is a future step, not this one.

**PE = mgh — what "h" is:** h is tied to the **strike velocity** — how hard the hammer hits sets how high the particle's excited, same way a note struck harder rings louder/brighter. In the code, the note's `vol` parameter (channel volume × step velocity) stands in for strike force directly. Mass (real, from color) and g (the planet preset) then set how much energy that height actually represents. Sound is a separate, simplified mapping layered on top (MIDI-style) — the physics underneath stays literal; how it's heard stays simple by choice.

---

## 7. Semantic layer — stays separate

Card text → embeddings → PCA → 2D plot → cosine-similarity "nearest cards." Color there is a visual anchor only, not meaning. **Not merged** with the physical space above, and not meant to be forced together via a shared mechanism like gravity — if both systems are built well, they may simply illuminate each other side by side, the way two instruments in different keys still make sense played together.

Gravity-as-meaning was ruled out *only* in this semantic system — never in the Organ's own sound physics, where it's fully load-bearing (see §6). The already-shipped mixer effect literally named "Gravity" (per-channel sustain-pull, defaults to 9.81) is a different, unrelated thing — keep the names separate so they don't conflate.

---

## 8. Current build scope

**Done:** real mass (= K) wired into Gravity Layer 1 — Force (lift-off cost) and Inertia (release resistance), across the planetary presets (Moon/Mars/Earth/Jupiter/Sun).

**Deliberately out of scope for now:** Gravity Layer 2 (pitch/pan), Layer 3 (point-source gravity well), bounce/restitution (`vy = -vy × e`), buoyancy (floating/sinking sounds by density — a good illustrative example, not a build target yet), re-deriving TV to directly include mass.

---

## Constants
- Air density ρ = 1.225 kg/m³ (sea level)
- Earth gravity = 9.81 m/s²
- Peak volumes: 0.70×vol (FRTVI off) · 0.90×vol (FRTVI on)
- Mass/gravity tuning (new): `GRAV_LIFT_K = 0.6`, `GRAV_INERTIA_K = 1.2`
