# ===================================================================
#           MACTUTOR - EMPTY EXAM FILE GENERATOR
# ===================================================================
# This script creates an organized folder structure and a blank .json 
# file for every exam listed in the master data source.
# -------------------------------------------------------------------

# --- STEP 1: DEFINE THE ROOT OUTPUT DIRECTORY ---
# All subject folders will be created inside this main folder.
# IMPORTANT: Change this path to your desired location!
$baseOutputDirectory = "C:\Exams\Generated_Tests"


# --- STEP 2: DEFINE THE MASTER DATA SOURCE ---
# All your exam lists have been consolidated here. We've added a 'subjectDirectory'
# property to each item to automatically create the correct folders.

$allExams = @(
  # Agricultural Science
  @{ fileName = '2025-2026-JS1-ACS-1ST'; subjectDirectory = 'Agricultural_Science' },
  @{ fileName = '2025-2026-JS1-ACS-2ND'; subjectDirectory = 'Agricultural_Science' },
  @{ fileName = '2025-2026-JS1-ACS-3RD'; subjectDirectory = 'Agricultural_Science' },
  @{ fileName = '2025-2026-JS2-ACS-1ST'; subjectDirectory = 'Agricultural_Science' },
  @{ fileName = '2025-2026-JS2-ACS-2ND'; subjectDirectory = 'Agricultural_Science' },
  @{ fileName = '2025-2026-JS2-ACS-3RD'; subjectDirectory = 'Agricultural_Science' },
  @{ fileName = '2025-2026-JS3-ACS-1ST'; subjectDirectory = 'Agricultural_Science' },
  @{ fileName = '2025-2026-JS3-ACS-2ND'; subjectDirectory = 'Agricultural_Science' },
  @{ fileName = '2025-2026-JS3-ACS-3RD'; subjectDirectory = 'Agricultural_Science' },

  # Basic Science
  @{ fileName = '2025-2026-JS1-BSCI-1ST'; subjectDirectory = 'Basic_Science' },
  @{ fileName = '2025-2026-JS1-BSCI-2ND'; subjectDirectory = 'Basic_Science' },
  @{ fileName = '2025-2026-JS1-BSCI-3RD'; subjectDirectory = 'Basic_Science' },
  @{ fileName = '2025-2026-JS2-BSCI-1ST'; subjectDirectory = 'Basic_Science' },
  @{ fileName = '2025-2026-JS2-BSCI-2ND'; subjectDirectory = 'Basic_Science' },
  @{ fileName = '2025-2026-JS2-BSCI-3RD'; subjectDirectory = 'Basic_Science' },
  @{ fileName = '2025-2026-JS3-BSCI-1ST'; subjectDirectory = 'Basic_Science' },
  @{ fileName = '2025-2026-JS3-BSCI-2ND'; subjectDirectory = 'Basic_Science' },
  @{ fileName = '2025-2026-JS3-BSCI-3RD'; subjectDirectory = 'Basic_Science' },
  
  # Basic Technology
  @{ fileName = '2025-2026-JS1-BTEC-1ST'; subjectDirectory = 'Basic_Technology' },
  @{ fileName = '2025-2026-JS1-BTEC-2ND'; subjectDirectory = 'Basic_Technology' },
  @{ fileName = '2025-2026-JS1-BTEC-3RD'; subjectDirectory = 'Basic_Technology' },
  @{ fileName = '2025-2026-JS2-BTEC-1ST'; subjectDirectory = 'Basic_Technology' },
  @{ fileName = '2025-2026-JS2-BTEC-2ND'; subjectDirectory = 'Basic_Technology' },
  @{ fileName = '2025-2026-JS2-BTEC-3RD'; subjectDirectory = 'Basic_Technology' },
  @{ fileName = '2025-2026-JS3-BTEC-1ST'; subjectDirectory = 'Basic_Technology' },
  @{ fileName = '2025-2026-JS3-BTEC-2ND'; subjectDirectory = 'Basic_Technology' },
  @{ fileName = '2025-2026-JS3-BTEC-3RD'; subjectDirectory = 'Basic_Technology' },
  
  # Business Studies
  @{ fileName = '2025-2026-JS1-BSTU-1ST'; subjectDirectory = 'Business_Studies' },
  @{ fileName = '2025-2026-JS1-BSTU-2ND'; subjectDirectory = 'Business_Studies' },
  @{ fileName = '2025-2026-JS1-BSTU-3RD'; subjectDirectory = 'Business_Studies' },
  @{ fileName = '2025-2026-JS2-BSTU-1ST'; subjectDirectory = 'Business_Studies' },
  @{ fileName = '2025-2026-JS2-BSTU-2ND'; subjectDirectory = 'Business_Studies' },
  @{ fileName = '2025-2026-JS2-BSTU-3RD'; subjectDirectory = 'Business_Studies' },
  @{ fileName = '2025-2026-JS3-BSTU-1ST'; subjectDirectory = 'Business_Studies' },
  @{ fileName = '2025-2026-JS3-BSTU-2ND'; subjectDirectory = 'Business_Studies' },
  @{ fileName = '2025-2026-JS3-BSTU-3RD'; subjectDirectory = 'Business_Studies' },
  
  # Christian Religious Studies
  @{ fileName = '2025-2026-JS1-CRS-1ST'; subjectDirectory = 'Christian_Religious_Studies' },
  @{ fileName = '2025-2026-JS1-CRS-2ND'; subjectDirectory = 'Christian_Religious_Studies' },
  @{ fileName = '2025-2026-JS1-CRS-3RD'; subjectDirectory = 'Christian_Religious_Studies' },
  @{ fileName = '2025-2026-JS2-CRS-1ST'; subjectDirectory = 'Christian_Religious_Studies' },
  @{ fileName = '2025-2026-JS2-CRS-2ND'; subjectDirectory = 'Christian_Religious_Studies' },
  @{ fileName = '2025-2026-JS2-CRS-3RD'; subjectDirectory = 'Christian_Religious_Studies' },
  @{ fileName = '2025-2026-JS3-CRS-1ST'; subjectDirectory = 'Christian_Religious_Studies' },
  @{ fileName = '2025-2026-JS3-CRS-2ND'; subjectDirectory = 'Christian_Religious_Studies' },
  @{ fileName = '2025-2026-JS3-CRS-3RD'; subjectDirectory = 'Christian_Religious_Studies' },

  # Civic Education
  @{ fileName = '2025-2026-JS1-CEDU-1ST'; subjectDirectory = 'Civic_Education' },
  @{ fileName = '2025-2026-JS1-CEDU-2ND'; subjectDirectory = 'Civic_Education' },
  @{ fileName = '2025-2026-JS1-CEDU-3RD'; subjectDirectory = 'Civic_Education' },
  @{ fileName = '2025-2026-JS2-CEDU-1ST'; subjectDirectory = 'Civic_Education' },
  @{ fileName = '2025-2026-JS2-CEDU-2ND'; subjectDirectory = 'Civic_Education' },
  @{ fileName = '2025-2026-JS2-CEDU-3RD'; subjectDirectory = 'Civic_Education' },
  @{ fileName = '2025-2026-JS3-CEDU-1ST'; subjectDirectory = 'Civic_Education' },
  @{ fileName = '2025-2026-JS3-CEDU-2ND'; subjectDirectory = 'Civic_Education' },
  @{ fileName = '2025-2026-JS3-CEDU-3RD'; subjectDirectory = 'Civic_Education' },

  # Computer Studies
  @{ fileName = '2025-2026-JS1-COMP-1ST'; subjectDirectory = 'Computer_Studies' },
  @{ fileName = '2025-2026-JS1-COMP-2ND'; subjectDirectory = 'Computer_Studies' },
  @{ fileName = '2025-2026-JS1-COMP-3RD'; subjectDirectory = 'Computer_Studies' },
  @{ fileName = '2025-2026-JS2-COMP-1ST'; subjectDirectory = 'Computer_Studies' },
  @{ fileName = '2025-2026-JS2-COMP-2ND'; subjectDirectory = 'Computer_Studies' },
  @{ fileName = '2025-2026-JS2-COMP-3RD'; subjectDirectory = 'Computer_Studies' },
  @{ fileName = '2025-2026-JS3-COMP-1ST'; subjectDirectory = 'Computer_Studies' },
  @{ fileName = '2025-2026-JS3-COMP-2ND'; subjectDirectory = 'Computer_Studies' },
  @{ fileName = '2025-2026-JS3-COMP-3RD'; subjectDirectory = 'Computer_Studies' },

  # Cultural and Creative Art
  @{ fileName = '2025-2026-JS1-CCA-1ST'; subjectDirectory = 'Cultural_Creative_Art' },
  @{ fileName = '2025-2026-JS1-CCA-2ND'; subjectDirectory = 'Cultural_Creative_Art' },
  @{ fileName = '2025-2026-JS1-CCA-3RD'; subjectDirectory = 'Cultural_Creative_Art' },
  @{ fileName = '2025-2026-JS2-CCA-1ST'; subjectDirectory = 'Cultural_Creative_Art' },
  @{ fileName = '2025-2026-JS2-CCA-2ND'; subjectDirectory = 'Cultural_Creative_Art' }, # Corrected from JS2-2ND
  @{ fileName = '2025-2026-JS2-CCA-3RD'; subjectDirectory = 'Cultural_Creative_Art' },
  @{ fileName = '2025-2026-JS3-CCA-1ST'; subjectDirectory = 'Cultural_Creative_Art' },
  @{ fileName = '2025-2026-JS3-CCA-2ND'; subjectDirectory = 'Cultural_Creative_Art' },
  @{ fileName = '2025-2026-JS3-CCA-3RD'; subjectDirectory = 'Cultural_Creative_Art' },
 
  # Dictation
  @{ fileName = '2025-2026-JS1-DITA-1ST'; subjectDirectory = 'Dictation' },
  @{ fileName = '2025-2026-JS1-DITA-2ND'; subjectDirectory = 'Dictation' },
  @{ fileName = '2025-2026-JS1-DITA-3RD'; subjectDirectory = 'Dictation' },
  @{ fileName = '2025-2026-JS2-DITA-1ST'; subjectDirectory = 'Dictation' },
  @{ fileName = '2025-2026-JS2-DITA-2ND'; subjectDirectory = 'Dictation' },
  @{ fileName = '2025-2026-JS2-DITA-3RD'; subjectDirectory = 'Dictation' },
  @{ fileName = '2025-2026-JS3-DITA-1ST'; subjectDirectory = 'Dictation' },
  @{ fileName = '2025-2026-JS3-DITA-2ND'; subjectDirectory = 'Dictation' },
  @{ fileName = '2025-2026-JS3-DITA-3RD'; subjectDirectory = 'Dictation' },

  # Junior Diction
  @{ fileName = '2025-2026-JS1-DION-1ST'; subjectDirectory = 'Junior_Diction' },
  @{ fileName = '2025-2026-JS1-DION-2ND'; subjectDirectory = 'Junior_Diction' },
  @{ fileName = '2025-2026-JS1-DION-3RD'; subjectDirectory = 'Junior_Diction' },
  @{ fileName = '2025-2026-JS2-DION-1ST'; subjectDirectory = 'Junior_Diction' },
  @{ fileName = '2025-2026-JS2-DION-2ND'; subjectDirectory = 'Junior_Diction' },
  @{ fileName = '2025-2026-JS2-DION-3RD'; subjectDirectory = 'Junior_Diction' },
  @{ fileName = '2025-2026-JS3-DION-1ST'; subjectDirectory = 'Junior_Diction' },
  @{ fileName = '2025-2026-JS3-DION-2ND'; subjectDirectory = 'Junior_Diction' },
  @{ fileName = '2025-2026-JS3-DION-3RD'; subjectDirectory = 'Junior_Diction' },

  # English Studies
  @{ fileName = '2025-2026-JS1-ENG-1ST'; subjectDirectory = 'English_Studies' },
  @{ fileName = '2025-2026-JS1-ENG-2ND'; subjectDirectory = 'English_Studies' },
  @{ fileName = '2025-2026-JS1-ENG-3RD'; subjectDirectory = 'English_Studies' },
  @{ fileName = '2025-2026-JS2-ENG-1ST'; subjectDirectory = 'English_Studies' },
  @{ fileName = '2025-2026-JS2-ENG-2ND'; subjectDirectory = 'English_Studies' },
  @{ fileName = '2025-2026-JS2-ENG-3RD'; subjectDirectory = 'English_Studies' },
  @{ fileName = '2025-2026-JS3-ENG-1ST'; subjectDirectory = 'English_Studies' },
  @{ fileName = '2025-2026-JS3-ENG-2ND'; subjectDirectory = 'English_Studies' },
  @{ fileName = '2025-2026-JS3-ENG-3RD'; subjectDirectory = 'English_Studies' },

  # French
  @{ fileName = '2025-2026-JS1-FRE-1ST'; subjectDirectory = 'French' },
  @{ fileName = '2025-2026-JS1-FRE-2ND'; subjectDirectory = 'French' },
  @{ fileName = '2025-2026-JS1-FRE-3RD'; subjectDirectory = 'French' },
  @{ fileName = '2025-2026-JS2-FRE-1ST'; subjectDirectory = 'French' },
  @{ fileName = '2025-2026-JS2-FRE-2ND'; subjectDirectory = 'French' },
  @{ fileName = '2025-2026-JS2-FRE-3RD'; subjectDirectory = 'French' },
  @{ fileName = '2025-2026-JS3-FRE-1ST'; subjectDirectory = 'French' },
  @{ fileName = '2025-2026-JS3-FRE-2ND'; subjectDirectory = 'French' },
  @{ fileName = '2025-2026-JS3-FRE-3RD'; subjectDirectory = 'French' },

  # Historical Studies
  @{ fileName = '2025-2026-JS1-HIS-1ST'; subjectDirectory = 'Historical_Studies' },
  @{ fileName = '2025-2026-JS1-HIS-2ND'; subjectDirectory = 'Historical_Studies' },
  @{ fileName = '2025-2026-JS1-HIS-3RD'; subjectDirectory = 'Historical_Studies' },
  @{ fileName = '2025-2026-JS2-HIS-1ST'; subjectDirectory = 'Historical_Studies' },
  @{ fileName = '2025-2026-JS2-HIS-2ND'; subjectDirectory = 'Historical_Studies' },
  @{ fileName = '2025-2026-JS2-HIS-3RD'; subjectDirectory = 'Historical_Studies' },
  @{ fileName = '2025-2026-JS3-HIS-1ST'; subjectDirectory = 'Historical_Studies' },
  @{ fileName = '2025-2026-JS3-HIS-2ND'; subjectDirectory = 'Historical_Studies' },
  @{ fileName = '2025-2026-JS3-HIS-3RD'; subjectDirectory = 'Historical_Studies' },

  # Home Economics
  @{ fileName = '2025-2026-JS1-HOM-1ST'; subjectDirectory = 'Home_Economics' },
  @{ fileName = '2025-2026-JS1-HOM-2ND'; subjectDirectory = 'Home_Economics' },
  @{ fileName = '2025-2026-JS1-HOM-3RD'; subjectDirectory = 'Home_Economics' },
  @{ fileName = '2025-2026-JS2-HOM-1ST'; subjectDirectory = 'Home_Economics' },
  @{ fileName = '2025-2026-JS2-HOM-2ND'; subjectDirectory = 'Home_Economics' },
  @{ fileName = '2025-2026-JS2-HOM-3RD'; subjectDirectory = 'Home_Economics' },
  @{ fileName = '2025-2026-JS3-HOM-1ST'; subjectDirectory = 'Home_Economics' },
  @{ fileName = '2025-2026-JS3-HOM-2ND'; subjectDirectory = 'Home_Economics' },
  @{ fileName = '2025-2026-JS3-HOM-3RD'; subjectDirectory = 'Home_Economics' },

  # Mathematics
  @{ fileName = '2025-2026-JS1-MAT-1ST'; subjectDirectory = 'Mathematics' },
  @{ fileName = '2025-2026-JS1-MAT-2ND'; subjectDirectory = 'Mathematics' },
  @{ fileName = '2025-2026-JS1-MAT-3RD'; subjectDirectory = 'Mathematics' },
  @{ fileName = '2025-2026-JS2-MAT-1ST'; subjectDirectory = 'Mathematics' },
  @{ fileName = '2025-2026-JS2-MAT-2ND'; subjectDirectory = 'Mathematics' },
  @{ fileName = '2025-2026-JS2-MAT-3RD'; subjectDirectory = 'Mathematics' },
  @{ fileName = '2025-2026-JS3-MAT-1ST'; subjectDirectory = 'Mathematics' },
  @{ fileName = '2025-2026-JS3-MAT-2ND'; subjectDirectory = 'Mathematics' },
  @{ fileName = '2025-2026-JS3-MAT-3RD'; subjectDirectory = 'Mathematics' },

  # Music
  @{ fileName = '2025-2026-JS1-MUS-1ST'; subjectDirectory = 'Music' },
  @{ fileName = '2025-2026-JS1-MUS-2ND'; subjectDirectory = 'Music' },
  @{ fileName = '2025-2026-JS1-MUS-3RD'; subjectDirectory = 'Music' },
  @{ fileName = '2025-2026-JS2-MUS-1ST'; subjectDirectory = 'Music' }, # Corrected from MUS-
  @{ fileName = '2025-2026-JS2-MUS-2ND'; subjectDirectory = 'Music' },
  @{ fileName = '2025-2026-JS2-MUS-3RD'; subjectDirectory = 'Music' },
  @{ fileName = '2025-2026-JS3-MUS-1ST'; subjectDirectory = 'Music' },
  @{ fileName = '2025-2026-JS3-MUS-2ND'; subjectDirectory = 'Music' },
  @{ fileName = '2025-2026-JS3-MUS-3RD'; subjectDirectory = 'Music' },

  # Physical And Health Education
  @{ fileName = '2025-2026-JS1-PHE-1ST'; subjectDirectory = 'Physical_Health_Education' },
  @{ fileName = '2025-2026-JS1-PHE-2ND'; subjectDirectory = 'Physical_Health_Education' },
  @{ fileName = '2025-2026-JS1-PHE-3RD'; subjectDirectory = 'Physical_Health_Education' },
  @{ fileName = '2025-2026-JS2-PHE-1ST'; subjectDirectory = 'Physical_Health_Education' },
  @{ fileName = '2025-2026-JS2-PHE-2ND'; subjectDirectory = 'Physical_Health_Education' },
  @{ fileName = '2025-2026-JS2-PHE-3RD'; subjectDirectory = 'Physical_Health_Education' },
  @{ fileName = '2025-2026-JS3-PHE-1ST'; subjectDirectory = 'Physical_Health_Education' },
  @{ fileName = '2025-2026-JS3-PHE-2ND'; subjectDirectory = 'Physical_Health_Education' },
  @{ fileName = '2025-2026-JS3-PHE-3RD'; subjectDirectory = 'Physical_Health_Education' },

  # Security Education
  @{ fileName = '2025-2026-JS1-SEC-1ST'; subjectDirectory = 'Security_Education' },
  @{ fileName = '2025-2026-JS1-SEC-2ND'; subjectDirectory = 'Security_Education' },
  @{ fileName = '2025-2026-JS1-SEC-3RD'; subjectDirectory = 'Security_Education' },
  @{ fileName = '2025-2026-JS2-SEC-1ST'; subjectDirectory = 'Security_Education' },
  @{ fileName = '2025-2026-JS2-SEC-2ND'; subjectDirectory = 'Security_Education' },
  @{ fileName = '2025-2026-JS2-SEC-3RD'; subjectDirectory = 'Security_Education' },
  @{ fileName = '2025-2026-JS3-SEC-1ST'; subjectDirectory = 'Security_Education' },
  @{ fileName = '2025-2026-JS3-SEC-2ND'; subjectDirectory = 'Security_Education' },
  @{ fileName = '2025-2026-JS3-SEC-3RD'; subjectDirectory = 'Security_Education' },

  # Social Studies
  @{ fileName = '2025-2026-JS1-SOS-1ST'; subjectDirectory = 'Social_Studies' },
  @{ fileName = '2025-2026-JS1-SOS-2ND'; subjectDirectory = 'Social_Studies' },
  @{ fileName = '2025-2026-JS1-SOS-3RD'; subjectDirectory = 'Social_Studies' },
  @{ fileName = '2025-2026-JS2-SOS-1ST'; subjectDirectory = 'Social_Studies' },
  @{ fileName = '2025-2026-JS2-SOS-2ND'; subjectDirectory = 'Social_Studies' },
  @{ fileName = '2025-2026-JS2-SOS-3RD'; subjectDirectory = 'Social_Studies' },
  @{ fileName = '2025-2026-JS3-SOS-1ST'; subjectDirectory = 'Social_Studies' },
  @{ fileName = '2025-2026-JS3-SOS-2ND'; subjectDirectory = 'Social_Studies' },
  @{ fileName = '2025-2026-JS3-SOS-3RD'; subjectDirectory = 'Social_Studies' }
)

