set homedir=%~dp0
set releaseFolder = %homedir%test

::Create a folder called release
echo %releaseFolder%
mkdir \release

::Compile the code for the API  
echo Compiling API
cd ..
cd \Valders-API
call tsc -p .

::Copy the dist/database from the API and move it into the release folder
copy \Dist\database\* %releaseFolder%

::convert API into a exe
call pkg -t node14-win Dist/index.js -o api.exe

::Move exe into release folder
copy api.exe %releaseFolder%

::Compile front end and move it into the release folder
cd %homedir%
call npm exec electron-packager . %releaseFolder% --platform=win32

