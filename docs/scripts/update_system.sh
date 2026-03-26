#!/bin/bash
echo ">>> Початок автоматичного оновлення GamerIS..."
git pull origin main
npm install
npm run build
echo ">>> Оновлення завершено успішно!"