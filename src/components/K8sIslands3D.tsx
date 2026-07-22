import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function Pod({ position, color }: { position: [number, number, number]; color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.08;
    }
  });
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.16, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} />
    </mesh>
  );
}

function IslandCluster({ x, podColor }: { x: number; podColor: string }) {
  return (
    <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.5}>
      <group position={[x, 0, 0]}>
        <mesh position={[0, -0.35, 0]}>
          <cylinderGeometry args={[1.1, 1.3, 0.5, 8]} />
          <meshStandardMaterial color="#141d33" />
        </mesh>
        <Pod position={[-0.4, 0.1, 0.3]} color={podColor} />
        <Pod position={[0.3, 0.2, -0.2]} color={podColor} />
        <Pod position={[0.1, 0.05, 0.4]} color={podColor} />
      </group>
    </Float>
  );
}

export default function K8sIslands3D() {
  return (
    <div className="w-full aspect-video max-h-[420px] rounded-2xl border border-line bg-panel overflow-hidden">
      <Canvas camera={{ position: [0, 2.4, 6], fov: 45 }}>
        <color attach="background" args={["#070b14"]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={40} color="#4cd4e8" />
        <pointLight position={[-5, 3, -5]} intensity={20} color="#a78bfa" />
        <Suspense fallback={null}>
          <IslandCluster x={-2.2} podColor="#4cd4e8" />
          <IslandCluster x={0} podColor="#a78bfa" />
          <IslandCluster x={2.2} podColor="#34d399" />
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          autoRotate
          autoRotateSpeed={0.6}
          minPolarAngle={Math.PI / 2.6}
          maxPolarAngle={Math.PI / 2.1}
        />
      </Canvas>
    </div>
  );
}
