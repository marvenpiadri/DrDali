import { Dental3DAsset } from '../models/dental-3d-asset.model';

export const DENTAL_3D_ASSETS: Record<string, Dental3DAsset> = {
  'omf-lower-jaw': {
    id: 'omf-lower-jaw',
    name: 'Lower Jaw with Teeth (Synthetic)',
    source: 'OMF Atlas (choxos) / Cristian Diaz',
    modelUrl: 'assets/models/omf-lower-jaw.glb',
    license: 'CC BY 4.0',
    attribution: 'Data of synthetic 3D models of the human jaw, by Cristian Diaz and colleagues (10.17632/xjsx7nfhj8.1)',
    commercialUseAllowed: true,
    structures: ['tooth', 'pdl', 'jaw'],
    category: 'jaw',
  },
  'nih-tooth': {
    id: 'nih-tooth',
    name: 'High-Resolution Tooth Anatomy',
    source: 'NIH 3D Print Exchange',
    modelUrl: 'assets/models/nih-tooth.glb',
    license: 'CC BY 4.0',
    attribution: 'NIH 3D Print Exchange',
    commercialUseAllowed: true,
    structures: ['enamel', 'dentin', 'pulp', 'root'],
    category: 'tooth',
  },
  'omf-molar-immature': {
    id: 'omf-molar-immature',
    name: 'Immature First Permanent Molar',
    source: 'OMF Atlas (choxos) / Fang Fang Kang',
    modelUrl: 'assets/models/omf-molar-immature.glb',
    license: 'CC BY 4.0',
    attribution: 'Models for a finite element study of a band and loop space maintainer, by Fang Fang Kang (10.6084/m9.figshare.24591537.v1)',
    commercialUseAllowed: true,
    structures: ['tooth', 'pulp', 'pdl'],
    category: 'tooth',
  }
};
