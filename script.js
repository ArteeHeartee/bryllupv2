const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const navigation = document.querySelector("[data-navigation]");

const navLinks = [
  ...document.querySelectorAll(".main-navigation a")
];

const heroBackground = document.querySelector(
  ".hero-background"
);


/*
  Endrer menyen når brukeren scroller.
*/

const updateHeader = () => {
  if (!header) {
    return;
  }

  header.classList.toggle(
    "scrolled",
    window.scrollY > 40
  );
};


/*
  Lukker mobilmenyen.
*/

const closeMenu = () => {
  if (!menuToggle || !navigation) {
    return;
  }

  menuToggle.setAttribute(
    "aria-expanded",
    "false"
  );

  navigation.classList.remove("open");
  document.body.classList.remove("menu-open");
};


/*
  Åpner og lukker mobilmenyen.
*/

if (menuToggle && navigation) {
  menuToggle.addEventListener("click", () => {

    const isOpen =
      menuToggle.getAttribute("aria-expanded") ===
      "true";

    menuToggle.setAttribute(
      "aria-expanded",
      String(!isOpen)
    );

    navigation.classList.toggle(
      "open",
      !isOpen
    );

    document.body.classList.toggle(
      "menu-open",
      !isOpen
    );
  });
}


/*
  Lukker mobilmenyen når et menypunkt trykkes.
*/

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});


/*
  Header og parallax ved scrolling.
*/

window.addEventListener(
  "scroll",
  () => {

    updateHeader();

    if (
      heroBackground &&
      window.innerWidth > 900
    ) {
      const offset = Math.min(
        window.scrollY * 0.16,
        90
      );

      heroBackground.style.transform =
        `translateY(${offset}px) scale(1.025)`;
    }

  },
  {
    passive: true
  }
);


/*
  Markerer riktig menypunkt
  basert på hvilken seksjon som vises.
*/

const sections = [
  ...document.querySelectorAll(
    "main section[id]"
  )
];

if ("IntersectionObserver" in window) {

  const observer = new IntersectionObserver(
    (entries) => {

      entries.forEach((entry) => {

        if (!entry.isIntersecting) {
          return;
        }

        navLinks.forEach((link) => {

          const linkTarget =
            link.getAttribute("href");

          const sectionTarget =
            `#${entry.target.id}`;

          link.classList.toggle(
            "active",
            linkTarget === sectionTarget
          );

        });

      });

    },
    {
      rootMargin: "-40% 0px -50% 0px",
      threshold: 0
    }
  );

  sections.forEach((section) => {
    observer.observe(section);
  });
}


/*
  Sørger for at headeren har riktig
  utseende allerede ved innlasting.
*/

updateHeader();