# --- STEP 3: THE AUTOMATION LOGIC ---

Write-Host "Starting empty exam file generation..." -ForegroundColor Green

# Create the base directory if it doesn't exist
if (-not (Test-Path -Path $baseOutputDirectory)) {
    New-Item -ItemType Directory -Path $baseOutputDirectory | Out-Null
    Write-Host "Created base directory: $baseOutputDirectory" -ForegroundColor Yellow
}

foreach ($exam in $allExams) {
    # 3a. Create the path for the subject's folder
    $subjectPath = Join-Path -Path $baseOutputDirectory -ChildPath $exam.subjectDirectory

    # 3b. Create the subject folder IF it doesn't already exist
    if (-not (Test-Path -Path $subjectPath)) {
        New-Item -ItemType Directory -Path $subjectPath | Out-Null
        Write-Host "Created new directory: $subjectPath" -ForegroundColor Yellow
    }

    # 3c. Create the full path for the final JSON file
    $jsonFileName = $exam.fileName + ".json"
    $jsonFilePath = Join-Path -Path $subjectPath -ChildPath $jsonFileName

    # 3d. Create a new, empty file. -Force will overwrite if it exists.
    New-Item -ItemType File -Path $jsonFilePath -Force | Out-Null
    
    # 3e. Give the user feedback
    Write-Host "  - Created empty file: $jsonFileName in $($exam.subjectDirectory)"
}

Write-Host "Process complete! All empty exam files have been created in '$baseOutputDirectory'." -ForegroundColor Green