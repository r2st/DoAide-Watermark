export function Slider({ label, value, onChange, min = 0, max = 100, step = 1, unit = '' }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-xs text-white/60">
        <span>{label}</span>
        <span className="text-gold">{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
    </div>
  );
}

export function Select({ label, value, onChange, options }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-white/60">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-dark-lighter border border-white/10 rounded-lg px-3 py-2 text-sm text-white
          focus:outline-none focus:border-gold/50"
      >
        {options.map((opt) => (
          <option key={opt.value ?? opt} value={opt.value ?? opt}>
            {opt.label ?? opt}
          </option>
        ))}
      </select>
    </div>
  );
}

export function ColorPicker({ label, value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-xs text-white/60">{label}</label>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-8 h-8 rounded cursor-pointer bg-transparent"
      />
      <span className="text-xs text-white/40 font-mono">{value}</span>
    </div>
  );
}

export function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <div className={`w-10 h-5 rounded-full transition-colors relative ${checked ? 'bg-gold' : 'bg-white/20'}`}>
        <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform
          ${checked ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
      </div>
      <span className="text-xs text-white/60">{label}</span>
    </label>
  );
}

export function Button({ children, onClick, variant = 'primary', className = '', disabled = false }) {
  const base = 'px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-gold text-dark hover:bg-gold-light',
    secondary: 'bg-white/10 text-white hover:bg-white/20',
    danger: 'bg-red-500/20 text-red-400 hover:bg-red-500/30',
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}

export function PositionGrid({ value, onChange }) {
  const positions = [
    ['top-left', 'top-center', 'top-right'],
    ['center-left', 'center', 'center-right'],
    ['bottom-left', 'bottom-center', 'bottom-right'],
  ];
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-white/60 mb-1">Position</span>
      <div className="grid grid-cols-3 gap-1 w-fit">
        {positions.flat().map((pos) => (
          <button
            key={pos}
            onClick={() => onChange(pos)}
            className={`w-7 h-7 rounded text-[10px] transition-colors
              ${value === pos ? 'bg-gold text-dark' : 'bg-white/10 text-white/40 hover:bg-white/20'}`}
            title={pos}
          >
            ●
          </button>
        ))}
      </div>
    </div>
  );
}
