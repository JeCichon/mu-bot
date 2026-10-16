# Trickno · Organ — Physics Key
*Vocabulary and functions. The chain from card to sound. Last settled: Oct 16, 2026. This is the only copy.*

Status tags used throughout: **BUILT** (in organ.html) · **READING** (built as a readout; does not change the sound) · **AGREED** (decided, not built) · **PARKED** (later, on purpose) · **OPEN** (undecided) · **WEDGED** (hand-picked mapping, not derived from an equation).

---

## Principles
1. **Physics as accurate as possible inside the dream.** When a real law and a convenient shortcut disagree, the law wins. Shortcuts are labelled WEDGED.
2. **Two readings of one object, both true at once:** "this particle obeys Maxwell's equations" and "this particle belongs to Fire."
3. **Gravity does gravity; atmosphere does atmosphere.** Gravity accelerates everything equally. Drag and buoyancy come from the atmosphere (air density ρ; 0 = vacuum). Galileo's falling-together is simply the ρ = 0 case, not a separate rule.
4. **Every audio change is opt-in, default OFF.** Existing songs keep their sound.
5. **A color is one vector, not three filters.** R, G, B are not separate knobs.
6. **Emphasize mass, volume, density and shape first.** The color-vector readings (length, tilt, spin) come second, and do nothing yet.

---

## The chain (zoomed out)

```
CARD  (suit · number · step)
  │
  ▼
EFFECTIVE COLOR  (r,g,b — after the channel gradient)
  │
  ├──► COLOR VECTOR  (line from black to the color)                        READING
  │      ├─ length ──► radius ──► VOLUME
  │      ├─ tilt   ──► how far off the gray diagonal
  │      └─ spin   ──► direction (= hue)
  │
  ├──► HEIGHT ON THE GRAY DIAGONAL = mean(r,g,b)/255 ──► MASS              BUILT
  ├──► MASS ÷ VOLUME ──► DENSITY                                           READING
  ├──► CMYK ──► envelope seeds  (C Attack · M Decay · Y Sustain · K Release)
  └──► HUE + LIGHTNESS ──► PITCH  (pitch class + octave)

SUIT ──► SHAPE (Platonic solid ──► Cd, k, corners)                         READING
     └─► MATERIAL FAMILY  (resonance · damping · excitation · harmonics)   PARKED

STRIKE  (the organ's charge = step velocity × channel volume)
  │
  ▼
ENERGY INTO PARTICLE ──► MOMENTUM p = √(KE² + 2·KE·m·c²)/c             READING
  │      (matter → Newton · mass 0 → light, p = KE/c · speed never passes c)
  ├──► FORCE = Δp ÷ Δt   (Δt = the attack time; F = m·Δv/Δt for matter)    READING
  └──► HEIGHT  (lift)                                                      AGREED
  │
  ▼
PARTICLE RESPONDS
  ├─ envelope     CMYK seeds + FRTVI sliders  (blend · opacity)            BUILT
  ├─ gravity      pulls sustain down; mass raises lift cost, stretches release   BUILT
  ├─ atmosphere   drag + buoyancy; terminal velocity from the equation     AGREED
  └─ vector       length · tilt · spin: assignable to controls, later      OPEN
  │
  ▼
SOUND  (pitch · suit waveform · gain curve · pan)
```

