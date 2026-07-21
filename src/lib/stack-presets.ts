/**
 * Industry reference presets for SC-008. Values are representative starting
 * points (NOT real part specifications) — the user tweaks from here.
 */
export interface PresetComponent { name: string; nominal: string; tol: string; distribution: 'normal' | 'uniform'; cpk: string; }
export interface PresetSpec { usl: string; lsl: string; target: string; seed: string; iterations: string; }
export interface StackPreset { id: string; label: string; spec: PresetSpec; components: PresetComponent[]; }

export const PRESETS: StackPreset[] = [
  {
    id: 'general', label: 'General machinery',
    spec: { usl: '31.5', lsl: '28.5', target: '30', seed: '12345', iterations: '5000' },
    components: [
      { name: 'Part A', nominal: '10', tol: '0.2', distribution: 'normal', cpk: '' },
      { name: 'Part B', nominal: '20', tol: '0.3', distribution: 'normal', cpk: '' }
    ]
  },
  {
    id: 'automotive', label: 'Automotive',
    spec: { usl: '30.2', lsl: '29.8', target: '30', seed: '12345', iterations: '5000' },
    components: [
      { name: 'Part A', nominal: '10', tol: '0.05', distribution: 'normal', cpk: '1.33' },
      { name: 'Part B', nominal: '20', tol: '0.08', distribution: 'normal', cpk: '1.33' }
    ]
  },
  {
    id: 'aerospace', label: 'Aerospace',
    spec: { usl: '30.1', lsl: '29.9', target: '30', seed: '12345', iterations: '5000' },
    components: [
      { name: 'Part A', nominal: '10', tol: '0.02', distribution: 'normal', cpk: '1.67' },
      { name: 'Part B', nominal: '20', tol: '0.03', distribution: 'normal', cpk: '1.67' }
    ]
  }
];
