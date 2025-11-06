# Oblivion Spell Altar 🧙‍♂️

![Status](https://img.shields.io/badge/Status-Experimental-8A2BE2?style=flat-square)
![Made with Next.js](https://img.shields.io/badge/Next.js-powered-black?style=flat-square)
![License MIT](https://img.shields.io/badge/License-MIT-brightgreen?style=flat-square)

Experiment with Oblivion's in-depth spell system and tweak incantations before committing them to Tamriel.  
Source for https://spells.oblivion.tools

## ✨ Highlights

- Browse and test spell effects with instant previews.
- Fine-tune magnitudes, durations, and costs in one place.
- Share tuned loadouts with fellow mages.

## 🚀 Getting Started

### Development

1. Ensure `docker`, `docker compose`, and `make` are installed.
2. Launch the development stack:
   ```bash
   make dev
   ```
3. Navigate to [http://localhost:3000](http://localhost:3000) and begin enchanting.

### Deployment

To build the production image and boot the server:

```bash
make prod-build
```

Then visit [http://localhost:3000](http://localhost:3000).

## 🔧 Configuration

Adjust `.env` to override defaults for local runs.

| Name             | Purpose                |
| ---------------- | ---------------------- |
| `CONTAINER_NAME` | Docker container name  |
| `PORT`           | Port server listens to |

## 🧭 Helpful Commands

- `make stop` — halt running containers.
- `make logs` — tail application logs for quick debugging.
