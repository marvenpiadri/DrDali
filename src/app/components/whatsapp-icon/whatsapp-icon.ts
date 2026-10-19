import {ChangeDetectionStrategy, Component, input} from '@angular/core';

@Component({
  selector: 'app-whatsapp-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg 
      [attr.width]="size()" 
      [attr.height]="size()" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      class="inline-block shrink-0 align-middle transition-transform"
      [class]="extraClass()"
      aria-hidden="true">
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm-3.52 4.38c-.19 0-.41.01-.6.04-.26.04-.54.14-.73.41-.26.37-1 1-1 2.42 0 1.43 1.04 2.81 1.18 3 .15.19 2.05 3.13 5 4.39.7.3 1.25.48 1.68.62.71.22 1.35.19 1.86.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.13-.27-.2-.56-.34-.3-.15-1.75-.86-2.02-1-.27-.13-.47-.2-.67.1-.2.3-.77 1-.95 1.2-.18.2-.36.23-.65.09-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.18-.3-.02-.46.13-.6.13-.13.3-.34.45-.52.15-.17.2-.3.3-.5.1-.19.05-.36-.03-.5-.07-.15-.65-1.61-.93-2.2-.26-.6-.52-.52-.71-.53z"/>
    </svg>
  `,
})
export class WhatsAppIconComponent {
  readonly size = input<number>(20);
  readonly extraClass = input<string>('');
}
