import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { InstancedMesh, Object3D, Color } from 'three'

interface MatrixBoxProps {
  count?: number
}

export default function MatrixScene({ count = 100 }: MatrixBoxProps) {
  const meshRef = useRef<InstancedMesh>(null!)
  const tempObject = useMemo(() => new Object3D(), [])
  
  // Generate random data for each box
  const boxData = useMemo(() => {
    const data = []
    for (let i = 0; i < count; i++) {
      data.push({
        x: (Math.random() - 0.5) * 20,
        y: Math.random() * 10 + 5,
        z: 0, // Keep it 2D
        speed: Math.random() * 0.02 + 0.01,
        size: Math.random() * 0.3 + 0.1,
        opacity: Math.random() * 0.8 + 0.2,
        hue: Math.random() * 60 + 100 // Green-ish colors
      })
    }
    return data
  }, [count])

  useFrame((state) => {
    if (!meshRef.current) return

    // Update each box instance
    boxData.forEach((box, i) => {
      // Update position (falling effect)
      box.y -= box.speed
      
      // Reset to top when it falls off screen
      if (box.y < -5) {
        box.y = Math.random() * 5 + 10
        box.x = (Math.random() - 0.5) * 20
      }

      // Set transform
      tempObject.position.set(box.x, box.y, box.z)
      tempObject.scale.setScalar(box.size)
      tempObject.updateMatrix()
      meshRef.current.setMatrixAt(i, tempObject.matrix)

      // Set color with some variation
      const greenIntensity = Math.sin(state.clock.elapsedTime + i * 0.1) * 0.3 + 0.7
      const color = new Color().setHSL(box.hue / 360, 0.8, greenIntensity * box.opacity)
      meshRef.current.setColorAt(i, color)
    })

    meshRef.current.instanceMatrix.needsUpdate = true
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true
    }
  })

  return (
    <group>
      {/* Use orthographic-like perspective for 2D feel */}
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        <planeGeometry args={[0.8, 0.8]} />
        <meshBasicMaterial transparent opacity={0.8} />
      </instancedMesh>
      
      {/* Add some background elements for depth */}
      <mesh position={[0, 0, -2]} scale={[25, 15, 1]}>
        <planeGeometry />
        <meshBasicMaterial color="#000a00" transparent opacity={0.3} />
      </mesh>
    </group>
  )
}