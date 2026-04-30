export type PaletteCategory =
  | "neutrals"
  | "blushAndLips"
  | "eyeshadowCore"
  | "eyeshadowAccent"
  | "deepDefinition"
  | "boldAccents";

export type SeasonPalette = {
  season: string;
  temperature: "warm" | "cool" | "neutral";
  chroma: "soft" | "bright" | "muted" | "clear";
  contrast: "low" | "medium" | "high";
  colors: Record<PaletteCategory, string[]>;
};

const categoryCounts: Record<PaletteCategory, number> = {
  neutrals: 16,
  blushAndLips: 12,
  eyeshadowCore: 16,
  eyeshadowAccent: 8,
  deepDefinition: 6,
  boldAccents: 6
};

export const paletteCategoryLabels: Record<PaletteCategory, string> = {
  neutrals: "Contour / Browns",
  blushAndLips: "Blush & Lips",
  eyeshadowCore: "Eyeshadow Neutrals",
  eyeshadowAccent: "Eyeshadow Accents",
  deepDefinition: "Deep Definition",
  boldAccents: "Bold Accents"
};

export const paletteCategoryOrder: PaletteCategory[] = [
  "neutrals",
  "blushAndLips",
  "eyeshadowCore",
  "eyeshadowAccent",
  "deepDefinition",
  "boldAccents"
];

function definePalette(palette: SeasonPalette): SeasonPalette {
  paletteCategoryOrder.forEach((category) => {
    const expected = categoryCounts[category];
    const actual = palette.colors[category].length;

    if (actual !== expected) {
      throw new Error(
        `${palette.season} ${category} must contain ${expected} colors, got ${actual}`
      );
    }
  });

  return palette;
}

