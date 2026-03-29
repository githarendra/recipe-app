import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGLTF, OrbitControls, Float } from '@react-three/drei'

const Model = () => {
  const { scene } = useGLTF('/bowl.glb')
  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <primitive object={scene} scale={3.5} position={[0, -0.5, 0]} />
    </Float>
  )
}

const FloatingFood = () => {
  return (
<Canvas camera={{ position: [0, 2.5, 6], fov: 45 }}>
  <ambientLight intensity={0.75} />
  <directionalLight position={[5, 5, 5]} intensity={0.9} />
  <pointLight position={[-3, 2, -3]} color="#f97316" intensity={0.5} />
  <Suspense fallback={null}>
    <Model />
  </Suspense>
  <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={2} />
</Canvas>
  )
}

export default FloatingFood