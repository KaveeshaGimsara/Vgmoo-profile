Add-Type -AssemblyName System.Drawing

$inputPath = "K:\Vgmoo\public\media\vgmoo-letter.jpg"
$outputPath = "K:\Vgmoo\public\media\vgmoo-letter-clean.png"

$bmp = [System.Drawing.Bitmap]::FromFile($inputPath)
$output = New-Object System.Drawing.Bitmap($bmp.Width, $bmp.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

for ($x = 0; $x -lt $bmp.Width; $x++) {
    for ($y = 0; $y -lt $bmp.Height; $y++) {
        $c = $bmp.GetPixel($x, $y)
        if ($c.R -lt 45 -and $c.G -lt 45 -and $c.B -lt 45) {
            $output.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } else {
            $output.SetPixel($x, $y, $c)
        }
    }
}

$output.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$output.Dispose()

# Also copy the new transparent paperclip
Copy-Item "C:\Users\kavee\.gemini\antigravity-ide\brain\a061b318-3ad8-4892-8c0d-922921968a96\.user_uploaded\media_1787881372834.png" "K:\Vgmoo\public\media\transparent-paperclip.png" -Force

# Copy bb section files
New-Item -ItemType Directory -Force -Path "K:\Vgmoo\public\bb-section"
Copy-Item "K:\Vgmoo\src\assets\bb section\*" "K:\Vgmoo\public\bb-section\" -Force

Write-Host "All assets processed successfully!"
