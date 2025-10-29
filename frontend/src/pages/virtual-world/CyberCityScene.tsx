import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { Physics, useBox, usePlane } from '@react-three/cannon';
import { EffectComposer, DepthOfField, Bloom } from '@react-three/postprocessing';
import { Sphere, Text, useTexture } from '@react-three/drei';
import { MeshLine, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';

import { useStores } from '../../core/architecture/container';

extend({ MeshLine, MeshLineMaterial });

type Vector3Tuple = [number, number, number];

type NetworkPacket = {
    id: string;
    position: Vector3Tuple;
    velocity: Vector3Tuple;
    color: string;
    opacity: number;
};

type ThreatIndicator = {
    id: string;
    position: Vector3Tuple;
    severity: 'low' | 'medium' | 'high';
    ttl: number;
};

type UserProgress = {
    completion: number;
    mastery: number;
    streak: number;
} | null;

const DEFAULT_WS_URL = 'ws://localhost:8080/ws';

const severityColor: Record<ThreatIndicator['severity'], string> = {
    low: '#3ddc97',
    medium: '#ffbd39',
    high: '#ff3864',
};

const useCyberCityRealtime = () => {
    const { simulationStore, aiStore } = useStores();
    const [networkTraffic, setNetworkTraffic] = useState<NetworkPacket[]>([]);
    const [threats, setThreats] = useState<ThreatIndicator[]>([]);
    const [userProgress, setUserProgress] = useState<UserProgress>(null);

    useEffect(() => {
        const url = process.env.REACT_APP_WS_URL ?? DEFAULT_WS_URL;
        const socket = new WebSocket(url);

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                switch (data.type) {
                    case 'NETWORK_TRAFFIC': {
                        const packets: NetworkPacket[] = data.packets.map((packet: Record<string, unknown>) => ({
                            id: `${packet.id ?? Math.random().toString(36).slice(2)}`,
                            position: packet.position as Vector3Tuple,
                            velocity: packet.velocity as Vector3Tuple,
                            color: (packet.color as string) ?? '#00e0ff',
                            opacity: 1,
                        }));
                        setNetworkTraffic((prev) => [...prev, ...packets].slice(-200));
                        packets.forEach((packet) => simulationStore.addNetworkEvent(packet));
                        break;
                    }
                    case 'THREAT_DETECTED': {
                        const threat: ThreatIndicator = {
                            id: data.threat.id ?? Math.random().toString(36).slice(2),
                            position: data.threat.position ?? [0, 4, 0],
                            severity: data.threat.severity ?? 'medium',
                            ttl: data.threat.ttl ?? 12,
                        };
                        setThreats((prev) => [...prev.filter((t) => t.id !== threat.id), threat]);
                        aiStore.addIntervention({
                            message: `Threat detected: ${threat.severity.toUpperCase()}`,
                            severity: threat.severity === 'high' ? 'critical' : 'warning',
                        });
                        break;
                    }
                    case 'USER_PROGRESS_UPDATE': {
                        setUserProgress(data.progress as UserProgress);
                        break;
                    }
                    default:
                        break;
                }
            } catch (error) {
                console.warn('Invalid realtime payload', error);
            }
        };

        socket.onerror = (error) => {
            console.error('Realtime socket error', error);
        };

        return () => socket.close();
    }, [aiStore, simulationStore]);

    const updateNetworkTraffic = useCallback((delta: number) => {
        setNetworkTraffic((prev) =>
            prev
                .map((packet) => {
                    const nextPosition: Vector3Tuple = [
                        packet.position[0] + packet.velocity[0] * delta,
                        packet.position[1] + packet.velocity[1] * delta,
                        packet.position[2] + packet.velocity[2] * delta,
                    ];
                    const opacity = Math.max(0, packet.opacity - delta * 0.25);
                    return { ...packet, position: nextPosition, opacity };
                })
                .filter((packet) => packet.opacity > 0.05),
        );
    }, []);

    const updateThreats = useCallback((delta: number) => {
        setThreats((prev) =>
            prev
                .map((threat) => ({ ...threat, ttl: threat.ttl - delta }))
                .filter((threat) => threat.ttl > 0),
        );
    }, []);

    return { networkTraffic, threats, userProgress, updateNetworkTraffic, updateThreats };
};

