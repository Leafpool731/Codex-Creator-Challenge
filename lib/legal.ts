/**
 * Copy for the Privacy, Affiliate disclosure and About pages.
 *
 * Keep this accurate to what the site actually does. If you add analytics, accounts,
 * a newsletter, uploads or anything else that collects data, update the privacy policy.
 * `{CONTACT}` is replaced with the contact email (NEXT_PUBLIC_CONTACT_EMAIL).
 */

export type LegalPageId = "privacy" | "disclosure" | "about";

export interface LegalSection {
  heading: string;
  body: string[];
}

export interface LegalPageContent {
  title: string;
  description: string;
  intro: string;
  sections: LegalSection[];
}

export const LEGAL_UPDATED = "2026-11-22";

const en: Record<LegalPageId, LegalPageContent> = {
  privacy: {
    title: "Privacy policy",
    description: "What Chromi collects (very little), and what it doesn't.",
    intro:
      "Chromi is designed to work without knowing who you are. You don't upload a photo, create an account or give us your name.",
    sections: [
      {
        heading: "What we don't collect",
        body: [
          "No photos. You choose a reference portrait; nothing from your camera or files is used.",
          "No accounts, names or email addresses.",
          "No analytics, advertising trackers or third-party scripts."
        ]
      },
      {
        heading: "What happens in your browser",
        body: [
          "The color analysis and the portrait recoloring run on your device.",
          "Your profile settings (skin depth, undertone, hair and eye color, clarity and the chosen portrait) are stored in the page address so you can bookmark or share your result. Anyone you send the link to will see those settings. They don't identify you."
        ]
      },
      {
        heading: "Cookies",
        body: [
          "We set one functional cookie, NEXT_LOCALE, to remember your language. It isn't used for tracking."
        ]
      },
      {
        heading: "Hosting",
        body: [
          "The site is hosted on Cloudflare. Like any web host, Cloudflare processes technical information needed to deliver and protect the site, such as IP address, browser type and the pages requested (including the page address). This is kept in request logs under Cloudflare's own policies (cloudflare.com/privacypolicy)."
        ]
      },
      {
        heading: "Shopping links",
        body: [
          "When you click a link to a retailer, you leave Chromi. The retailer or affiliate network may set cookies to credit the referral, and their privacy policies apply from then on. We don't receive your name, address or what you buy; affiliate programs only report aggregate commissions."
        ]
      },
      {
        heading: "Children",
        body: ["Chromi isn't directed at children under 13 and doesn't knowingly collect information from them."]
      },
      {
        heading: "Changes and contact",
        body: [
          "If what we collect changes, we'll update this page and the date above.",
          "Questions or requests: {CONTACT}"
        ]
      }
    ]
  },
  disclosure: {
    title: "Affiliate disclosure",
    description: "How Chromi earns money, and why it doesn't affect which products you see.",
    intro:
      "Some links on Chromi are affiliate links. If you buy through one, Chromi may earn a commission at no extra cost to you.",
    sections: [
      {
        heading: "How products are chosen",
        body: [
          "Products are ranked only by how close their shade is to your season's target colors, measured in a perceptual color space. Commission never affects the ranking.",
          "Products without an affiliate link are included and ranked the same way. Affiliate links are labelled on each product."
        ]
      },
      {
        heading: "Amazon",
        body: ["{AMAZON}"]
      },
      {
        heading: "Accuracy",
        body: [
          "Shade colors are measured from retailer swatch images and screens show color differently, so treat swatches as a guide and check shades in daylight before you buy.",
          "Products marked “Sample” are placeholders and can't be purchased."
        ]
      },
      {
        heading: "Contact",
        body: ["Questions about a recommendation: {CONTACT}"]
      }
    ]
  },
  about: {
    title: "About Chromi",
    description: "What Chromi is, how it works and who to contact.",
    intro:
      "Chromi is a free personal color analysis tool. It helps you find the colors and makeup shades that suit your natural coloring, without uploading a photo.",
    sections: [
      {
        heading: "How it works",
        body: [
          "You pick the reference portrait closest to you and adjust skin depth, undertone, hair, eyes and clarity until it matches you. Chromi places that profile on four dimensions — temperature, value, chroma and contrast — and finds the nearest of sixteen seasons.",
          "Palettes are generated from each season's position in a perceptual color space, and the drape test shows your colors at the neckline next to colors to avoid."
        ]
      },
      {
        heading: "What it isn't",
        body: [
          "Color analysis is part science, part judgment, and professional analysts don't always agree. Chromi is a guide and a starting point, not a diagnosis. We're comparing its results with professional analyses and will publish how often they agree."
        ]
      },
      {
        heading: "How Chromi is funded",
        body: ["Through affiliate links on product recommendations. See the affiliate disclosure for how that works."]
      },
      {
        heading: "Contact",
        body: ["{CONTACT}"]
      }
    ]
  }
};

