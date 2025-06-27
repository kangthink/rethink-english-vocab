import React, { useState, useEffect } from 'react';
import './App.css';
import WordNode from './components/WordNode';
import { getRelatedWords } from './services/llmService';
import { WordData } from './types/index.ts'; // Updated import path to be explicit

function App() {
  const [words, setWords] = useState<WordData[]>([]);
  const [newWord, setNewWord] = useState<string>('');

  // Calculate grid dimensions dynamically
  const minX = words.length > 0 ? Math.min(...words.map(w => w.x)) : 0;
  const maxX = words.length > 0 ? Math.max(...words.map(w => w.x)) : 0;
  const minY = words.length > 0 ? Math.min(...words.map(w => w.y)) : 0;
  const maxY = words.length > 0 ? Math.max(...words.map(w => w.y)) : 0;

  const gridWidth = Math.max(10, maxX - minX + 3); // +3 for padding
  const gridHeight = Math.max(10, maxY - minY + 3); // +3 for padding

  const handleAddWord = async () => {
    if (newWord.trim() !== '') {
      const wordToAdd = newWord.trim();
      let currentWords = [...words];

      // Check if the word already exists
      if (!currentWords.some(w => w.word.toLowerCase() === wordToAdd.toLowerCase())) {
        const newId = currentWords.length > 0 ? Math.max(...currentWords.map(w => w.id)) + 1 : 1;
        const initialX = Math.floor(gridWidth / 2) + Math.abs(minX); // Center the first word
        const initialY = Math.floor(gridHeight / 2) + Math.abs(minY);

        const newWordData: WordData = {
          id: newId,
          word: wordToAdd,
          x: initialX,
          y: initialY,
        };
        currentWords.push(newWordData);
        setWords(currentWords);

        // Get related words and add them
        const relatedWords = await getRelatedWords(wordToAdd, currentWords);
        setWords(prevWords => {
          const updatedWords = [...prevWords];
          relatedWords.forEach(rw => {
            if (!updatedWords.some(uw => uw.word.toLowerCase() === rw.word.toLowerCase())) {
              updatedWords.push(rw);
            }
          });
          return updatedWords;
        });
      }
      setNewWord('');
    }
  };

  const renderGridCells = () => {
    const cells = [];
    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        cells.push(
          <div
            key={`cell-${x}-${y}`}
            className="grid-cell"
            style={{
              gridColumnStart: x + 1,
              gridRowStart: y + 1,
            }}
          ></div>
        );
      }
    }
    return cells;
  };

  return (
    <div className="App">
      <div className="container">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${gridWidth}, 30px)`,
            gridTemplateRows: `repeat(${gridHeight}, 30px)`,
          }}
        >
          {renderGridCells()}
          {words.map((wordData) => (
            <div
              key={wordData.id}
              className="grid-item"
              style={{
                gridColumnStart: wordData.x - minX + 1,
                gridRowStart: wordData.y - minY + 1,
              }}
            >
              <WordNode word={wordData.word} />
            </div>
          ))}
        </div>
        <div className="input-area">
          <input
            type="text"
            placeholder="Enter a word"
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddWord();
              }
            }}
          />
          <button onClick={handleAddWord}>Add</button>
        </div>
      </div>
    </div>
  );
}

export default App;