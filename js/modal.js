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

// Function to get the correct file extension for a given cottage and image number
function getImagePath(cottage, imageNumber) {
    const basePath = imagePaths[cottage];
    const isJpeg = fileExtensions[cottage].jpeg.includes(imageNumber);
    const extension = isJpeg ? 'jpeg' : 'jpg';
    return `${basePath}/${imageNumber}.${extension}`;
}

// ... existing code ... 