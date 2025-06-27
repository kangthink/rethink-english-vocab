import React from 'react';

interface WordNodeProps {
  word: string;
}

const WordNode: React.FC<WordNodeProps> = ({ word }) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      fontSize: '0.8em',
      color: 'white',
      textAlign: 'center',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }}>
      {word}
    </div>
  );
};

export default WordNode;