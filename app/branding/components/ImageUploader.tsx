'use client';

interface ImageUploaderProps {
  id: string;
  image: string;
  onImageChange: (image: string) => void;
  label?: string;
  description?: string;
  recommendedSize?: string;
  previewClassName?: string;
  previewStyle?: React.CSSProperties;
  buttonText?: string;
  variant?: 'banner' | 'square' | 'strip';
}

export default function ImageUploader({
  id,
  image,
  onImageChange,
  label,
  description,
  recommendedSize,
  previewClassName = '',
  previewStyle,
  buttonText = 'Upload',
  variant = 'banner',
}: ImageUploaderProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        onImageChange(reader.result as string);
      };
      reader.onerror = () => {
        alert('Error reading image file. Please try again.');
      };
      reader.readAsDataURL(file);
    }
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  const getPreviewContent = () => {
    if (image) {
      if (variant === 'strip') {
        return <img src={image} alt="Uploaded" className="w-full h-full object-cover rounded-lg" />;
      }
      return null; // For banner and square, use background-image in style
    }

    if (variant === 'strip') {
      return <span className="material-symbols-outlined text-[#757575]">add_photo_alternate</span>;
    }
    return <span className={`material-symbols-outlined text-[#757575] ${variant === 'banner' ? 'text-4xl' : ''}`}>image</span>;
  };

  if (variant === 'banner') {
    return (
      <div>
        {label && <h2 className="text-base font-bold text-primary dark:text-white mb-3">{label}</h2>}
        <label htmlFor={id} className="block cursor-pointer">
          <div className="border-2 border-dashed border-[#e0e0e0] dark:border-[#333] rounded-xl p-4 flex flex-col items-center justify-center bg-white dark:bg-[#222] hover:border-primary dark:hover:border-[#555] transition-all group">
            <div
              className={`w-full h-32 bg-gray-100 dark:bg-[#2b2b2b] rounded-lg flex items-center justify-center mb-3 overflow-hidden bg-center bg-cover ${previewClassName}`}
              style={image ? { backgroundImage: `url(${image})`, ...previewStyle } : previewStyle}
            >
              {!image && getPreviewContent()}
            </div>
            <div className="flex flex-col items-center">
              <span className="material-symbols-outlined text-[#757575] group-hover:text-primary transition-colors">cloud_upload</span>
              <p className="text-primary dark:text-gray-200 text-sm font-medium mt-1">Upload your brand banner</p>
              {recommendedSize && <p className="text-[#757575] text-xs mt-1">{recommendedSize}</p>}
            </div>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id={id}
          />
        </label>
      </div>
    );
  }

  // For square and strip variants (used in wallet card)
  return (
    <div className="flex items-center gap-4 px-6 py-5 justify-between">
      <div className="flex items-center gap-4">
        <div
          className={`bg-gray-100 dark:bg-[#2b2b2b] flex items-center justify-center rounded-lg border border-[#e0e0e0] dark:border-[#444] ${
            variant === 'square' ? 'aspect-square bg-center bg-no-repeat bg-cover size-14' : 'w-24 h-10'
          }`}
          style={image && variant === 'square' ? { backgroundImage: `url(${image})` } : undefined}
        >
          {getPreviewContent()}
        </div>
        <div className="flex flex-col">
          {label && <p className="text-sm font-semibold text-primary dark:text-white">{label}</p>}
          {description && <p className="text-[#757575] text-xs font-normal">{description}</p>}
        </div>
      </div>
      <label htmlFor={id} className="cursor-pointer">
        <div className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-9 px-4 bg-gray-100 dark:bg-[#2b2b2b] text-primary dark:text-white text-sm font-semibold hover:bg-gray-200 dark:hover:bg-[#333] transition-colors">
          {image && variant === 'square' ? 'Change' : buttonText}
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id={id}
        />
      </label>
    </div>
  );
}
