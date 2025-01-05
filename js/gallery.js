document.addEventListener('DOMContentLoaded', function() {
    const galleryGrid = document.querySelector('.gallery-grid');
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-indicator';
    loadingIndicator.innerHTML = '<div class="spinner"></div><p>Loading gallery...</p>';
    galleryGrid.appendChild(loadingIndicator);

    // Define image paths with correct extensions and consistent casing
    const cottages = {
        'mistletoe': {
            basePath: 'assets/gallery/rooms/Mistletoe Cottage',
            images: [
                '1.jpeg', '2.jpeg', '3.jpg', '4.jpg', '5.jpg',
                '6.jpg', '7.jpeg', '8.jpg', '9.jpg', '10.jpg'
            ]
        },
        'oak': {
            basePath: 'assets/gallery/rooms/Oak Cottage',
            images: ['1.jpg', '2.jpg', '3.jpg', '4.jpeg']
        },
        'refuge': {
            basePath: 'assets/gallery/rooms/Refuge Family Cottage',
            images: Array.from({length: 9}, (_, i) => `${i + 1}.jpg`)
        },
        'treehouse': {
            basePath: 'assets/gallery/rooms/Treehouse',
            images: Array.from({length: 10}, (_, i) => `${i + 1}.jpg`).map((name, i) => 
                i === 7 ? '8.jpeg' : name
            )
        },
        'walnut': {
            basePath: 'assets/gallery/rooms/Walnut Cottage',
            images: ['1.jpeg', ...Array.from({length: 7}, (_, i) => `${i + 2}.jpg`)]
        },
        'property': {
            basePath: 'assets/gallery/rooms/Property',
            images: Array.from({length: 5}, (_, i) => `${i + 1}.jpg`)
        }
    };

    // Create all gallery items
    const fragment = document.createDocumentFragment();

    Object.entries(cottages).forEach(([category, {basePath, images}]) => {
        images.forEach(imageName => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.dataset.category = category;
            item.style.display = category === 'treehouse' ? 'block' : 'none';

            const img = document.createElement('img');
            const primaryPath = `${basePath}/${imageName}`;
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
                    await tryLoadImage(primaryPath);
                    img.src = primaryPath;
                } catch {
                    // If primary fails, try the alternate extension
                    const ext = primaryPath.split('.').pop().toLowerCase();
                    const altExt = ext === 'jpg' ? 'jpeg' : 'jpg';
                    const altPath = primaryPath.replace(`.${ext}`, `.${altExt}`);
                    
                    try {
                        await tryLoadImage(altPath);
                        img.src = altPath;
                    } catch {
                        // If both fail, use placeholder
                        img.src = 'assets/placeholder.jpg';
                        img.alt = 'Image not available';
                        console.error(`Failed to load image: ${primaryPath}`);
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