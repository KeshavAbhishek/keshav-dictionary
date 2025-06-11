export default function DictionaryCard({ data }) {
    return (
        data && (
            <div className="max-h-[100vh] bg-gray-100 p-4 rounded-lg space-y-4 shadow-md border border-gray-200">
                <div className="flex items-center flex-col">
                    <h2 className="text font-semibold capitalize" style={{fontSize: "7vw"}}>{data.word}</h2>
                    {data.phonetic && <p className="text-gray-500 italic">{data.phonetic}</p>}
                    {data.phonetics?.[0]?.audio && (
                        <audio
                            key={data.phonetics[0].audio} // 🔧 force re-render when URL changes
                            controls
                            className="mt-2"
                        >
                            <source src={data.phonetics[0].audio} type="audio/mp3" />
                        </audio>
                    )}
                </div>
                <div className="max-h-[50vh] overflow-y-auto pr-2 scrollbar-hide">
                    {data.origin && (
                        <p className="text-sm text-gray-500">Origin: {data.origin}</p>
                    )}

                    {data.meanings.map((meaning, idx) => (
                        <div key={idx} className="border-t border-gray-300 pt-2">
                            <p className="text-blue-600 capitalize text-3xl font-bold mt-5 mb-3">{meaning.partOfSpeech}</p>
                            {meaning.definitions.map((def, i) => (
                                <div key={i} className="mt-1">
                                    <p className="text-xl font-bold text-justify">• {def.definition}</p>
                                    {def.example && (
                                        <p className="text-xl text-gray-600 italic text-justify">“{def.example}”</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        )
    );
}