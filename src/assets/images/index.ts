import nbcMockup from './NBC_Mockup.webp';
import regridParcel from './regrid_parcel.webp';
import siloStream from './silo_stream.webp';
import subtitleMaker from './subtitle_maker.webp';

export const projectImages = {
  NBC_Mockup: nbcMockup,
  regrid_parcel: regridParcel,
  silo_stream: siloStream,
  subtitle_maker: subtitleMaker,
} as const;

export type ProjectImageKey = keyof typeof projectImages;

export const projectImageKeys = Object.keys(projectImages) as ProjectImageKey[];

export function getProjectImage(key: ProjectImageKey) {
  return projectImages[key];
}