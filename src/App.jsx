import { useState, useEffect, useRef } from "react";
import DictionaryCard from "./components/DictionaryCard";

export default function App() {
  const [word, setWord] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  // Initialize SpeechRecognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser does not support voice recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const spokenWord = event.results[0][0].transcript;
      setWord(spokenWord);
      setListening(false);
      fetchWord(spokenWord); // Auto-search
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      setListening(true);
      recognitionRef.current.start();
    }
  };

  const fetchWord = async (inputWord = word) => {
    try {
      const res = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${inputWord}`
      );
      if (!res.ok) throw new Error("Word not found");
      const data = await res.json();
      setResult(data[0]);
      setError("");
    } catch (err) {
      setResult(null);
      setError("Word not found. Try another.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (word.trim()) fetchWord();
  };

  return (
    <div className="min-h-screen p-4 max-w-md mx-auto bg-white text-black">
      <h1 className="text-5xl font-bold mb-4 text-center mt-5 mb-10">
        📘 Dictionary
      </h1>

      <form className="mb-6 flex gap-2" netlify>
        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          placeholder="Type or say it..."
          className="w-full p-5 rounded-md bg-gray-100 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 text-2xl"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.target.blur(); // Remove focus
              handleSubmit(e);
            }
          }}
        />

        <button
          type="button"
          onClick={startListening}
          className="p-3 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 active:scale-95 transition"
          title="Voice Search"
        >
          {listening ? (
            // Solid mic icon when listening
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
              <path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" />
              <path d="M6 10.5a.75.75 0 0 1 .75.75v1.5a5.25 5.25 0 1 0 10.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5a6.751 6.751 0 0 1-6 6.709v2.291h3a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1 0-1.5h3v-2.291a6.751 6.751 0 0 1-6-6.709v-1.5A.75.75 0 0 1 6 10.5Z" />
            </svg>
          ) : (
            // Outline mic icon when idle
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
            </svg>
          )}
        </button>

      </form>

      {listening && (
        <p className="text-center text-blue-600 mb-4 animate-pulse">
          Listening...
        </p>
      )}

      {error && <p className="text-red-500 text-center">{error}</p>}

      {result && <DictionaryCard data={result} />}
    </div>
  );
}
