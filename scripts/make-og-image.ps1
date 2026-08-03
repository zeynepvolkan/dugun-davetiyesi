Add-Type -AssemblyName System.Drawing

$canvasW = 1200
$canvasH = 630

$bmp = New-Object System.Drawing.Bitmap($canvasW, $canvasH)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

$paper = [System.Drawing.Color]::FromArgb(255, 246, 233, 216)
$ink = [System.Drawing.Color]::FromArgb(255, 71, 48, 34)
$inkSoft = [System.Drawing.Color]::FromArgb(255, 106, 78, 58)
$accent = [System.Drawing.Color]::FromArgb(255, 181, 89, 46)
$gold = [System.Drawing.Color]::FromArgb(255, 201, 154, 110)

$g.Clear($paper)

$framePen = New-Object System.Drawing.Pen($gold, 2)
$g.DrawRectangle($framePen, 18, 18, $canvasW - 37, $canvasH - 37)

$photo = [System.Drawing.Image]::FromFile("C:\Users\user\projects\my-site\assets\gelin-damat.jpg")
$srcSize = [Math]::Min($photo.Width, $photo.Height)
$srcX = [int](($photo.Width - $srcSize) / 2)
$srcY = [int](($photo.Height - $srcSize) / 6)
if ($srcY + $srcSize -gt $photo.Height) { $srcY = $photo.Height - $srcSize }
$srcRect = New-Object System.Drawing.Rectangle($srcX, $srcY, $srcSize, $srcSize)

$photoSize = 400
$photoX = 60
$photoY = [int](($canvasH - $photoSize) / 2)

$whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255,255,252,247))
$g.FillRectangle($whiteBrush, $photoX - 10, $photoY - 10, $photoSize + 20, $photoSize + 20)
$photoBorderPen = New-Object System.Drawing.Pen($gold, 1.4)
$g.DrawRectangle($photoBorderPen, $photoX - 10, $photoY - 10, $photoSize + 20, $photoSize + 20)

$destRect = New-Object System.Drawing.Rectangle($photoX, $photoY, $photoSize, $photoSize)
$g.DrawImage($photo, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)

# text block on the right
$textX = $photoX + $photoSize + 80
$textWidth = $canvasW - $textX - 50

function U([int[]]$codes) {
  -join ($codes | ForEach-Object { [char]$_ })
}

$eyebrowText = (U 0x0044) + (U 0x00DC) + (U 0x011E) + (U 0x00DC) + "N " + (U 0x0059) + "EME" + (U 0x011E) + (U 0x0130)
$dateText = "3 Ekim 2026   " + (U 0x00B7) + "   " + (U 0x00DC) + "sk" + (U 0x00FC) + "dar, " + (U 0x0130) + "stanbul"

$eyebrowFont = New-Object System.Drawing.Font("Segoe UI", 15, [System.Drawing.FontStyle]::Bold)
$eyebrowBrush = New-Object System.Drawing.SolidBrush($accent)
$g.DrawString($eyebrowText, $eyebrowFont, $eyebrowBrush, [float]$textX, 172.0)

$titleRect = New-Object System.Drawing.RectangleF([float]($textX - 6), 195.0, [float]($textWidth + 20), 130.0)
$titleFont = New-Object System.Drawing.Font("Dancing Script", 52, [System.Drawing.FontStyle]::Bold)
$titleBrush = New-Object System.Drawing.SolidBrush($ink)
$titleFormat = New-Object System.Drawing.StringFormat
$titleFormat.Trimming = [System.Drawing.StringTrimming]::EllipsisWord
$g.DrawString("Zeynep & Volkan", $titleFont, $titleBrush, $titleRect, $titleFormat)

$dateFont = New-Object System.Drawing.Font("Georgia", 18, [System.Drawing.FontStyle]::Regular)
$dateBrush = New-Object System.Drawing.SolidBrush($inkSoft)
$g.DrawString($dateText, $dateFont, $dateBrush, [float]$textX, 330.0)

$rulePen = New-Object System.Drawing.Pen($gold, 1)
$g.DrawLine($rulePen, $textX, 375, $textX + 320, 375)

$outPath = "C:\Users\user\projects\my-site\assets\og-image.jpg"
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$qualityEncoder = [System.Drawing.Imaging.Encoder]::Quality
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter($qualityEncoder, [int64]88)
$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$bmp.Save($outPath, $jpegCodec, $encoderParams)

$g.Dispose()
$bmp.Dispose()
$photo.Dispose()

Write-Output "Saved: $outPath"
