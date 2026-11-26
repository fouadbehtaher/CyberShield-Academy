import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, Line, OrbitControls, TransformControls, useCursor } from '@react-three/drei';
import {
  Badge,
  MantineProvider,
  Button,
  Card,
  Divider,
  Group,
  Select,
  SegmentedControl,
  Slider,
  Stack,
  Switch,
  Text,
  ThemeIcon,
  Title,
  Tooltip
} from '@mantine/core';
import { IconAlertTriangle, IconPlayerPause, IconPlayerPlay, IconRefresh, IconSquareRoundedX, IconTopologyRing2 } from '@tabler/icons-react';
import * as THREE from 'three';
import type { Mesh } from 'three';
import type { TransformControls as TransformControlsImpl } from 'three-stdlib';
import type { ControlPanelState, ControlUpdater } from './types';
import { createDefaultControlPanelState } from './types';
import { FloatingControlPanel } from './FloatingControlPanel';

type TransformMode = 'translate' | 'rotate' | 'scale';

type NetworkTopology = ControlPanelState['simulationEnvironment']['networkTopology'];

interface TopologyNode {
  id: string;
  label: string;
  position: [number, number, number];
  connections: string[];
}

const SCENARIO_DEFINITIONS = [
  { name: 'هجوم DDoS', severity: 5, description: 'تصعيد هائل في حركة المرور يستهدف مراكز البيانات الحيوية.' },
  { name: 'اختراق شبكة', severity: 4, description: 'محاولة للوصول غير المصرح به إلى شبكة المؤسسة.' },
  { name: 'تصيد احتيالي', severity: 3, description: 'حملة بريد إلكتروني خبيثة تستهدف المستخدمين الحسّاسِين.' },
  { name: 'برمجيات خبيثة', severity: 4, description: 'انتشار برمجيات خبيثة متعددة المراحل داخل البيئة.' }
] as const;

type ScenarioName = (typeof SCENARIO_DEFINITIONS)[number]['name'];

