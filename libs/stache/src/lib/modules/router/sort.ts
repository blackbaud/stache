import { StacheNavLink } from '../nav/nav-link';

export function sortByName(a: StacheNavLink, b: StacheNavLink): number {
  if (a.name.toLowerCase() < b.name.toLowerCase()) {
    return -1;
  } else if (a.name.toLowerCase() > b.name.toLowerCase()) {
    return 1;
  } else {
    return 0;
  }
}

export function sortByOrder(a: StacheNavLink, b: StacheNavLink): number {
  if (a.order === undefined || b.order === undefined) {
    return -1;
  }

  if (a.order < b.order) {
    return -1;
  } else if (a.order > b.order) {
    return 1;
  } else {
    return 0;
  }
}
