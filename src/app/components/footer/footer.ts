import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {LogoComponent} from '../logo/logo';
import {TranslatePipe} from '../../pipes/translate.pipe';

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, LogoComponent, TranslatePipe],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class FooterComponent {
}
