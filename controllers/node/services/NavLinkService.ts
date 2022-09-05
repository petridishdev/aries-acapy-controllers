const navLinksJson = require('../data/nav_links.json');

class NavLinkService {
    navLinks: any[] = [];
    customNavLinks: any[] = [];

    constructor() {
        this.navLinks = navLinksJson;
    }

    getNavLinks() {
        return this.navLinks || [];
    }

    getCustomNavLinks() {
        return this.customNavLinks || [];
    }

    registerCustomLinks(links: any[]) {
        this.customNavLinks = links;
    }

    clearLinkClasses() {
        this.navLinks.forEach((navLink: any) => delete navLink.class);
        this.customNavLinks.forEach((navLink: any) => delete navLink.class);
    }

    setNavLinkActive(url: string) {
        const navLink = this.navLinks.find(navLink => navLink.url === url);
        if (navLink) {
            navLink.class = 'active';
        }
    }

    setCustomNavLinkActive(url: string) {
        const customNavLink = this.customNavLinks.find(navLink => navLink.url === url);
        if (customNavLink) {
            customNavLink.class = 'active';
        }
    }
}

const navLinkService = new NavLinkService()
export { navLinkService }