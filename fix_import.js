const fs = require('fs');
let content = fs.readFileSync('src/app/services/dental-3d-engine.service.ts', 'utf8');
content = content.replace("import {DENTAL_3D_ASSETS} from '../data/dental-3d-assets';", "import {DENTAL_3D_ASSETS} from '../data/dental-3d-assets';\nimport {Dental3DAsset} from '../models/dental-3d-asset.model';");
fs.writeFileSync('src/app/services/dental-3d-engine.service.ts', content, 'utf8');
