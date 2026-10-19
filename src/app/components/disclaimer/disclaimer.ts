import {ChangeDetectionStrategy, Component, input} from '@angular/core';

@Component({
  selector: 'app-disclaimer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './disclaimer.html',
  styleUrl: './disclaimer.css',
})
export class DisclaimerComponent {
  title = input<string>('Information Médicale & Éducative');
  text = input<string>(
    'Ce contenu est rédigé à visée exclusivement éducative et préventive. Il ne constitue pas et ne remplace en aucun cas une consultation, un diagnostic ou un acte médical dispensé par un chirurgien-dentiste ou professionnel de santé qualifié au Centre Dentaire Dali.'
  );
}
