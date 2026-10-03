import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import TextWatermark from './components/TextWatermark';
import ImageWatermark from './components/ImageWatermark';
import TiledWatermark from './components/TiledWatermark';
import BatchProcessor from './components/BatchProcessor';
import ImageResize from './components/ImageResize';
import CompareSlider from './components/CompareSlider';

const TABS = [
  { id: 'text', label: 'Text', icon: 'T', desc: 'Add custom text watermark' },
  { id: 'image', label: 'Logo', icon: '🖼', desc: 'Use your logo as watermark' },
  { id: 'tiled', label: 'Tiled', icon: '⊞', desc: 'Repeating pattern watermark' },
  { id: 'batch', label: 'Batch', icon: '⧉', desc: 'Process multiple images' },
  { id: 'resize', label: 'Resize', icon: '⤡', desc: 'Resize & compress images' },
  { id: 'compare', label: 'Compare', icon: '⇔', desc: 'Before/after slider' },
];

const COMPONENTS = {
  text: TextWatermark,
  image: ImageWatermark,
  tiled: TiledWatermark,
  batch: BatchProcessor,
  resize: ImageResize,
  compare: CompareSlider,
};

function App() {
  const [activeTab, setActiveTab] = useState('text');
  const ActiveComponent = COMPONENTS[activeTab];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Free Image <span className="text-gold">Watermark</span> Tool
          </h1>
          <p className="text-white/50 max-w-xl mx-auto">
            Protect your images with custom watermarks. No uploads, no sign-ups — everything runs in your browser.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2
                ${activeTab === tab.id
                  ? 'bg-gold text-dark shadow-lg shadow-gold/20'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="mb-4">
          <p className="text-center text-white/40 text-sm">
            {TABS.find((t) => t.id === activeTab)?.desc}
          </p>
        </div>

        <ActiveComponent />
      </main>

      <Footer />
    </div>
  );
}

export default App;
