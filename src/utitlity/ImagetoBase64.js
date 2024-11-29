import Compressor from 'compress.js';

async function ImagetoBase64(file) {
  const compress = new Compressor();
  const compressedFile = await compress.compress([file], {
    size: 4, // kích thước tối đa (4MB)
    quality: 0.6, // chất lượng từ 0 đến 1
    maxWidth: 400, // kích thước tối đa
    maxHeight: 400,
    resize: true,
    mimeType: 'image/webp', // định dạng đầu ra
  });

  const reader = new FileReader();
  reader.readAsDataURL(compressedFile[0]);

  return new Promise((resolve, reject) => {
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = (err) => reject(err);
  });
}

export { ImagetoBase64 };