const zh: Record<LegalPageId, LegalPageContent> = {
  privacy: {
    title: "隐私政策",
    description: "Chromi 收集哪些信息（极少），以及不收集哪些信息。",
    intro: "Chromi 的设计无需知道你是谁。你不需要上传照片、注册账号或提供姓名。",
    sections: [
      {
        heading: "我们不收集的信息",
        body: [
          "不收集照片。你选择的是参考肖像，不会使用你的相机或文件中的任何内容。",
          "不收集账号、姓名或电子邮箱。",
          "不使用分析工具、广告追踪或第三方脚本。"
        ]
      },
      {
        heading: "在你浏览器中发生的事",
        body: [
          "色彩分析与肖像重新着色均在你的设备上运行。",
          "你的档案设置（肤色深浅、底色、发色与眼睛颜色、清晰度及所选肖像）保存在页面地址中，方便收藏或分享结果。收到链接的人可以看到这些设置，但它们无法识别你的身份。"
        ]
      },
      {
        heading: "Cookie",
        body: ["我们只设置一个功能性 Cookie（NEXT_LOCALE）来记住你的语言，不用于追踪。"]
      },
      {
        heading: "托管",
        body: [
          "本网站托管于 Cloudflare。与任何网站托管服务一样，Cloudflare 会处理提供和保护网站所需的技术信息，例如 IP 地址、浏览器类型以及请求的页面（包括页面地址）。这些信息按 Cloudflare 自身的政策保存在请求日志中（cloudflare.com/privacypolicy）。"
        ]
      },
      {
        heading: "购物链接",
        body: [
          "点击零售商链接后，你将离开 Chromi。零售商或联盟网络可能设置 Cookie 以记录推荐来源，此后适用其隐私政策。我们不会收到你的姓名、地址或购买内容；联盟计划只提供汇总的佣金报告。"
        ]
      },
      {
        heading: "儿童",
        body: ["Chromi 不面向 13 岁以下儿童，也不会有意收集其信息。"]
      },
      {
        heading: "变更与联系方式",
        body: ["如果我们收集的信息发生变化，将更新本页面及上方日期。", "问题或请求：{CONTACT}"]
      }
    ]
  },
  disclosure: {
    title: "联盟链接说明",
    description: "Chromi 如何获得收入，以及为什么这不会影响你看到的产品。",
    intro: "Chromi 上的部分链接为联盟链接。通过这些链接购买，Chromi 可能获得佣金，你无需额外付费。",
    sections: [
      {
        heading: "产品如何挑选",
        body: [
          "产品仅按其色号与你季型目标色的接近程度排序，在感知均匀的色彩空间中测量。佣金从不影响排序。",
          "没有联盟链接的产品同样会被收录并以相同方式排序。每个产品的联盟链接都有标注。"
        ]
      },
      {
        heading: "Amazon",
        body: ["{AMAZON}"]
      },
      {
        heading: "准确性",
        body: [
          "色号颜色取自零售商的色块图片，而不同屏幕显示的颜色也会不同，因此色块仅供参考，购买前请在日光下确认色号。",
          "标有“示例”的产品为占位内容，无法购买。"
        ]
      },
      {
        heading: "联系方式",
        body: ["关于推荐的问题：{CONTACT}"]
      }
    ]
  },
  about: {
    title: "关于 Chromi",
    description: "Chromi 是什么、如何运作以及联系方式。",
    intro: "Chromi 是一款免费的个人色彩分析工具，无需上传照片，就能帮你找到适合自身天然色彩的颜色与彩妆色号。",
    sections: [
      {
        heading: "运作方式",
        body: [
          "你选择与自己最接近的参考肖像，并调整肤色深浅、底色、发色、眼睛颜色和清晰度，直到与你一致。Chromi 将该档案放在冷暖、明度、彩度和对比度四个维度上，找到十六季型中最接近的一个。",
          "色板由每个季型在感知色彩空间中的位置生成，披布测试则在领口处并排展示适合色与应避免色。"
        ]
      },
      {
        heading: "它不是什么",
        body: [
          "色彩分析既有科学成分也有主观判断，专业顾问之间也并不总是一致。Chromi 是参考和起点，而非诊断。我们正在将其结果与专业分析进行对比，并会公布一致的比例。"
        ]
      },
      {
        heading: "Chromi 的收入来源",
        body: ["来自产品推荐中的联盟链接。具体方式请参阅联盟链接说明。"]
      },
      {
        heading: "联系方式",
        body: ["{CONTACT}"]
      }
    ]
  }
};

export function legalContent(locale: string, id: LegalPageId): LegalPageContent {
  return (locale === "zh" ? zh : en)[id];
}

export const legalStrings = {
  en: {
    updated: "Last updated",
    contactPending: "A contact email is being set up.",
    amazon: "As an Amazon Associate, Chromi earns from qualifying purchases.",
    amazonNone: "Chromi isn't currently part of the Amazon Associates program."
  },
  zh: {
    updated: "最后更新",
    contactPending: "联系邮箱正在设置中。",
    amazon: "作为亚马逊联盟成员，Chromi 会从符合条件的购买中获得收入。",
    amazonNone: "Chromi 目前未加入亚马逊联盟计划。"
  }
} as const;
