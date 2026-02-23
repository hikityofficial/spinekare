import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface SpineModelProps {
    activeArea?: 'cervical' | 'thoracic' | 'lumbar' | 'full' | 'none' | 'core';
}

const Vertebra = ({ position, index, activeArea }: { position: [number, number, number], index: number, activeArea: string }) => {
    const meshRef = useRef<THREE.Mesh>(null);

    let isCervical = index >= 17;
    let isThoracic = index >= 5 && index < 17;
    let isLumbar = index < 5;

    let isActive = false;
    if (activeArea === 'full') isActive = true;
    if (activeArea === 'cervical' && isCervical) isActive = true;
    if (activeArea === 'thoracic' && isThoracic) isActive = true;
    if (activeArea === 'lumbar' && isLumbar) isActive = true;

    useFrame((state) => {
        if (meshRef.current) {
            const scale = 1 + Math.sin(state.clock.elapsedTime * 2 + index * 0.2) * (isActive ? 0.08 : 0.02);
            meshRef.current.scale.set(scale, scale, scale);
        }
    });

    const baseColor = new THREE.Color('#1E3358');
    const activeColor = new THREE.Color('#00E5CC');

    return (
        <mesh position={position} ref={meshRef}>
            <cylinderGeometry args={[0.9, 0.9, 0.6, 24]} />
            <meshStandardMaterial
                color={isActive ? activeColor : baseColor}
                emissive={isActive ? activeColor : new THREE.Color(0x000000)}
                emissiveIntensity={isActive ? 0.6 : 0}
                roughness={0.3}
                metalness={0.7}
            />
        </mesh>
    );
};

const Disc = ({ position }: { position: [number, number, number] }) => (
    <mesh position={position}>
        <cylinderGeometry args={[0.8, 0.8, 0.2, 24]} />
        <meshStandardMaterial color="#8A9BBE" roughness={0.9} transparent opacity={0.4} />
    </mesh>
);

const SpineStack = ({ activeArea }: { activeArea: string }) => {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
        }
    });

    const vertebraeCount = 24;
    const spacing = 1.0;

    const getCurveOffset = (i: number) => {
        const normalized = i / vertebraeCount;
        return Math.sin(normalized * Math.PI * 2.5) * 1.5;
    };

    return (
        <group ref={groupRef} position={[0, -11, 0]}>
            {Array.from({ length: vertebraeCount }).map((_, i) => (
                <React.Fragment key={i}>
                    <Vertebra
                        index={i}
                        activeArea={activeArea}
                        position={[0, i * spacing, getCurveOffset(i)]}
                    />
                    {i < vertebraeCount - 1 && (
                        <Disc position={[0, i * spacing + 0.5, (getCurveOffset(i) + getCurveOffset(i + 1)) / 2]} />
                    )}
                </React.Fragment>
            ))}
        </group>
    );
};

export default function SpineModel3D({ activeArea = 'none' }: SpineModelProps) {
    return (
        <div className="w-full h-full flex items-center justify-center relative">
            <Canvas camera={{ position: [16, 0, 16], fov: 40 }}>
                <ambientLight intensity={0.4} />
                <spotLight position={[20, 20, 10]} angle={0.2} penumbra={1} intensity={2} color="#F0F4FF" />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#0A1628" />
                <SpineStack activeArea={activeArea} />
                <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
            </Canvas>
        </div>
    );
}
