# Agricultural Science Exams Data
$agriculturalScienceExams = @(
  @{ fileName = '2025-2026-JS1-ACS-1ST'; displayName = 'BASIC 7 1ST TERM AGRICULTURAL SCIENCE EXAM 2025/2026' },
  @{ fileName = '2025-2026-JS1-ACS-2ND'; displayName = 'BASIC 7 2ND TERM AGRICULTURAL SCIENCE EXAM 2025/2026' },
  @{ fileName = '2025-2026-JS1-ACS-3RD'; displayName = 'BASIC 7 3RD TERM AGRICULTURAL SCIENCE EXAM 2025/2026' },
  @{ fileName = '2025-2026-JS2-ACS-1ST'; displayName = 'BASIC 8 1ST TERM AGRICULTURAL SCIENCE EXAM 2025/2026' },
  @{ fileName = '2025-2026-JS2-ACS-2ND'; displayName = 'BASIC 8 2ND TERM AGRICULTURAL SCIENCE EXAM 2025/2026' },
  @{ fileName = '2025-2026-JS2-ACS-3RD'; displayName = 'BASIC 8 3RD TERM AGRICULTURAL SCIENCE EXAM 2025/2026' },
  @{ fileName = '2025-2026-JS3-ACS-1ST'; displayName = 'BASIC 9 1ST TERM AGRICULTURAL SCIENCE EXAM 2025/2026' },
  @{ fileName = '2025-2026-JS3-ACS-2ND'; displayName = 'BASIC 9 2ND TERM AGRICULTURAL SCIENCE EXAM 2025/2026' },
  @{ fileName = '2025-2026-JS3-ACS-3RD'; displayName = 'BASIC 9 3RD TERM AGRICULTURAL SCIENCE EXAM 2025/2026' }
)

# Define the output directory. You can customize this path.
$outputDirectory = "C:\Exams\Agricultural_Science"

# Create the directory if it doesn't exist
if (-not (Test-Path -Path $outputDirectory)) {
    New-Item -ItemType Directory -Path $outputDirectory | Out-Null
}

# Loop through each exam and create an empty .json file
$agriculturalScienceExams | ForEach-Object {
    $fileName = $_.fileName + ".json"
    $filePath = Join-Path -Path $outputDirectory -ChildPath $fileName

    # Create a new, empty file
    New-Item -ItemType File -Path $filePath -Force | Out-Null
    
    Write-Host "Created empty file: $filePath"
}

Write-Host "All Agricultural Science exam files have been created successfully!"
