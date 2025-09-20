import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stats } from '@react-three/drei'
import RotatingCube from './scenes/RotatingCube'
import MatrixScene from './scenes/MatrixScene'
import './App.css'

function App() {
  const [currentScene, setCurrentScene] = useState<'cube' | 'matrix' | 'sphere'>('cube')

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
            Matrix 2D
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
          {currentScene === 'matrix' && <MatrixScene count={150} />}
          
          {/* Controls for user interaction - disabled for matrix scene */}
          {currentScene !== 'matrix' && (
            <OrbitControls 
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
            />
          )}
          
          {/* Performance stats */}
          <Stats />
        </Canvas>
      </main>

      <aside className="info-panel">
        <h3>Scene Info</h3>
        <p>
          {currentScene === 'cube' && 'A simple rotating cube to get started with Three.js'}
          {currentScene === 'matrix' && 'A 2D Matrix-style falling boxes animation using instanced rendering'}
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
                <li>Watch the falling green boxes</li>
                <li>Each box has random speed and opacity</li>
                <li>Colors pulse with time variations</li>
              </>
            )}
          </ul>
        </div>
      </aside>
    </div>
  )
}

export default App