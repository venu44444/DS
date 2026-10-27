import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';

/**
 * 1. The Gradient Descent Manifold:
 * A live mathematical wave surface (loss landscape) that gently undulates
 * using harmonic trigonometric equations and reacts to the user's cursor.
 */
function LossLandscapeManifold({ isDark }) {
  const meshRef = useRef();
  const geomRef = useRef();

  // 48x36 segments plane for smooth wave animation without heavy compute
  const { originalPositions, count } = useMemo(() => {
    const geo = new THREE.PlaneGeometry(32, 22, 48, 36);
    const pos = geo.attributes.position.array;
    return {
      originalPositions: new Float32Array(pos),
      count: pos.length / 3,
    };
  }, []);

  useFrame((state) => {
    if (!geomRef.current) return;
    const t = state.clock.getElapsedTime() * 0.45;
    const { pointer } = state;
    const pos = geomRef.current.attributes.position.array;

    for (let i = 0; i < count; i++) {
      const x = originalPositions[i * 3];
      const y = originalPositions[i * 3 + 1];

      // Harmonic mathematical loss surface: combination of wave frequencies
      const z =
        Math.sin(x * 0.35 + t) * Math.cos(y * 0.3 + t * 0.8) * 1.2 +
        Math.sin((x + y) * 0.2 + t * 0.6) * 0.7 +
        Math.cos(Math.sqrt(x * x + y * y) * 0.3 - t * 0.5) * 0.5 +
        pointer.x * Math.sin(x * 0.5) * 0.4 -
        pointer.y * Math.cos(y * 0.5) * 0.4;

      pos[i * 3 + 2] = z;
    }

    geomRef.current.attributes.position.needsUpdate = true;

    if (meshRef.current) {
      // Gentle reactive tilt
      meshRef.current.rotation.z = Math.sin(t * 0.2) * 0.05 + pointer.x * 0.08;
      meshRef.current.rotation.x = -Math.PI / 2.7 + pointer.y * 0.05;
    }
  });

  const wireColor = isDark ? '#38bdf8' : '#0284c7';
  const wireOpacity = isDark ? 0.15 : 0.08;

  return (
    <mesh
      ref={meshRef}
      position={[0, -2.8, -4]}
      rotation={[-Math.PI / 2.7, 0, 0]}
    >
      <planeGeometry ref={geomRef} args={[32, 22, 48, 36]} />
      <meshBasicMaterial
        wireframe
        color={wireColor}
        transparent
        opacity={wireOpacity}
        depthWrite={false}
      />
    </mesh>
  );
}

/**
 * 2. Neural Data Constellation:
 * High-dimensional data nodes with proximity synapsing lines.
 */
function NeuralDataConstellation({ isDark }) {
  const groupRef = useRef();
  const count = 75;

  const [positions, lineIndices] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 1;
    }

    const indices = [];
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = pos[i * 3] - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < 3.4) {
          indices.push(i, j);
        }
      }
    }

    return [pos, new Uint16Array(indices)];
  }, [count]);

  const lineGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setIndex(new THREE.BufferAttribute(lineIndices, 1));
    return geo;
  }, [positions, lineIndices]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const { pointer } = state;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.02 + pointer.x * 0.12;
    groupRef.current.rotation.x = Math.sin(t * 0.015) * 0.04 - pointer.y * 0.08;
  });

  const nodeColor = isDark ? '#22d3ee' : '#0ea5e9';
  const synapseColor = isDark ? '#818cf8' : '#6366f1';
  const synapseOpacity = isDark ? 0.16 : 0.09;

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.14}
          color={nodeColor}
          transparent
          opacity={isDark ? 0.65 : 0.45}
          sizeAttenuation
        />
      </points>

      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial
          color={synapseColor}
          transparent
          opacity={synapseOpacity}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}

/**
 * 3. High-Dimensional Tensor Polyhedra:
 * Slow floating geometric structures symbolizing mathematical dimensionality.
 */
function TensorPolyhedra({ isDark }) {
  const mesh1 = useRef();
  const mesh2 = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (mesh1.current) {
      mesh1.current.rotation.x = t * 0.05;
      mesh1.current.rotation.y = t * 0.07;
    }
    if (mesh2.current) {
      mesh2.current.rotation.x = -t * 0.04;
      mesh2.current.rotation.z = t * 0.06;
    }
  });

  const color1 = isDark ? '#38bdf8' : '#0284c7';
  const color2 = isDark ? '#a855f7' : '#9333ea';
  const opacity1 = isDark ? 0.14 : 0.08;
  const opacity2 = isDark ? 0.12 : 0.07;

  return (
    <>
      <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh ref={mesh1} position={[-6.5, 2.2, -4]}>
          <dodecahedronGeometry args={[1.7, 0]} />
          <meshBasicMaterial
            wireframe
            color={color1}
            transparent
            opacity={opacity1}
          />
        </mesh>
      </Float>

      <Float speed={1.6} rotationIntensity={0.4} floatIntensity={0.7}>
        <mesh ref={mesh2} position={[6.8, -1.8, -3.5]}>
          <icosahedronGeometry args={[1.5, 1]} />
          <meshBasicMaterial
            wireframe
            color={color2}
            transparent
            opacity={opacity2}
          />
        </mesh>
      </Float>
    </>
  );
}

export default function Scene3D() {
  const { isDark } = useTheme();

  return (
    <Canvas
      camera={{ position: [0, 0, 7.5], fov: 60 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      {/* 1. Undulating Gradient Descent Manifold */}
      <LossLandscapeManifold isDark={isDark} />

      {/* 2. Neural Data Constellation */}
      <NeuralDataConstellation isDark={isDark} />

      {/* 3. High-Dimensional Tensor Polyhedra */}
      <TensorPolyhedra isDark={isDark} />
    </Canvas>
  );
}