const NetworkPacketVisual: React.FC<{ packet: NetworkPacket; onIntercept?: (packet: NetworkPacket) => void }> = ({
    packet,
    onIntercept,
}) => {
    const lineRef = useRef<THREE.Mesh>(null);

    useEffect(() => {
        if (packet.opacity < 0.2 && onIntercept) {
            onIntercept(packet);
        }
    }, [packet, onIntercept]);

    return (
        <mesh ref={lineRef}>
            {/* @ts-expect-error meshline types are not precise */}
            <meshLine attach="geometry" points={new Float32Array([...packet.position, packet.position[0], packet.position[1] + 0.6, packet.position[2]])} />
            {/* @ts-expect-error meshline material typing */}
            <meshLineMaterial attach="material" transparent lineWidth={0.045} color={packet.color} opacity={packet.opacity} />
        </mesh>
    );
};

const ThreatVisualization: React.FC<{ threat: ThreatIndicator }> = ({ threat }) => {
    const pulse = Math.sin(Date.now() / 180) * 0.25 + 1.1;
    return (
        <group position={threat.position}>
            <Sphere args={[pulse, 32, 32]}>
                <meshStandardMaterial
                    color={severityColor[threat.severity]}
                    emissive={severityColor[threat.severity]}
                    emissiveIntensity={0.8}
                    transparent
                    opacity={Math.min(1, threat.ttl / 8)}
                />
            </Sphere>
            <Text position={[0, 1.6, 0]} fontSize={0.35} color="white">
                {threat.severity.toUpperCase()}
            </Text>
        </group>
    );
};

const UserProgressVisualization: React.FC<{ progress: UserProgress }> = ({ progress }) => {
    const radius = useMemo(() => (progress ? 1.6 + progress.completion * 3.4 : 1.2), [progress]);
    return (
        <group position={[0, 0.2, 0]}>
            <mesh rotation={[Math.PI / 2, 0, 0]} scale={[radius, radius, 1]}>
                <torusGeometry args={[1, 0.08, 16, 64]} />
                <meshStandardMaterial
                    color={progress ? '#5dd9c1' : '#2b2d42'}
                    emissive={progress ? '#5dd9c1' : '#000000'}
                    emissiveIntensity={progress ? 0.6 : 0}
                />
            </mesh>
            {progress && (
                <Text position={[0, 0, 0]} fontSize={0.38} color="white">
                    {`${Math.round(progress.completion * 100)}%`}
                </Text>
            )}
        </group>
    );
};

const AdvancedBuildingCluster: React.FC = () => {
    const [ref] = useBox<THREE.Group>(() => ({ mass: 0, position: [0, 1.5, -5] }));
    return (
        <group ref={ref}>
            {[...Array(6)].map((_, index) => (
                <mesh key={index} position={[index * 2 - 5, Math.random() * 4 + 2, Math.random()]}
                    castShadow
                >
                    <boxGeometry args={[1.2, Math.random() * 6 + 2, 1.2]} />
                    <meshStandardMaterial color="#23395d" emissive="#1d84b5" emissiveIntensity={0.4} />
                </mesh>
            ))}
        </group>
    );
};

const DataCenterWithTraffic: React.FC = () => {
    const [ref] = useBox<THREE.Group>(() => ({ mass: 0, position: [6, 1, 4] }));
    const texture = useTexture('/textures/datacenter-panel.png');

    return (
        <group ref={ref}>
            <mesh>
                <boxGeometry args={[4, 2.5, 4]} />
                <meshStandardMaterial color="#0f1b2b" emissive="#1d84b5" emissiveIntensity={0.7} map={texture} />
            </mesh>
            <Text position={[0, 1.6, 2.1]} fontSize={0.4} color="#58a6ff">
                NOC
            </Text>
        </group>
    );
};

