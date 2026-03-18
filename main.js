const productLinks = {
  baobab: {
    wb: "https://www.wildberries.kz/catalog/729195584/detail.aspx?utm_source=site&utm_medium=description&utm_campaign=vendor_org_2841908_2",
    ozon: "https://ozon.kz/product/baobab-poroshok-100g-nubiotica-naturalnyy-superfud-iz-tanzanii-vitamin-s-3297609013/?utm_source=site&utm_medium=description&utm_campaign=vendor_org_2841908_2",
  },
  moringa: {
    wb: "https://wildberries.ru/catalog/729211511/detail.aspx?utm_source=site&utm_medium=description&utm_campaign=vendor_org_2841908_2",
    ozon: "https://ozon.kz/product/moringa-poroshok-100g-nubiotica-naturalnyy-superfud-iz-tanzanii-detoks-3297574778/?utm_source=site&utm_medium=description&utm_campaign=vendor_org_2841908_2",
  },
  ashwa: {
    wb: "", // Оставили пустой, чтобы скрыть кнопку WB
    ozon: "https://ozon.kz/product/rastitelnyy-poroshok-iz-sushenogo-kornya-100-g-superfud-iz-vostochnoy-afriki-3297870226/?utm_source=site&utm_medium=description&utm_campaign=vendor_org_2841908_2",
  },
  shata: {
    wb: "https://www.wildberries.kz/catalog/729260664/detail.aspx?utm_source=site&utm_medium=description&utm_campaign=vendor_org_2841908_2",
    ozon: "https://ozon.kz/product/shatavari-poroshok-100g-nubiotica-naturalnyy-superfud-dlya-zhenshchin-iz-tanzanii-3297926603/?utm_source=site&utm_medium=description&utm_campaign=vendor_org_2841908_2",
  },
};

const dynamicTexts = {
  ru: {
    wLbl: "Ваш номер WhatsApp",
    wPlh: "+7 (___) ___-__-__",
    wErr: "Введите полный номер телефона",
    tLbl: "Ваш Telegram",
    tPlh: "@username или +7 (___) ___-__-__",
    tErr: "Укажите корректный @username или номер",
    eLbl: "Ваш Email",
    ePlh: "example@mail.com",
    eErr: "Укажите корректный email",
  },
  kz: {
    wLbl: "WhatsApp нөміріңіз",
    wPlh: "+7 (___) ___-__-__",
    wErr: "Толық телефон нөмірін енгізіңіз",
    tLbl: "Telegram нигіңіз",
    tPlh: "@username немесе +7 (___) ___-__-__",
    tErr: "Дұрыс @username немесе нөмірді көрсетіңіз",
    eLbl: "Сіздің Email",
    ePlh: "example@mail.com",
    eErr: "Дұрыс email көрсетіңіз",
  },
  en: {
    wLbl: "Your WhatsApp number",
    wPlh: "+7 (___) ___-__-__",
    wErr: "Enter the full phone number",
    tLbl: "Your Telegram",
    tPlh: "@username or +7 (___) ___-__-__",
    tErr: "Provide a valid @username or number",
    eLbl: "Your Email",
    ePlh: "example@mail.com",
    eErr: "Provide a valid email",
  },
};

const processTexts = {
  ru: { exp: "Подробнее о процессе", col: "Скрыть процесс" },
  kz: { exp: "Процесс туралы толығырақ", col: "Процесті жасыру" },
  en: { exp: "More about the process", col: "Hide the process" },
};

document.querySelectorAll(".lang-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const switcher = btn.closest(".lang-switcher");
    document.querySelectorAll(".lang-switcher").forEach((s) => {
      if (s !== switcher) s.classList.remove("active");
    });
    switcher.classList.toggle("active");
  });
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".lang-switcher")) {
    document
      .querySelectorAll(".lang-switcher")
      .forEach((s) => s.classList.remove("active"));
  }
  if (e.target.classList.contains("modal-backdrop")) {
    e.target.classList.remove("active");
    if (window.lenis) window.lenis.start();
  }
  if (!e.target.closest(".buy-wrapper")) {
    document
      .querySelectorAll(".buy-dropdown")
      .forEach((d) => d.classList.remove("active"));
  }
});

