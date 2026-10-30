# Trickno · Organ — Physics Key
*Vocabulary and functions. The chain from card to sound. Last settled: Oct 30, 2026 (Phase A step 4 + presets + undo audit + 4b parts 1–3). This is the only copy.*

Status tags used throughout: **BUILT** (in organ.html) · **READING** (built as a readout; does not change the sound) · **AGREED** (decided, not built) · **PARKED** (later, on purpose) · **OPEN** (undecided) · **WEDGED** (hand-picked mapping, not derived from an equation).

---

## Principles
1. **Physics as accurate as possible inside the dream.** When a real law and a convenient shortcut disagree, the law wins. Shortcuts are labelled WEDGED.
2. **Two readings of one object, both true at once:** "this particle obeys Maxwell's equations" and "this particle belongs to Fire."
3. **Gravity does gravity; atmosphere does atmosphere.** Gravity accelerates everything equally. Drag and buoyancy come from the atmosphere (air density ρ; 0 = vacuum). Galileo's falling-together is simply the ρ = 0 case, not a separate rule.
4. **Every audio change is opt-in, default OFF.** Existing songs keep their sound.
5. **A color is one vector, not three filters.** R, G, B are not separate knobs.
6. **Emphasize mass, volume, density and shape first.** The color-vector readings (length, tilt, spin) come second, and can be assigned to a feature in RGB Particle Controls (unassigned by default).

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
  └──► LAUNCH v₀ ──► FLIGHT in gravity g + atmosphere ρ                    BUILT (opt-in)
         weight (m − ρV)g · terminal v √(2|W|/ρCdA) · peak height · coast τ
         │
         │   compared with a REFERENCE particle (mid-gray cube, Earth air, struck at 0.7) that keeps your ADSR exactly:
         ├─ Resistance (decay)  = your Decay   × τ/τ_ref   (limited ×⅓ … ×3)
         ├─ Inertia (release)   = your Release × τ/τ_ref   (same limits)
         ├─ Terminal Velocity   = your Sustain × s/s_ref,  s = min(1, TV/v₀)
         └─ floater + "Floaters rise" ──► sustain swells from v₀/TV up to the peak
  │
  ▼
