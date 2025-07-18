import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-tomorrow.css";

export default function CodeInput({ input, setInput, isAssembly }) {
//   const placeholder = isAssembly
//     ? "LOAD R1 5\nADD R2 R1 R1\nPRINT R2\nHALT"
//     : "0 1 5 2 2 1 1 5 255";

  return (
    <div className="relative">
  {/* Placeholder (only visible if input is empty) */}
  {input.trim() === "" && (
    <pre
      className="absolute top-2 left-3 text-gray-500 pointer-events-none whitespace-pre-wrap z-10"
      style={{
        fontFamily: "monospace",
        fontSize: 14,
        opacity: 0.6,
      }}
    >
      {isAssembly
        ? "LOAD R1 5\nADD R2 R1 R1\nPRINT R2\nHALT"
        : "0 1 5 2 2 1 1 5 255"}
    </pre>
  )}

  {/* Code Editor (z-20 ensures it's above placeholder but still shows it behind text) */}
  <Editor
    value={input}
    onValueChange={setInput}
    highlight={(code) => highlight(code, languages.javascript)}
    padding={10}
    style={{
      backgroundColor: "#2d2d2d",
      color: "white",
      fontFamily: "monospace",
      fontSize: 14,
      borderRadius: "8px",
      minHeight: "240px",
      position: "relative",
      zIndex: 20,
      whiteSpace: "pre-wrap",
    }}
  />
</div>
  );
}
