# PlayGround

<!-- omgithub:readme:start -->
## 🚀 Build, play, and remix with OMGithub

**Created using [OMGithub.com](https://go.ondev.store/).**

[![OMGithub](https://img.shields.io/badge/OMGithub-Open%20project-orange?style=for-the-badge)](https://go.ondev.store/briansalesbffs-code/PlayGround)
[![GitHub](https://img.shields.io/badge/GitHub-Source-181717?logo=github&style=for-the-badge)](https://github.com/briansalesbffs-code/PlayGround)

- 🎮 [Open the project](https://go.ondev.store/briansalesbffs-code/PlayGround).
- ✨ [Remix this project](https://go.ondev.store/briansalesbffs-code/PlayGround?remix=1).
- 💻 [Explore the source](https://github.com/briansalesbffs-code/PlayGround).
- 🛠️ [Check build runs](https://github.com/briansalesbffs-code/PlayGround/actions).
- 🐛 [Report an issue](https://github.com/briansalesbffs-code/PlayGround/issues).
- 👤 [Explore the creator's projects](https://go.ondev.store/briansalesbffs-code).
- 🌍 [Create with OMGithub](https://go.ondev.store/).
<!-- omgithub:readme:end -->

## ETERNA ONLINE — Ecos do Bosque

A playable, single-player fantasy MMORPG-style browser prototype. Explore the clearing, fight forest creatures and the guardian, level up, choose among nine classes, complete weekly quests, and collect cosmetic-only outfits through a free ticket gacha.

### Run locally

The game is a single `index.html` file and loads Three.js and fonts from CDNs, so an internet connection is required. Serve the repository over HTTP (rather than opening the file directly):

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000> in a modern desktop or mobile browser. Use WASD or the on-screen joystick to move, click a creature to target it, Space or the attack button for basic attacks, 1–4 for class skills, and E for dodge. Progress is saved in browser local storage.

### Prototype scope

- This build is a local single-player demo. It does not include online multiplayer, accounts, a server, synchronized persistence, or a backend economy.
- Weekly quest progress and gacha pity are stored only in the current browser. There are no purchases; tickets are earned through gameplay, and gacha rewards are cosmetic only.
- The 3D scene uses Three.js from jsDelivr. Internet access is needed to load the game dependencies.

### Android packaging

There is no Android APK/AAB in this repository yet. To make an Android app, first wrap the web app in a WebView-based container such as Capacitor, configure the app's Android project, and build/sign it with Android Studio or Gradle. That packaging step does not add multiplayer or server persistence; those require a separate backend implementation.
