const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");

const langs = ["ru", "kz", "en"];
const baseUrl = "https://nubiotica.kz"; // Замени на свой реальный домен

const pages = [
  { tpl: "template.html", out: "index.html" },
  { tpl: "template-policy.html", out: "policy.html" },
  { tpl: "template-storage.html", out: "storage.html" },
  { tpl: "template-terms.html", out: "terms.html" },
];

langs.forEach((lang) => {
  const dictPath = path.join(__dirname, "lang", `${lang}.json`);

  if (!fs.existsSync(dictPath)) {
    console.warn(
      `⚠️ Файл lang/${lang}.json не найден. Пропуск сборки для ${lang.toUpperCase()}.`,
    );
    return;
  }

  const dict = JSON.parse(fs.readFileSync(dictPath, "utf-8"));

  let outDir = lang === "ru" ? __dirname : path.join(__dirname, lang);

  if (lang !== "ru" && !fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  pages.forEach(({ tpl, out }) => {
    const tplPath = path.join(__dirname, tpl);
    if (!fs.existsSync(tplPath)) return;

    const templateHtml = fs.readFileSync(tplPath, "utf-8");
    const $ = cheerio.load(templateHtml, { decodeEntities: false });

    const htmlLang = lang === "kz" ? "kk" : lang;
    $("html").attr("lang", htmlLang);

    $("[data-i18n]").each((i, el) => {
      const key = $(el).attr("data-i18n");
      if (dict[key]) {
        if (["input", "textarea"].includes(el.tagName.toLowerCase())) {
          $(el).attr("placeholder", dict[key]);
        } else {
          $(el).html(dict[key]);
        }
      }
    });

    $("[data-i18n-alt]").each((i, el) => {
      const key = $(el).attr("data-i18n-alt");
      if (dict[key]) $(el).attr("alt", dict[key]);
    });

    $("[data-i18n-content]").each((i, el) => {
      const key = $(el).attr("data-i18n-content");
      if (dict[key]) $(el).attr("content", dict[key]);
    });

    $("[data-i18n-aria]").each((i, el) => {
      const key = $(el).attr("data-i18n-aria");
      if (dict[key]) $(el).attr("aria-label", dict[key]);
    });

    let pageUrl =
      lang === "ru" ? `${baseUrl}/${out}` : `${baseUrl}/${lang}/${out}`;
    if (out === "index.html") {
      pageUrl = lang === "ru" ? `${baseUrl}/` : `${baseUrl}/${lang}/`;
    }

    $("#canonical-link").attr("href", pageUrl);
    $("#og-url").attr("content", pageUrl);

    let locale = lang === "ru" ? "ru_RU" : lang === "kz" ? "kk_KZ" : "en_US";
    $("#og-locale").attr("content", locale);

    $(".lang-dropdown a").removeClass("active");
    $(`.lang-dropdown a[data-lang="${lang}"]`).addClass("active");

    $(".desktop-lang-switcher .lang-btn-text").text(lang.toUpperCase());
    $(".mobile-lang-switcher .lang-btn-text").text(
      lang === "ru" ? "РУС" : lang === "kz" ? "ҚАЗ" : "ENG",
    );

    if (out !== "index.html") {
      $("#schema-json").remove();
    } else {
      const schemaScript = $("#schema-json");
      if (schemaScript.length && dict["meta_desc"] && dict["meta_title"]) {
        const schemaJSON = {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              name: "Nubiotica",
              url: baseUrl,
              logo: `${baseUrl}/apple-touch-icon.png`,
              description: dict["meta_desc"],
            },
            {
              "@type": "WebSite",
              url: pageUrl,
              name: dict["meta_title"],
              description: dict["meta_desc"],
              inLanguage: htmlLang,
            },
          ],
        };
        schemaScript.text(JSON.stringify(schemaJSON, null, 2));
      }
    }

    $("[data-i18n], [data-i18n-alt], [data-i18n-content], [data-i18n-aria]")
      .removeAttr("data-i18n")
      .removeAttr("data-i18n-alt")
      .removeAttr("data-i18n-content")
      .removeAttr("data-i18n-aria");

    fs.writeFileSync(path.join(outDir, out), $.html());
  });

  console.log(`✅ Сборка успешна: ${lang.toUpperCase()}`);
});
