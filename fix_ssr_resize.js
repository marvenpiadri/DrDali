const fs = require('fs');
let content = fs.readFileSync('src/app/components/dental-3d-viewport/dental-3d-viewport.ts', 'utf8');

// The error is "ResizeObserver is not defined" during SSR. 
content = content.replace(
  "ngAfterViewInit(): void {", 
  "ngAfterViewInit(): void {\n    if (typeof window === 'undefined') return;"
);

fs.writeFileSync('src/app/components/dental-3d-viewport/dental-3d-viewport.ts', content, 'utf8');
