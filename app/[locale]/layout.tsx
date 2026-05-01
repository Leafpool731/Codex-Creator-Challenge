import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { SiteJsonLd } from "@/components/seo/SiteJsonLd";
import { routing } from "@/i18n/routing";
import { getSiteUrl } from "@/lib/site";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const site = getSiteUrl();

  return {
    metadataBase: new URL(site),
    title: {
      default: t("title"),
      template: "%s · Chromi"
    },
    description: t("description"),
    applicationName: "Chromi",
    authors: [{ name: "Chromi", url: site }],
    creator: "Chromi",
    publisher: "Chromi",
    formatDetection: {
      email: false,
      address: false,
      telephone: false
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1
      }
    },
    openGraph: {
      type: "website",
      siteName: "Chromi",
      locale: locale === "zh" ? "zh_CN" : "en_US",
      alternateLocale: locale === "zh" ? ["en_US"] : ["zh_CN"]
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description")
    },
    verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
      : undefined,
    other: {
      "apple-mobile-web-app-title": "Chromi"
    }
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <SiteJsonLd locale={locale} />
      {children}
    </NextIntlClientProvider>
  );
}
