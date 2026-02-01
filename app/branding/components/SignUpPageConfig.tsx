'use client';

import ImageUploader from './ImageUploader';
import ActionButtons from './ActionButtons';

interface FormFields {
  fullName: boolean;
  birthday: boolean;
  email: boolean;
  phone: boolean;
}

interface SignUpPageConfigProps {
  headerImage: string;
  welcomeTitle: string;
  description: string;
  formFields: FormFields;
  onHeaderImageChange: (image: string) => void;
  onWelcomeTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onFormFieldsChange: (fields: FormFields) => void;
  onSave: () => void;
  onReset: () => void;
  isSaving?: boolean;
}

export default function SignUpPageConfig({
  headerImage,
  welcomeTitle,
  description,
  formFields,
  onHeaderImageChange,
  onWelcomeTitleChange,
  onDescriptionChange,
  onFormFieldsChange,
  onSave,
  onReset,
  isSaving = false,
}: SignUpPageConfigProps) {
  return (
    <>
      <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4 space-y-8">
        {/* Header Image Section */}
        <ImageUploader
          id="header-image-upload"
          image={headerImage}
          onImageChange={onHeaderImageChange}
          label="Header Image"
          recommendedSize="Recommended: 1200x600px (JPG, PNG)"
          variant="banner"
        />

        {/* Messaging Section */}
        <div>
          <h2 className="text-base font-bold text-primary dark:text-white mb-3">Messaging</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#757575] uppercase tracking-wider mb-1.5">Welcome Title</label>
              <input
                type="text"
                value={welcomeTitle}
                onChange={(e) => onWelcomeTitleChange(e.target.value)}
                className="w-full bg-white dark:bg-[#222] border border-[#e0e0e0] dark:border-[#333] rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#757575] uppercase tracking-wider mb-1.5">Description</label>
              <textarea
                value={description}
                onChange={(e) => onDescriptionChange(e.target.value)}
                rows={3}
                className="w-full bg-white dark:bg-[#222] border border-[#e0e0e0] dark:border-[#333] rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Form Configuration */}
        <div>
          <h2 className="text-base font-bold text-primary dark:text-white mb-3">Form Fields</h2>
          <div className="bg-white dark:bg-[#222] border border-[#e0e0e0] dark:border-[#333] rounded-xl divide-y divide-[#e0e0e0] dark:divide-[#333]">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#757575] text-[20px]">person</span>
                <span className="text-sm font-medium">Full Name</span>
              </div>
              <input
                type="checkbox"
                checked={formFields.fullName}
                onChange={(e) => onFormFieldsChange({ ...formFields, fullName: e.target.checked })}
                className="rounded border-[#e0e0e0] text-primary focus:ring-primary"
              />
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#757575] text-[20px]">cake</span>
                <span className="text-sm font-medium">Birthday</span>
              </div>
              <input
                type="checkbox"
                checked={formFields.birthday}
                onChange={(e) => onFormFieldsChange({ ...formFields, birthday: e.target.checked })}
                className="rounded border-[#e0e0e0] text-primary focus:ring-primary"
              />
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#757575] text-[20px]">mail</span>
                <span className="text-sm font-medium">Email Address</span>
              </div>
              <input
                type="checkbox"
                checked={formFields.email}
                disabled
                className="rounded border-[#e0e0e0] text-primary focus:ring-primary opacity-50"
              />
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#757575] text-[20px]">call</span>
                <span className="text-sm font-medium">Phone Number</span>
              </div>
              <input
                type="checkbox"
                checked={formFields.phone}
                onChange={(e) => onFormFieldsChange({ ...formFields, phone: e.target.checked })}
                className="rounded border-[#e0e0e0] text-primary focus:ring-primary"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <ActionButtons onSave={onSave} onReset={onReset} isSaving={isSaving} />
    </>
  );
}
