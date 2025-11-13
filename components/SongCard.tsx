
import React, { useState } from 'react';
import type { Song, Composition } from '../types';

const CompositionDetail: React.FC<{ composition: Composition }> = ({ composition }) => (
    <div className="mt-4 p-4 bg-gray-800/50 rounded-lg space-y-4 text-sm">
        <div className="flex justify-between items-center text-gray-300">
            <span><strong>Tempo:</strong> {composition.tempo} BPM</span>
            <span><strong>Key:</strong> {composition.key}</span>
        </div>
        {Object.entries(composition).filter(([key]) => Array.isArray(composition[key as keyof Composition])).map(([key, value]) => {
            if (Array.isArray(value)) {
                return (
                    <div key={key}>
                        <h4 className="font-semibold text-purple-300 capitalize mb-2">{key}</h4>
                        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-gray-900/50 rounded">
                            {value.map((item, index) => (
                                <span key={index} className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">{item}</span>
                            ))}
                        </div>
                    </div>
                );
            }
            return null;
        })}
    </div>
);

const SongCard: React.FC<{ song: Song }> = ({ song }) => {
    const [isCompositionVisible, setIsCompositionVisible] = useState(false);

    const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-purple-500/20 hover:scale-[1.02]">
            <div className="relative">
                <img
                    src={`https://picsum.photos/seed/${song.id}/500/300`}
                    alt={song.album}
                    className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-800 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4">
                    <h2 className="text-2xl font-bold text-white">{song.title}</h2>
                    <p className="text-md font-medium text-gray-300">{song.artist}</p>
                </div>
            </div>
            <div className="p-4">
                <div className="flex justify-between items-center text-sm text-gray-400 mb-3">
                    <span>{song.album} ({song.year})</span>
                    <span>{formatDuration(song.duration)}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                    {song.genre.map((g) => (
                        <span key={g} className="px-2 py-1 bg-purple-600/50 text-purple-200 rounded-full text-xs font-semibold">{g}</span>
                    ))}
                     <span className="px-2 py-1 bg-indigo-600/50 text-indigo-200 rounded-full text-xs font-semibold">{song.mood}</span>
                </div>
                <div className="p-3 bg-gray-900/50 rounded-md mb-4">
                    <p className="text-sm text-gray-300 italic">
                        <span className="font-semibold text-gray-200">Album Art Concept:</span> {song.coverArt}
                    </p>
                </div>
                <button
                    onClick={() => setIsCompositionVisible(!isCompositionVisible)}
                    className="w-full text-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors text-sm font-medium"
                >
                    {isCompositionVisible ? 'Hide' : 'Show'} Composition
                </button>
                {isCompositionVisible && <CompositionDetail composition={song.composition} />}
            </div>
        </div>
    );
};

export default SongCard;
