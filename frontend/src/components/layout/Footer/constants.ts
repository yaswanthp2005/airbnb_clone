import { comingSoonRoute, routes } from "@/constants/routes";

export type FooterLink = {
  labelKey: string;
  href: string;
};

export type FooterColumn = {
  titleKey: string;
  links: FooterLink[];
};

const soon = (labelKey: string, slug: string): FooterLink => ({
  labelKey,
  href: comingSoonRoute(slug),
});

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    titleKey: "footer.support",
    links: [
      soon("footer.links.helpCentre", "help-centre"),
      soon("footer.links.airCover", "aircover"),
      soon("footer.links.antiDiscrimination", "anti-discrimination"),
      soon("footer.links.disabilitySupport", "disability-support"),
      soon("footer.links.cancellationOptions", "cancellation-options"),
      soon("footer.links.neighbourhoodConcern", "neighbourhood-concern"),
    ],
  },
  {
    titleKey: "footer.hosting",
    links: [
      { labelKey: "footer.links.becomeHost", href: routes.hosting },
      soon("footer.links.airCoverForHosts", "aircover-for-hosts"),
      soon("footer.links.hostingResources", "hosting-resources"),
      soon("footer.links.communityForum", "community-forum"),
      soon("footer.links.hostingResponsibly", "hosting-responsibly"),
      soon("footer.links.hostingClass", "hosting-class"),
    ],
  },
  {
    titleKey: "footer.company",
    links: [
      soon("footer.links.newsroom", "newsroom"),
      soon("footer.links.newFeatures", "new-features"),
      soon("footer.links.careers", "careers"),
      soon("footer.links.investors", "investors"),
      soon("footer.links.emergencyStays", "emergency-stays"),
    ],
  },
];

export const FOOTER_LEGAL_LINKS: FooterLink[] = [
  soon("footer.privacy", "privacy"),
  soon("footer.terms", "terms"),
  soon("footer.sitemap", "sitemap"),
  soon("footer.companyDetails", "company-details"),
];