window.openMarketplaceModal = function (prodId = null) {
  const wbLink = document.getElementById("btn-link-wb");
  const ozonLink = document.getElementById("btn-link-ozon");

  if (prodId && productLinks[prodId]) {
    if (productLinks[prodId].wb === "") {
      wbLink.style.display = "none"; // Скрываем WB, если ссылки нет
    } else {
      wbLink.style.display = ""; // Возвращаем отображение
      wbLink.href = productLinks[prodId].wb;
    }
    ozonLink.href = productLinks[prodId].ozon;
  } else {
    wbLink.style.display = "";
    wbLink.href = "https://www.wildberries.ru/seller/4062695";
    ozonLink.href = "https://ozon.kz/seller/unistores/";
  }
  openModal("marketplace");
};

window.openModal = function (id, subjectValue = null) {
  const modal = document.getElementById("modal-" + id);
  if (modal) {
    modal.classList.add("active");
    if (window.lenis) window.lenis.stop();
    if (id === "contact" && subjectValue) {
      const select = modal.querySelector('select[name="subject"]');
      if (select) select.value = subjectValue;
    }
  }
  const menu = document.getElementById("mobile-menu");
  if (menu && menu.classList.contains("active")) toggleMobileMenu();
};

window.toggleProcess = function (btn) {
  const lang = document.documentElement.lang || "ru";
  const content = btn.nextElementSibling;
  const textSpan = btn.querySelector("span");
  btn.classList.toggle("active");
  content.classList.toggle("expanded");
  textSpan.textContent = content.classList.contains("expanded")
    ? processTexts[lang]?.col || processTexts.ru.col
    : processTexts[lang]?.exp || processTexts.ru.exp;
};

window.toggleMobileMenu = function () {
  const menu = document.getElementById("mobile-menu");
  const burger = document.querySelector(".burger-btn");
  menu.classList.toggle("active");
  burger.classList.toggle("active");
  if (window.lenis) {
    menu.classList.contains("active")
      ? window.lenis.stop()
      : window.lenis.start();
  }
};

window.closeModal = function (id) {
  const modal = document.getElementById("modal-" + id);
  if (modal) {
    modal.classList.remove("active");
    if (window.lenis) window.lenis.start();
  }
};

window.openProdModal = function (id) {
  const modal = document.getElementById("pm-" + id);
  if (modal) {
    modal.classList.add("active");
    if (window.lenis) window.lenis.stop();
  }
};

window.closeProdModal = function (id) {
  const modal = document.getElementById("pm-" + id);
  if (modal) {
    modal.classList.remove("active");
    if (window.lenis) window.lenis.start();
  }
};

window.switchToMarketplace = function (prodId) {
  closeProdModal(prodId);
  setTimeout(function () {
    openMarketplaceModal(prodId);
  }, 300);
};

window.toggleBuyDropdown = function (btn) {
  const wrapper = btn.closest(".buy-wrapper");
  const dd = wrapper.querySelector(".buy-dropdown");
  document.querySelectorAll(".buy-dropdown").forEach((el) => {
    if (el !== dd) el.classList.remove("active");
  });
  dd.classList.toggle("active");
};

window.currentTraceIndex = 0;

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

function applyPhoneMask(input) {
  let val = input.value.replace(/\D/g, "");
  if (!val) {
    input.value = "";
    return;
  }
  if (val[0] === "7" || val[0] === "8") val = val.substring(1);
  let res = "+7 ";
  if (val.length > 0) res += "(" + val.substring(0, 3);
  if (val.length >= 4) res += ") " + val.substring(3, 6);
  if (val.length >= 7) res += "-" + val.substring(6, 8);
  if (val.length >= 9) res += "-" + val.substring(8, 10);
  input.value = res;
}

document.addEventListener("input", function (e) {
  if (e.target.classList.contains("dynamic-contact-input")) {
    const mask = e.target.getAttribute("data-mask");
    const val = e.target.value;
    if (mask === "phone") {
      applyPhoneMask(e.target);
    } else if (mask === "tg") {
      if (val.startsWith("+")) {
        applyPhoneMask(e.target);
      } else if (/[a-zA-Z]/.test(val) && !val.startsWith("@")) {
        e.target.value = "@" + val;
      }
    }
  }
});

window.updateContactInput = function (radio) {
  const form = radio.closest("form");
  if (!form) return;
  const input = form.querySelector(".dynamic-contact-input");
  const label = form.querySelector(".dynamic-contact-label");
  const errorMsg = form.querySelector(".dynamic-error-msg");
  if (!input || !label || !errorMsg) return;

  const lang = document.documentElement.lang || "ru";
  const dict = dynamicTexts[lang] || dynamicTexts["ru"];

  input.value = "";
  input.classList.remove("has-error");

  if (radio.value === "WhatsApp") {
    label.innerText = dict.wLbl;
    input.type = "tel";
    input.placeholder = dict.wPlh;
    input.setAttribute("data-mask", "phone");
    errorMsg.innerText = dict.wErr;
  } else if (radio.value === "Telegram") {
    label.innerText = dict.tLbl;
    input.type = "text";
    input.placeholder = dict.tPlh;
    input.setAttribute("data-mask", "tg");
    errorMsg.innerText = dict.tErr;
  } else if (radio.value === "Email") {
    label.innerText = dict.eLbl;
    input.type = "email";
    input.placeholder = dict.ePlh;
    input.removeAttribute("data-mask");
    errorMsg.innerText = dict.eErr;
  }
};

