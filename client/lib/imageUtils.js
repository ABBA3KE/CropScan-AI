/**
 * Client-Side Image Compression and Resizing
 * Scales down large smartphone photos to ~1280px max edge using HTML5 Canvas.
 * Reduces bandwidth, speeds up scanning for rural connections, and satisfies 5MB limit.
 */

export async function compressAndResizeImage(file, maxDimension = 1280, quality = 0.85) {
  if (!file) return null;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio preserved dimensions
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        // Clear and draw image smoothly
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return reject(new Error('Canvas to Blob conversion failed'));
            }

            // Create a resized File object preserving filename
            const resizedFile = new File([blob], file.name || 'crop_scan.jpg', {
              type: 'image/jpeg',
              lastModified: Date.now()
            });

            // Also generate data URL preview
            const previewUrl = canvas.toDataURL('image/jpeg', quality);

            resolve({
              file: resizedFile,
              previewUrl,
              width,
              height,
              sizeBytes: blob.size
            });
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = (err) => reject(new Error('Failed to load image for resizing: ' + err));
      img.src = e.target.result;
    };

    reader.onerror = (err) => reject(new Error('Failed to read image file: ' + err));
    reader.readAsDataURL(file);
  });
}