PARTICLE RESPONDS
  ├─ envelope     CMYK seeds + ΔtRTVI sliders  (blend · opacity)            BUILT
  ├─ gravity      pulls sustain down; mass raises lift cost, stretches release   BUILT
  ├─ atmosphere   drag + buoyancy; terminal velocity from the equation     AGREED
  └─ controls     R · G · B · length · tilt · spin → any feature (drop-downs)   BUILT
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
| RGB reading | Additive, spirit: what the particle is **doing** | BUILT (as RGB Particle Controls) |

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
| Force (F) | **Derived, not a control.** `F = Δp ÷ Δt`. For matter `F = m·Δv/Δt`; for light `F = E/(c·Δt)`. Shown in the ΔtRTVI pane and the Physics table | READING |
| Regime | Matter-like (v ≪ c) or light-like (v/c ≥ 0.5). White is light; the rest of the deck is matter | READING |
| Height | How high the strike lifts the particle. In vacuum `h = E/(mg)` | AGREED |
| Gravity (g) | Same acceleration for everything. Presets Moon / Mars / Earth / Jupiter / Sun | BUILT |
| Atmosphere (ρ) | Air density, its own tile under Physics Engine. Vacuum 0 · Mars 0.02 · Jupiter 0.16 · Earth 1.225 · Titan 5.3 · Venus 65 kg/m³. Its controls: ρ · Physics Depth · Mass Unit · Floaters Rise | BUILT (default OFF) |
| World | Preset that sets gravity and air together: Earth · Moon · Mars · Jupiter (1 bar) · Titan (g 1.352, ρ 5.3) · Venus. Either can still be edited alone (shows as Mixed) | BUILT |
| Physics Depth | Atmosphere's strength, like ΔtRTVI opacity. 0% = exactly the sound without it; 100% = your ADSR fully scaled by the flight ratios; between = breakpoints mixed | BUILT |
| Reference particle | Mid-gray cube at strike 0.7 in Earth air, mass unit 1. It keeps your ADSR exactly; every other card is scaled by how its flight differs from it | BUILT |
| Flight plot | Height (or speed) over time for each card, integrated from `m·dv/dt = −mg + ρVg − ½ρCdA·v|v|`. Analysis only; it matches the closed-form vacuum peak to 0.01% | BUILT (reading) |
| Mass Unit | Multiplies every card's mass against the air (log slider, default 1). Moves the sink / float line without changing the atmosphere. Does not touch Gravity layer 1 | BUILT |
| Floaters Rise | ON: a card lighter than the air starts at launch speed and accelerates up to terminal velocity, so its sustain swells. OFF: it sustains at that speed | BUILT (default OFF) |
| Buoyancy | `ρ·V·g` upward. A card less dense than the air floats (30 of 78 on Earth at mass unit 1) | BUILT (via flight) |
| Net weight | `W = (m − ρV)·g` | READING |
| Peak height | vacuum `v₀²/2g`; with air `(TV²/2g′)·ln(1+v₀²/TV²)`, `g′ = |W|/m` | READING |
| Coast time τ | `2m/(ρ·Cd·A·v₀)`. Quadratic drag: `v = v₀/(1+t/τ)`. (The exponential in older notes is the slow-speed, linear-drag case) | READING |
| Drag | `F = ½ρ·Cd·A·v²`, with A = π·R² (the particle's sphere silhouette) | READING |
| Resistance | Decay. Fluid drag opposing motion | BUILT |
| Terminal Velocity | Sustain. Where drive = drag. `TV = sqrt(2F / ρCdA)` | BUILT as a slider · equation AGREED |
| Inertia | Release. Momentum after the drive stops | BUILT |
| Lift cost | What mass and gravity charge the strike: `mass · gNorm · depth · 0.6` | BUILT (tuning constant) |
| Release stretch | Heavier rings longer: `R × (1 + mass · 1.2)` | BUILT (tuning constant) |
| Sag | Gravity pulling the sustain down: `gNorm · depth · 0.22` | BUILT, WEDGED |
| Opacity | ΔtRTVI strength. 100% = full blend · 0% = exactly as if ΔtRTVI were off | BUILT |
| Blend | How ΔtRTVI mixes with the card's own envelope: normal / multiply / screen / overlay | BUILT |
| RGB Particle Controls | The old RGB Particle, opened up. Six numbers read from each card's color (R, G, B, length, tilt, spin), each with a drop-down for the feature it drives and its own amount; Influence scales all. Defaults: R→Peak, G→Pan, B→Sustain, the rest unassigned. Features: Peak · Sustain · Pan · Attack (Δt) · Decay · Release · Pitch (detune). Above the middle of a range pushes one way, below the other. No graph: you hear it | BUILT, WEDGED strengths (±30% peak, +35% sustain, ±0.2 pan, ×½…×2 times, ±50¢) |
| Effects Lab | Only one channel's Lab is open at a time. Lab background `#0f0f13` | BUILT |
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
| Flight | `flightProps(col,suit,vol,channel,g,rho,massUnit)` | → net weight, launch speed, peaks, terminal v, coast τ, floats/sinks/light | BUILT |
| Flight | `flightEnvelope(f,rise,base)` | flight ratios vs the reference → your sustain, decay, release scaled (and whether it swells) | BUILT |
| Flight | `flightTrajectory(f,g,rho,T)` · `buildFlightPlot` | RK4 motion of one card; the Atmosphere pane's height/speed plot | READING |
| **Shape** | `noteShape(...)` wraps `noteShapeBase(...)` | applies the atmosphere on top of the usual envelope; `force.suit` carries the card's suit, `force.flight` isolates it for graphs | BUILT |
| Strike | `strikeKinematics(col,vol,channel)` | → mass, KE, momentum p, v/c, Δt (the real attack), Force, light/matter | READING |
| Vector | `colorVector(col)` | → length (0–1), tilt, spin | READING |
| Volume | `particleVolume(col,suit)` | sphere model → volume of the suit's solid | READING |
| Particle | `particleProps(col,suit)` | → mass, volume, density, length, tilt, spin, shape | READING |
| Shape | `SUIT_SOLID` | per suit: solid name, corners, Cd, k, circumradius | READING |
| Pitch | `activeRgbToFreq` → `rgbToFreq` / `rgbToFreqMultiOctave` | hue → pitch class, lightness → octave → Hz | BUILT |
| Envelope | `getCmykAdsr(col)` | CMYK → the card's own envelope (ΔtRTVI on) | BUILT |
| Envelope | `blendAdsr(cmyk,user,mode)` | card's envelope × the four sliders | BUILT |
| **Shape** | `noteShape(col,vol,channel,force)` | **the one envelope calculation**: opacity, blend, gravity, RGB wedge | BUILT |
| Shape | `noteGainPoints(s,dur,t0)` | shape → four `[time, gain]` points | BUILT |
| Play | `scheduleCardNote(...)` | plays those points | BUILT |
| Graphs | `buildFxGraph(channel,ci,kind)` | draws from `noteShape`, so the picture is the sound | BUILT |
| Readout | `fxBlockParticle(channel,ci)` | the Physics Engine pane's per-card table (particle · strike · color vector) | READING |
| Readout | `fxBlockFrtvi` force line | the ΔtRTVI pane's Force range across the channel's cards | READING |
| Safety | `ensureFx(channel)` | fills missing settings so old songs still load | BUILT |
| Strike | strike → energy → height; atmosphere; drag; terminal velocity | | AGREED |

---

## Status board

**BUILT**
RGB Particle Controls (six assignable color numbers; songs saved before it keep R→Peak and B→Sustain, with G→Pan at 0 because the old pan never reached the sound; new ones start with G→Pan live) · Atmosphere → sound (Phase 3b): your ADSR scaled by flight ratios against a reference card (decay and release × τ/τ_ref, sustain × s/s_ref), vacuum stretches the most, floaters swell (opt-in), white keeps its envelope · Flight plot (height / speed per card) · Atmosphere replaces the Gravity sag for sustain, but Gravity still lowers the peak (lift cost) · Color → pitch · suit → waveform · CMYK → envelope · ΔtRTVI sliders, blend, opacity · mass in Gravity (lift cost, release stretch) · Gravity sag (WEDGED) · Physics Engine switch · RGB Particle (WEDGED: R → peak, B → sustain, G → pan, and the pan part never reached the sound) · Effects Lab with + / × · live graphs · Physics Engine readout (mass, volume, density, shape, Δt, Force, regime, length, tilt, spin per card) · Attack relabelled Δt.

**BUILT, tools (not physics): Phase A step 1, Oct 21.** Every channel now plugs into its own *level bus* (a gain of exactly 1), and all buses meet at one *master bus*; analysers listen in but never touch the sound (offline render with and without them differs by about 4e-8, inaudible; exports still go straight to the speakers). Per-channel meter under each volume slider (−60 to 0 dBFS, peak hold). Master meter in the header: L/R peak bars, PEAK (sample peak since Play), LUFS short-term and integrated (K-weighted, BS.1770 gating; matched ffmpeg's EBU R128 on a test song within 0.1 LU). Volume sliders keep the stored 0–1 value, step 0.01, with a dB readout (1.0 = 0 dB); Shift-drag = 0.1 dB per pixel; double-click the number to type `-12`, `-12.5`, `40%` or `off`.

**BUILT, tools: Phase A step 2, Oct 21.** The pattern bar now carries a *monitor* (mini live spectrum + the master meter) and the pattern blocks wrap to two rows (scroll beyond that). Click the mini spectrum to open the **Analyzer** panel: a floating window inside the page, draggable by its title, resizable from the corner, remembered between sessions (its own key `trico_analyzer_ui`, never inside songs). Log-frequency spectrum 20 Hz–20 kHz (8192-point FFT, loudest bin per pixel column), dB grid, band zones, a falling peak-hold line (HOLD / CLEAR), and a hover readout giving frequency, nearest note and level. Underneath, the **energy share per band** (SUB 20–60, BASS 60–250, LOW MID 250–500, MID 500–2k, HI MID 2–4k, PRES 4–8k, AIR 8k+), which is the direct answer to "how bass-heavy is this?". Left and right are summed to one mix for the picture; the dB scale is calibrated so a full-scale sine reads 0 dB (WEDGED only in the sense of a measured offset, +13.8 dB). Listening does not touch the sound (6,000 + 3,000 random-note recordings identical).

**BUILT, tools: Phase A step 3, Oct 22.** The Analyzer panel has two tabs, SPECTRUM and SCOPE, both reading the **master mix** (so Solo on a channel shows only that channel, the way a meter on Ableton's master follows soloed tracks). SCOPE: **WAVE** (the last 5–100 ms, held still by a rising zero-crossing trigger; left in gold, right in blue), **X–Y** (left against right, with a phosphor-style fading trail; mono = a diagonal line, a 90° phase offset = a circle, inverted = the other diagonal), **BOTH** side by side, a **45°** toggle (mid/side: a centered sound is a vertical line), **GAIN** 1×/2×/4×/8×/AUTO (AUTO drops at once on a peak and rises slowly, so quiet mixes still fill the screen; the readout shows the peak in dB so absolute level is never hidden), and a **stereo correlation meter** (+1 mono, 0 wide, −1 out of phase). Tested with known signals (mono, quadrature, inverted) and 3,000 random-note recordings (identical).

**BUILT, tools: Phase A step 4 (EQ, first pass), Oct 22.** An 8-band master EQ in the manner of Ableton's EQ Eight, on a third tab of the Analyzer. It sits between the master bus and the speakers and is **part of the song** (`masterEq` is saved with the song, in the cloud payload and in the local save, and exported with it); a song without one loads with the EQ OFF, and while it is off the signal takes the dry path only (nothing in it). Each band: on/off, a type (LOW CUT 48 or 12 dB/oct, LOW SHELF, PEAK, NOTCH, HIGH SHELF, HIGH CUT 12 or 48 dB/oct), frequency 20 Hz–20 kHz, gain ±15 dB (shelves and peak), Q 0.1–18 (cuts, peak, notch; shelves have no Q because Web Audio's shelf has a fixed slope). A 48 dB cut is four 2nd-order 8th-order-Butterworth sections in a row (Qs 0.5098, 0.6013, 0.9, 2.5629). Defaults (all off): 1 low cut 40 Hz, 2 low shelf 100, 3 peak 250, 4 peak 800, 5 peak 2k, 6 peak 5k, 7 high shelf 8k, 8 high cut 16k. Plus a **master trim** (−36 to +12 dB, 0 = unchanged). Drag a dot: across = frequency, up/down = gain (Q on cuts/notch); Alt-drag or scroll = Q; Shift = fine; number buttons 1–8 switch bands on/off (Shift-click selects only); typed fields for the selected band; RESET. The EQ curve is drawn with the same filter formulas Web Audio uses (checked against the browser's own response to under 0.001 dB), over the live spectrum; EQ scale is ±12 dB on the right, spectrum dBFS on the left. Switching a band or type briefly ducks the wet path (about 20 ms) while it rewires; moving a value is smoothed. **All meters, the spectrum, the scope and the loudness now read the output after the EQ.** Measured: a +6 dB peak at 1 kHz gives ×1.995, −12 dB gives ×0.251, trim −6 dB gives ×0.501, live and in the export path. Not yet (step 4b): Audition, Adaptive Q, Scale, Mid/Side and Left/Right modes, oversampling.

**EQ direction (research, Oct 22; Ableton Live 11 manual).** EQ Eight: up to 8 parametric bands per channel; each band picks 48 or 12 dB/oct low cut, low shelf, peak, notch, high shelf, 12 or 48 dB/oct high cut; dragging a dot sets frequency (across) and gain (up/down), Alt-drag sets Q; **Stereo / L-R / M-S** modes with an Edit switch between the two curves; **Audition** (hold a dot to hear only that band's effect); **Adaptive Q** (Q rises with boost or cut so level stays steady); **Scale** (one knob scales every band's gain); global Gain; band on/off to save CPU; oversampling; the analyzer sits behind the curve (block size 8192 or 16384, averaging); drag-enclose to move several dots at once. Channel EQ: HP 80 Hz toggle, low shelf 100 Hz ±15, sweepable mid peak 120 Hz–7.5 kHz ±12, high shelf ±15, output gain. EQ Three: three bands, each can be cut to −∞, adjustable crossovers, signal LEDs. For our step 4 the likely first set: a few parametric bands drawn over the spectrum, filter-type chooser, drag to set frequency and gain, Q, per-band on/off, an Audition button, master trim, and a Reset. Later (per-track EQ in the Effects Lab, like Ableton's per-track device): the same EQ, scope and spectrum as effects on a single layer.

**ROADMAP (agreed Oct 21).** Phase A (eyes and ears): step 1 levels ✔ → step 2 mini-analyzer + floating panel + two-row pattern blocks ✔ → step 3 oscilloscope with X–Y and stereo correlation ✔ → step 4 master EQ ✔ first pass (8 bands, trim; 4b: Audition, Adaptive Q, Scale, Mid/Side, oversampling). Phase B (time): note length (default one step, so old songs are unchanged) → piano-roll mode over the same notes (rows in card order by default, button for pitch order) → multiple timeline layers. Phase C: drums as their own phase, with the striker idea. Later: suits combining waveforms (needs the scope first); Material is on hold. A true separate pop-out window for a second monitor may come after the in-page one.

**AGREED, not built**
- Particle cloud with voices is an **effect**, later, outside the Physics Engine.

**Direction, not decided**
- More features for the controls to drive (filter, resonance, vibrato…) as those effects arrive. Possible later: lock a control to one fixed job.

**PARKED**
scope "SELF" mode (plot the signal against a delayed copy of itself, so one track's waveform makes a closed shape) · RGB cube visualizer (each playing card as a point in R-G-B space; the vector from black) · spectrum color mode (a colored line per playing card at its pitch, card color = line color) · scope / spectrum / EQ as per-layer effects in the Effects Lab (after the master versions settle) · channel picker for the scope (Solo already does it) · Material (list to be pulled from the cards) · striker (surface area, hardness) and ADSR labels in front · cutoff / resonance / modulation as offsets from the card's material · photon energy (E = h·f from pitch; white stays on strike energy for now) · Planck-scale constants · Gravity layers 2 and 3 · bounce `vy = −vy·e`.

**OPEN**
- (Settled Oct 16: the attack slider is Δt, and Force is derived: F = Δp ÷ Δt. Nothing double-booked.)
- Mass scale: organ mass 0–1 against real air makes 30 of 78 cards balloons on Earth. Keep, or add a mass-unit constant?
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

**WEDGED in 3b:** the ratio limits `PHYS_RATIO_MIN = ⅓`, `PHYS_RATIO_MAX = 3` · the choice of reference particle (mid-gray cube, Earth air, strike 0.7). The ratios themselves τ/τ_ref and s/s_ref are the physics. On Earth the release ratio across the deck: median ×1.6, a quarter of cards at ×1 or below, a quarter at the ×3 limit.

**Fixed Oct 18 (older than 3b):** short notes with a long decay put the release breakpoint before the decay one, and RGB Particle could push a peak a hair over 1.0. Breakpoints are now always returned in time order (Web Audio had been re-sorting them silently, but the note's stop time followed the wrong point, so tails could be cut). Peak is capped at 1. In 6,000 random notes: 5,822 identical, 176 re-ordered, 2 capped.

**Constants:** c² = 1000 · light-like at v/c ≥ 0.5 · ρ = 1.225 kg/m³ (sea level) · g = 9.81 m/s² · peak 0.70×vol (ΔtRTVI off), 0.90×vol (ΔtRTVI on) · `GRAV_LIFT_K = 0.6` · `GRAV_INERTIA_K = 1.2` · sag factor 0.22.

**Semantic layer** (Mu's card text → embeddings → 2D plot) stays separate. Its "gravity" has nothing to do with the Organ's gravity.

### BUILT Oct 24, 2026: EQ presets and the undo audit
- **EQ presets** (dropdown in the EQ footer): Starting points, band sketches (Boards of Canada, Autechre, Death Grips, Deerhunter x3, Radiohead, Tortoise, Scott Walker), Games (16-bit console, Metroid), Tape (worn reel), plus **your own** (SAVE/DEL, kept in this browser under `trico_eq_presets`). Choosing one fills the eight bands and switches the EQ on; trim is untouched. Shows "custom" once you nudge a band. **WEDGED / sketches, not measurements:** I cannot listen to recordings, so these come from how each sound is commonly described; to make one real, attach a clip and measure its spectrum.
- **Undo now covers:** master EQ (every drag, typed field, band toggle, type menu, power, reset, preset), Effects Lab sliders/number boxes/menus/buttons (one slider drag = one step), group and pattern renames, and the octave mode. A gesture that changes nothing leaves no undo step; identical pictures are never filed twice.
- **Deliberately not undoable:** loop and play-mode toggles, switching pattern view (view state, not song content). Offer: include them if wanted.
- **Band toggle without a dropout (Oct 24):** the EQ keeps two identical wet paths; a band on/off or filter-type change is built on the idle path and crossfaded (~30 ms), so the song never mutes. Measured on a live tone: old build dipped to ~0, new build holds 0.249–0.252. Dragging frequency/gain/Q still glides on the live path.

### BUILT Oct 24, 2026: Step 4b part 1 (Audition and Scale)
- **Scale** (footer, 0–200%): multiplies every band's gain at once (`eqEg(b)` = stored gain × scale). 100% = as drawn, 0% = flat. The curve, dots, live sound and exports all use the scaled gain; dragging a dot edits the stored gain so the dot stays under the pointer. Saved with the song (`masterEq.scale`), undoable, scroll over the box to nudge (Shift = 1%).
- **Audition** (footer toggle, never saved): while lit, holding a dot plays only what that band works on: bandpass at its frequency and Q for bells/notches; the part a cut removes (low cut → lowpass, high cut → highpass); the lifted or dropped region for shelves. Releasing restores the normal sound. WEDGED: audition bandpass uses the band's Q directly, cuts/shelves use Q 0.707.
- Still to build in 4b: oversampling (see below).

### BUILT Oct 25, 2026: Step 4b part 2 (Mid/Side and Left/Right)
- **MODE** (footer): STEREO (default, everything as before), MID / SIDE, LEFT / RIGHT. One mode for the whole EQ (as in Ableton), and **each band picks its lane** with a lane button next to Q (Mid or Side; Left or Right). The whole EQ lives in one mode, so the two lanes are truly independent and each curve is exact.
- **Mid** = (L+R)/2, what both speakers share (center). **Side** = (L−R)/2, what differs between them (width). Decode is L = Mid+Side, R = Mid−Side, unity when nothing filters. Checked: a tone on the left only, +6 dB on Mid gives L .374 / R .124; on Right lane leaves L untouched; M/S with no gain is identical. Offline export matches live.
- **Display:** the lane of the selected band is the bold curve; the other lane is a thin blue curve; dots of the other lane are dimmed (still draggable). Mode and lanes are saved with the song, undoable, and presets work in any mode (they set bands on lane 0).
- **Audition** follows the lane: a Side band plays only the Side signal (a centered sound gives silence), Mid plays only the Mid, Left/Right play that channel alone.

### BUILT Oct 25, 2026: Step 4b part 3 (Adaptive Q) · oversampling PARKED
- **ADAPT Q** (footer toggle, off by default, saved with the song, undoable): a bell's Q is multiplied by 1 + 0.08 × |gain in dB| (15 dB → about 2.2×), so big boosts and cuts get narrower. At 0 dB nothing changes. **WEDGED:** `EQ_ADAPT_K = 0.08` is hand-picked, not a published curve. Measured: a +12 dB bell's −3 dB width dropped from 31 to 15 columns.
- **Oversampling: not built, on purpose.** Web Audio's built-in filters cannot run faster than the context's sample rate, so true oversampling needs an AudioWorklet with our own filters (a new engine, not a switch). The cost of not having it is cramping near the top of the spectrum: vs the ideal analog bell at 44.1 kHz, worst-case error is 0.02 dB for 1 kHz +6 dB, 1.1 dB for 5 kHz +12 dB, 3.8 dB for 10 kHz +12 dB, 7.9 dB for 16 kHz +12 dB. The drawn curve is the exact digital response, so what you see is what you hear. Parked as an optional "Phase 4c: AudioWorklet EQ" (also the natural home for true analog-matched shelves).

### IDEAS (not built), Oct 25, 2026: physical pictures for the EQ and the limiter
- **EQ band = a damped resonator** (a mass on a spring with friction; an RLC circuit; a bell, a string, a room). Frequency = stiffness over mass (f0 = √(k/m)/2π), **Q = how little friction** (Q = √(k·m)/c, so Q behaves like the inverse of **Resistance** in ΔtRTVI). Gain = how strongly the resonator is coupled into the sound. This is literally what a biquad filter is, so the picture is true physics, not a wedge. Adaptive Q = a bigger push on the spring rings narrower.
- **Atmosphere already is an EQ in nature:** air absorbs highs with distance and density. A future "air absorption" high shelf driven by the Atmosphere (rho) and distance would make the Physics Engine and the EQ the same object.
- **Suits on the spectrum (proposal, not fact):** Earth/Disks low end, Water/Cups low-mids, Fire/Wands the biting mids and presence, Air/Swords the top, Aether/Major the whole (the Scale and trim knobs). Mid/Side = the core of a sound vs its halo.
- **Limiter wall:** three different walls. Hard clip = a brick wall that flattens the waveform. **Limiter** = a very fast compressor with infinite ratio and look-ahead: g = min(1, ceiling/peak), smoothed, applied to a slightly delayed signal; the shape of the wave survives, the level is pulled down. **Soft wall / "black hole"** = a saturator curve such as y = x/(1+|x|) or tanh: inputs 1, 3, 7, 15 land at 0.5, 0.75, 0.875, 0.9375, so each step covers half of the remaining distance to the wall and never touches it (a Zeno wall). It bends the wave (adds harmonics), so it is a color as well as a safety. A future "Wall" control could offer Hard (limiter) or Soft (asymptotic). Not on the deferred list as a limiter specifically; the compressor/sidechain item stays deferred.

### BUILT Oct 28, 2026: presets in every mode · ROADMAP decision
- **Every preset now has three versions** (Stereo, Mid/Side, Left/Right). The dropdown applies the version for the MODE you are in and never changes the mode. A preset of your own remembers the mode it was saved in and restores it. Character rules (judgement, not measurement, all WEDGED): in Mid/Side the Side lane gets a low cut (bass stays centered) and carries the width, haze or dullness; in Left/Right the two channels get small mismatches (frequency or amount) so the sound spreads; utility presets (Kick click, De-mud, Presence lift, 16-bit, Metroid) stay identical left and right.
- **ROADMAP (Oct 28):** Limiter (master only, small, uses the existing true-peak meter; Hard limiter and Soft "asymptotic wall" options) → Phase B (note length, piano roll, timeline layers) → Compressor with sidechain, after layers exist so the sidechain picker lists the real layer units. Reorderable if Justin wants.
- **PROPOSAL, awaiting design answers:** Color EQ in the analyzer. Source: the Color Lab's "Color EQ · Spectral Filters" (`eqBump` cosine bumps: R = bass bump centered at 0 with half-width .62, G = mid bump at .5 width .42, B = treble bump at 1 width .62; C, M, Y = 1 − R, G, B; a color's curve = min(1, r·R + g·G + b·B) on an axis that is log-even from 60 Hz to 16 kHz). A wheel (with the Lab's lightness slider) picks a color, and its curve drives the eight bands.

### BUILT Oct 30, 2026: COLOR VIEW (sound → color), Step 1 of the Color EQ
- **One road, two directions.** The Color Lab turns a color into a filter shape (color → sound). Color View runs the same road backward: any EQ curve becomes the color of glass that best imitates it (sound → color). Nothing about the audio changes; it is a visualizer.
- **The translation (from the Lab, `eqBump`):** axis log-even from 60 Hz to 16 kHz; R = bass bump (center 0, half-width .62), G = mid bump (.5, .42), B = treble bump (1, .62); a color's curve = min(1, r·R + g·G + b·B), read as transmission (1 passes, 0 blocked). White = everything passes = flat EQ. The EQ's dB curve is read as transmission T = 1 + (dB − loudest dB) / 12, clamped to 0..1, and the color is found by search (coarse grid, then refinement). Checked: pure R, G, B, magenta and white come back as themselves (98–100%).
- **WEDGED (hand-picked):** `COL_DEPTH` = 12 dB for "0 to 1", the 60 Hz–16 kHz axis (the Lab's labels are approximate: 60, 250, 1k, 4k, 16k), and the match % (100 × (1 − RMS error / 0.25)). A single color can only imitate smooth, broad shapes (bass/mid/treble tilts and scoops), so surgical bells score low; the % says how well.
- **Where it shows:** a swatch chip with hex and match % in the EQ band row (two chips, with M/S or L/R, in split modes); a COLOR button that tints the curve and draws the color's own glass shape as a dashed line; a colored dot before every preset name (the color of that preset in the current mode).
- **Examples (stereo):** Boards of Canada #ffbf66 (warm: bass and mids kept, highs dimmed), Presence lift #b3a5f7 (blue-violet: treble), De-mud #e9bdff (pink-magenta: mids scooped), Autechre #af8dff.
- **NEXT (Color EQ phases, agreed Oct 30):** Phase 1 = COLOR mode (color → sound): wheel + lightness, GLASS / TINT, DEPTH, MID/SIDE/BOTH picker, six basis shapes. Phase 2 = 8 color slots with amount and ADD (RGB, light adds) / MULTIPLY (CMY, glass stacks) blending. Realized as a smooth graphic-EQ bank fitted to the mixed curve. Additive here mixes magnitude curves (not literal parallel signal paths, since phases would interfere).
