# ===================================================================
#           CSC - SENIOR SECONDARY (SSC) EXAM FILE GENERATOR
# ===================================================================
# This script creates the specified folder structure and blank .json 
# files for all Senior Secondary exams.
# -------------------------------------------------------------------

# --- STEP 1: DEFINE THE ROOT OUTPUT DIRECTORY ---
# This path now automatically finds your Documents folder and creates the
# required subdirectories. No editing is needed.
$baseOutputDirectory = Join-Path -Path $env:USERPROFILE -ChildPath "Documents\CSC\data\SSC"


# --- STEP 2: DEFINE THE MASTER DATA SOURCE (ALL SENIOR SUBJECTS) ---
# This list uses nested loops to generate every required file name.

$subjects = @(
    @{ name = "Agricultural_Science"; code = "ACS" },
    @{ name = "Animal_Husbandry"; code = "ANI" },
    @{ name = "Biology"; code = "BIO" },
    @{ name = "Chemistry"; code = "CHEM" },
    @{ name = "Christian_Religious_Studies"; code = "CRS" },
    @{ name = "Civic_Education"; code = "CEDU" },
    @{ name = "Commerce"; code = "COMM" },
    @{ name = "Diction"; code = "DION" },
    @{ name = "Economics"; code = "ECON" },
    @{ name = "English_Studies"; code = "ENG" },
    @{ name = "Further_Mathematics"; code = "FMAT" },
    @{ name = "Geography"; code = "GEO" },
    @{ name = "Government"; code = "GOVT" },
    @{ name = "Historical_Studies"; code = "HIS" },
    @{ name = "Literature_In_English"; code = "LIT" },
    @{ name = "Mathematics"; code = "MATH" },
    @{ name = "Physics"; code = "PHY" }
)

$years = @("SS1", "SS2", "SS3")
$terms = @("1ST", "2ND", "3RD")

# --- STEP 3: THE AUTOMATION LOGIC ---

Write-Host "Starting Senior Secondary (SSC) empty exam file generation..." -ForegroundColor Green

# Create the base directory structure if it doesn't exist
# The -Force parameter ensures that all parent directories are created.
if (-not (Test-Path -Path $baseOutputDirectory)) {
    New-Item -ItemType Directory -Path $baseOutputDirectory -Force | Out-Null
    Write-Host "Created base directory structure: $baseOutputDirectory" -ForegroundColor Yellow
}

# Nested loops to generate every combination
foreach ($subject in $subjects) {
    # 3a. Create the path for the subject's folder
    $subjectPath = Join-Path -Path $baseOutputDirectory -ChildPath $subject.name

    # 3b. Create the subject folder IF it doesn't already exist
    if (-not (Test-Path -Path $subjectPath)) {
        New-Item -ItemType Directory -Path $subjectPath | Out-Null
        Write-Host "Created new directory: $($subject.name)" -ForegroundColor Yellow
    }

    foreach ($year in $years) {
        foreach ($term in $terms) {
            # 3c. Construct the filename with a consistent hyphenated format
            $jsonFileName = "2025-2026-$($year)-$($subject.code)-$($term).json"
            $jsonFilePath = Join-Path -Path $subjectPath -ChildPath $jsonFileName

            # 3d. Create a new, empty, valid JSON file.
            Set-Content -Path $jsonFilePath -Value "{}"
            
            # 3e. Give the user feedback
            Write-Host "  - Created empty file: $jsonFileName"
        }
    }
}

Write-Host "Process complete! All empty SSC exam files have been created in '$baseOutputDirectory'." -ForegroundColor Green