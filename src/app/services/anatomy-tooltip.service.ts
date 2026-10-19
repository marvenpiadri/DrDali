import { Injectable, signal } from '@angular/core';

export interface ActiveTooltipState {
  visible: boolean;
  label: string;
  category: string;
  screenX: number;
  screenY: number;
  hoveredMeshId?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AnatomyTooltipService {
  readonly activeTooltip = signal<ActiveTooltipState>({
    visible: false,
    label: '',
    category: '',
    screenX: 0,
    screenY: 0,
  });

  setTooltip(state: ActiveTooltipState): void {
    this.activeTooltip.set(state);
  }

  clearTooltip(): void {
    if (this.activeTooltip().visible) {
      this.activeTooltip.set({
        visible: false,
        label: '',
        category: '',
        screenX: 0,
        screenY: 0,
      });
    }
  }
}
