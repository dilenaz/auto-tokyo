$ErrorActionPreference = "Stop"
$admin = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqladmin.exe"
$defaults = Join-Path $PSScriptRoot "..\.mysql-run\root-client.ini"

if (-not (Test-NetConnection 127.0.0.1 -Port 3307 -InformationLevel Quiet -WarningAction SilentlyContinue)) {
  Write-Output "Auto Tokyo MySQL zaten kapalı."
  exit 0
}

& $admin "--defaults-extra-file=$defaults" shutdown
Write-Output "Auto Tokyo MySQL durduruldu."
