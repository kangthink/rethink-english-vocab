import { WordData } from '../types/index.ts'; // Changed import path to be explicit

// Mock LLM service to simulate related words and their positions
export const getRelatedWords = async (word: string, existingWords: WordData[]): Promise<WordData[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const mockData: { [key: string]: { word: string; relativeX: number; relativeY: number }[] } = {
    "hello": [
      { word: "hi", relativeX: 1, relativeY: 0 },
      { word: "greeting", relativeX: 0, relativeY: 1 },
      { word: "welcome", relativeX: -1, relativeY: 0 },
    ],
    "apple": [
      { word: "fruit", relativeX: 1, relativeY: 0 },
      { word: "red", relativeX: 0, relativeY: 1 },
      { word: "tree", relativeX: -1, relativeY: 0 },
    ],
    "car": [
      { word: "vehicle", relativeX: 1, relativeY: 0 },
      { word: "drive", relativeX: 0, relativeY: 1 },
      { word: "road", relativeX: -1, relativeY: 0 },
    ],
    "happy": [
      { word: "joy", relativeX: 1, relativeY: 0 },
      { word: "sad", relativeX: 0, relativeY: 1 },
      { word: "emotion", relativeX: -1, relativeY: 0 },
    ],
  };

  const baseWordData = existingWords.find(w => w.word.toLowerCase() === word.toLowerCase());

  if (!baseWordData) {
    return [];
  }

  const related = mockData[word.toLowerCase()] || [];
  const newWords: WordData[] = [];
  let newId = existingWords.length > 0 ? Math.max(...existingWords.map(w => w.id)) + 1 : 1;

  related.forEach(rel => {
    // Calculate absolute position based on the base word's position
    const newX = baseWordData.x + rel.relativeX;
    const newY = baseWordData.y + rel.relativeY;

    // Simple collision detection and adjustment (very basic, needs improvement)
    let finalX = newX;
    let finalY = newY;
    let collisionDetected = true;
    let attempts = 0;
    const maxAttempts = 100;

    while (collisionDetected && attempts < maxAttempts) {
      collisionDetected = existingWords.some(ew => ew.x === finalX && ew.y === finalY) ||
                          newWords.some(nw => nw.x === finalX && nw.y === finalY);

      if (collisionDetected) {
        // Try to find an adjacent empty spot
        if (attempts % 4 === 0) finalX++;
        else if (attempts % 4 === 1) finalY++;
        else if (attempts % 4 === 2) finalX--;
        else finalY--;
        attempts++;
      }
    }

    if (!collisionDetected) {
      newWords.push({
        id: newId++,
        word: rel.word,
        x: finalX,
        y: finalY,
      });
    }
  });

  return newWords;
};
