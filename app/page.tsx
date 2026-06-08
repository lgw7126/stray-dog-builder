'use client';

import { useState, useCallback, useRef } from 'react';
import type { GeneratedContent } from '@/lib/types';

type TabType = 'poster' | 'cardNews' | 'adoptionPage';

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GeneratedContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('poster');
  const [isDragging, setIsDragging] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (file.size > 4 * 1024 * 1024) {
      setError('이미지 크기는 4MB 이하여야 합니다.');
      return;
    }
    setImage(file);
    setError(null);
    setResult(null);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleGenerate = async () => {
    if (!image) {
      setError('강아지 사진을 업로드해주세요.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('additionalInfo', additionalInfo);

      const res = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || '생성 중 오류가 발생했습니다.');
      }
      setResult(data);
      setActiveTab('poster');
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getPosterText = () => {
    if (!result) return '';
    const { poster, dogProfile } = result;
    return `🐾 ${poster.title}

${poster.subtitle}

${poster.story}

✨ ${dogProfile.name}의 매력
${poster.appealPoints.map((p) => `• ${p}`).join('\n')}

📞 ${poster.callToAction}

"${poster.tagline}"`;
  };

  const getCardNewsText = () => {
    if (!result) return '';
    return result.cardNews
      .map(
        (card, i) =>
          `[카드 ${i + 1}] ${card.emoji} ${card.title}\n${card.content}`
      )
      .join('\n\n');
  };

  const getAdoptionPageText = () => {
    if (!result) return '';
    const { adoptionPage } = result;
    return `${adoptionPage.headline}

${adoptionPage.description}

📋 입양 조건
${adoptionPage.requirements.map((r) => `• ${r}`).join('\n')}

📝 입양 절차
${adoptionPage.process.map((p, i) => `${i + 1}. ${p}`).join('\n')}

📞 연락처
${adoptionPage.contactInfo}

⚠️ 특이사항
${adoptionPage.specialNotes}`;
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-amber-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <span className="text-3xl">🐾</span>
          <div>
            <h1 className="text-2xl font-bold text-amber-800">
              유기견 홍보 빌더
            </h1>
            <p className="text-sm text-amber-600">
              AI가 입양 홍보 콘텐츠를 자동으로 만들어드립니다
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-amber-100">
          <h2 className="text-lg font-semibold text-amber-900 mb-4">
            📸 강아지 사진 업로드
          </h2>

          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-amber-500 bg-amber-50'
                : 'border-amber-300 hover:border-amber-400 hover:bg-amber-50'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            {imagePreview ? (
              <div className="space-y-3">
                <img
                  src={imagePreview}
                  alt="업로드된 강아지"
                  className="max-h-64 mx-auto rounded-xl object-contain shadow"
                />
                <p className="text-sm text-amber-600">
                  클릭하거나 드래그하여 다른 사진으로 교체
                </p>
              </div>
            ) : (
              <div className="space-y-3 text-amber-500">
                <div className="text-5xl">🐶</div>
                <div>
                  <p className="font-medium text-amber-700">
                    강아지 사진을 드래그하거나 클릭하여 업로드
                  </p>
                  <p className="text-sm text-amber-400 mt-1">
                    JPEG, PNG, WEBP · 최대 4MB
                  </p>
                </div>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileInput}
          />

          <div className="mt-4">
            <label className="block text-sm font-medium text-amber-800 mb-1">
              추가 정보 (선택)
            </label>
            <textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="예: 이름은 콩이, 3살 추정 수컷, 활발하고 사람을 좋아함, 현재 임보 중"
              rows={2}
              className="w-full rounded-lg border border-amber-200 px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
            />
          </div>

          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={!image || isLoading}
            className="mt-4 w-full py-3 px-6 rounded-xl font-semibold text-white bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-md text-base"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                AI가 홍보 콘텐츠를 생성하고 있습니다...
              </span>
            ) : (
              '✨ AI로 홍보 콘텐츠 자동 생성'
            )}
          </button>
        </div>

        {/* Results */}
        {result && (
          <>
            {/* Dog Profile Card */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-amber-100">
              <h2 className="text-lg font-semibold text-amber-900 mb-4">
                🐾 AI 분석 결과
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: '이름', value: result.dogProfile.name, icon: '🏷️' },
                  { label: '견종', value: result.dogProfile.breed, icon: '🐕' },
                  { label: '나이', value: result.dogProfile.age, icon: '📅' },
                  { label: '성별', value: result.dogProfile.gender, icon: '⚥' },
                  { label: '크기', value: result.dogProfile.size, icon: '📏' },
                  { label: '색상', value: result.dogProfile.color, icon: '🎨' },
                ].map(({ label, value, icon }) => (
                  <div
                    key={label}
                    className="bg-amber-50 rounded-xl p-3 border border-amber-100"
                  >
                    <p className="text-xs text-amber-500 font-medium">
                      {icon} {label}
                    </p>
                    <p className="text-sm font-semibold text-amber-900 mt-1">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-3 bg-amber-50 rounded-xl p-3 border border-amber-100">
                <p className="text-xs text-amber-500 font-medium">
                  💝 성격
                </p>
                <p className="text-sm text-amber-900 mt-1">
                  {result.dogProfile.personality}
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-md border border-amber-100 overflow-hidden">
              <div className="flex border-b border-amber-100">
                {(
                  [
                    { key: 'poster', label: '📋 홍보 포스터' },
                    { key: 'cardNews', label: '📱 SNS 카드뉴스' },
                    { key: 'adoptionPage', label: '📄 입양 신청 페이지' },
                  ] as { key: TabType; label: string }[]
                ).map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`flex-1 py-3 px-2 text-sm font-medium transition-colors ${
                      activeTab === key
                        ? 'bg-amber-500 text-white'
                        : 'text-amber-600 hover:bg-amber-50'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {/* Poster Tab */}
                {activeTab === 'poster' && (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
                      <div className="text-center space-y-3">
                        <div className="text-4xl">🐾</div>
                        <h3 className="text-2xl font-bold">
                          {result.poster.title}
                        </h3>
                        <p className="text-amber-100 font-medium">
                          {result.poster.subtitle}
                        </p>
                        <p className="text-sm text-amber-50 leading-relaxed bg-white/10 rounded-xl p-3">
                          {result.poster.story}
                        </p>
                        <div className="bg-white/20 rounded-xl p-3 text-left space-y-1">
                          <p className="text-xs font-semibold text-amber-100 mb-2">
                            ✨ {result.dogProfile.name}의 매력
                          </p>
                          {result.poster.appealPoints.map((point, i) => (
                            <p key={i} className="text-sm">
                              • {point}
                            </p>
                          ))}
                        </div>
                        <div className="bg-white text-amber-600 rounded-xl py-2 px-4 font-bold text-lg inline-block">
                          {result.poster.callToAction}
                        </div>
                        <p className="text-xs text-amber-100 italic">
                          "{result.poster.tagline}"
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(getPosterText(), 'poster')}
                      className="w-full py-2.5 rounded-xl border-2 border-amber-300 text-amber-700 hover:bg-amber-50 font-medium text-sm transition-colors"
                    >
                      {copiedKey === 'poster'
                        ? '✅ 복사됨!'
                        : '📋 포스터 텍스트 복사'}
                    </button>
                  </div>
                )}

                {/* Card News Tab */}
                {activeTab === 'cardNews' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {result.cardNews.map((card, i) => (
                        <div
                          key={i}
                          className="rounded-2xl p-5 shadow-sm border border-gray-100"
                          style={{ backgroundColor: card.backgroundColor }}
                        >
                          <div className="text-3xl mb-2">{card.emoji}</div>
                          <h4 className="font-bold text-gray-800 text-base mb-1">
                            {card.title}
                          </h4>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {card.content}
                          </p>
                          <div className="mt-3 text-xs text-gray-400 font-medium">
                            Card {i + 1} / {result.cardNews.length}
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() =>
                        copyToClipboard(getCardNewsText(), 'cardNews')
                      }
                      className="w-full py-2.5 rounded-xl border-2 border-amber-300 text-amber-700 hover:bg-amber-50 font-medium text-sm transition-colors"
                    >
                      {copiedKey === 'cardNews'
                        ? '✅ 복사됨!'
                        : '📋 카드뉴스 텍스트 복사'}
                    </button>
                  </div>
                )}

                {/* Adoption Page Tab */}
                {activeTab === 'adoptionPage' && (
                  <div className="space-y-4">
                    <div className="space-y-4">
                      {/* Hero */}
                      <div className="bg-gradient-to-br from-rose-400 to-pink-500 rounded-2xl p-6 text-white text-center shadow">
                        <div className="text-4xl mb-3">🏠</div>
                        <h3 className="text-xl font-bold">
                          {result.adoptionPage.headline}
                        </h3>
                        <p className="text-sm text-rose-100 mt-2 leading-relaxed">
                          {result.adoptionPage.description}
                        </p>
                      </div>

                      {/* Requirements */}
                      <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                        <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                          <span>📋</span> 입양 조건
                        </h4>
                        <ul className="space-y-1">
                          {result.adoptionPage.requirements.map((req, i) => (
                            <li
                              key={i}
                              className="text-sm text-blue-700 flex gap-2"
                            >
                              <span className="text-blue-400">✓</span>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Process */}
                      <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                        <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                          <span>📝</span> 입양 절차
                        </h4>
                        <ol className="space-y-2">
                          {result.adoptionPage.process.map((step, i) => (
                            <li key={i} className="flex gap-3 items-start">
                              <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full text-xs flex items-center justify-center font-bold">
                                {i + 1}
                              </span>
                              <span className="text-sm text-green-700">
                                {step}
                              </span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* Contact & Notes */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                          <h4 className="font-semibold text-amber-800 mb-1 flex items-center gap-2">
                            <span>📞</span> 연락처
                          </h4>
                          <p className="text-sm text-amber-700">
                            {result.adoptionPage.contactInfo}
                          </p>
                        </div>
                        <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                          <h4 className="font-semibold text-purple-800 mb-1 flex items-center gap-2">
                            <span>⚠️</span> 특이사항
                          </h4>
                          <p className="text-sm text-purple-700">
                            {result.adoptionPage.specialNotes}
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        copyToClipboard(getAdoptionPageText(), 'adoption')
                      }
                      className="w-full py-2.5 rounded-xl border-2 border-amber-300 text-amber-700 hover:bg-amber-50 font-medium text-sm transition-colors"
                    >
                      {copiedKey === 'adoption'
                        ? '✅ 복사됨!'
                        : '📋 입양 페이지 텍스트 복사'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <footer className="text-center py-8 text-amber-400 text-sm">
        <p>🐾 모든 유기견이 따뜻한 가족을 만나길 바랍니다 🐾</p>
      </footer>
    </main>
  );
}
