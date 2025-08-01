import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer
  className="
    w-full text-center text-gray-500 py-6
    border-t border-white/10 font-mono
    text-xs sm:text-sm md:text-base
  "
>
  <p className="mb-2 text-sm text-gray-400 flex flex-col items-center sm:flex-row sm:justify-center gap-x-1 gap-y-1">
  <span>© {new Date().getFullYear()} retroWeb Emulator</span>
  <span className="sm:inline hidden">•</span>
  <span>Built with ❤️ by{' '}
    <a
      href="https://www.iamasiff.com"
      target="_blank"
      rel="noopener noreferrer"
      className="text-orange-400 hover:text-orange-300 font-medium transition"
    >
      Asifur Rahman
    </a>
  </span>
</p>

      <div className="flex flex-col items-center gap-2 my-2">
      {/* Icons */}
      <div className="flex items-center justify-center gap-4">
        <motion.a
          href="https://github.com/asifrahman2003"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.2, rotate: -5 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="hover:text-white"
        >
          <FaGithub size={22} />
        </motion.a>

        <motion.a
          href="https://www.linkedin.com/in/iamasiff"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.2, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="hover:text-white"
        >
          <FaLinkedin size={22} />
        </motion.a>
      </div>

      {/* Version Badge */}
      <motion.span
        className="bg-gray-700 text-gray-300 px-2 py-0.5 text-xs font-mono rounded-full mt-1"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        v0.1 Alpha
      </motion.span>
    </div>


      <p className="text-xs mt-2 text-gray-600 italic hover:text-pink-400 transition duration-300 font-mono">
        {`<psst> try typing HALT twice 👀`}
      </p>
    </footer>
  );
}
