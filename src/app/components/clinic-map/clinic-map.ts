import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  afterNextRender,
  inject,
} from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ClinicService } from '../../services/clinic.service';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-clinic-map',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './clinic-map.html',
  styleUrl: './clinic-map.css',
})
export class ClinicMapComponent implements OnDestroy {
  clinic = inject(ClinicService);
  i18n = inject(TranslationService);
  private platformId = inject(PLATFORM_ID);

  @ViewChild('mapElement') mapElement!: ElementRef<HTMLDivElement>;

  readonly latitude = 33.9265;
  readonly longitude = -6.9125;
  readonly googleMapsDirectionsUrl = 'https://www.google.com/maps/dir/?api=1&destination=33.9265,-6.9125';
  readonly wazeDirectionsUrl = 'https://waze.com/ul?ll=33.9265,-6.9125&navigate=yes';

  private map: unknown = null;


  constructor() {
    afterNextRender(() => {
      this.initLeafletMap();
    });
  }

  private async initLeafletMap() {
    if (!isPlatformBrowser(this.platformId) || !this.mapElement) return;

    try {
      const L = await import('leaflet');

      if (this.map) {
        (this.map as { remove: () => void }).remove();
      }

      const container = this.mapElement.nativeElement;
      const mapInstance = L.map(container, {
        center: [this.latitude, this.longitude],
        zoom: 16,
        zoomControl: true,
        attributionControl: true,
      });

      this.map = mapInstance;

      // CARTO's dark basemap keeps the map itself aligned with the app's monochrome theme.
      // Attribution remains visible; no client API key is required for the tile URL.
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 20,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      }).addTo(mapInstance);

      // Create a custom SVG pin marker for Centre Dentaire Dali
      const customIcon = L.divIcon({
        className: 'custom-clinical-marker',
        html: `
          <div class="relative flex items-center justify-center w-10 h-10">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <div class="relative inline-flex rounded-full h-10 w-10 bg-neutral-950 border-2 border-white text-white shadow-2xl items-center justify-center font-bold text-xs">
              <span class="material-icons text-white text-lg">local_hospital</span>
            </div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -20],
      });

      const marker = L.marker([this.latitude, this.longitude], { icon: customIcon }).addTo(mapInstance);

      const popupContent = `
        <div style="font-family: sans-serif; padding: 4px; color: #fafafa;">
          <h4 style="font-weight: 700; font-size: 14px; margin: 0 0 4px 0;">Centre Dentaire Dali</h4>
          <p style="font-size: 12px; margin: 0 0 6px 0; color: #d4d4d4;">Avenue Hassan II, Témara</p>
          <span style="display: inline-block; font-size: 11px; font-weight: 600; color: #e5e5e5; background: #262626; padding: 2px 8px; border-radius: 9999px;">
            Soins & Implantologie
          </span>
        </div>
      `;

      marker.bindPopup(popupContent).openPopup();

      setTimeout(() => {
        mapInstance.invalidateSize();
      }, 250);
    } catch (err) {
      console.error('Failed to initialize Leaflet map:', err);
    }
  }

  ngOnDestroy() {
    if (this.map) {
      (this.map as { remove: () => void }).remove();
      this.map = null;
    }
  }
}
