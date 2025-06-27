import React from 'react';
import { LanguageSettings, SupportedLanguage } from '../types';
import { SUPPORTED_LANGUAGES, getLanguageInfo, getUITranslation } from '../utils/languages';

interface LanguageSettingsProps {
  settings: LanguageSettings;
  onSettingsChange: (settings: LanguageSettings) => void;
  uiLanguage: SupportedLanguage;
}

const LanguageSettingsComponent: React.FC<LanguageSettingsProps> = ({
  settings,
  onSettingsChange,
  uiLanguage
}) => {
  const handleLearningLanguageChange = (language: SupportedLanguage) => {
    onSettingsChange({ ...settings, learningLanguage: language });
  };

  const handleNativeLanguageChange = (language: SupportedLanguage) => {
    onSettingsChange({ ...settings, nativeLanguage: language });
  };

  return (
    <div style={{
      background: 'white',
      padding: '20px',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      marginBottom: '20px'
    }}>
      <h3 style={{
        margin: '0 0 20px 0',
        color: '#333',
        fontSize: '18px',
        fontWeight: '600'
      }}>
        ⚙️ {getUITranslation('languageSettings', uiLanguage)}
      </h3>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px'
      }}>
        {/* 학습 언어 선택 */}
        <div>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            color: '#555',
            fontWeight: '500',
            fontSize: '14px'
          }}>
            📚 {getUITranslation('learningLanguage', uiLanguage)}
          </label>
          <select
            value={settings.learningLanguage}
            onChange={(e) => handleLearningLanguageChange(e.target.value as SupportedLanguage)}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '14px',
              backgroundColor: 'white',
              cursor: 'pointer',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#007bff'}
            onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
          >
            {SUPPORTED_LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.nativeName} ({lang.name})
              </option>
            ))}
          </select>
        </div>

        {/* 모국어(설명 언어) 선택 */}
        <div>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            color: '#555',
            fontWeight: '500',
            fontSize: '14px'
          }}>
            🌍 {getUITranslation('nativeLanguage', uiLanguage)}
          </label>
          <select
            value={settings.nativeLanguage}
            onChange={(e) => handleNativeLanguageChange(e.target.value as SupportedLanguage)}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '14px',
              backgroundColor: 'white',
              cursor: 'pointer',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#007bff'}
            onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
          >
            {SUPPORTED_LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.nativeName} ({lang.name})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 현재 설정 표시 */}
      <div style={{
        marginTop: '16px',
        padding: '12px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        fontSize: '14px',
        color: '#666'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>📖</span>
          <span>
            {getLanguageInfo(settings.learningLanguage).flag} {getLanguageInfo(settings.learningLanguage).nativeName}
            {' → '}
            {getLanguageInfo(settings.nativeLanguage).flag} {getLanguageInfo(settings.nativeLanguage).nativeName}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LanguageSettingsComponent; 