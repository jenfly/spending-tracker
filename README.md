# Spend Notes

A calm, guilt-free place to jot down what you spend. Type an amount, pick cash or card, tap a tile. That's it. Totals live on a separate "Look back" screen she only visits when she wants to.

Plain HTML, CSS and JavaScript. No framework, no build step, no accounts. Everything is stored in the browser on the phone (localStorage).

## Put it on GitHub Pages

1. Create a new repo and add all the files in this folder at the top level (so `index.html` is in the repo root).
2. In the repo: **Settings → Pages → Build and deployment → Deploy from a branch**, pick `main` and `/ (root)`.
3. Open the Pages URL on her phone, then use the browser menu: **Add to Home screen** (or **Install app**).

To try it on a computer first: `python3 -m http.server 8000` in this folder, then open http://localhost:8000.

## Using it

- **Log:** type the amount (digits fill in from the cents, so `1250` becomes `$12.50`; `00` is handy for whole dollars), choose Card or Cash, tap a tile. A small "Saved · Undo" message appears for a few seconds.
- **Sub-tiles (optional):** if the tile you tapped has sub-tiles (like Groceries, Coffee, Takeout under Food), the "Saved" toast also shows a small chip for each one. Tap a chip to tag the entry you just saved; ignore the chips and the entry stays as plain Food. The toast also has an "Edit" link straight to that tile's sub-tile list, in case you want to add one on the spot. Sub-tiles are optional per tile and fully customizable — see "Edit tiles" below.
- **Add a note (optional):** tap "+ Add a note" under Card/Cash, type a few words, then tap a tile. The note attaches to that entry and the field tucks itself away again. Notes show under each entry in Look back, and can be changed or removed when you tap an entry.
- **Clear the amount:** long-press the backspace key.
- **Edit tiles:** tap "Edit tiles" under the grid, or long-press any tile. Rename, change the picture, reorder, hide, add. Each tile also has a small "Sub-tiles" line — tap it to add, rename, reorder or hide that tile's sub-tiles, or delete one (tap "Delete" twice to confirm; its entries fall back to the plain tile, nothing is lost).
- **Look back:** "Look back" at the top. Month or week, category totals in her own tile order, tap a category to see its entries. If that tile has any sub-tagged entries, a "See the split by sub-tile" line reveals the breakdown. Tap an entry to fix, retag, or remove it.
- **Backup:** Settings → Save backup creates a `.json` file. Settings → Restore from backup reads one back in. Sub-tiles and sub-tile tags are included.

## Privacy

- Nothing is sent anywhere. There are no servers, accounts or analytics.
- The starter tiles in `app.js` (`STARTER_TILES`) are deliberately generic. Anything personal she types, like renaming a tile, stays on her phone and never touches the repo.
- Backup files are saved on her device. Don't commit them to the repo.

## Changing things

- **Starter tiles:** `STARTER_TILES` at the top of `app.js` — each entry is `[name, emoji]` or `[name, emoji, [sub-tile names]]`. They only apply the first time the app opens on a device.
- **Colors:** the CSS variables at the top of `styles.css`.
- **Gentle wording / bars:** both are switches in Settings; defaults are in `defaultState()` in `app.js`.
- **After you change any file:** bump `CACHE` in `sw.js` (for example `spend-notes-v2`) so installed copies refresh. The new version shows up the second time the app is opened.

## Data format

```json
{
  "app": "spend-notes",
  "version": 1,
  "categories": [{
    "id": "…", "name": "Food", "emoji": "🍎", "hidden": false,
    "subs": [{ "id": "…", "name": "Groceries", "hidden": false }]
  }],
  "entries": [{ "id": "…", "cents": 1250, "method": "card", "categoryId": "…", "subId": "optional", "ts": 1762560000000, "note": "optional" }],
  "settings": { "method": "card", "warm": true, "bars": true, "lastBackup": null, "nudgeUntil": 0 }
}
```

Amounts are whole cents. Tile order is the order of the `categories` array, and sub-tile order is the order of a tile's `subs` array. A tile with no `subs` (or an empty one) behaves exactly as it did before sub-tiles existed. An entry's `subId` is optional; entries without one, or whose `subId` points at a sub-tile that's gone, are treated as plain tile entries. That keeps the backup file simple and makes a future sync feature easy to add.
