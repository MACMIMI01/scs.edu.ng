document.addEventListener('DOMContentLoaded', async () => {
    const humanSkeletonImg = document.getElementById('human-skeleton-img');
    const hotspotsContainer = document.getElementById('bone-hotspots-container');
    const boneNameSpan = document.getElementById('bone-name');
    const boneCommonNameSpan = document.getElementById('bone-common-name');
    const boneRegionSpan = document.getElementById('bone-region');
    const boneDescriptionSpan = document.getElementById('bone-description');
    const feedbackMessage = document.getElementById('feedback-message');
    const boneSearchInput = document.getElementById('bone-search-input'); // New
    const searchResultsUl = document.getElementById('search-results');     // New

    let allBonesData = []; // This will store the loaded JSON data
    let activeHotspot = null; // To keep track of the currently active hotspot

    // Function to load bone data from JSON
    async function loadBoneData() {
        try {
            const response = await fetch('boneData.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            allBonesData = data.bones;
            feedbackMessage.textContent = `Loaded ${allBonesData.length} bone entries. Click a bone on the skeleton or use the search bar!`;
        } catch (error) {
            console.error('Error loading bone data:', error);
            feedbackMessage.textContent = 'Failed to load bone data. Please check the boneData.json file path and format.';
        }
    }

    // Function to create hotspots based on loaded bone data
    function createBoneHotspots() {
        hotspotsContainer.innerHTML = ''; // Clear existing hotspots
        const imgWidth = humanSkeletonImg.naturalWidth; // Original width of the image
        const imgHeight = humanSkeletonImg.naturalHeight; // Original height of the image
        const displayWidth = humanSkeletonImg.clientWidth; // Current displayed width of the image
        const displayHeight = humanSkeletonImg.clientHeight; // Current displayed height of the image

        // Calculate scaling factors
        const scaleX = displayWidth / imgWidth;
        const scaleY = displayHeight / imgHeight;

        allBonesData.forEach(bone => {
            const hotspot = document.createElement('div');
            hotspot.classList.add('bone-hotspot');
            hotspot.dataset.boneId = bone.id; // Store bone ID for easy lookup

            // Apply scaling to position and size
            hotspot.style.left = `${bone.x * scaleX}px`;
            hotspot.style.top = `${bone.y * scaleY}px`;
            hotspot.style.width = `${bone.width * scaleX}px`;
            hotspot.style.height = `${bone.height * scaleY}px`;

            hotspot.addEventListener('click', () => {
                selectBone(bone.id);
            });
            hotspotsContainer.appendChild(hotspot);
        });
    }

    // Function to display bone details in the info panel and highlight hotspot
    function displayBoneDetails(bone) {
        boneNameSpan.textContent = bone.name || 'N/A';
        boneCommonNameSpan.textContent = bone.commonName || 'N/A';
        boneRegionSpan.textContent = bone.region || 'N/A';
        boneDescriptionSpan.textContent = bone.description || 'No description available.';
    }

    // Function to select a bone (from click or search)
    function selectBone(boneId) {
        // Remove 'active' class from previous hotspot
        if (activeHotspot) {
            activeHotspot.classList.remove('active');
        }

        // Find the corresponding hotspot and data
        const selectedHotspot = document.querySelector(`.bone-hotspot[data-bone-id="${boneId}"]`);
        const selectedBone = allBonesData.find(bone => bone.id === boneId);

        if (selectedHotspot && selectedBone) {
            selectedHotspot.classList.add('active');
            activeHotspot = selectedHotspot;
            displayBoneDetails(selectedBone);

            // Scroll to the bone if it's not in view (optional, but good UX)
            selectedHotspot.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        } else {
            console.warn(`Bone with ID ${boneId} not found or hotspot missing.`);
            // Optionally, clear details or show an error
        }

        // Clear search input and hide results after selection
        boneSearchInput.value = '';
        searchResultsUl.classList.remove('show');
    }

    // Initialize display with default message
    function initializeDisplay() {
        boneNameSpan.textContent = 'Select a bone';
        boneCommonNameSpan.textContent = '';
        boneRegionSpan.textContent = '';
        boneDescriptionSpan.textContent = 'Click on any part of the skeleton or use the search bar to see its details here.';
    }

    // --- Search functionality ---
    boneSearchInput.addEventListener('input', () => {
        const searchTerm = boneSearchInput.value.toLowerCase().trim();
        searchResultsUl.innerHTML = ''; // Clear previous results

        if (searchTerm.length < 2) { // Only search if at least 2 characters are typed
            searchResultsUl.classList.remove('show');
            return;
        }

        const filteredBones = allBonesData.filter(bone =>
            bone.name.toLowerCase().includes(searchTerm) ||
            (bone.commonName && bone.commonName.toLowerCase().includes(searchTerm)) ||
            bone.region.toLowerCase().includes(searchTerm)
        );

        if (filteredBones.length > 0) {
            filteredBones.forEach(bone => {
                const li = document.createElement('li');
                li.textContent = bone.name;
                // Add common name if different and present
                if (bone.commonName && bone.commonName.toLowerCase() !== bone.name.toLowerCase()) {
                    li.textContent += ` (${bone.commonName})`;
                }
                li.dataset.boneId = bone.id;
                li.addEventListener('click', () => {
                    selectBone(bone.id);
                });
                searchResultsUl.appendChild(li);
            });
            searchResultsUl.classList.add('show');
        } else {
            const li = document.createElement('li');
            li.textContent = 'No bones found.';
            li.style.cursor = 'default';
            searchResultsUl.appendChild(li);
            searchResultsUl.classList.add('show');
        }
    });

    // Hide search results when clicking outside
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.search-section')) {
            searchResultsUl.classList.remove('show');
        }
    });
    // --- End Search functionality ---


    // Main execution flow
    await loadBoneData(); // Load the bone data first

    // Create hotspots once the image is loaded AND the DOM is ready
    // This ensures clientWidth/clientHeight are accurate
    if (humanSkeletonImg.complete) {
        // Image is already loaded (e.g., from browser cache)
        createBoneHotspots();
        initializeDisplay();
    } else {
        // Image is still loading, wait for it
        humanSkeletonImg.addEventListener('load', () => {
            createBoneHotspots();
            initializeDisplay();
        });
        humanSkeletonImg.addEventListener('error', () => {
            console.error('Error loading skeleton image.');
            feedbackMessage.textContent = 'Failed to load the skeleton image. Please check the image path.';
        });
    }

    // Recalculate and recreate hotspots if the window is resized
    // This is important for responsiveness if the image scales
    window.addEventListener('resize', createBoneHotspots);
});
