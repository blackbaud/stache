/**
 * Represents the values coming from a parsed JSON file.
 */
export interface StacheRouteMetadataConfigJson {
  name: string;
  order?: number | string;
  path: string;
  showInNav?: boolean;
}