const TOPOLOGY_LAYOUTS: Record<NetworkTopology, TopologyNode[]> = {
  simple: [
    { id: 'core', label: 'العقدة المركزية', position: [0, 0.2, 0], connections: ['edge-north', 'edge-south', 'edge-east', 'edge-west'] },
    { id: 'edge-north', label: 'بوابة شمالية', position: [0, 0.2, 3], connections: ['core'] },
    { id: 'edge-south', label: 'بوابة جنوبية', position: [0, 0.2, -3], connections: ['core'] },
    { id: 'edge-east', label: 'بوابة شرقية', position: [3, 0.2, 0], connections: ['core'] },
    { id: 'edge-west', label: 'بوابة غربية', position: [-3, 0.2, 0], connections: ['core'] }
  ],
  complex: [
    { id: 'core-primary', label: 'مركز التحكم', position: [0, 0.3, 0], connections: ['dist-north', 'dist-south', 'dist-east', 'dist-west'] },
    { id: 'dist-north', label: 'توزيع شمالي', position: [0, 0.3, 3.5], connections: ['core-primary', 'access-north-east', 'access-north-west'] },
    { id: 'dist-south', label: 'توزيع جنوبي', position: [0, 0.3, -3.5], connections: ['core-primary', 'access-south-east', 'access-south-west'] },
    { id: 'dist-east', label: 'توزيع شرقي', position: [3.5, 0.3, 0], connections: ['core-primary', 'access-east-north', 'access-east-south'] },
    { id: 'dist-west', label: 'توزيع غربي', position: [-3.5, 0.3, 0], connections: ['core-primary', 'access-west-north', 'access-west-south'] },
    { id: 'access-north-east', label: 'نقطة وصول NE', position: [1.8, 0.25, 5], connections: ['dist-north'] },
    { id: 'access-north-west', label: 'نقطة وصول NW', position: [-1.8, 0.25, 5], connections: ['dist-north'] },
    { id: 'access-south-east', label: 'نقطة وصول SE', position: [1.8, 0.25, -5], connections: ['dist-south'] },
    { id: 'access-south-west', label: 'نقطة وصول SW', position: [-1.8, 0.25, -5], connections: ['dist-south'] },
    { id: 'access-east-north', label: 'مراقبة شرقية', position: [6, 0.25, 1.8], connections: ['dist-east'] },
    { id: 'access-east-south', label: 'مراقبة تحتية', position: [6, 0.25, -1.8], connections: ['dist-east'] },
    { id: 'access-west-north', label: 'مراقبة فرعية', position: [-6, 0.25, 1.8], connections: ['dist-west'] },
    { id: 'access-west-south', label: 'حارس جانبي', position: [-6, 0.25, -1.8], connections: ['dist-west'] }
  ],
  enterprise: [
    { id: 'core-a', label: 'نواة A', position: [0, 0.35, 0], connections: ['core-b', 'dist-1', 'dist-2', 'dist-3'] },
    { id: 'core-b', label: 'نواة B', position: [1.5, 0.35, 1.5], connections: ['core-a', 'dist-4', 'dist-5'] },
    { id: 'dist-1', label: 'توزيع 1', position: [-3, 0.3, 3], connections: ['core-a', 'edge-1', 'edge-2'] },
    { id: 'dist-2', label: 'توزيع 2', position: [3, 0.3, -3], connections: ['core-a', 'edge-3', 'edge-4'] },
    { id: 'dist-3', label: 'توزيع 3', position: [-3, 0.3, -3], connections: ['core-a', 'edge-5', 'edge-6'] },
    { id: 'dist-4', label: 'توزيع 4', position: [3, 0.3, 3], connections: ['core-b', 'edge-7', 'edge-8'] },
    { id: 'dist-5', label: 'توزيع 5', position: [0, 0.3, 4.5], connections: ['core-b', 'edge-9', 'edge-10'] },
    { id: 'edge-1', label: 'طرفي 1', position: [-6, 0.25, 4.5], connections: ['dist-1'] },
    { id: 'edge-2', label: 'طرفي 2', position: [-4.5, 0.25, 6], connections: ['dist-1'] },
    { id: 'edge-3', label: 'طرفي 3', position: [6, 0.25, -4.5], connections: ['dist-2'] },
    { id: 'edge-4', label: 'طرفي 4', position: [4.5, 0.25, -6], connections: ['dist-2'] },
    { id: 'edge-5', label: 'طرفي 5', position: [-6, 0.25, -4.5], connections: ['dist-3'] },
    { id: 'edge-6', label: 'طرفي 6', position: [-4.5, 0.25, -6], connections: ['dist-3'] },
    { id: 'edge-7', label: 'طرفي 7', position: [6, 0.25, 4.5], connections: ['dist-4'] },
    { id: 'edge-8', label: 'طرفي 8', position: [4.5, 0.25, 6], connections: ['dist-4'] },
    { id: 'edge-9', label: 'طرفي 9', position: [1.8, 0.25, 7], connections: ['dist-5'] },
    { id: 'edge-10', label: 'طرفي 10', position: [-1.8, 0.25, 7], connections: ['dist-5'] }
  ]
};

interface SimulationControlPanelProps {
  state: ControlPanelState;
  onStateChange: ControlUpdater;
}

