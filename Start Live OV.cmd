@echo off
rem Live OV starten: dubbelklik op dit bestand.
rem Installeert wat ontbreekt, bouwt de eerste keer de dienstregeling, start backend + frontend en opent de browser.
cd /d "%~dp0"
title Live OV
if not exist node_modules call npm install
if not exist backend\node_modules call npm --prefix backend install
if not exist frontend\node_modules call npm --prefix frontend install
if not exist backend\data\gtfs-current.txt if not exist backend\data\gtfs.db (
  echo Eerste keer: dienstregeling downloaden en opbouwen, dit duurt een paar minuten...
  call npm --prefix backend run gtfs:update
)
rem Browser openen zodra de frontend er is (na ~10 s).
start "" /min cmd /c "timeout /t 10 /nobreak >nul & start http://localhost:3000"
npm run dev
