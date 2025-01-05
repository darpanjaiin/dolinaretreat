document.addEventListener('DOMContentLoaded', function() {
    const galleryGrid = document.querySelector('.gallery-grid');
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-indicator';
    loadingIndicator.innerHTML = '<div class="spinner"></div><p>Loading gallery...</p>';
    galleryGrid.appendChild(loadingIndicator);

    // Image paths configuration
    const imagePaths = {
        'mistletoe': 'assets/gallery/rooms/mistletoe',
        'oak': 'assets/gallery/rooms/oak',
        'refuge': 'assets/gallery/rooms/refuge',
        'treehouse': 'assets/gallery/rooms/tree',
        'walnut': 'assets/gallery/rooms/walnut',
        'property': 'assets/gallery/rooms/property'
    };

    // File extension mapping for each image
    const fileExtensions = {
        'mistletoe': {
            total: 10,
            jpeg: [1, 2, 7],  // These are .jpeg
            jpg: [3, 4, 5, 6, 8, 9, 10]  // These are .jpg
        },
        'oak': {
            total: 4,
            jpeg: [4],  // These are .jpeg
            jpg: [1, 2, 3]  // These are .jpg
        },
        'property': {
            total: 5,
            jpg: [1, 2, 3, 4, 5]  // All are .jpg
        },
        'refuge': {
            total: 9,
            jpg: [1, 2, 3, 4, 5, 6, 7, 8, 9]  // All are .jpg
        },
        'treehouse': {
            total: 10,
            jpeg: [8],  // This is .jpeg
            jpg: [1, 2, 3, 4, 5, 6, 7, 9, 10]  // These are .jpg
        },
        'walnut': {
            total: 8,
            jpeg: [1],  // This is .jpeg
            jpg: [2, 3, 4, 5, 6, 7, 8]  // These are .jpg
        }
    };

    // Create all gallery items
    const fragment = document.createDocumentFragment();

    Object.entries(imagePaths).forEach(([category, basePath]) => {
        fileExtensions[category].jpeg.forEach(jpegIndex => {
            const imageName = `${jpegIndex}.jpeg`;
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.dataset.category = category;
            item.style.display = category === 'treehouse' ? 'block' : 'none';

            const img = document.createElement('img');
            img.alt = `${category} view`;
            img.loading = 'lazy';
            img.decoding = 'async';
            img.width = 300;
            img.height = 200;

            // Enhanced error handling for image loading
            const tryLoadImage = (path) => {
                return new Promise((resolve, reject) => {
                    const tempImg = new Image();
                    tempImg.onload = () => resolve(path);
                    tempImg.onerror = () => reject();
                    tempImg.src = path;
                });
            };

            // Try loading with both extensions
            const loadWithFallback = async () => {
                try {
                    // Try the primary path first
                    await tryLoadImage(`${basePath}/${imageName}`);
                    img.src = `${basePath}/${imageName}`;
                } catch {
                    // If primary fails, try the alternate extension
                    const ext = imageName.split('.').pop().toLowerCase();
                    const altExt = ext === 'jpg' ? 'jpeg' : 'jpg';
                    const altPath = imageName.replace(`.${ext}`, `.${altExt}`);
                    
                    try {
                        await tryLoadImage(`${basePath}/${altPath}`);
                        img.src = `${basePath}/${altPath}`;
                    } catch {
                        // If both fail, use placeholder
                        img.src = 'assets/placeholder.jpg';
                        img.alt = 'Image not available';
                        console.error(`Failed to load image: ${basePath}/${imageName}`);
                    }
                }
            };

            loadWithFallback();

            // Add load event listener for fade-in effect
            img.onload = () => {
                img.classList.add('loaded');
                item.classList.add('loaded');
            };
            
            item.appendChild(img);
            fragment.appendChild(item);
        });

        fileExtensions[category].jpg.forEach(jpgIndex => {
            const imageName = `${jpgIndex}.jpg`;
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.dataset.category = category;
            item.style.display = category === 'treehouse' ? 'block' : 'none';

            const img = document.createElement('img');
            img.alt = `${category} view`;
            img.loading = 'lazy';
            img.decoding = 'async';
            img.width = 300;
            img.height = 200;

            // Enhanced error handling for image loading
            const tryLoadImage = (path) => {
                return new Promise((resolve, reject) => {
                    const tempImg = new Image();
                    tempImg.onload = () => resolve(path);
                    tempImg.onerror = () => reject();
                    tempImg.src = path;
                });
            };

            // Try loading with both extensions
            const loadWithFallback = async () => {
                try {
                    // Try the primary path first
                    await tryLoadImage(`${basePath}/${imageName}`);
                    img.src = `${basePath}/${imageName}`;
                } catch {
                    // If primary fails, try the alternate extension
                    const ext = imageName.split('.').pop().toLowerCase();
                    const altExt = ext === 'jpg' ? 'jpeg' : 'jpg';
                    const altPath = imageName.replace(`.${ext}`, `.${altExt}`);
                    
                    try {
                        await tryLoadImage(`${basePath}/${altPath}`);
                        img.src = `${basePath}/${altPath}`;
                    } catch {
                        // If both fail, use placeholder
                        img.src = 'assets/placeholder.jpg';
                        img.alt = 'Image not available';
                        console.error(`Failed to load image: ${basePath}/${imageName}`);
                    }
                }
            };

            loadWithFallback();

            // Add load event listener for fade-in effect
            img.onload = () => {
                img.classList.add('loaded');
                item.classList.add('loaded');
            };
            
            item.appendChild(img);
            fragment.appendChild(item);
        });
    });

    // Remove loading indicator and append all items
    galleryGrid.appendChild(fragment);
    loadingIndicator.remove();

    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            
            // Update active button
            filterButtons.forEach(b => b.classList.remove('filter-btn-selected', 'active'));
            btn.classList.add('filter-btn-selected', 'active');

            // Filter items with animation
            document.querySelectorAll('.gallery-item').forEach(item => {
                if (filter === item.dataset.category) {
                    item.style.display = 'block';
                    setTimeout(() => item.classList.add('visible'), 10);
                } else {
                    item.classList.remove('visible');
                    setTimeout(() => item.style.display = 'none', 300);
                }
            });
        });
    });

    // Set initial active state
    const defaultFilter = document.querySelector('.filter-btn[data-filter="treehouse"]');
    if (defaultFilter) {
        defaultFilter.classList.add('filter-btn-selected', 'active');
    }

    // Lightbox functionality
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = lightbox.querySelector('.lightbox-image');
    let currentImages = [];
    let currentImageIndex = 0;

    galleryGrid.addEventListener('click', e => {
        const item = e.target.closest('.gallery-item');
        if (!item) return;

        const img = item.querySelector('img');
        const imgSrc = img.src;
        
        // Get current filter
        const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter;
        
        // Get all visible images
        currentImages = Array.from(document.querySelectorAll('.gallery-item'))
            .filter(i => i.dataset.category === activeFilter)
            .map(i => i.querySelector('img').src);
        
        currentImageIndex = currentImages.indexOf(imgSrc);
        lightboxImg.src = imgSrc;
        lightbox.classList.add('active');
    });

    // Navigation handlers
    document.querySelector('.prev-btn').addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
        lightboxImg.src = currentImages[currentImageIndex];
    });

    document.querySelector('.next-btn').addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % currentImages.length;
        lightboxImg.src = currentImages[currentImageIndex];
    });

    document.querySelector('.close-lightbox').addEventListener('click', () => {
        lightbox.classList.remove('active');
    });
}); 