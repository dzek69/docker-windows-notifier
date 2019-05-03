@echo off
del /q releases\*
call npx pkg . --targets node10-win-x64,node10-win-x86 --out-path releases/
call ren releases\docker-windows-notifier-x64.exe docker-windows-notifier.exe