export default function Header() {
  return (
    <header className="border-b border-white/10 bg-dark/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="https://doaide.com" className="flex items-center gap-2 no-underline">
          <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center font-bold text-dark text-sm">
            D
          </div>
          <span className="text-white font-semibold text-lg">
            DoAide <span className="text-gold">Watermark</span>
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-6 text-sm text-white/60">
          <a href="https://doaide.com" className="hover:text-white transition-colors no-underline text-white/60">
            More Tools
          </a>
        </nav>
      </div>
    </header>
  );
}
