$ErrorActionPreference = "Stop"
$portOpen = Test-NetConnection 127.0.0.1 -Port 3307 -InformationLevel Quiet -WarningAction SilentlyContinue
if ($portOpen) {
  Write-Output "Auto Tokyo MySQL zaten çalışıyor: 127.0.0.1:3307"
  exit 0
}

$mysql = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld.exe"
$data = Join-Path $PSScriptRoot "..\.mysql-data"
$run = Join-Path $PSScriptRoot "..\.mysql-run"
$config = Join-Path $run "my.ini"
$arguments = "--defaults-file=`"$config`""
for ($attempt = 1; $attempt -le 3; $attempt++) {
  $process = Start-Process -FilePath $mysql -ArgumentList $arguments -WorkingDirectory $data -WindowStyle Hidden -PassThru
  for ($second = 1; $second -le 20; $second++) {
    Start-Sleep -Seconds 1
    if (Test-NetConnection 127.0.0.1 -Port 3307 -InformationLevel Quiet -WarningAction SilentlyContinue) {
    Write-Output "Auto Tokyo MySQL başlatıldı: 127.0.0.1:3307"
      exit 0
    }
    if ($process.HasExited) { break }
  }
}

throw "MySQL üç denemede başlatılamadı. .mysql-run/mysql-error.log dosyasını kontrol edin."
