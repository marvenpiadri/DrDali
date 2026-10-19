import {ChangeDetectionStrategy, Component, input} from '@angular/core';

@Component({
  selector: 'app-dental-loader',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dental-loader.html',
  styleUrl: './dental-loader.css',
})
export class DentalLoaderComponent {
  message = input<string>('Chargement du modèle 3D...');
  subMessage = input<string>('Structure anatomique haute précision');
  size = input<'sm' | 'md' | 'lg'>('md');
  overlay = input<boolean>(true);
}
