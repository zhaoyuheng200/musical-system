import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stats } from '@react-three/drei'
import RotatingCube from './scenes/RotatingCube'
import MatrixScene from './scenes/MatrixScene'
import './App.css'

function App() {
  const [currentScene, setCurrentScene] = useState<'cube' | 'matrix' | 'sphere'>('cube')
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number; x: number; y: number } | null>(null)

  return (
    <div className="app">
      <header className="header">
        <h1>Three.js Playground</h1>
        <nav className="nav">
          <button 
            className={currentScene === 'cube' ? 'active' : ''}
            onClick={() => setCurrentScene('cube')}
          >
            Rotating Cube
          </button>
          <button 
            className={currentScene === 'matrix' ? 'active' : ''}
            onClick={() => setCurrentScene('matrix')}
          >
            Memory Matrix
          </button>
          <button 
            className={currentScene === 'sphere' ? 'active' : ''}
            onClick={() => setCurrentScene('sphere')}
          >
            Coming Soon...
          </button>
        </nav>
      </header>

      <main className="canvas-container">
        <Canvas
          camera={{ 
            position: currentScene === 'matrix' ? [0, 0, 8] : [0, 0, 5], 
            fov: currentScene === 'matrix' ? 50 : 75 
          }}
          gl={{ antialias: true }}
        >
          {/* Conditional lighting based on scene */}
          {currentScene !== 'matrix' && (
            <>
              <ambientLight intensity={0.4} />
              <directionalLight position={[10, 10, 5]} intensity={1} />
            </>
          )}
          
          {/* Scene content */}
          {currentScene === 'cube' && <RotatingCube />}
          {currentScene === 'matrix' && <MatrixScene rows={24} cols={32} onHover={setHoveredCell} />}
          
          {/* Controls for user interaction */}
          <OrbitControls 
            enablePan={currentScene !== 'matrix'}
            enableZoom={true}
            enableRotate={currentScene !== 'matrix'}
            minDistance={currentScene === 'matrix' ? 5 : 1}
            maxDistance={currentScene === 'matrix' ? 50 : 100}
          />
          
          {/* Performance stats */}
          <Stats />
        </Canvas>
      </main>

      <aside className="info-panel">
        <h3>Scene Info</h3>
        <p>
          {currentScene === 'cube' && 'A simple rotating cube to get started with Three.js'}
          {currentScene === 'matrix' && 'Memory access pattern visualization: 24x32 grid showing different memory access patterns (sequential, random, block, stride)'}
          {currentScene === 'sphere' && 'More scenes coming soon!'}
        </p>
        <div className="controls-info">
          <h4>Controls:</h4>
          <ul>
            {currentScene !== 'matrix' ? (
              <>
                <li>Left click + drag: Rotate camera</li>
                <li>Right click + drag: Pan camera</li>
                <li>Scroll: Zoom in/out</li>
              </>
            ) : (
              <>
                <li>🔴 Red: Currently being accessed</li>
                <li>🔵 Blue: Recently accessed memory</li>
                <li>⚫ Gray: Inactive memory cells</li>
                <li>🔍 Scroll: Zoom in/out to inspect cells</li>
                <li>🖱️ Hover: Shows cell coordinates</li>
                <li>Patterns cycle: Sequential → Random → Block → Stride</li>
              </>
            )}
          </ul>
        </div>
      </aside>

      {/* Tooltip for hovered cell - outside Canvas */}
      {hoveredCell && (
        <div
          style={{
            position: 'fixed',
            left: hoveredCell.x + 10,
            top: hoveredCell.y - 30,
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            pointerEvents: 'none',
            zIndex: 1000,
            border: '1px solid #61dafb'
          }}
        >
          Row: {hoveredCell.row}, Col: {hoveredCell.col}
        </div>
      )}
    </div>
  )
}

export default App