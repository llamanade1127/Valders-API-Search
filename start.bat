
echo Checking if new version exists...
call node index.js repo=Valders-API-Search username=llamanade1127 token=ghp_wgVHF9vQ95c2XAqGczrapNkIHyirO83cIhht
set homedir=%~dp0
cd %homedir%/Valders-Chromebook-API/resources/app
start api.exe
cd %homedir%
start /Valders-Chromebook-API/resources/app

