param(
  [string]$ApiUrl = 'http://localhost:8080/predict',
  [string]$File = '..\frontend\assets\audio-samples\sample.wav'
)

Write-Host "Posting $File to $ApiUrl"
$apiKey = $env:INFERENCE_API_KEY
$curlCmd = "curl -v -F \"audio=@$File\""
if ($apiKey) { $curlCmd += " -H \"x-api-key: $apiKey\"" }
$curlCmd += " `"$ApiUrl`""
Invoke-Expression $curlCmd