window.toggleFaq = function (btn) {
  const item = btn.parentElement;
  const content = item.querySelector(".faq-content");
  const inner = item.querySelector(".faq-inner");
  const isActive = item.classList.contains("active");
  document.querySelectorAll(".faq-item").forEach((i) => {
    i.classList.remove("active");
    i.querySelector(".faq-content").style.maxHeight = null;
  });
  if (!isActive) {
    item.classList.add("active");
    content.style.maxHeight = inner.offsetHeight + "px";
  }
};

document.addEventListener("DOMContentLoaded", () => {
  window.lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
  });

  function raf(time) {
    window.lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  const setupVideoTransition = (introId, loopId) => {
    const introVideo = document.getElementById(introId);
    const loopVideo = document.getElementById(loopId);

    if (introVideo && loopVideo) {
      introVideo.addEventListener("ended", () => {
        loopVideo.play();
        introVideo.style.display = "none";
      });
    }
  };

  setupVideoTransition("desk-intro", "desk-loop");
  setupVideoTransition("mob-intro", "mob-loop");

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId !== "#") {
        const targetElement = document.querySelector(targetId);
        if (targetElement && window.lenis) {
          e.preventDefault();
          window.lenis.scrollTo(targetElement, { offset: -110 });
          const menu = document.getElementById("mobile-menu");
          if (menu && menu.classList.contains("active")) {
            toggleMobileMenu();
          }
        }
      }
    });
  });

  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    let mm = gsap.matchMedia();
    const header = document.getElementById("sect-header");
    ScrollTrigger.create({
      trigger: "#sect-benefits",
      start: "bottom bottom",
      onEnter: () => header.classList.add("scrolled"),
      onLeaveBack: () => header.classList.remove("scrolled"),
    });
    gsap.fromTo(
      ".anim-trace",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: { trigger: "#sect-trace", start: "top 80%" },
      },
    );
    gsap.to(".parallax-img", {
      yPercent: 20,
      ease: "none",
      scrollTrigger: {
        trigger: "#sect-parallax",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
    mm.add("(min-width: 1025px)", () => {
      gsap.to(".hero-content", {
        y: -100,
        opacity: 0,
        scrollTrigger: {
          trigger: "#sect-benefits",
          start: "top 55%",
          end: "top 15%",
          scrub: 1,
        },
      });
      gsap.fromTo(
        ".phil-bg-desktop",
        { y: "-15%" },
        {
          y: "15%",
          ease: "none",
          scrollTrigger: {
            trigger: "#sect-philosophy",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
      const philTl = gsap.timeline({
        scrollTrigger: { trigger: "#sect-philosophy", start: "top 60%" },
      });
      philTl
        .fromTo(
          ".phil-box",
          { opacity: 0, x: 50 },
          { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" },
        )
        .fromTo(
          ".phil-item",
          { opacity: 0, x: 20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out",
          },
          "-=0.3",
        );
    });
    mm.add("(max-width: 1024px)", () => {
      gsap.fromTo(
        [".phil-title-anim", ".phil-text-anim", ".phil-item"],
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: { trigger: ".phil-box", start: "top 80%" },
        },
      );
    });
  }

  const track = document.getElementById("traceTrack");
  const dotsContainer = document.getElementById("traceDots");
  const slides = document.querySelectorAll(".trace-slide");
  const totalSlides = slides.length;

  if (totalSlides > 0 && dotsContainer) {
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement("div");
      dot.classList.add("dot");
      if (i === 0) dot.classList.add("active");
      dot.setAttribute("onclick", `setTraceSlide(${i})`);
      dotsContainer.appendChild(dot);
    }
  }

  if (totalSlides <= 1) {
    const navEl = document.querySelector(".carousel-nav");
    if (navEl) navEl.style.display = "none";
  }

  window.updateTraceCarousel = function () {
    if (!track) return;
    track.style.transform = `translateX(-${window.currentTraceIndex * 100}%)`;
    if (!dotsContainer) return;
    const dots = dotsContainer.children;
    for (let i = 0; i < dots.length; i++) {
      dots[i].classList.remove("active");
    }
    if (dots[window.currentTraceIndex]) {
      dots[window.currentTraceIndex].classList.add("active");
    }
  };

  window.moveTraceSlide = function (direction) {
    if (totalSlides <= 1) return;
    window.currentTraceIndex += direction;
    if (window.currentTraceIndex < 0)
      window.currentTraceIndex = totalSlides - 1;
    if (window.currentTraceIndex >= totalSlides) window.currentTraceIndex = 0;
    updateTraceCarousel();
  };

  window.setTraceSlide = function (index) {
    if (totalSlides <= 1) return;
    window.currentTraceIndex = index;
    updateTraceCarousel();
  };

  const smartForms = document.querySelectorAll(".smart-form");
  smartForms.forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let hasError = false;
      const statusBox = form.querySelector(".form-status-box");
      const submitBtn = form.querySelector(".btn-submit");
      const btnText = submitBtn ? submitBtn.querySelector(".btn-text") : null;
      const btnLoader = submitBtn
        ? submitBtn.querySelector(".btn-loader")
        : null;

      if (statusBox) {
        statusBox.className = "form-status-box";
        statusBox.innerText = "";
      }

      form.querySelectorAll("[required]").forEach((input) => {
        let isInvalid = false;
        const val = input.value.trim();

        if (!val) {
          isInvalid = true;
        } else if (input.classList.contains("dynamic-contact-input")) {
          const commType = form.querySelector(
            'input[name="comm"]:checked',
          ).value;
          if (commType === "Email" && !isValidEmail(val)) isInvalid = true;
          if (commType === "WhatsApp" && val.replace(/\D/g, "").length < 11)
            isInvalid = true;
          if (commType === "Telegram") {
            if (val.startsWith("+") && val.replace(/\D/g, "").length < 11)
              isInvalid = true;
            if (!val.startsWith("+") && val.length < 2) isInvalid = true;
          }
        } else if (input.type === "email" && !isValidEmail(val)) {
          isInvalid = true;
        }

        if (isInvalid) {
          input.classList.add("has-error", "shake");
          setTimeout(() => input.classList.remove("shake"), 400);
          hasError = true;
        } else {
          input.classList.remove("has-error");
        }
      });

      if (hasError) return;

      if (submitBtn) submitBtn.disabled = true;
      if (btnText) btnText.style.display = "none";
      if (btnLoader) btnLoader.style.display = "inline-block";

      try {
        const formData = new FormData(form);
        const response = await fetch("mailer.php", {
          method: "POST",
          body: formData,
        });
        const result = await response.json();

        if (result.status === "success") {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({ event: "form_success" });
          if (statusBox) {
            const lang = document.documentElement.lang || "ru";
            const successMsg =
              lang === "en"
                ? "Successfully sent! We will contact you soon."
                : lang === "kz"
                  ? "Сәтті жіберілді! Жақында хабарласамыз."
                  : "Заявка успешно отправлена! Скоро свяжемся.";
            statusBox.innerText = successMsg;
            statusBox.classList.add("success");
          }
          form.reset();
          const radioWatsapp = form.querySelector(
            'input[name="comm"][value="WhatsApp"]',
          );
          if (radioWatsapp) {
            radioWatsapp.checked = true;
            updateContactInput(radioWatsapp);
          }
          if (
            form.id === "contactModalForm" ||
            form.id === "contactFormBlock"
          ) {
            setTimeout(() => {
              closeModal("contact");
              if (statusBox) statusBox.className = "form-status-box";
            }, 2500);
          }
        } else {
          if (statusBox) {
            statusBox.innerText =
              result.message || "Ошибка сервера при отправке.";
            statusBox.classList.add("error");
          }
        }
      } catch (error) {
        if (statusBox) {
          const lang = document.documentElement.lang || "ru";
          const networkErr =
            lang === "en"
              ? "Network error. Please try again later."
              : lang === "kz"
                ? "Желі қатесі. Кейінірек қайталап көріңіз."
                : "Ошибка сети. Проверьте подключение и попробуйте позже.";
          statusBox.innerText = networkErr;
          statusBox.classList.add("error");
        }
      } finally {
        if (submitBtn) submitBtn.disabled = false;
        if (btnText) btnText.style.display = "inline-block";
        if (btnLoader) btnLoader.style.display = "none";
      }
    });
    form.addEventListener("input", (e) => {
      if (e.target.classList.contains("has-error")) {
        e.target.classList.remove("has-error");
      }
    });
  });
});
