const fs = require('fs');
let content = fs.readFileSync('src/app/services/dental-3d-engine.service.ts', 'utf8');

// The error "document is not defined" is coming from SSR because Three.js/OrbitControls
// accesses the DOM during class instantiation or module load. We need to wrap it.
content = content.replace("initialize(container: HTMLElement): void {", "initialize(container: HTMLElement): void {\n    if (typeof window === 'undefined' || typeof document === 'undefined') return;");
content = content.replace("resize(width: number, height: number): void {", "resize(width: number, height: number): void {\n    if (typeof window === 'undefined') return;");

fs.writeFileSync('src/app/services/dental-3d-engine.service.ts', content, 'utf8');
