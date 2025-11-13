
import React, { useState } from 'react';
import { generateSongs } from './services/geminiService';
import type { Song } from './types';
import SongCard from './components/SongCard';
import Loader from './components/Loader';

const App: React.FC = () => {
    const [numSongs, setNumSongs] = useState('3');
    const [genre, setGenre] = useState('Synthwave');
    const [mood, setMood] = useState('Nostalgic');
    const [songs, setSongs] = useState<Song[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSongs([]);

        const songCount = parseInt(numSongs, 10);
        if (isNaN(songCount) || songCount <= 0 || songCount > 10) {
            setError("Please enter a valid number of songs (1-10).");
            setIsLoading(false);
            return;
        }

        try {
            const generatedSongs = await generateSongs(songCount, genre, mood);
            setSongs(generatedSongs);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="text-center mb-12">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
                        AI Song Generator
                    </h1>
                    <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
                        Craft unique musical pieces with AI. Just specify the number, genre, and mood, and let creativity flow.
                    </p>
                </header>

                <main>
                    <div className="sticky top-4 z-10 bg-gray-900/80 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-700 mb-8">
                        <form onSubmit={handleGenerate} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
                            <div>
                                <label htmlFor="numSongs" className="block text-sm font-medium text-gray-300 mb-1">Number of Songs</label>
                                <input
                                    id="numSongs"
                                    type="number"
                                    value={numSongs}
                                    onChange={(e) => setNumSongs(e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-purple-500 focus:border-purple-500"
                                    min="1"
                                    max="10"
                                    placeholder="e.g., 3"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="genre" className="block text-sm font-medium text-gray-300 mb-1">Genre</label>
                                <input
                                    id="genre"
                                    type="text"
                                    value={genre}
                                    onChange={(e) => setGenre(e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-purple-500 focus:border-purple-500"
                                    placeholder="e.g., Lofi Hip Hop"
                                    required
                                />
                            </div>
                             <div>
                                <label htmlFor="mood" className="block text-sm font-medium text-gray-300 mb-1">Mood</label>
                                <input
                                    id="mood"
                                    type="text"
                                    value={mood}
                                    onChange={(e) => setMood(e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-purple-500 focus:border-purple-500"
                                    placeholder="e.g., Relaxing"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-10 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-md shadow-md hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {isLoading ? (
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : 'Generate Music'}
                            </button>
                        </form>
                    </div>

                    {isLoading && <Loader />}
                    {error && <div className="text-center p-4 bg-red-900/50 text-red-300 rounded-lg">{error}</div>}
                    
                    {!isLoading && songs.length === 0 && !error && (
                        <div className="text-center py-16 px-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 6l12-3" />
                            </svg>
                            <h3 className="mt-2 text-xl font-medium text-gray-300">Your studio is quiet</h3>
                            <p className="mt-1 text-md text-gray-500">Generate your first AI-powered song to get started.</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {songs.map(song => (
                            <SongCard key={song.id} song={song} />
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;
