export default function getCroppedImg(imageSrc: string, pixelCrop: { x: number, y: number, width: number, height: number }): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = imageSrc;
      image.crossOrigin = 'anonymous';
  
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
  
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Canvas context not available'));
        }
  
        ctx.drawImage(
          image,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          pixelCrop.width,
          pixelCrop.height
        );
  
        canvas.toBlob((blob) => {
          if (!blob) return reject(new Error('Failed to create blob'));
          resolve(blob);
        }, 'image/jpeg');
      };
  
      image.onerror = () => reject(new Error('Failed to load image'));
    });
  }
  