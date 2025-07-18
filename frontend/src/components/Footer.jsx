import { FaGithub, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="mt-16 w-full text-center text-sm text-gray-500 py-6 border-t border-white/10 font-mono">
      <p className="mb-1">
        © {new Date().getFullYear()} RetroWeb Emulator • Built by
        {' '}
        <a
          href="https://www.iamasiff.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-orange-400 hover:text-orange-300 font-medium transition"
        >
          Asifur Rahman
        </a>
      </p>

      <div className="flex justify-center items-center gap-4 my-2">
        <a
          href="https://github.com/asifrahman2003"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition"
        >
          <FaGithub size={20} />
        </a>
        <a
          href="https://www.linkedin.com/in/iamasiff"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition"
        >
          <FaLinkedin size={20} />
        </a>
        <span className="bg-gray-700 text-gray-300 px-2 py-0.7 text-xs font-mono rounded-full flex">
          v0.1 Beta
        </span>
      </div>

      <p className="text-xs mt-2 text-gray-600 italic hover:text-pink-400 transition duration-300 font-mono">
        {`<psst> try typing HALT twice 👀`}
      </p>
    </footer>
  );
}
