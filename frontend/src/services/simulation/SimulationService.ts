export interface SimulationScenario {
  id: string;
  name: string;
  difficulty?: "easy" | "normal" | "hard";
  description?: string;
}

// Placeholder implementations until the actual simulation layer exists.
export async function startSimulation(scenario: SimulationScenario | string): Promise<void> {
  const scenarioId = typeof scenario === "string" ? scenario : scenario.id;
  console.warn("startSimulation not implemented", { scenarioId });
}

export async function stopSimulation(): Promise<void> {
  console.warn("stopSimulation not implemented");
}

export async function loadScenario(scenarioId: string): Promise<void> {
  console.warn("loadScenario not implemented", { scenarioId });
}