export const SimulationControlPanel: React.FC<SimulationControlPanelProps> = ({ state, onStateChange }) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [transformMode, setTransformMode] = useState<TransformMode>('translate');
  const [simulationTime, setSimulationTime] = useState(0);

  useEffect(() => {
    setSelectedNodeId(null);
  }, [state.simulationEnvironment.networkTopology]);

  const activeScenarioCount = state.simulationEnvironment.activeScenarios.size;

  const handleScenarioToggle = useCallback(
    (scenario: ScenarioName, enabled: boolean) => {
      onStateChange(prev => {
        const nextScenarios = new Set(prev.simulationEnvironment.activeScenarios);
        if (enabled) {
          nextScenarios.add(scenario);
        } else {
          nextScenarios.delete(scenario);
        }
        return {
          ...prev,
          simulationEnvironment: {
            ...prev.simulationEnvironment,
            activeScenarios: nextScenarios
          }
        };
      });
    },
    [onStateChange]
  );

  const handleThreatLevelChange = useCallback(
    (value: number) => {
      onStateChange(prev => ({
        ...prev,
        simulationEnvironment: {
          ...prev.simulationEnvironment,
          threatLevel: Math.round(value)
        }
      }));
    },
    [onStateChange]
  );

  const handleTopologyChange = useCallback(
    (value: string | null) => {
      if (!value) {
        return;
      }
      onStateChange(prev => ({
        ...prev,
        simulationEnvironment: {
          ...prev.simulationEnvironment,
          networkTopology: value as NetworkTopology
        }
      }));
    },
    [onStateChange]
  );

  const handleQuickAction = useCallback(
    (action: 'start-all' | 'pause-all' | 'stop-all' | 'reset') => {
      switch (action) {
        case 'start-all':
          onStateChange(prev => {
            const nextScenarios = new Set(prev.simulationEnvironment.activeScenarios);
            SCENARIO_DEFINITIONS.forEach(scenario => nextScenarios.add(scenario.name));
            return {
              ...prev,
              simulationEnvironment: {
                ...prev.simulationEnvironment,
                activeScenarios: nextScenarios,
                autoResponse: true
              }
            };
          });
          break;
        case 'pause-all':
          onStateChange(prev => ({
            ...prev,
            simulationEnvironment: {
              ...prev.simulationEnvironment,
              autoResponse: false
            }
          }));
          break;
        case 'stop-all':
          onStateChange(prev => ({
            ...prev,
            simulationEnvironment: {
              ...prev.simulationEnvironment,
              activeScenarios: new Set<string>(),
              autoResponse: false
            }
          }));
          setSelectedNodeId(null);
          break;
        case 'reset':
          onStateChange(prev => ({
            ...prev,
            simulationEnvironment: createDefaultControlPanelState().simulationEnvironment
          }));
          setSelectedNodeId(null);
          setSimulationTime(0);
          break;
        default:
          break;
      }
    },
    [onStateChange]
  );

  const handleTimeAdvance = useCallback((delta: number) => {
    if (delta <= 0) {
      return;
    }
    setSimulationTime(prev => prev + delta);
  }, []);

  const threatPercent = useMemo(
    () => Math.round((state.simulationEnvironment.threatLevel / 10) * 100),
    [state.simulationEnvironment.threatLevel]
  );

  const selectedNodeLabel = useMemo(() => {
    if (!selectedNodeId) {
      return null;
    }
    return getNodeLabel(state.simulationEnvironment.networkTopology, selectedNodeId);
  }, [selectedNodeId, state.simulationEnvironment.networkTopology]);

  return (
    <div className="simulation-control-panel advanced">
      <Group align="flex-start" gap="lg" wrap="nowrap">
        <Card shadow="sm" padding="lg" radius="md" withBorder className="simulation-visual-card">
          <Group justify="space-between" align="center" mb="md">
            <Group gap="xs">
              <ThemeIcon variant="light" radius="xl" color="indigo">
                <IconTopologyRing2 size={20} />
              </ThemeIcon>
              <Title order={4}>💠 المشهد الشبكي التفاعلي</Title>
            </Group>
            <SegmentedControl
              value={transformMode}
              onChange={value => setTransformMode(value as TransformMode)}
              data={[
                { value: 'translate', label: 'تحريك' },
                { value: 'rotate', label: 'دوران' },
                { value: 'scale', label: 'تحجيم' }
              ]}
              radius="md"
            />
          </Group>

          <div className="simulation-visual-control">
            <Canvas camera={{ position: [8, 7, 8], fov: 45 }} shadows>
              <color attach="background" args={['#050608']} />
              <SimulationScene
                topology={state.simulationEnvironment.networkTopology}
                threatLevel={state.simulationEnvironment.threatLevel}
                timeScale={state.globalControls.timeScale}
                transformMode={transformMode}
                selectedNodeId={selectedNodeId}
                onSelectNode={setSelectedNodeId}
                onTimeAdvance={handleTimeAdvance}
                simulationTime={simulationTime}
                activeScenarioCount={activeScenarioCount}
                state={state}
                onStateChange={onStateChange}
                threatPercent={threatPercent}
              />
            </Canvas>
          </div>

          <Divider my="md" />

          <SelectedNodeSummary nodeId={selectedNodeId} nodeLabel={selectedNodeLabel} threatPercent={threatPercent} />
        </Card>

        <Stack className="simulation-side-panel" gap="md" style={{ flex: '0 0 340px' }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="md">
              <Title order={5}>🎯 تحكم في السيناريوهات</Title>
              <Badge color={activeScenarioCount > 0 ? 'green' : 'gray'} variant="light">
                {activeScenarioCount} نشطة
              </Badge>
            </Group>

            <Stack gap="sm">
              {SCENARIO_DEFINITIONS.map(({ name, severity, description }) => {
                const active = state.simulationEnvironment.activeScenarios.has(name);
                return (
                  <Card key={name} padding="sm" radius="md" shadow="xs" withBorder>
                    <Group justify="space-between" align="flex-start" gap="sm">
                      <div>
                        <Text size="sm" fw={600} mb={4}>
                          {name}
                        </Text>
                        <Text size="xs" color="dimmed">
                          {description}
                        </Text>
                      </div>
                      <Stack gap={6} align="flex-end">
                        <Badge color={severity >= 4 ? 'red' : severity === 3 ? 'yellow' : 'green'} variant="light">
                          شدة {severity}/5
                        </Badge>
                        <Group gap={6}>
                          <Tooltip label="إعدادات السيناريو">
                            <Button size="xs" variant="light" radius="md">
                              ⚙️
                            </Button>
                          </Tooltip>
                          <Switch
                            size="md"
                            checked={active}
                            onChange={event => handleScenarioToggle(name, event.currentTarget.checked)}
                          />
                        </Group>
                      </Stack>
                    </Group>
                  </Card>
                );
              })}
            </Stack>
          </Card>

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={5} mb="sm">
              🌐 تحكم في بنية الشبكة
            </Title>
            <Select
              value={state.simulationEnvironment.networkTopology}
              onChange={handleTopologyChange}
              data={[
                { value: 'simple', label: '🔷 شبكة بسيطة' },
                { value: 'complex', label: '🔶 شبكة معقدة' },
                { value: 'enterprise', label: '🏢 شبكة مؤسسة' }
              ]}
              radius="md"
              comboboxProps={{ withinPortal: true }}
            />
          </Card>

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="sm">
              <Title order={5}>⚠️ تحكم في مستوى التهديد</Title>
              <Badge color={threatPercent > 70 ? 'red' : threatPercent > 40 ? 'yellow' : 'green'} variant="light">
                {threatPercent}%
              </Badge>
            </Group>
            <Slider
              value={state.simulationEnvironment.threatLevel}
              onChange={handleThreatLevelChange}
              min={1}
              max={10}
              step={1}
              marks={[
                { value: 1, label: 'منخفض' },
                { value: 5, label: 'متوسط' },
                { value: 10, label: 'عالٍ جداً' }
              ]}
            />
            <Group gap="xs" mt="sm">
              <ThemeIcon size="sm" radius="md" variant="light" color={threatPercent > 70 ? 'red' : 'yellow'}>
                <IconAlertTriangle size={14} />
              </ThemeIcon>
              <Text size="xs" color="dimmed">
                اضبط مستوى التهديد لمحاكاة ضغوط الأمن السيبراني.
              </Text>
            </Group>
          </Card>

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={5} mb="md">
              ⚡ إجراءات سريعة
            </Title>
            <Stack gap="sm">
              <Button
                variant="filled"
                color="green"
                fullWidth
                onClick={() => handleQuickAction('start-all')}
                leftSection={<IconPlayerPlay size={16} />}
              >
                بدء جميع السيناريوهات
              </Button>
              <Button
                variant="light"
                color="yellow"
                fullWidth
                onClick={() => handleQuickAction('pause-all')}
                leftSection={<IconPlayerPause size={16} />}
              >
                إيقاف مؤقت للجميع
              </Button>
              <Button
                variant="light"
                color="red"
                fullWidth
                onClick={() => handleQuickAction('stop-all')}
                leftSection={<IconSquareRoundedX size={16} />}
              >
                إيقاف جميع المحاكاة
              </Button>
              <Button
                variant="outline"
                fullWidth
                onClick={() => handleQuickAction('reset')}
                leftSection={<IconRefresh size={16} />}
              >
                إعادة تعيين الكل
              </Button>
            </Stack>
          </Card>
        </Stack>
      </Group>
    </div>
  );
};

