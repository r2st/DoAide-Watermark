export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-8 mt-16 text-center text-white/40 text-sm">
      <div className="max-w-6xl mx-auto px-4">
        <p>
          Built by{' '}
          <a href="https://doaide.com" className="text-gold hover:underline">
            DoAide
          </a>{' '}
          — Free tools for creators.
        </p>
        <p className="mt-2">No uploads to servers. Everything runs in your browser.</p>
      </div>
    </footer>
  );
}
