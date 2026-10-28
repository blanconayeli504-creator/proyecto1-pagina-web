@echo off
cd /d "%~dp0"
echo Iniciando servidor en http://localhost:8000 ...
python servidor.py || py servidor.py
pause
