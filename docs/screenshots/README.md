# Screenshots for the main README

Add PNG or JPG files in **this folder**, then commit and push. The root [`README.md`](../../README.md) references them with relative paths like `./docs/screenshots/home-explore.png`.

## How to capture

1. Open the live app: [https://airbnb-clone-jade-one-73.vercel.app](https://airbnb-clone-jade-one-73.vercel.app)
2. Use **Chrome DevTools → Toggle device toolbar** for mobile shots (optional).
3. **macOS:** `Cmd + Shift + 4` (region) or `Cmd + Shift + 3` (full screen).  
   **Windows:** `Win + Shift + S`.  
   **Chrome:** right-click page → Inspect → `Cmd/Ctrl + Shift + P` → “Capture full size screenshot”.
4. Save with the **exact filenames** listed in the root README (kebab-case, `.png` preferred).
5. From repo root: `git add docs/screenshots/*.png && git commit -m "Add README screenshots" && git push`

If a file is missing, GitHub shows a broken image until you add it—that is expected until you paste screenshots.

## Suggested files

| File | What to show |
|------|----------------|
| `home-explore.png` | Home: destinations + popular homes row |
| `search-map.png` | `/search` with list + map and price pins |
| `listing-detail.png` | Listing page: photos + booking card |
| `booking-checkout.png` | Confirm and pay screen |
| `trips.png` | Trips tab with an upcoming booking |
| `hosting-dashboard.png` | Host dashboard (stats + listings) |

Optional: `filters-sort.png`, `dark-mode.png`, `mobile-search.png`
