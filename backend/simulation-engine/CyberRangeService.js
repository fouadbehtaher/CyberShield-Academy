const Docker = require('dockerode');
const { v4: uuidv4 } = require('uuid');

class CyberRangeService {
  constructor() {
    this.docker = new Docker();
    this.activeSimulations = new Map();
  }

  async createSimulationEnvironment(scenario, userId) {
    const simulationId = uuidv4();

    const containerConfig = {
      Image: 'cybershield/simulation-base',
      name: `sim-${simulationId}`,
      HostConfig: {
        NetworkMode: 'none',
        Memory: 512 * 1024 * 1024,
        NanoCpus: 500000000
      },
      Env: [
        `SCENARIO=${scenario.type}`,
        `USER_ID=${userId}`,
        `SIMULATION_ID=${simulationId}`
      ]
    };

    const container = await this.docker.createContainer(containerConfig);
    await container.start();

    const simulation = {
      id: simulationId,
      containerId: container.id,
      userId,
      scenario,
      status: 'running',
      startTime: new Date(),
      metrics: {}
    };

    this.activeSimulations.set(simulationId, simulation);
    return simulation;
  }

  async executeAttackScenario(simulationId, attackVector) {
    const simulation = this.activeSimulations.get(simulationId);

    if (!simulation) {
      throw new Error('Simulation not found');
    }

    const container = this.docker.getContainer(simulation.containerId);

    const exec = await container.exec({
      Cmd: ['python3', '/simulator/execute_attack.py', ...attackVector],
      AttachStdout: true,
      AttachStderr: true
    });

    const result = await exec.start();

    const metrics = await this.collectMetrics(container);
    const score = this.evaluatePerformance(metrics, attackVector);

    return { metrics, score, simulationId, logs: result.output };
  }

  async collectMetrics(container) {
    const stats = await container.stats({ stream: false });
    const processes = await container.top({ ps_args: 'aux' });

    return {
      cpu_usage: stats.cpu_stats.cpu_usage.total_usage,
      memory_usage: stats.memory_stats.usage,
      network_io: stats.networks,
      running_processes: processes.Processes.length,
      security_events: this.analyzeSecurityEvents(processes)
    };
  }

  evaluatePerformance(metrics, attackVector) {
    const resourceScore = 1 - (metrics.cpu_usage / (metrics.cpu_usage + metrics.memory_usage || 1));
    const processScore = metrics.running_processes > 0 ? 1 / metrics.running_processes : 1;
    const attackComplexity = attackVector.length / 10;
    return (resourceScore * 0.4) + (processScore * 0.4) + (attackComplexity * 0.2);
  }

  analyzeSecurityEvents(processes) {
    return processes.Processes
      .filter((proc) => proc.includes('alert'))
      .map((proc) => ({ type: 'alert', detail: proc }));
  }
}

module.exports = CyberRangeService;