interface SimulationSceneProps {
  topology: NetworkTopology;
  threatLevel: number;
  timeScale: number;
  transformMode: TransformMode;
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string | null) => void;
  onTimeAdvance: (delta: number) => void;
  simulationTime: number;
  activeScenarioCount: number;
  state: ControlPanelState;
  onStateChange: ControlUpdater;
  threatPercent: number;
}

const SimulationScene: React.FC<SimulationSceneProps> = ({
  topology,
  threatLevel,
  timeScale,
  transformMode,
  selectedNodeId,
  onSelectNode,
  onTimeAdvance,
  simulationTime,
  activeScenarioCount,
  state,
  onStateChange,
  threatPercent
}) => {
  const transformControls = useRef<TransformControlsImpl | null>(null);
  const nodeRefs = useRef<Map<string, Mesh>>(new Map());
  const timeAccumulator = useRef(0);
  const gridHelper = useMemo(() => {
    const helper = new THREE.GridHelper(20, 20, 0x2b2f3a, 0x2b2f3a);
    const material = Array.isArray(helper.material) ? helper.material[0] : helper.material;
    if (material) {
      material.opacity = 0.4;
      material.transparent = true;
    }
    return helper;
  }, []);

  useEffect(() => () => {
    gridHelper.dispose();
  }, [gridHelper]);

  const nodes = useMemo(() => TOPOLOGY_LAYOUTS[topology].map(node => ({ ...node })), [topology]);
  const edges = useMemo(() => buildEdges(nodes), [nodes]);
  const threatRatio = Math.min(1, Math.max(0, threatLevel / 10));

  const registerNode = useCallback((nodeId: string, mesh: Mesh | null) => {
    registerNodeRef(nodeRefs.current, nodeId, mesh);
  }, []);

  useEffect(() => {
    nodeRefs.current.clear();
  }, [topology]);

  useEffect(() => {
    const controls = transformControls.current;
    if (!controls) {
      return;
    }
    if (selectedNodeId) {
      const target = nodeRefs.current.get(selectedNodeId);
      if (target) {
        controls.attach(target);
        return;
      }
    }
    controls.detach();
  }, [selectedNodeId, topology]);

  useFrame((_, delta) => {
    timeAccumulator.current += delta * timeScale;
    if (timeAccumulator.current >= 0.2) {
      onTimeAdvance(timeAccumulator.current);
      timeAccumulator.current = 0;
    }
  });

  return (
    <group>
      <primitive object={gridHelper} position={[0, -0.01, 0]} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[6, 10, 6]} intensity={0.9} castShadow />

      {edges.map(([from, to]) => (
        <Line
          key={`${from.id}-${to.id}`}
          points={[from.position, to.position]}
          color={threatRatio > 0.65 ? '#f03e3e' : '#4c6ef5'}
          lineWidth={1.2 + threatRatio}
          dashed={threatRatio > 0.75}
          dashSize={0.4}
          gapSize={0.2}
        />
      ))}

      {nodes.map((node, index) => (
        <NetworkNode
          key={node.id}
          node={node}
          index={index}
          threatRatio={threatRatio}
          selected={selectedNodeId === node.id}
          registerNode={registerNode}
          onSelect={onSelectNode}
        />
      ))}

      <TransformControls
        ref={transformControls}
        mode={transformMode}
        showX
        showY
        showZ
        enabled={Boolean(selectedNodeId)}
      />
      <OrbitControls enableDamping makeDefault dampingFactor={0.12} />
      <Html position={[-3.5, 4, 0]} transform distanceFactor={9} className="floating-simulation-panel">
        {/* drei's Html renders in its own React root, so React context (including Mantine's theme) does not pass through. */}
        <MantineProvider>
          <FloatingControlPanel
            state={state}
            onStateChange={onStateChange}
            simulationTime={simulationTime}
            threatPercent={threatPercent}
            activeScenarioCount={activeScenarioCount}
          />
        </MantineProvider>
      </Html>
    </group>
  );
};

