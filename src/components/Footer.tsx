type Props = {
  designedBy: string;
  lastUpdated: string;
};

export function Footer({ designedBy, lastUpdated }: Props) {
  return (
    <footer className="px-6 md:px-12 py-12 border-t border-theme max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center transition-colors duration-300">
      <p className="font-mono text-[10px] opacity-40">{designedBy}</p>
      <p className="font-mono text-[10px] opacity-40 mt-4 md:mt-0">{lastUpdated}</p>
    </footer>
  );
}

