import { useRef, useMemo, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { InstancedMesh, Object3D, Color, Raycaster, Vector2 } from 'three'

interface MatrixSceneProps {
  rows?: number
  cols?: number
  onHover?: (cellInfo: { row: number; col: number; x: number; y: number } | null) => void
}

export default function MatrixScene({ rows = 32, cols = 32, onHover }: MatrixSceneProps) {
  const meshRef = useRef<InstancedMesh>(null!)
  const tempObject = useMemo(() => new Object3D(), [])
  const [currentPattern, setCurrentPattern] = useState('Sequential')
  const { camera, gl } = useThree()
  const raycaster = useMemo(() => new Raycaster(), [])
  const mouse = useMemo(() => new Vector2(), [])
  
  const totalCells = rows * cols
  const cellSize = 0.15
  const spacing = 0.18
  
  // Generate grid positions and memory access simulation
  const matrixData = useMemo(() => {
    const data = []
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const index = row * cols + col
        data.push({
          index,
          row,
          col,
          x: (col - cols / 2) * spacing,
          y: (rows / 2 - row) * spacing,
          z: 0,
          baseColor: 0.2, // Base blue/gray
          accessTime: 0,
          isAccessed: false
        })
      }
    }
    return data
  }, [rows, cols, spacing])

  // Handle mouse move for hover detection
  const handlePointerMove = (event: any) => {
    if (!onHover) return
    
    // Get mouse position in normalized device coordinates
    const rect = gl.domElement.getBoundingClientRect()
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    // Update raycaster
    raycaster.setFromCamera(mouse, camera)
    
    if (meshRef.current) {
      const intersects = raycaster.intersectObject(meshRef.current)
      
      if (intersects.length > 0) {
        const instanceId = intersects[0].instanceId
        if (instanceId !== undefined && instanceId < matrixData.length) {
          const cell = matrixData[instanceId]
          onHover({
            row: cell.row,
            col: cell.col,
            x: event.clientX,
            y: event.clientY
          })
        }
      } else {
        onHover(null)
      }
    }
  }

  // Simulate memory access patterns
  useFrame((state) => {
    if (!meshRef.current) return

    const time = state.clock.elapsedTime
    const patternIndex = Math.floor(time * 2) % 4
    
    // Update pattern name
    const patterns = ['Sequential', 'Random', 'Block', 'Stride']
    const newPattern = patterns[patternIndex]
    if (newPattern !== currentPattern) {
      setCurrentPattern(newPattern)
    }
    
    // Simulate different memory access patterns
    if (patternIndex === 0) {
      // Sequential access pattern
      const currentIndex = Math.floor((time * 10) % totalCells)
      matrixData.forEach((cell, i) => {
        cell.isAccessed = i === currentIndex
        if (cell.isAccessed) cell.accessTime = time
      })
    } else if (patternIndex === 1) {
      // Random access pattern
      if (Math.floor(time * 5) !== Math.floor((time - 0.016) * 5)) {
        const randomIndex = Math.floor(Math.random() * totalCells)
        matrixData[randomIndex].isAccessed = true
        matrixData[randomIndex].accessTime = time
      }
    } else if (patternIndex === 2) {
      // Block access pattern (cache-friendly)
      const blockSize = 4
      const blockIndex = Math.floor((time * 3) % (totalCells / (blockSize * blockSize)))
      const startRow = Math.floor(blockIndex / (cols / blockSize)) * blockSize
      const startCol = (blockIndex % (cols / blockSize)) * blockSize
      
      matrixData.forEach((cell) => {
        cell.isAccessed = cell.row >= startRow && cell.row < startRow + blockSize &&
                         cell.col >= startCol && cell.col < startCol + blockSize
        if (cell.isAccessed) cell.accessTime = time
      })
    } else {
      // Stride access pattern
      const stride = 4
      const startIndex = Math.floor((time * 8) % stride)
      matrixData.forEach((cell, i) => {
        cell.isAccessed = (i - startIndex) % stride === 0 && i >= startIndex
        if (cell.isAccessed) cell.accessTime = time
      })
    }

    // Update visual representation
    matrixData.forEach((cell, i) => {
      // Position
      tempObject.position.set(cell.x, cell.y, cell.z)
      tempObject.scale.setScalar(cellSize)
      tempObject.updateMatrix()
      meshRef.current.setMatrixAt(i, tempObject.matrix)

      // Color based on access state and recency
      let color: Color
      const timeSinceAccess = time - cell.accessTime
      
      if (cell.isAccessed) {
        // Currently being accessed - bright red
        color = new Color(1, 0.2, 0.2)
      } else if (timeSinceAccess < 1) {
        // Recently accessed - fade from red to blue
        const fade = timeSinceAccess
        color = new Color(1 - fade * 0.8, 0.2, 0.2 + fade * 0.6)
      } else if (timeSinceAccess < 5) {
        // Was accessed in last 5 seconds - blue
        const fade = Math.min(1, (timeSinceAccess - 1) / 4)
        color = new Color(0.2, 0.3, 0.8 - fade * 0.4)
      } else {
        // Not recently accessed - gray
        color = new Color(0.3, 0.3, 0.4)
      }
      
      meshRef.current.setColorAt(i, color)
    })

    meshRef.current.instanceMatrix.needsUpdate = true
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true
    }
  })

  return (
    <>
      <group onPointerMove={handlePointerMove} onPointerLeave={() => onHover?.(null)}>
        <instancedMesh ref={meshRef} args={[undefined, undefined, totalCells]}>
          <boxGeometry args={[1, 1, 0.1]} />
          <meshBasicMaterial />
        </instancedMesh>
      
      {/* Grid background */}
      <mesh position={[0, 0, -0.1]} scale={[cols * spacing + 1, rows * spacing + 1, 1]}>
        <planeGeometry />
        <meshBasicMaterial color="#1a1a1a" transparent opacity={0.8} />
      </mesh>
      
      {/* Title showing current access pattern */}
      <Text
        position={[0, (rows / 2 + 2.5) * spacing, 0.1]}
        fontSize={0.3}
        color="#61dafb"
        anchorX="center"
        anchorY="middle"
      >
        Memory Access Pattern: {currentPattern}
      </Text>
      
      {/* Column numbers (top) */}
      {Array.from({ length: cols }, (_, col) => (
        <Text
          key={`col-${col}`}
          position={[(col - cols / 2) * spacing, (rows / 2 + 1) * spacing, 0.1]}
          fontSize={0.12}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {col}
        </Text>
      ))}
      
      {/* Row numbers (left) */}
      {Array.from({ length: rows }, (_, row) => (
        <Text
          key={`row-${row}`}
          position={[(-cols / 2 - 1) * spacing, (rows / 2 - row) * spacing, 0.1]}
          fontSize={0.12}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {row}
        </Text>
      ))}
      </group>
    </>
  )
}