interface NetworkNodeProps {
  node: TopologyNode;
  index: number;
  threatRatio: number;
  selected: boolean;
  registerNode: (nodeId: string, mesh: Mesh | null) => void;
  onSelect: (nodeId: string | null) => void;
}

const NetworkNode: React.FC<NetworkNodeProps> = ({ node, index, threatRatio, selected, registerNode, onSelect }) => {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  useEffect(() => {
    registerNode(node.id, meshRef.current);
    return () => registerNode(node.id, null);
  }, [registerNode, node.id]);

  useFrame(({ clock }) => {
    if (!meshRef.current) {
      return;
    }
    const elapsed = clock.getElapsedTime();
    meshRef.current.position.y = 0.25 + Math.sin(elapsed * 1.5 + index) * 0.05;
    const pulse = 1 + Math.sin(elapsed * 2.1 + index) * 0.05 + threatRatio * 0.15 + (selected ? 0.2 : 0);
    meshRef.current.scale.setScalar(pulse);
  });

  return (
    <group position={node.position}>
      <mesh
        ref={meshRef}
        onClick={event => {
          event.stopPropagation();
          onSelect(selected ? null : node.id);
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        <sphereGeometry args={[0.28, 28, 28]} />
        <meshStandardMaterial
          color={selected ? '#91a7ff' : hovered ? '#748ffc' : '#5c7cfa'}
          emissive={selected ? '#4c6ef5' : '#1c274c'}
          emissiveIntensity={selected ? 0.85 : 0.3 + threatRatio * 0.2}
          roughness={0.35}
          metalness={0.1}
        />
      </mesh>
      <Html distanceFactor={12} position={[0, 0.65, 0]} transform className="node-label">
        <MantineProvider>
          <Badge size="sm" radius="md" variant={selected ? 'filled' : 'light'} color={selected ? 'indigo' : 'blue'}>
            {node.label}
          </Badge>
        </MantineProvider>
      </Html>
    </group>
  );
};

interface SelectedNodeSummaryProps {
  nodeId: string | null;
  nodeLabel: string | null;
  threatPercent: number;
}

const SelectedNodeSummary: React.FC<SelectedNodeSummaryProps> = ({ nodeId, nodeLabel, threatPercent }) => {
  if (!nodeId) {
    return (
      <Card padding="md" radius="md" withBorder>
        <Text size="sm" color="dimmed" ta="center">
          حدد عقدة من المشهد الثلاثي الأبعاد لإظهار التفاصيل.
        </Text>
      </Card>
    );
  }

  return (
    <Card padding="md" radius="md" withBorder>
      <Stack gap="xs">
        <Text size="xs" color="dimmed">
          العقدة المحددة
        </Text>
        <Text fw={600}>{nodeLabel ?? nodeId}</Text>
        {nodeLabel && nodeLabel !== nodeId ? (
          <Text size="xs" color="dimmed">
            المعرّف: {nodeId}
          </Text>
        ) : null}
        <Group gap="sm">
          <Badge color="indigo" variant="filled">
            نشاط {threatPercent}%
          </Badge>
          <Badge color="blue" variant="light">
            وضع متقدم
          </Badge>
        </Group>
      </Stack>
    </Card>
  );
};

const buildEdges = (nodes: TopologyNode[]): Array<[TopologyNode, TopologyNode]> => {
  const edges: Array<[TopologyNode, TopologyNode]> = [];
  const seen = new Set<string>();
  nodes.forEach(node => {
    node.connections.forEach(connectionId => {
      const target = nodes.find(candidate => candidate.id === connectionId);
      if (!target) {
        return;
      }
      const key = [node.id, target.id].sort().join('::');
      if (seen.has(key)) {
        return;
      }
      edges.push([node, target]);
      seen.add(key);
    });
  });
  return edges;
};

const registerNodeRef = (registry: Map<string, Mesh>, nodeId: string, mesh: Mesh | null) => {
  if (!mesh) {
    registry.delete(nodeId);
    return;
  }
  registry.set(nodeId, mesh);
};

const getNodeLabel = (topology: NetworkTopology, nodeId: string): string | null => {
  const node = TOPOLOGY_LAYOUTS[topology].find(candidate => candidate.id === nodeId);
  return node?.label ?? null;
};

export default SimulationControlPanel;
