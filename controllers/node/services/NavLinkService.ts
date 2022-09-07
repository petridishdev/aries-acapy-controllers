import navLinksJson from '../data/nav_links.json'

class NavLinkService {
  navLinks: any[] = []
  customNavLinks: any[] = []

  constructor () {
    this.navLinks = navLinksJson
  }

  getNavLinks (): any[] {
    return this.navLinks || []
  }

  getCustomNavLinks (): any[] {
    return this.customNavLinks || []
  }

  registerCustomLinks (links: any[]): void {
    this.customNavLinks = links
  }

  clearLinkClasses (): void {
    this.navLinks.forEach((navLink: any) => delete navLink.class)
    this.customNavLinks.forEach((navLink: any) => delete navLink.class)
  }

  setNavLinkActive (url: string): void {
    const navLink = this.navLinks.find(navLink => navLink.url === url)
    if (navLink) {
      navLink.class = 'active'
    }
  }

  setCustomNavLinkActive (url: string): void {
    const customNavLink = this.customNavLinks.find(navLink => navLink.url === url)
    if (customNavLink) {
      customNavLink.class = 'active'
    }
  }
}

const navLinkService = new NavLinkService()
export { navLinkService }
