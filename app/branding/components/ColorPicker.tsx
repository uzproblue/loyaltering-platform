'use client';

interface ColorPickerProps {
  id: string;
  label: string;
  color: string;
  onColorChange: (color: string) => void;
}

export default function ColorPicker({ id, label, color, onColorChange }: ColorPickerProps) {
  return (
    <div className="flex flex-col gap-2 p-4 bg-white dark:bg-[#222] border border-[#e0e0e0] dark:border-[#333] rounded-xl">
      <label className="text-sm font-semibold text-[#757575]">{label}</label>
      <label htmlFor={id} className="cursor-pointer relative group inline-block">
        <div
          className="w-12 h-12 rounded border-2 border-[#e0e0e0] dark:border-[#444] shadow-sm hover:border-primary hover:scale-105 transition-all flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: color }}
          title="Click to pick color"
        >
          <input
            type="color"
            id={id}
            value={color}
            onChange={(e) => onColorChange(e.target.value)}
            className="w-full h-full opacity-0 cursor-pointer"
          />
        </div>
        <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-[10px] text-[#757575] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Pick color
        </span>
      </label>
    </div>
  );
}
