import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Environment, Sky } from '@react-three/drei';

const CyberCity = () => {
  const [activeZone, setActiveZone] = useState(null);

  const zones = [
    { id: 'bank', name: 'البنك الإلكتروني', position: [10, 0, 0], color: 'gold' },
    { id: 'company', name: 'مقر الشركة', position: [-10, 0, 0], color: 'blue' },
    { id: 'hospital', name: 'المستشفى الذكي', position: [0, 0, 10], color: 'green' },
    { id: 'home', name: 'المنزل الذكي', position: [0, 0, -10], color: 'orange' }
  ];

  return (
    <Canvas camera={{ position: [0, 15, 20], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />

      <Environment preset="city" />
      <Sky sunPosition={[100, 10, 100]} />

      <OrbitControls enableZoom enablePan />

      {zones.map((zone) => (
        <CyberZone
          key={zone.id}
          zone={zone}
          isActive={activeZone === zone.id}
          onClick={() => setActiveZone(zone.id)}
        />
      ))}

      <Ground />
    </Canvas>
  );
};

const CyberZone = ({ zone, isActive, onClick }) => {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.5;
    }
  });

  return (
    <group position={zone.position}>
      <mesh ref={meshRef} onClick={onClick}>
        <boxGeometry args={[4, 4, 4]} />
        <meshStandardMaterial
          color={zone.color}
          emissive={isActive ? zone.color : '#000000'}
          emissiveIntensity={0.5}
        />
      </mesh>

      <Text
        position={[0, 3, 0]}
        color="white"
        fontSize={0.5}
        anchorX="center"
        anchorY="middle"
      >
        {zone.name}
      </Text>
    </group>
  );
};

const Ground = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
    <planeGeometry args={[50, 50]} />
    <meshStandardMaterial color="#222222" />
  </mesh>
);

export default CyberCity;
