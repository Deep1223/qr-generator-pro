import React from 'react';
import { Palette } from 'lucide-react';
import ColorPresets from './ColorPresets';
import ColorCustomization from './ColorCustomization';
import SizeAndLogo from './SizeAndLogo';

/**
 * Main customization panel component
 */
const CustomizationPanel = ({
  // Color settings
  fgColor,
  bgColor,
  gradientEnabled,
  gradientColor2,
  onFgColorChange,
  onBgColorChange,
  onGradientToggle,
  onGradientColor2Change,
  
  // Size and logo settings
  size,
  onSizeChange,
  logoImage,
  logoSize,
  onLogoSizeChange,
  onLogoUpload,
  onLogoRemove
}) => {
  const handlePresetSelect = (preset) => {
    onFgColorChange(preset.fg);
    onBgColorChange(preset.bg);
    onGradientToggle(false);
  };

  return (
    <div className="bg-white bg-opacity-95 rounded-4 shadow-lg p-4 border border-white border-opacity-20">
      <div className="d-flex align-items-center gap-2 mb-4">
        <Palette className="text-primary" size={24} />
        <h2 className="h4 fw-bold text-dark mb-0">Design Customization</h2>
      </div>

      <div className="row g-4">
        {/* Color Presets */}
        <div className="col-12">
          <ColorPresets onPresetSelect={handlePresetSelect} />
        </div>

        {/* Custom Colors */}
        <div className="col-12">
          <ColorCustomization
            fgColor={fgColor}
            bgColor={bgColor}
            gradientEnabled={gradientEnabled}
            gradientColor2={gradientColor2}
            onFgColorChange={onFgColorChange}
            onBgColorChange={onBgColorChange}
            onGradientToggle={onGradientToggle}
            onGradientColor2Change={onGradientColor2Change}
          />
        </div>

        {/* Size and Logo */}
        <div className="col-12">
          <SizeAndLogo
            size={size}
            onSizeChange={onSizeChange}
            logoImage={logoImage}
            logoSize={logoSize}
            onLogoSizeChange={onLogoSizeChange}
            onLogoUpload={onLogoUpload}
            onLogoRemove={onLogoRemove}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomizationPanel;
