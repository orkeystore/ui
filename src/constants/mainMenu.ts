import { ROUTES } from "./routes";

export const MAIN_MENU_LINKS = [
  { id: 1, path: ROUTES.KEYS , name: 'keys', title: 'Active keys', icon: 'vpn_key', isAdminOnly: false },
  { id: 3, path: ROUTES.ARCHIVE , name: 'archive', title: 'Archived keys', icon: 'unarchive', isAdminOnly: false },
  { id: 2, path: ROUTES.REPOS, name: 'repos', title: 'Repositories', icon: 'apps', isAdminOnly: false },
  { id: 4, path: ROUTES.STORAGE , name: 'storage', title: 'Storage', icon: 'inbox', isAdminOnly: false },
];
