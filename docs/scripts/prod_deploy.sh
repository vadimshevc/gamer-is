#!/bin/bash
echo "[GamerIS] Starting Production Build and Deploy..."
npm run lint && npm run build && npm run deploy
echo "[GamerIS] Deployment Finished!"