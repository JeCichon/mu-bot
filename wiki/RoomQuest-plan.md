# Room Quest — phase plan (updated Nov 26, 2026)

The idea: **Home** (the house map) is the front page and the forum's centre. Your room is your character sheet — equipment, stats, personality.

| Phase | What | Status |
|---|---|---|
| 0. Stability | One master house map in Supabase; every device loads it; saved label; conflict choice instead of silent overwrite; sign-in page when signed out | v0.14–0.15 |
| 1. Home page | Home is the first screen (title **Home**, "House map" under it). Tap a room → small card (owner, size, measured; your own room has **Enter room**, done in v0.16). Top-right app-style menu opens a right-hand side bar: people in the house, chores (later), your room's objects. Rename "House map" → "Home" | in progress |
| 1.1 Save-to-apply editing | Admin edits the house map in an Edit mode and must Save (v0.16). Same idea for room walls: changes shared to the house map only when you save / leave edit mode | house map (v0.16) and room shape (v0.17) both done |
| 2. Sister fully in | Easy sign-in, her room works like yours, her shape flows to the house map (v0.13) | built; she hasn't signed in yet |
| 1.2 Tasks side bar | Top-right menu opens a right-hand side bar with a **Tasks** area (self-assigned; add a task to a spot on the map), people list, room objects | next — design questions open |
| 2.5 Onboarding | Calm first-run for her: one big action per screen, 3-step sign-in card. **Simpler sign-in: add "Sign in with Google" next to the email code** (needs a Google provider set up in Supabase) | next after Phase 1 |
| 3. Fill the house | Brother's room measured, parents' room, then levels (downstairs, front door) | later |
| 4. Look & feel | Thick hatched walls, floor textures (wood, tile), Blueprint toggle, catalog pictures, PNG uploads (posters, book covers), click a pile from Room mode and jump to Pile mode | later |
| 5. Engagement | Sims/Zelda ideas: fog on unexplored rooms, keys, build vs live modes, level-ups (equipment / stats / personality) | later |
| 6. Together | Private + shared chores (with a location), chat on Home | later |
| 7. Extras | In-app Feedback page (like the Lodge's feedback.html), mom on Android/laptop, Tricknologic/Lodge link, LiDAR import, blueprint underlay if a flat photo works | someday |

Notes
- Privacy stays as is: furniture never leaves your room; private rooms show an outline only.
- Lodge mobile chat won't scroll on iPhone — keep Home light; avoid a heavy chat widget.
