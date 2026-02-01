'use client';

interface FormFields {
  fullName: boolean;
  birthday: boolean;
  email: boolean;
  phone: boolean;
}

interface SignUpPagePreviewProps {
  headerImage: string;
  welcomeTitle: string;
  description: string;
  formFields: FormFields;
}

export default function SignUpPagePreview({
  headerImage,
  welcomeTitle,
  description,
  formFields,
}: SignUpPagePreviewProps) {
  return (
    <div className="relative w-[340px] h-[700px] bg-white dark:bg-[#191919] rounded-[3rem] border-[8px] border-[#333] dark:border-[#444] shadow-2xl flex flex-col overflow-hidden">
      {/* Mobile Status Bar */}
      <div className="h-10 w-full flex items-center justify-between px-8 pt-2">
        <span className="text-[12px] font-bold text-[#141414] dark:text-gray-200">9:41</span>
        <div className="flex gap-1.5 items-center">
          <span className="material-symbols-outlined text-[14px]">signal_cellular_alt</span>
          <span className="material-symbols-outlined text-[14px]">wifi</span>
          <span className="material-symbols-outlined text-[14px]">battery_full</span>
        </div>
      </div>

      {/* Browser URL Bar */}
      <div className="px-4 py-2 border-b border-gray-100 dark:border-[#333]">
        <div className="bg-gray-100 dark:bg-[#222] rounded-lg py-1.5 px-3 flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-[12px] text-[#757575]">lock</span>
          <span className="text-[10px] text-[#757575] font-medium">loyaltering.com/loyalty-program</span>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
        <div
          className="h-40 w-full bg-gray-200 dark:bg-[#222] bg-center bg-cover flex items-end"
          style={headerImage ? { backgroundImage: `url(${headerImage})` } : {}}
        >
          <div className="w-full h-1/2 bg-gradient-to-t from-white dark:from-[#191919] to-transparent"></div>
        </div>
        <div className="px-6 pb-12 -mt-6">
          <div className="bg-white dark:bg-[#191919] rounded-xl p-6 shadow-sm border border-gray-100 dark:border-[#333] flex flex-col items-center text-center">
            <h3 className="text-lg font-bold text-primary dark:text-white mb-2 leading-tight">{welcomeTitle}</h3>
            <p className="text-xs text-[#757575] dark:text-gray-400 mb-6 leading-relaxed">{description}</p>
            <div className="w-full space-y-4">
              {formFields.fullName && (
                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-bold text-[#757575] uppercase tracking-wider ml-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="w-full bg-gray-50 dark:bg-[#222] border-none rounded-lg text-xs py-3 px-4 focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
              )}
              {formFields.birthday && (
                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-bold text-[#757575] uppercase tracking-wider ml-1">Birthday</label>
                  <input
                    type="text"
                    placeholder="MM/DD/YYYY"
                    className="w-full bg-gray-50 dark:bg-[#222] border-none rounded-lg text-xs py-3 px-4 focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
              )}
              {formFields.email && (
                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-bold text-[#757575] uppercase tracking-wider ml-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    className="w-full bg-gray-50 dark:bg-[#222] border-none rounded-lg text-xs py-3 px-4 focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
              )}
              {formFields.phone && (
                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-bold text-[#757575] uppercase tracking-wider ml-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="(555) 123-4567"
                    className="w-full bg-gray-50 dark:bg-[#222] border-none rounded-lg text-xs py-3 px-4 focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
              )}
              <button className="w-full bg-primary dark:bg-white text-white dark:text-primary font-bold text-sm py-3 rounded-lg shadow-lg shadow-primary/10 mt-2 hover:opacity-90 transition-opacity">
                Create Account
              </button>
              <p className="text-[10px] text-[#757575] mt-4">By signing up you agree to our Terms of Service</p>
            </div>
          </div>
        </div>
      </div>

      {/* Home Indicator */}
      <div className="h-6 w-full flex justify-center items-center pb-2">
        <div className="h-1 w-32 bg-gray-200 dark:bg-[#444] rounded-full"></div>
      </div>
    </div>
  );
}