const NetworkOperationsCenter: React.FC = () => {
    const [ref] = useBox<THREE.Group>(() => ({ mass: 0, position: [-6, 1.2, 3] }));
    return (
        <group ref={ref}>
            <mesh>
                <boxGeometry args={[3, 2.4, 3]} />
                <meshStandardMaterial color="#2b2d42" emissive="#ffbd39" emissiveIntensity={0.4} />
            </mesh>
            <Text position={[0, 1.5, 1.8]} fontSize={0.35} color="#ffbd39">
                SOC
            </Text>
        </group>
    );
};

const ThreatIntelligenceDashboard: React.FC = () => {
    const [ref] = useBox<THREE.Group>(() => ({ mass: 0, position: [0, 0.8, 6] }));
    return (
        <group ref={ref}>
            <mesh>
                <boxGeometry args={[4, 1.6, 0.4]} />
                <meshStandardMaterial color="#171820" emissive="#ff3864" emissiveIntensity={0.5} />
            </mesh>
            <Text position={[0, 1, 0.25]} fontSize={0.3} color="#ff3864">
                Threat Dashboard
            </Text>
        </group>
    );
};

const GroundPlane: React.FC = () => {
    usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], position: [0, -0.01, 0] }));
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[80, 80]} />
            <meshStandardMaterial color="#0d1117" />
        </mesh>
    );
};

const AdaptiveCameraRig: React.FC<{ userProgress: UserProgress; threats: ThreatIndicator[] }> = ({ userProgress, threats }) => {
    const { camera } = useThree();
    useFrame((state, delta) => {
        const focusThreat = threats.find((threat) => threat.severity === 'high');
        const target = focusThreat ? focusThreat.position : [0, 0, 0];
        camera.position.lerp({
            x: focusThreat ? target[0] + 8 : 12,
            y: 12 + (userProgress ? userProgress.completion * 4 : 0),
            z: focusThreat ? target[2] + 6 : 14,
        } as THREE.Vector3, delta * 0.5);
        camera.lookAt(target[0], target[1], target[2]);
    });
    return null;
};

const SceneContent: React.FC = () => {
    const { networkTraffic, threats, userProgress, updateNetworkTraffic, updateThreats } = useCyberCityRealtime();

    useFrame((_, delta) => {
        updateNetworkTraffic(delta);
        updateThreats(delta);
    });

    const handlePacketIntercept = useCallback((packet: NetworkPacket) => {
        // Hook for future interception workflows integrating with simulationStore.
        console.debug('Packet intercept event', packet.id);
    }, []);

    return (
        <>
            <ambientLight intensity={0.4} />
            <directionalLight position={[10, 12, 10]} intensity={0.8} castShadow />

            <AdaptiveCameraRig userProgress={userProgress} threats={threats} />

            <Physics gravity={[0, -9.81, 0]} broadphase="SAP">
                <GroundPlane />
                <AdvancedBuildingCluster />
                <DataCenterWithTraffic />
                <NetworkOperationsCenter />
                <ThreatIntelligenceDashboard />

                {networkTraffic.map((packet) => (
                    <NetworkPacketVisual key={packet.id} packet={packet} onIntercept={handlePacketIntercept} />
                ))}

                {threats.map((threat) => (
                    <ThreatVisualization key={threat.id} threat={threat} />
                ))}

                <UserProgressVisualization progress={userProgress} />
            </Physics>

            <EffectComposer>
                <DepthOfField focusDistance={0.02} focalLength={0.02} bokehScale={2.8} />
                <Bloom intensity={0.55} luminanceThreshold={0.65} luminanceSmoothing={0.12} />
            </EffectComposer>
        </>
    );
};

const CyberCityScene: React.FC = () => (
    <Canvas shadows camera={{ position: [12, 12, 14], fov: 50 }}>
        <SceneContent />
    </Canvas>
);

export default CyberCityScene;
