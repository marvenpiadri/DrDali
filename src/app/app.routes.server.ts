import {RenderMode, ServerRoute} from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'encyclopedia/:category/:slug',
    renderMode: RenderMode.Server,
  },
  {
    path: 'atlas/:lessonId',
    renderMode: RenderMode.Server,
  },
  {
    path: 'tools/:toolId',
    renderMode: RenderMode.Server,
  },
  {
    path: 'tools/3d/:toolId',
    renderMode: RenderMode.Server,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
