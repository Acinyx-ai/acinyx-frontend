import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-400">
      <div className="max-w-7xl mx-auto px-8 py-12">

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/10 pb-8">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold text-white">
              Acinyx<span className="text-[#00e6b8]">.AI</span>
            </h3>
            <p className="text-sm mt-2 max-w-xs">
              Build AI posters, chat with AI, and automate content — instantly.
            </p>
            <p className="text-sm mt-2">
              📧 <a
                href="mailto:acinyx.webtech@gmail.com"
                className="hover:text-white"
              >
                acinyx.webtech@gmail.com
              </a>
            </p>
          </div>

          <div className="flex gap-6 text-sm">
            <Link to="/features" className="hover:text-white">
              Features
            </Link>
            <Link to="/pricing" className="hover:text-white">
              Pricing
            </Link>
            <Link to="/how-it-works" className="hover:text-white">
              How it works
            </Link>
          </div>
        </div>

        <div className="pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Acinyx.AI — Fast. Smart. Limitless.
        </div>

      </div>
    </footer>
  );
}