export const seasonPalettes: SeasonPalette[] = [
  definePalette({
    season: "Light Spring",
    temperature: "warm",
    chroma: "clear",
    contrast: "low",
    colors: {
      neutrals: ["#FFF7E8", "#FCECCF", "#F4DDB9", "#E8C99F", "#D9B17A", "#C99C62", "#B88952", "#A57443", "#8D6137", "#75502F", "#F8E3C8", "#F2D2B8", "#E3B990", "#CFA16E", "#B98857", "#7A5538"],
      blushAndLips: ["#F7B8A7", "#F4A996", "#F29581", "#EB806D", "#DD6F62", "#CF5F58", "#FFC1A6", "#FFAD8B", "#F99B76", "#ED856D", "#D96C63", "#C85B59"],
      eyeshadowCore: ["#FFF3DA", "#F9E4C4", "#EDD0A6", "#DFC08F", "#CEAA76", "#B98F59", "#A77C4C", "#8D653C", "#F6DDB6", "#E8C69B", "#D7AD78", "#C99B63", "#B18351", "#93683F", "#76502F", "#5E3E27"],
      eyeshadowAccent: ["#9EDFCF", "#6FD0C9", "#72C7E0", "#9DDA9B", "#C5D96C", "#F7B65E", "#F58465", "#E66658"],
      deepDefinition: ["#6E4A31", "#5A3C2A", "#483023", "#70462C", "#5B3827", "#3F2A21"],
      boldAccents: ["#00A7A1", "#39B7B0", "#70B84F", "#F47D55", "#E95D51", "#F1B545"]
    }
  }),
  definePalette({
    season: "Bright Spring",
    temperature: "neutral",
    chroma: "bright",
    contrast: "high",
    colors: {
      neutrals: ["#FFF8E1", "#FCE8BF", "#EFD3A1", "#DDB77D", "#C99A55", "#A9773D", "#83562E", "#5B3A25", "#F7E3C6", "#E8C69B", "#D2A66D", "#AE804C", "#8D5C36", "#5C3727", "#31211C", "#161210"],
      blushAndLips: ["#FF8F70", "#FF775C", "#F35E55", "#E94649", "#D73444", "#C72842", "#FF6F8E", "#F04F79", "#E83F67", "#D92E58", "#C51E48", "#A8173E"],
      eyeshadowCore: ["#FFF4D4", "#F8DEAA", "#EBC179", "#D9A050", "#BE7F38", "#9F5E2C", "#774224", "#3E271D", "#F5D7C0", "#E5B48B", "#CC875A", "#A86540", "#7A432B", "#4A2B22", "#2A1C19", "#0E0C0B"],
      eyeshadowAccent: ["#00BDB8", "#00A4C8", "#78C341", "#B5D834", "#FF9B3E", "#FF684E", "#E94377", "#B65DB8"],
      deepDefinition: ["#3A241A", "#2A1B17", "#1D1512", "#3E1C23", "#281722", "#11100F"],
      boldAccents: ["#00AFA9", "#008BD2", "#72BE44", "#FF6D4D", "#E83254", "#B948B5"]
    }
  }),
  definePalette({
    season: "True Spring",
    temperature: "warm",
    chroma: "bright",
    contrast: "medium",
    colors: {
      neutrals: ["#FFF0C8", "#F8DDAA", "#EDC783", "#DBAD5F", "#C59242", "#A87333", "#86562A", "#5F3B22", "#F4D4A7", "#E1B879", "#CC9854", "#AA7438", "#8A5930", "#68412A", "#4A2E22", "#2F211A"],
      blushAndLips: ["#FFB183", "#F99A68", "#F08457", "#E96F4A", "#DA5B42", "#C94A3B", "#FF8B76", "#F26D5F", "#E85B52", "#D94C4D", "#C63D44", "#AE303D"],
      eyeshadowCore: ["#FFF2C8", "#F8DDA4", "#E8BF73", "#D6A04B", "#BF8438", "#9E642D", "#7D4B27", "#5C3823", "#F1C990", "#E0AE68", "#CD9146", "#A96C32", "#83502A", "#654029", "#493021", "#332319"],
      eyeshadowAccent: ["#71D6C9", "#2ABBB4", "#67B95C", "#9BC64A", "#E7B13E", "#F79245", "#EA684D", "#DB484C"],
      deepDefinition: ["#6D4327", "#593626", "#462A20", "#74422C", "#563125", "#34231B"],
      boldAccents: ["#12AAA6", "#46B85A", "#93C83F", "#F68743", "#E9584A", "#CF3A42"]
    }
  }),
  definePalette({
    season: "Warm Spring",
    temperature: "warm",
    chroma: "clear",
    contrast: "medium",
    colors: {
      neutrals: ["#F8E2B3", "#EEC982", "#DEAD58", "#C89038", "#A9702C", "#865226", "#633820", "#45251B", "#F1D29E", "#DFB36E", "#C99148", "#A96E33", "#89552C", "#674028", "#4C3021", "#302018"],
      blushAndLips: ["#F5A06F", "#EA8B5D", "#DE744E", "#CC5F43", "#B94C39", "#A43D32", "#F68C68", "#E97357", "#D95F4A", "#C94E41", "#B64038", "#9F332F"],
      eyeshadowCore: ["#F5DCB1", "#E7C081", "#D39C53", "#B97A35", "#955C29", "#714123", "#52301E", "#362119", "#E8BD82", "#D69E5C", "#BB7E3C", "#9B622E", "#774829", "#5B3824", "#40291D", "#2B1D16"],
      eyeshadowAccent: ["#A7B34B", "#7FA24B", "#5B8546", "#2D847B", "#DFA235", "#C87534", "#B75335", "#93412F"],
      deepDefinition: ["#704222", "#5B341F", "#46291C", "#6A3B25", "#4F3021", "#342119"],
      boldAccents: ["#258C7F", "#4D934D", "#A4A33C", "#D99230", "#C25734", "#A63B31"]
    }
  }),
  definePalette({
    season: "Light Summer",
    temperature: "cool",
    chroma: "soft",
    contrast: "low",
    colors: {
      neutrals: ["#F4EEF0", "#E8DADD", "#D6C4C7", "#C4ACAF", "#AA9095", "#8F747B", "#735F66", "#574A51", "#ECE7E4", "#D8D0CD", "#C2B7B5", "#A89C9D", "#8D8286", "#746D73", "#5C5860", "#45444C"],
      blushAndLips: ["#E9B5C4", "#DEA0B3", "#D18BA3", "#C17692", "#B06482", "#9F5575", "#E5A6B8", "#D58CA5", "#C67692", "#B66483", "#A55375", "#904866"],
      eyeshadowCore: ["#F0E9E8", "#DDD2D1", "#C9BCBD", "#B5A6AA", "#9C8E95", "#837883", "#6B626E", "#534E5B", "#E4DDE2", "#CDC1CB", "#B5A8B7", "#9E91A3", "#877C90", "#716B7B", "#5E596A", "#484653"],
      eyeshadowAccent: ["#B5CADA", "#9DBCCF", "#AFC6C2", "#B6C5A9", "#C4B8D5", "#B7A4C9", "#C98BA5", "#B96F8D"],
      deepDefinition: ["#615861", "#514B55", "#433F49", "#5B4A58", "#4D414E", "#393640"],
      boldAccents: ["#7AA8C4", "#8BAFA9", "#9AAE88", "#A793C0", "#B96687", "#9C4B71"]
    }
  }),
  definePalette({
    season: "True Summer",
    temperature: "cool",
    chroma: "soft",
    contrast: "medium",
    colors: {
      neutrals: ["#EEE9E8", "#DDD4D4", "#C7BBBD", "#AFA2A7", "#968990", "#7B727B", "#635E68", "#4D4B56", "#E6E1E3", "#D1C8CC", "#BBAFB6", "#A497A1", "#8D818D", "#746D79", "#5B5865", "#44434F"],
      blushAndLips: ["#DFA5B7", "#D28DA5", "#C77697", "#B96188", "#AA507A", "#98436C", "#D485A1", "#C76F91", "#B95D82", "#A84D73", "#963F65", "#823654"],
      eyeshadowCore: ["#EEE9E7", "#DCD4D2", "#C5B9BA", "#AD9FA2", "#93868C", "#7B7078", "#645D68", "#4D4A55", "#DAD4DC", "#C3BAC8", "#ABA0B2", "#93889C", "#7D7388", "#675F74", "#534E60", "#403D4B"],
      eyeshadowAccent: ["#9BB5CC", "#7EA0BD", "#8DAFB0", "#8FA58F", "#B2A2C7", "#9A86B0", "#B95F83", "#9B486F"],
      deepDefinition: ["#554C58", "#47414D", "#3A3643", "#4C4050", "#3E3645", "#302D39"],
      boldAccents: ["#537FA5", "#5C8C93", "#728F79", "#7E68A2", "#9E416D", "#7F3357"]
    }
  }),
  definePalette({
    season: "Soft Summer",
    temperature: "neutral",
    chroma: "muted",
    contrast: "low",
    colors: {
      neutrals: ["#E6DDD9", "#D3C4BF", "#BDAAA5", "#A5908D", "#8C7977", "#736463", "#5C5051", "#453E41", "#DED9D3", "#C9C0BA", "#B0A5A1", "#968C8B", "#7D7477", "#686268", "#514E56", "#3F3D45"],
      blushAndLips: ["#CFA0A0", "#BF898D", "#B0747E", "#9F626F", "#8F5264", "#7E4558", "#C48D93", "#B67882", "#A86475", "#985468", "#87475B", "#743B4E"],
      eyeshadowCore: ["#E1D8D3", "#CFC1BB", "#B8A9A3", "#A0918E", "#887A79", "#706565", "#5B5253", "#463F42", "#D6D2CC", "#BFB8B2", "#A7A09C", "#8F8887", "#787274", "#635F65", "#4F4C55", "#3C3B43"],
      eyeshadowAccent: ["#879B96", "#738B8C", "#8D9A82", "#778469", "#9A89A7", "#806F90", "#A96A7D", "#8A4E68"],
      deepDefinition: ["#514844", "#453D3B", "#393332", "#4B3E42", "#3E343B", "#312B32"],
      boldAccents: ["#4F7E82", "#687C6A", "#7F7A5A", "#786593", "#8D4D67", "#703C55"]
    }
  }),
  definePalette({
    season: "Cool Summer",
    temperature: "cool",
    chroma: "soft",
    contrast: "medium",
    colors: {
      neutrals: ["#F0EDF0", "#DED9DF", "#C7C0C9", "#AEA6B3", "#958D9B", "#7B7584", "#625F70", "#494859", "#E4E2E5", "#CDC9D0", "#B4AFBA", "#9B95A3", "#837D8E", "#6A6678", "#535064", "#3C3B4C"],
      blushAndLips: ["#DCA2B9", "#CF89A8", "#C37298", "#B35C87", "#A34C79", "#913E69", "#D87B9E", "#C9658E", "#B9517E", "#A8446F", "#96375F", "#812E50"],
      eyeshadowCore: ["#F0ECEF", "#DBD5DA", "#C4BDC5", "#ABA3AE", "#928A98", "#797384", "#625D70", "#4B485B", "#DAD9E1", "#C1BFCC", "#A9A6BA", "#928FA7", "#7B788F", "#656277", "#504F61", "#3B3B4B"],
      eyeshadowAccent: ["#8EAEC9", "#668FB6", "#7587B7", "#6D75A7", "#6F9DA0", "#4D858C", "#B3527B", "#923C67"],
      deepDefinition: ["#4C475A", "#403D50", "#343344", "#433746", "#382F3E", "#2B2935"],
      boldAccents: ["#366FA2", "#415BA0", "#287A86", "#8B4B98", "#9D3765", "#7C2B54"]
    }
  }),
  definePalette({
    season: "Soft Autumn",
    temperature: "warm",
    chroma: "muted",
    contrast: "low",
    colors: {
      neutrals: ["#E3D1B9", "#CDB493", "#B99A73", "#A1805B", "#86684A", "#6D5540", "#564435", "#3F342C", "#D8C6A5", "#C1A77D", "#A9895F", "#8B6E4E", "#725A43", "#5C493A", "#46392F", "#332B26"],
      blushAndLips: ["#C98C75", "#BA7864", "#A96655", "#985646", "#88493D", "#773E35", "#C77A68", "#B86559", "#A6544D", "#954640", "#843A36", "#71312F"],
      eyeshadowCore: ["#E4D0AF", "#CBB084", "#B09262", "#927548", "#735A36", "#59452D", "#443527", "#30241D", "#D4B890", "#BE9B6E", "#A37F55", "#846545", "#6B5239", "#544231", "#3F332A", "#2D251F"],
      eyeshadowAccent: ["#9A8F5B", "#7F814E", "#667047", "#4D766F", "#A98245", "#9B6A3B", "#9E5440", "#80504B"],
      deepDefinition: ["#5B4634", "#4C3A2D", "#3E3128", "#503C30", "#41312A", "#2F2722"],
      boldAccents: ["#3F786F", "#5D7650", "#7C7448", "#A05A3C", "#854439", "#6D3C42"]
    }
  }),
  definePalette({
    season: "Warm Autumn",
    temperature: "warm",
    chroma: "muted",
    contrast: "medium",
    colors: {
      neutrals: ["#E8C992", "#D7AA65", "#BE8843", "#9D6730", "#784824", "#5B351F", "#42271A", "#2D1C15", "#D9B373", "#C08D4B", "#A56D35", "#87512A", "#6B3F24", "#52311F", "#3C2519", "#281912"],
      blushAndLips: ["#D98155", "#C96C45", "#B95839", "#A64A32", "#943D2B", "#803226", "#D9684A", "#C7553C", "#B54434", "#A2372E", "#8D2E2A", "#772625"],
      eyeshadowCore: ["#E2C082", "#CFA25B", "#B77D36", "#965A28", "#73401F", "#563018", "#3D2114", "#291710", "#D1A460", "#BB8541", "#9F6630", "#7E4A25", "#62381E", "#4B2B1A", "#342018", "#241610"],
      eyeshadowAccent: ["#B68B2E", "#9B7A27", "#7E7E34", "#5A733C", "#3F7D72", "#B65B31", "#9D442B", "#783421"],
      deepDefinition: ["#5A321C", "#482718", "#381E14", "#5A2E22", "#45231C", "#2B1712"],
      boldAccents: ["#177B71", "#55763A", "#9A8428", "#B95B27", "#9F3B25", "#763120"]
    }
  }),
  definePalette({
    season: "True Autumn",
    temperature: "warm",
    chroma: "muted",
    contrast: "medium",
    colors: {
      neutrals: ["#E7D3A4", "#CFAE72", "#B58A48", "#94672E", "#70461F", "#55331A", "#3E2516", "#281811", "#D9BB81", "#C09555", "#A57438", "#85542A", "#6B4023", "#50311E", "#392417", "#251710"],
      blushAndLips: ["#C97852", "#B96543", "#A75337", "#93442D", "#813829", "#6E2F25", "#C65F42", "#B44E38", "#A03F30", "#8D342B", "#7A2C27", "#642522"],
      eyeshadowCore: ["#E4C788", "#CCA45A", "#B28037", "#905B27", "#6C3D1E", "#513018", "#3B2315", "#251610", "#D2A35F", "#B9833E", "#9E622E", "#7A4724", "#5D361E", "#482B1A", "#332016", "#20140E"],
      eyeshadowAccent: ["#A88728", "#8A7324", "#6E7033", "#53683B", "#306F66", "#B45A2C", "#933F27", "#6E2F21"],
      deepDefinition: ["#56321E", "#442719", "#341D14", "#522B20", "#40231B", "#291713"],
      boldAccents: ["#207267", "#58703D", "#9A7B25", "#B45129", "#8F3724", "#663020"]
    }
  }),
  definePalette({
    season: "Deep Autumn",
    temperature: "neutral",
    chroma: "muted",
    contrast: "high",
    colors: {
      neutrals: ["#D8BB87", "#BA8F53", "#936335", "#6A3D24", "#462719", "#2E1A13", "#1D110D", "#0F0A08", "#C59B63", "#A5723E", "#7C4D2C", "#5D3522", "#48271C", "#351E16", "#241510", "#160D0A"],
      blushAndLips: ["#B45A3B", "#9E4631", "#88372B", "#762E28", "#632624", "#51201F", "#A24734", "#8D382E", "#7B2F2B", "#682728", "#562223", "#431C1E"],
      eyeshadowCore: ["#CF9E58", "#AD763C", "#865129", "#62351F", "#45251A", "#2E1913", "#1C100C", "#0E0806", "#B88447", "#97612F", "#714322", "#56301C", "#3D2318", "#2B1913", "#1D110D", "#0F0907"],
      eyeshadowAccent: ["#8B742C", "#6F6429", "#4F5E32", "#245F59", "#0F4E52", "#984927", "#7D3323", "#5F2721"],
      deepDefinition: ["#2E1A13", "#24120E", "#170C09", "#321712", "#23100D", "#100807"],
      boldAccents: ["#0F5F60", "#325F38", "#7D6A24", "#A34824", "#743029", "#522028"]
    }
  }),
  definePalette({
    season: "Bright Winter",
    temperature: "neutral",
    chroma: "bright",
    contrast: "high",
    colors: {
      neutrals: ["#FFFFFF", "#F5F3F4", "#DADCE1", "#B4BAC3", "#8D96A5", "#667080", "#444C5A", "#222832", "#EAE7EC", "#CFCAD4", "#AAA4B5", "#837B92", "#62586F", "#44394F", "#241D2B", "#070707"],
      blushAndLips: ["#F05C9A", "#DF4085", "#C92872", "#B01860", "#99114F", "#7F0D42", "#E6415F", "#D6264B", "#C4123B", "#A90D33", "#8F0B2C", "#720823"],
      eyeshadowCore: ["#FFFFFF", "#E8E7ED", "#CAC7D4", "#A7A4B8", "#817E95", "#5D5B70", "#3D3B4B", "#181720", "#DCE8EE", "#BCD1DD", "#91AFC4", "#658BA7", "#3E6685", "#26455F", "#172A3D", "#090C12"],
      eyeshadowAccent: ["#8DE7E2", "#00B6C8", "#0057D8", "#7C39D5", "#E23D8F", "#D20F3B", "#00A36C", "#D9EF45"],
      deepDefinition: ["#15151A", "#0B0C10", "#261531", "#1A1830", "#10233C", "#070707"],
      boldAccents: ["#0057D8", "#00A36C", "#E23D8F", "#D20F3B", "#6D2ED3", "#00B6C8"]
    }
  }),
  definePalette({
    season: "True Winter",
    temperature: "cool",
    chroma: "clear",
    contrast: "high",
    colors: {
      neutrals: ["#FFFFFF", "#F4F5F6", "#DDE1E6", "#BBC2CA", "#929CA7", "#697481", "#454D58", "#242932", "#ECEEF2", "#CED4DD", "#A9B2C0", "#818B9A", "#5F6877", "#424A57", "#252B34", "#050506"],
      blushAndLips: ["#E94C82", "#D9346C", "#C51F57", "#AF154B", "#98103F", "#820C36", "#D82042", "#C41230", "#AA0E2B", "#920B26", "#78081F", "#5E071A"],
      eyeshadowCore: ["#FFFFFF", "#E4E7EA", "#C9CED5", "#A8AFB9", "#838B98", "#5F6874", "#3C434E", "#181C22", "#DDE6EE", "#BED0DD", "#8FA9BE", "#627F99", "#3B5B75", "#213A52", "#142235", "#07090C"],
      eyeshadowAccent: ["#BFEAF5", "#79B8E6", "#0047AB", "#4D2F91", "#C0007A", "#C41230", "#00845E", "#F7F2A8"],
      deepDefinition: ["#0D0D10", "#070707", "#1A1921", "#202631", "#17132A", "#111116"],
      boldAccents: ["#0047AB", "#00845E", "#C0007A", "#C41230", "#4D2F91", "#00A6D6"]
    }
  }),
  definePalette({
    season: "Deep Winter",
    temperature: "cool",
    chroma: "clear",
    contrast: "high",
    colors: {
      neutrals: ["#F8F7F5", "#E5E3E2", "#C8C9CC", "#A4A8AF", "#7C838E", "#545B67", "#333945", "#171B22", "#E8E3E7", "#C9C1CA", "#A79EAA", "#817786", "#5C535F", "#3F3744", "#261F2A", "#09090C"],
      blushAndLips: ["#C8577A", "#B64068", "#A12C58", "#8D204B", "#74183F", "#5C1232", "#B62749", "#9F183C", "#85112F", "#6E0D29", "#570A22", "#43071A"],
      eyeshadowCore: ["#F3F2F3", "#D9D9DC", "#B7BBC2", "#9197A3", "#69717D", "#464E59", "#29303A", "#101318", "#D9D6DD", "#BBB5C2", "#9A90A4", "#756D83", "#544D60", "#383342", "#241F2D", "#0B090E"],
      eyeshadowAccent: ["#A9C9DE", "#5C8FC0", "#173D75", "#4F315F", "#8D1F46", "#42182B", "#173C3A", "#F0DCE6"],
      deepDefinition: ["#111116", "#09090B", "#241923", "#181D24", "#112833", "#070708"],
      boldAccents: ["#173D75", "#006A6E", "#6A2D7A", "#8D1F46", "#B3123D", "#2E6A5F"]
    }
  }),
  definePalette({
    season: "Cool Winter",
    temperature: "cool",
    chroma: "clear",
    contrast: "high",
    colors: {
      neutrals: ["#FAFAFB", "#E9EAEE", "#CDD2DA", "#AAB2BF", "#818A9A", "#596373", "#384252", "#1D2430", "#ECEAF0", "#D0CAD6", "#ADA5B7", "#857B93", "#62586F", "#443B52", "#282233", "#0D0D12"],
      blushAndLips: ["#D75B86", "#C74376", "#B32D66", "#9F2058", "#861849", "#6D123B", "#C72A4F", "#B01842", "#961235", "#7E0E2D", "#650B25", "#4E091D"],
      eyeshadowCore: ["#F4F4F6", "#DEDFE5", "#C1C5CF", "#9CA3B2", "#747E8F", "#515B6D", "#323A49", "#151922", "#DFDCE7", "#C3BDD1", "#A197B4", "#7C7293", "#5B5272", "#3E3653", "#27213B", "#0E0D16"],
      eyeshadowAccent: ["#B7D6E6", "#7AA7D0", "#2D69A8", "#4F4BA2", "#5D2A72", "#A80F3C", "#00606A", "#DCD6EE"],
      deepDefinition: ["#15161D", "#0C0D12", "#262132", "#1A2230", "#11283B", "#08080C"],
      boldAccents: ["#2D69A8", "#00606A", "#5D2A72", "#A80F3C", "#BD2348", "#4255A8"]
    }
  })
];

const seasonAliases: Record<string, string> = {
  "dark autumn": "deep autumn",
  "dark winter": "deep winter"
};

function normalizeSeasonName(seasonName: string): string {
  const normalized = seasonName.trim().toLowerCase();
  return seasonAliases[normalized] ?? normalized;
}

const paletteBySeason = new Map(
  seasonPalettes.map((palette) => [normalizeSeasonName(palette.season), palette])
);

export function getPaletteForSeason(seasonName: string): SeasonPalette {
  return (
    paletteBySeason.get(normalizeSeasonName(seasonName)) ??
    seasonPalettes[0]
  );
}

export function getPaletteCategory(
  seasonName: string,
  category: PaletteCategory
): string[] {
  return getPaletteForSeason(seasonName).colors[category];
}

export function getContourColors(seasonName: string): string[] {
  return getPaletteCategory(seasonName, "neutrals");
}

export function getLipColors(seasonName: string): string[] {
  return getPaletteCategory(seasonName, "blushAndLips");
}

export function getEyeshadowColors(seasonName: string): string[] {
  const palette = getPaletteForSeason(seasonName);
  return [
    ...palette.colors.eyeshadowCore,
    ...palette.colors.eyeshadowAccent,
    ...palette.colors.deepDefinition
  ];
}
