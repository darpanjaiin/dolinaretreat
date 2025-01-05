document.addEventListener('DOMContentLoaded', function() {
    const galleryGrid = document.querySelector('.gallery-grid');
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-indicator';
    loadingIndicator.innerHTML = '<div class="spinner"></div><p>Loading gallery...</p>';
    galleryGrid.appendChild(loadingIndicator);

    // Define the image configurations
    const cottages = {
        'mistletoe': {
            path: 'assets/gallery/rooms/Mistletoe Cottage',
            total: 10,
            jpegIndices: [1, 2, 7] // These are .jpeg, rest are .jpg
        },
        'oak': {
            path: 'assets/gallery/rooms/Oak Cottage',
            total: 4,
            jpegIndices: [4] // Only 10 is .jpeg, rest are .jpg
        },
        'refuge': {
            path: 'assets/gallery/rooms/Refuge Family Cottage',
            total: 9,
            jpegIndices: [] // All are .jpg
        },
        'treehouse': {
            path: 'assets/gallery/rooms/Tree house',
            total: 10,
            jpegIndices: [8] // Only 8 is .jpeg, rest are .jpg
        },
        'walnut': {
            path: 'assets/gallery/rooms/Walnut cottage',
            total: 8,
            jpegIndices: [1] // Only 1 is .jpeg, rest are .jpg
        },
        'property': {
            path: 'assets/gallery/rooms/Property',
            total: 2,
            jpegIndices: [] // All are .jpg
        }
    };

    // Intersection Observer for lazy loading
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.onload = () => img.classList.add('loaded');
                    img.onerror = () => {
                        console.error('Failed to load image:', img.dataset.src);
                    };
                }
                imageObserver.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.1
    });

    function createGalleryItem(imagePath, category) {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.dataset.category = category;

        const img = document.createElement('img');
        img.className = 'lazy';
        img.dataset.src = imagePath;
        img.alt = `${category} cottage view`;
        img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        
        item.appendChild(img);
        imageObserver.observe(img);
        return item;
    }

    function loadCottageImages() {
        let totalImagesLoaded = 0;
        const fragment = document.createDocumentFragment();

        for (const [category, info] of Object.entries(cottages)) {
            for (let i = 1; i <= info.total; i++) {
                const extension = info.jpegIndices.includes(i) ? '.jpeg' : '.jpg';
                const imagePath = `${info.path}/${i}${extension}`;
                const item = createGalleryItem(imagePath, category);
                fragment.appendChild(item);
                totalImagesLoaded++;
            }
        }

        galleryGrid.appendChild(fragment);
        loadingIndicator.remove();
        console.log(`Total images loaded: ${totalImagesLoaded}`);
    }

    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            document.querySelectorAll('.gallery-item').forEach(item => {
                item.style.display = (filter === 'all' || item.dataset.category === filter) ? 'block' : 'none';
            });
        });
    });

    // Lightbox functionality
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = lightbox.querySelector('.lightbox-image');
    let currentImages = [];
    let currentImageIndex = 0;

    galleryGrid.addEventListener('click', e => {
        const item = e.target.closest('.gallery-item');
        if (!item) return;

        const img = item.querySelector('img');
        const imgSrc = img.dataset.src || img.src;
        
        const filter = document.querySelector('.filter-btn.active').dataset.filter;
        currentImages = Array.from(document.querySelectorAll('.gallery-item'))
            .filter(i => filter === 'all' || i.dataset.category === filter)
            .map(i => i.querySelector('img').dataset.src || i.querySelector('img').src);
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

    // Initialize gallery
    loadCottageImages();
}); 