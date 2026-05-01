import { getTranslations } from "next-intl/server";
import { getSiteUrl } from "@/lib/site";

type Props = {
  locale: string;
};

export async function SiteJsonLd({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: "metadata" });
  const url = getSiteUrl();
  const name = t("organizationName");
  const description = t("description");

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    description,
    url: `${url}/${locale}`,
    inLanguage: locale === "zh" ? "zh-CN" : "en",
    publisher: {
      "@type": "Organization",
      name,
      url
    }
  };

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    description
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
    </>
  );
}
