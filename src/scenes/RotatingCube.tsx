import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'

export default function RotatingCube() {
  const meshRef = useRef<Mesh>(null!)

  // This hook runs every frame and rotates the cube
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta
      meshRef.current.rotation.y += delta * 0.7
    }
  })

  return (
    <mesh ref={meshRef}>
      {/* Box geometry with width, height, depth */}
      <boxGeometry args={[2, 2, 2]} />
      
      {/* Material with a nice color and properties */}
      <meshStandardMaterial 
        color="royalblue" 
        wireframe={false}
        roughness={0.3}
        metalness={0.1}
      />
    </mesh>
  )
}