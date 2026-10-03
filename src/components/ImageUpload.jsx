import { useCallback } from 'react';

export default function ImageUpload({ onImageLoad, label = 'Drop an image here or click to upload', accept = 'image/*', multiple = false }) {
  const handleFile = useCallback((files) => {
    if (!files?.length) return;
    if (multiple) {
      onImageLoad(Array.from(files));
    } else {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => onImageLoad(e.target.result, file);
      reader.readAsDataURL(file);
    }
  }, [onImageLoad, multiple]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-gold');
    handleFile(e.dataTransfer.files);
  }, [handleFile]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-gold');
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.currentTarget.classList.remove('border-gold');
  }, []);

  return (
    <label
      className="block border-2 border-dashed border-white/20 rounded-xl p-10 text-center cursor-pointer
        hover:border-gold/50 transition-colors bg-white/[0.02]"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div className="text-4xl mb-3 opacity-40">📷</div>
      <p className="text-white/50 text-sm">{label}</p>
      <p className="text-white/30 text-xs mt-1">PNG, JPG, WebP supported</p>
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFile(e.target.files)}
      />
    </label>
  );
}
