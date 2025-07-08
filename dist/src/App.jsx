// src/App.jsx
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

const boltGrid = [
  ['1A', '1B', '1C'],
  ['2AB', '2BC'],
  ['3A', '3B', '3C'],
  ['4AB', '4BC'],
  ['5A', '5B', '5C'],
  ['6AB', '6BC'],
  ['7A', '7B', '7C'],
];

const starterHoles = ['H1', 'H2', 'H3'];

const initialPlanks = [
  { id: 'r1', color: 'red', level: 1, bolts: ['1A', '3A'] },
  { id: 'r2', color: 'red', level: 1, bolts: ['5A', '7A'] },
  { id: 'r3', color: 'red', level: 4, bolts: ['1A', '1B', '1C'] },
  { id: 'r4', color: 'red', level: 1, bolts: ['1C', '3C'] },
  { id: 'r5', color: 'red', level: 1, bolts: ['5C', '7C'] },
  { id: 'r6', color: 'red', level: 1, bolts: ['2AB', '4AB'] },
  { id: 'r7', color: 'red', level: 1, bolts: ['2BC', '4BC'] },
  { id: 'r8', color: 'red', level: 4, bolts: ['4AB', '4BC'] },
  { id: 'r9', color: 'red', level: 4, bolts: ['6AB', '6BC'] },
  { id: 'r10', color: 'red', level: 4, bolts: ['3A', '3B', '3C'] },
  { id: 'r11', color: 'red', level: 4, bolts: ['5A', '5B', '5C'] },
  { id: 'r12', color: 'red', level: 1, bolts: ['1B', '3B'] },
  { id: 'r13', color: 'red', level: 1, bolts: ['5B', '7B'] },
];

const boltPositionMap = {};
boltGrid.forEach((row, rowIndex) => {
  row.forEach((bolt, colIndex) => {
    boltPositionMap[bolt] = { x: colIndex, y: rowIndex };
  });
});

export default function App() {
  const [planks, setPlanks] = useState(initialPlanks);
  const [removedBolts, setRemovedBolts] = useState([]);
  const [steps, setSteps] = useState([]);
  const initialRef = useRef(initialPlanks);

  function canRemoveBolt(boltId) {
    const blockers = planks.filter(p =>
      p.bolts.includes(boltId) &&
      p.bolts.some(b => !removedBolts.includes(b)) &&
      p.bolts.length > 1
    );
    return blockers.length === 0;
  }

  function removeBolt(boltId) {
    if (!canRemoveBolt(boltId)) return;
    setRemovedBolts(prev => [...prev, boltId]);
    setSteps(prev => [...prev, `Removed ${boltId}`]);
  }

  function resetGame() {
    setRemovedBolts([]);
    setSteps([]);
    setPlanks(initialRef.current);
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">Wood Nuts Simulator</h1>

      <div className="grid grid-cols-3 gap-1 mb-4">
        {starterHoles.map((id, idx) => (
          <div key={id} className="h-6 bg-gray-200 rounded flex items-center justify-center">
            {id}
          </div>
        ))}
      </div>

      <div className="grid grid-rows-7 grid-cols-3 gap-1 relative">
        {boltGrid.flat().map(bolt => (
          <button
            key={bolt}
            onClick={() => removeBolt(bolt)}
            disabled={!canRemoveBolt(bolt)}
            className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center
              ${removedBolts.includes(bolt) ? 'bg-gray-300' : 'bg-yellow-400 hover:bg-yellow-500'}`}
          >
            ●
          </button>
        ))}

        {planks.map(p => {
          const positions = p.bolts.map(b => boltPositionMap[b]).filter(Boolean);
          if (positions.length === 0) return null;
          const minX = Math.min(...positions.map(p => p.x));
          const minY = Math.min(...positions.map(p => p.y));
          const maxX = Math.max(...positions.map(p => p.x));
          const maxY = Math.max(...positions.map(p => p.y));
          return (
            <motion.div
              key={p.id}
              className={`absolute rounded-md opacity-90 z-[${p.level * 10}]`}
              style={{
                backgroundColor: p.color,
                left: `${minX * 2}rem`,
                top: `${minY * 2}rem`,
                width: `${(maxX - minX + 1) * 2}rem`,
                height: `${(maxY - minY + 1) * 2}rem`
              }}
              animate={{ y: removedBolts.some(b => p.bolts.includes(b)) && p.bolts.filter(b => !removedBolts.includes(b)).length === 1 ? 200 : 0 }}
              transition={{ type: 'spring', stiffness: 100 }}
            />
          );
        })}
      </div>

      <div className="mt-4">
        <button onClick={resetGame} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Reset</button>
        {planks.every(p => p.bolts.every(b => removedBolts.includes(b))) && (
          <span className="ml-4 text-green-600 font-bold">Success 🎉</span>
        )}
      </div>

      <div className="mt-4 text-sm bg-gray-100 p-2 rounded">
        <h2 className="font-bold mb-1">Steps</h2>
        <ul className="list-disc ml-5">
          {steps.map((s, idx) => <li key={idx}>{s}</li>)}
        </ul>
      </div>
    </div>
  );
}