**Dollars and cents.** Mass = K + cents. **K** = `1 − max(r,g,b)/255` is the whole dollar: the weight a color is guaranteed from how far it sits from white. The **cents** = `max − mean` are the extra weight saturation adds, the texture of the mass. Pure grays have no cents. K stays the CMYK reading (and Inertia's envelope slot); mass is the diagonal height, and mass ≥ K always.

---

## Vocabulary

**Particle and color**
| Term | Meaning | Status |
|---|---|---|
| Sound particle | One triggered card note | BUILT |
| Effective color | The card's color at that step, after the channel gradient | BUILT |
| Color vector | Line from black (0,0,0) to the effective color | READING |
| Length | Vector length as a 0–1 sphere radius: distance from black ÷ 441.7. Scales the shape. Any further job undecided | READING |
| Tilt | Angle between the vector and the gray diagonal, in degrees. 0° = pure gray. Black has none | READING |
| Spin | Angle around the gray diagonal, 0–360°. Red 0 · yellow 60 · green 120 · cyan 180 · blue 240 · magenta 300. Pure grays have none. Within ~1.1° of ordinary HSV hue everywhere | READING |
| CMYK reading | Subtractive, matter: what the particle **is** | BUILT |
| RGB reading | Additive, spirit: what the particle is **doing** | AGREED |

**Properties**
| Term | Meaning | Status |
|---|---|---|
| Mass | `1 − mean(r,g,b)/255`, the height down the gray diagonal. Black 1, white 0 (only white; deck has 1 zero-mass card, 56 distinct masses) | BUILT (shapes Gravity) |
| K | `1 − max(r,g,b)/255`. The whole-dollar part of mass; the CMYK black. `mass = K + cents` | BUILT |
| Cents | `max − mean`. The extra mass from saturation | READING |
| Volume | `k × (R / circ)³`, sphere model. Unit sphere: radius 1 at white. Biggest possible = white Major, 2.785 | READING |
| Density | `mass ÷ volume`. Infinite at pure black, 0 at white | READING |
| Shape | The suit's Platonic solid, with its corner count, Cd and how much of its sphere it fills | READING |
| Cd | Drag coefficient of the shape | AGREED |
| Material | Suit's material family | PARKED |

**Forces and envelope**
| Term | Meaning | Status |
|---|---|---|
| Strike | The organ's charge into the particle, like a piano hammer. Size = `vol` (velocity × channel volume) | BUILT |
| Strike energy (KE) | Energy the strike delivers, from `vol`, floor 0.05 | BUILT (feeds Gravity lift) · READING |
| c | The organ's speed of light. `c² = 1000` organ units, a tuning constant. Nothing moves faster | READING |
| Momentum (p) | `√(KE² + 2·KE·m·c²) / c`. One equation for matter and light | READING |
| Δt | The Attack slider. How long the organ takes to push the particle (ms). Replaces the old "Force" label | BUILT (label) |
| Force (F) | **Derived, not a control.** `F = Δp ÷ Δt`. For matter `F = m·Δv/Δt`; for light `F = E/(c·Δt)`. Shown in the FRTVI pane and the Physics table | READING |
| Regime | Matter-like (v ≪ c) or light-like (v/c ≥ 0.5). White is light; the rest of the deck is matter | READING |
| Height | How high the strike lifts the particle. In vacuum `h = E/(mg)` | AGREED |
| Gravity (g) | Same acceleration for everything. Presets Moon / Mars / Earth / Jupiter / Sun | BUILT |
| Atmosphere (ρ) | Air density. Moon ≈ none · Mars ≈ 0.02 · Earth 1.225 kg/m³ | AGREED |
| Drag | `F = ½ρ·Cd·A·v²` | AGREED |
| Resistance | Decay. Fluid drag opposing motion | BUILT |
| Terminal Velocity | Sustain. Where drive = drag. `TV = sqrt(2F / ρCdA)` | BUILT as a slider · equation AGREED |
| Inertia | Release. Momentum after the drive stops | BUILT |
| Lift cost | What mass and gravity charge the strike: `mass · gNorm · depth · 0.6` | BUILT (tuning constant) |
| Release stretch | Heavier rings longer: `R × (1 + mass · 1.2)` | BUILT (tuning constant) |
| Sag | Gravity pulling the sustain down: `gNorm · depth · 0.22` | BUILT, WEDGED |
| Opacity | FRTVI strength. 100% = full blend · 0% = exactly as if FRTVI were off | BUILT |
| Blend | How FRTVI mixes with the card's own envelope: normal / multiply / screen / overlay | BUILT |
| Physics Engine | Master switch for physics. Its pane shows each card's particle readout | BUILT |

**Interface**
Effects Lab (button + list) · effect tile · pane · graph · particle readout · **+** add · **×** remove.

---

## Functions (the machine's parts)
| Stage | Function | Does | Status |
|---|---|---|---|
| Color | `getEffectiveColor(track,n,si,stepCount)` | card + step → color after gradient | BUILT |
| Color | `toCMYK(r,g,b)` | color → C, M, Y, K | BUILT |
| Mass | `cardMass(col)` | `1 − mean(r,g,b)/255` | BUILT |
| Strike | `strikeKinematics(col,vol,channel)` | → mass, KE, momentum p, v/c, Δt (the real attack), Force, light/matter | READING |
| Vector | `colorVector(col)` | → length (0–1), tilt, spin | READING |
| Volume | `particleVolume(col,suit)` | sphere model → volume of the suit's solid | READING |
| Particle | `particleProps(col,suit)` | → mass, volume, density, length, tilt, spin, shape | READING |
| Shape | `SUIT_SOLID` | per suit: solid name, corners, Cd, k, circumradius | READING |
| Pitch | `activeRgbToFreq` → `rgbToFreq` / `rgbToFreqMultiOctave` | hue → pitch class, lightness → octave → Hz | BUILT |
| Envelope | `getCmykAdsr(col)` | CMYK → the card's own envelope (FRTVI on) | BUILT |
| Envelope | `blendAdsr(cmyk,user,mode)` | card's envelope × the four sliders | BUILT |
| **Shape** | `noteShape(col,vol,channel,force)` | **the one envelope calculation**: opacity, blend, gravity, RGB wedge | BUILT |
| Shape | `noteGainPoints(s,dur,t0)` | shape → four `[time, gain]` points | BUILT |
| Play | `scheduleCardNote(...)` | plays those points | BUILT |
| Graphs | `buildFxGraph(channel,ci,kind)` | draws from `noteShape`, so the picture is the sound | BUILT |
| Readout | `fxBlockParticle(channel,ci)` | the Physics Engine pane's per-card table (particle · strike · color vector) | READING |
| Readout | `fxBlockFrtvi` force line | the FRTVI pane's Force range across the channel's cards | READING |
| Safety | `ensureFx(channel)` | fills missing settings so old songs still load | BUILT |
| Strike | strike → energy → height; atmosphere; drag; terminal velocity | | AGREED |

---

## Status board

**BUILT**
Color → pitch · suit → waveform · CMYK → envelope · FRTVI sliders, blend, opacity · mass in Gravity (lift cost, release stretch) · Gravity sag (WEDGED) · Physics Engine switch · RGB Particle (WEDGED: R → peak, B → sustain, G → pan, and the pan part never reached the sound) · Effects Lab with + / × · live graphs · Physics Engine readout (mass, volume, density, shape, Δt, Force, regime, length, tilt, spin per card) · Attack relabelled Δt.

**AGREED, not built**
- Strike → height; atmosphere per planet preset; drag and buoyancy; terminal velocity from the equation.
- Old RGB Particle stays until its replacement has been heard, then retires.
- Particle cloud with voices is an **effect**, later, outside the Physics Engine.

**Direction, not decided**
- Length, tilt and spin do nothing yet, not even pan. Later they may become controls the **user** assigns to whatever they want each to drive.

**PARKED**
Material (list to be pulled from the cards) · striker (surface area, hardness) and ADSR labels in front · cutoff / resonance / modulation as offsets from the card's material · photon energy (E = h·f from pitch; white stays on strike energy for now) · Planck-scale constants · Gravity layers 2 and 3 · bounce `vy = −vy·e`.

**OPEN**
- (Settled Oct 16: the attack slider is Δt, and Force is derived: F = Δp ÷ Δt. Nothing double-booked.)
- Whether the Force reading should later feed the sound (peak or attack shape), and how.
- The value of c: only white reads light-like at c² = 1000. Tune by ear.
- What length, tilt and spin should drive.
- Spin already sets pitch class, so any pan by spin would pin each pitch class to a place on the stage.
- Which hues sit left or right would be a convention, not a derivation.
- Element ↔ color beyond the five suit tints (magenta = plasma? cyan?).
- Meaning of "negative space" and the curved gaps between a solid and its sphere.
- Whether the CMYK ↔ ADSR pairing stays (origin: both have four slots).

---

## Reference numbers

```
mass  = 1 − mean(r,g,b)/255       K = 1 − max(r,g,b)/255      mass = K + cents,  cents = max − mean
p     = √(KE² + 2·KE·m·c²)/c      F = p/Δt                    c² = 1000 (organ units)
dist  = distance of (r,g,b) from (0,0,0)
R     = dist / (255·√3)           length / sphere radius, 0 to 1
edge  = R / circ                  suit's solid scaled so its corners sit on the sphere
volume = k × edge³                density = mass / volume
tilt  = acos((r+g+b) / (√3·dist))
spin  = atan2(√3·(g−b), 2r−g−b)
```

| Suit | Element | Solid | Corners | Cd | k | Fills its sphere |
|---|---|---|---|---|---|---|
| Wands | Fire | Tetrahedron | 4 | ≈ 0.55 | √2⁄12 | 12.3% |
| Cups | Water | Icosahedron | 12 | ≈ 0.45 | 5(3+√5)⁄12 | 60.5% |
| Swords | Air | Octahedron | 6 | ≈ 0.50 | √2⁄3 | 31.8% |
| Disks | Earth | Cube | 8 | ≈ 1.05 | 1 | 36.8% |
| Major | Aether | Dodecahedron | 20 | ≈ 0.48 | (15+7√5)⁄4 | 66.5% |

Densest suit (Wands) to lightest (Major) at the same color: 5.43×.
Suit waveforms: Wands triangle · Cups sine · Swords sawtooth · Disks square · Major sine + triangle overtone at 2×.

**Constants:** c² = 1000 · light-like at v/c ≥ 0.5 · ρ = 1.225 kg/m³ (sea level) · g = 9.81 m/s² · peak 0.70×vol (FRTVI off), 0.90×vol (FRTVI on) · `GRAV_LIFT_K = 0.6` · `GRAV_INERTIA_K = 1.2` · sag factor 0.22.

**Semantic layer** (Mu's card text → embeddings → 2D plot) stays separate. Its "gravity" has nothing to do with the Organ's gravity.
