const body =
  document.body;

const header =
  document.querySelector(
    "[data-header]"
  );

const openInvitationButton =
  document.querySelector(
    "[data-open-invitation]"
  );

const reopenInvitationButton =
  document.querySelector(
    "[data-reopen-invitation]"
  );

const menuToggle =
  document.querySelector(
    "[data-menu-toggle]"
  );

const navigation =
  document.querySelector(
    "[data-navigation]"
  );

const navLinks = [
  ...document.querySelectorAll(
    ".main-navigation a"
  )
];

const quickLinks = [
  ...document.querySelectorAll(
    ".header-quick-navigation a"
  )
];

const RSVP_ENDPOINT =
  "DIN_BACKEND_ADRESSE_KOMMER_HER";


/*
  INVITASJON
*/

const openInvitation = () => {

  body.classList.remove(
    "invitation-closed"
  );

  body.classList.add(
    "invitation-open"
  );

};


const closeInvitation = () => {

  closeMenu();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });


  window.setTimeout(() => {

    body.classList.remove(
      "invitation-open"
    );

    body.classList.add(
      "invitation-closed"
    );

  }, 350);

};


if (openInvitationButton) {

  openInvitationButton.addEventListener(
    "click",
    openInvitation
  );

}


if (reopenInvitationButton) {

  reopenInvitationButton.addEventListener(
    "click",
    closeInvitation
  );

}


/*
  HEADER
*/

const updateHeader = () => {

  if (!header) {
    return;
  }

  header.classList.toggle(
    "scrolled",
    window.scrollY > 30
  );

};


window.addEventListener(
  "scroll",
  updateHeader,
  {
    passive: true
  }
);


/*
  MOBILMENY
*/

function closeMenu() {

  if (!menuToggle || !navigation) {
    return;
  }

  menuToggle.setAttribute(
    "aria-expanded",
    "false"
  );

  navigation.classList.remove(
    "open"
  );

  body.classList.remove(
    "menu-open"
  );

}


if (menuToggle && navigation) {

  menuToggle.addEventListener(
    "click",
    () => {

      const isOpen =
        menuToggle.getAttribute(
          "aria-expanded"
        ) === "true";

      menuToggle.setAttribute(
        "aria-expanded",
        String(!isOpen)
      );

      navigation.classList.toggle(
        "open",
        !isOpen
      );

      body.classList.toggle(
        "menu-open",
        !isOpen
      );

    }
  );

}


navLinks.forEach((link) => {

  link.addEventListener(
    "click",
    closeMenu
  );

});


window.addEventListener(
  "resize",
  () => {

    if (window.innerWidth > 760) {
      closeMenu();
    }

  }
);


/*
  KORREKT SCROLLPLASSERING

  Vi beregner headerens faktiske høyde,
  slik at seksjonene alltid havner rett
  under toppbaren.
*/

const getHeaderOffset = () => {

  if (!header) {
    return 0;
  }

  return header.getBoundingClientRect().height;

};


const scrollToSection = (target) => {

  if (!target) {
    return;
  }

  const targetPosition =
    target.getBoundingClientRect().top +
    window.scrollY -
    getHeaderOffset();

  window.scrollTo({
    top: Math.max(targetPosition, 0),
    behavior: "smooth"
  });

};


const internalJumpLinks = [
  ...document.querySelectorAll(
    'a[href^="#"]'
  )
];


internalJumpLinks.forEach((link) => {

  link.addEventListener(
    "click",
    (event) => {

      const href =
        link.getAttribute("href");


      if (
        !href ||
        href === "#"
      ) {
        return;
      }


      const target =
        document.querySelector(href);


      if (!target) {
        return;
      }


      event.preventDefault();

      closeMenu();

      scrollToSection(target);


      if (
        window.history &&
        window.history.replaceState
      ) {

        window.history.replaceState(
          null,
          "",
          href
        );

      }

    }
  );

});


/*
  AKTIV NAVIGASJON
*/

const navigationSections = [
  ...document.querySelectorAll(
    "main section[id]"
  )
];


const setActiveNavigation = (
  sectionId
) => {

  const allLinks = [
    ...navLinks,
    ...quickLinks
  ];


  allLinks.forEach((link) => {

    const isActive =
      link.getAttribute("href") ===
      `#${sectionId}`;

    link.classList.toggle(
      "active",
      isActive
    );

  });

};


const updateActiveSection = () => {

  const headerOffset =
    getHeaderOffset();

  const referencePoint =
    window.scrollY +
    headerOffset +
    window.innerHeight * .22;

  let currentSection =
    navigationSections[0];


  navigationSections.forEach(
    (section) => {

      if (
        section.offsetTop <=
        referencePoint
      ) {

        currentSection = section;

      }

    }
  );


  if (currentSection) {

    setActiveNavigation(
      currentSection.id
    );

  }

};


window.addEventListener(
  "scroll",
  updateActiveSection,
  {
    passive: true
  }
);


window.addEventListener(
  "resize",
  updateActiveSection
);


/*
  NEDTELLING
*/
const daysElement =
  document.querySelector(
    "[data-days]"
  );

const hoursElement =
  document.querySelector(
    "[data-hours]"
  );

const minutesElement =
  document.querySelector(
    "[data-minutes]"
  );

const secondsElement =
  document.querySelector(
    "[data-seconds]"
  );


const weddingDate =
  new Date(
    "2027-09-18T13:30:00+02:00"
  );


const padNumber = (
  number,
  length = 2
) => {

  return String(number).padStart(
    length,
    "0"
  );

};


const updateCountdown = () => {

  if (
    !daysElement ||
    !hoursElement ||
    !minutesElement ||
    !secondsElement
  ) {
    return;
  }


  const difference =
    weddingDate.getTime() -
    Date.now();


  if (difference <= 0) {

    daysElement.textContent = "000";
    hoursElement.textContent = "00";
    minutesElement.textContent = "00";
    secondsElement.textContent = "00";

    return;
  }


  const totalSeconds =
    Math.floor(
      difference / 1000
    );


  const days =
    Math.floor(
      totalSeconds / 86400
    );


  const hours =
    Math.floor(
      (
        totalSeconds %
        86400
      ) /
      3600
    );


  const minutes =
    Math.floor(
      (
        totalSeconds %
        3600
      ) /
      60
    );


  const seconds =
    totalSeconds % 60;


  daysElement.textContent =
    padNumber(days, 3);

  hoursElement.textContent =
    padNumber(hours);

  minutesElement.textContent =
    padNumber(minutes);

  secondsElement.textContent =
    padNumber(seconds);

};


updateCountdown();


window.setInterval(
  updateCountdown,
  1000
);


/*
  SCROLLANIMASJONER
*/

const revealElements = [
  ...document.querySelectorAll(
    ".reveal"
  )
];


if ("IntersectionObserver" in window) {

  const revealObserver =
    new IntersectionObserver(
      (entries, observer) => {

        entries.forEach((entry) => {

          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add(
            "visible"
          );

          observer.unobserve(
            entry.target
          );

        });

      },
      {
        threshold: .08
      }
    );


  revealElements.forEach(
    (element) => {

      revealObserver.observe(
        element
      );

    }
  );

} else {

  revealElements.forEach(
    (element) => {

      element.classList.add(
        "visible"
      );

    }
  );

}


/*
  GAVEKNAPP
*/

const giftLink =
  document.querySelector(
    "[data-gift-link]"
  );


if (giftLink) {

  giftLink.addEventListener(
    "click",
    (event) => {

      if (
        giftLink.classList.contains(
          "disabled-link"
        )
      ) {

        event.preventDefault();

      }

    }
  );

}


/*
  RSVP POPUP
*/

const rsvpModal =
  document.querySelector(
    "[data-rsvp-modal]"
  );

const openRsvpButton =
  document.querySelector(
    "[data-open-rsvp]"
  );

const closeRsvpButtons = [
  ...document.querySelectorAll(
    "[data-close-rsvp]"
  )
];


const openRsvpModal = () => {

  if (!rsvpModal) {
    return;
  }

  rsvpModal.classList.add(
    "open"
  );

  rsvpModal.setAttribute(
    "aria-hidden",
    "false"
  );

  body.classList.add(
    "modal-open"
  );


  window.setTimeout(() => {

    const firstField =
      rsvpModal.querySelector(
        "input, textarea"
      );

    if (firstField) {
      firstField.focus();
    }

  }, 350);

};


const closeRsvpModal = () => {

  if (!rsvpModal) {
    return;
  }

  rsvpModal.classList.remove(
    "open"
  );

  rsvpModal.setAttribute(
    "aria-hidden",
    "true"
  );

  body.classList.remove(
    "modal-open"
  );


  if (openRsvpButton) {
    openRsvpButton.focus();
  }

};


if (openRsvpButton) {

  openRsvpButton.addEventListener(
    "click",
    openRsvpModal
  );

}


closeRsvpButtons.forEach(
  (button) => {

    button.addEventListener(
      "click",
      closeRsvpModal
    );

  }
);


document.addEventListener(
  "keydown",
  (event) => {

    if (event.key !== "Escape") {
      return;
    }

    closeMenu();
    closeRsvpModal();

  }
);


/*
  RSVP-SKJEMA
*/
const rsvpForm =
  document.querySelector(
    "[data-rsvp-form]"
  );

const formStatus =
  document.querySelector(
    "[data-form-status]"
  );


const setFormStatus = (
  message,
  type = ""
) => {

  if (!formStatus) {
    return;
  }

  formStatus.textContent =
    message;

  formStatus.className =
    "form-status";

  if (type) {

    formStatus.classList.add(
      type
    );

  }

};


const formDataToObject = (
  formData
) => {

  const result = {};


  formData.forEach(
    (value, key) => {

      result[key] = value;

    }
  );


  return result;

};


if (rsvpForm) {

  rsvpForm.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();


      if (!rsvpForm.checkValidity()) {

        rsvpForm.reportValidity();

        return;

      }


      const submitButton =
        rsvpForm.querySelector(
          ".form-submit"
        );


      const formData =
        new FormData(rsvpForm);


      const payload =
        formDataToObject(formData);


      payload.submittedAt =
        new Date().toISOString();


      if (
        RSVP_ENDPOINT ===
        "DIN_BACKEND_ADRESSE_KOMMER_HER"
      ) {

        console.table(payload);

        setFormStatus(
          "Skjemaet fungerer, men står foreløpig i testmodus. Svaret er derfor ikke sendt ennå.",
          "error"
        );

        return;

      }


      try {

        submitButton.disabled =
          true;

        submitButton.textContent =
          "Sender …";

        setFormStatus(
          "Sender svaret …"
        );


        const response =
          await fetch(
            RSVP_ENDPOINT,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body:
                JSON.stringify(payload)
            }
          );


        if (!response.ok) {

          throw new Error(
            `Serveren svarte med status ${response.status}`
          );

        }


        setFormStatus(
          "Tusen takk! Svaret deres er registrert.",
          "success"
        );


        rsvpForm.reset();


        window.setTimeout(
          closeRsvpModal,
          2500
        );

      } catch (error) {

        console.error(
          "RSVP-feil:",
          error
        );


        setFormStatus(
          "Vi klarte ikke å sende svaret. Prøv igjen, eller ta kontakt med Pernille eller Andreas.",
          "error"
        );

      } finally {

        submitButton.disabled =
          false;

        submitButton.textContent =
          "Send svar";

      }

    }
  );

}


updateHeader();
updateActiveSection();


/*
  GLIDENDE AKTIV MARKØR I HURTIGMENYEN
*/

const quickNavigation =
  document.querySelector(
    "[data-quick-navigation]"
  );

let activeMarker = null;


const createActiveMarker = () => {

  if (!quickNavigation) {
    return;
  }

  activeMarker =
    document.createElement("span");

  activeMarker.className =
    "header-active-marker";

  activeMarker.setAttribute(
    "aria-hidden",
    "true"
  );

  quickNavigation.prepend(
    activeMarker
  );

};


const moveActiveMarker = () => {

  if (
    !quickNavigation ||
    !activeMarker
  ) {
    return;
  }

  const activeLink =
    quickNavigation.querySelector(
      "a.active"
    );

  if (!activeLink) {

    activeMarker.style.opacity = "0";

    return;
  }

  const navigationRectangle =
    quickNavigation.getBoundingClientRect();

  const linkRectangle =
    activeLink.getBoundingClientRect();

  const markerX =
    linkRectangle.left -
    navigationRectangle.left +
    (
      linkRectangle.width -
      activeMarker.offsetWidth
    ) /
    2;

  activeMarker.style.opacity = "1";

  activeMarker.style.transform =
    `translate3d(${markerX}px, -50%, 0)`;

};


createActiveMarker();


window.setTimeout(
  moveActiveMarker,
  100
);


window.addEventListener(
  "resize",
  moveActiveMarker
);


/*
  Den eksisterende setActiveNavigation-funksjonen
  endrer active-klassen. Denne observatøren oppdager
  endringen og flytter markøren automatisk.
*/

if (quickNavigation) {

  const navigationMarkerObserver =
    new MutationObserver(
      moveActiveMarker
    );

  navigationMarkerObserver.observe(
    quickNavigation,
    {
      subtree: true,
      attributes: true,
      attributeFilter: [
        "class"
      ]
    }
  );

}
/*
  ==================================================
  DESKTOP: SIDEVISNING UTEN VERTIKAL SCROLLING
  ==================================================
*/

const desktopPageMedia =
  window.matchMedia("(min-width: 761px)");

const desktopPageIds = [
  "invitasjon",
  "historien",
  "program",
  "praktisk",
  "gaveonsker",
  "rsvp"
];

let activeDesktopPageId =
  "invitasjon";

let desktopPageTransitionTimer =
  null;


const getDesktopPage = (
  pageId
) => {

  return document.getElementById(
    pageId
  );

};


const getDesktopPageIndex = (
  pageId
) => {

  return desktopPageIds.indexOf(
    pageId
  );

};


const cleanDesktopHash = (
  hash
) => {

  const pageId =
    String(hash || "")
      .replace(/^#/, "");

  if (
    desktopPageIds.includes(pageId)
  ) {
    return pageId;
  }

  return "invitasjon";

};


const updateDesktopPageClasses = (
  activePageId
) => {

  const activeIndex =
    getDesktopPageIndex(
      activePageId
    );

  desktopPageIds.forEach(
    (pageId, pageIndex) => {

      const page =
        getDesktopPage(pageId);

      if (!page) {
        return;
      }

      page.classList.remove(
        "desktop-page-active",
        "desktop-page-before",
        "desktop-page-after"
      );

      page.setAttribute(
        "aria-hidden",
        pageId === activePageId
          ? "false"
          : "true"
      );

      if (
        pageId === activePageId
      ) {

        page.classList.add(
          "desktop-page-active"
        );

      } else if (
        pageIndex < activeIndex
      ) {

        page.classList.add(
          "desktop-page-before"
        );

      } else {

        page.classList.add(
          "desktop-page-after"
        );

      }

    }
  );

};


const showDesktopPage = (
  pageId,
  options = {}
) => {

  if (!desktopPageMedia.matches) {
    return;
  }

  const {
    updateHash = true,
    animate = true
  } = options;

  const nextPageId =
    cleanDesktopHash(pageId);

  const nextPage =
    getDesktopPage(nextPageId);

  if (!nextPage) {
    return;
  }

  if (
    nextPageId !== "invitasjon" &&
    body.classList.contains(
      "invitation-closed"
    )
  ) {

    openInvitation();

  }

  if (
    desktopPageTransitionTimer
  ) {

    window.clearTimeout(
      desktopPageTransitionTimer
    );

  }

  if (!animate) {

    body.classList.add(
      "desktop-page-no-animation"
    );

  }

  body.classList.add(
    "desktop-page-mode"
  );

  activeDesktopPageId =
    nextPageId;

  updateDesktopPageClasses(
    activeDesktopPageId
  );

  setActiveNavigation(
    activeDesktopPageId
  );

  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "auto"
  });

  if (
    updateHash &&
    window.history &&
    window.history.replaceState
  ) {

    window.history.replaceState(
      null,
      "",
      `#${activeDesktopPageId}`
    );

  }

  if (!animate) {

    desktopPageTransitionTimer =
      window.setTimeout(
        () => {

          body.classList.remove(
            "desktop-page-no-animation"
          );

        },
        40
      );

  }

};


const initializeDesktopPages = () => {

  if (!desktopPageMedia.matches) {

    body.classList.remove(
      "desktop-page-mode",
      "desktop-page-no-animation"
    );

    desktopPageIds.forEach(
      (pageId) => {

        const page =
          getDesktopPage(pageId);

        if (!page) {
          return;
        }

        page.classList.remove(
          "desktop-page-active",
          "desktop-page-before",
          "desktop-page-after"
        );

        page.removeAttribute(
          "aria-hidden"
        );

      }
    );

    return;
  }

  const initialPageId =
    body.classList.contains(
      "invitation-closed"
    )
      ? "invitasjon"
      : cleanDesktopHash(
          window.location.hash
        );

  showDesktopPage(
    initialPageId,
    {
      updateHash: false,
      animate: false
    }
  );

};


document.addEventListener(
  "click",
  (event) => {

    if (!desktopPageMedia.matches) {
      return;
    }

    const link =
      event.target.closest(
        'a[href^="#"]'
      );

    if (!link) {
      return;
    }

    const href =
      link.getAttribute("href");

    const targetPageId =
      cleanDesktopHash(href);

    if (
      !desktopPageIds.includes(
        targetPageId
      )
    ) {
      return;
    }

    event.preventDefault();
    event.stopImmediatePropagation();

    closeMenu();

    showDesktopPage(
      targetPageId
    );

  },
  true
);


if (openInvitationButton) {

  openInvitationButton.addEventListener(
    "click",
    () => {

      if (!desktopPageMedia.matches) {
        return;
      }

      window.setTimeout(
        () => {

          showDesktopPage(
            "invitasjon",
            {
              updateHash: true,
              animate: false
            }
          );

        },
        20
      );

    }
  );

}


if (reopenInvitationButton) {

  reopenInvitationButton.addEventListener(
    "click",
    () => {

      if (!desktopPageMedia.matches) {
        return;
      }

      activeDesktopPageId =
        "invitasjon";

      updateDesktopPageClasses(
        "invitasjon"
      );

      if (
        window.history &&
        window.history.replaceState
      ) {

        window.history.replaceState(
          null,
          "",
          "#invitasjon"
        );

      }

    }
  );

}


window.addEventListener(
  "hashchange",
  () => {

    if (!desktopPageMedia.matches) {
      return;
    }

    showDesktopPage(
      cleanDesktopHash(
        window.location.hash
      ),
      {
        updateHash: false
      }
    );

  }
);


desktopPageMedia.addEventListener(
  "change",
  initializeDesktopPages
);


initializeDesktopPages();
/*
  ==================================================
  DESKTOP: BLA DIREKTE PÅ DET AKTIVE KORTET
  ==================================================
*/

const createDesktopPageControls = () => {

  const existingControls =
    document.querySelector(
      "[data-desktop-page-controls]"
    );

  if (existingControls) {
    existingControls.remove();
  }


  const controls =
    document.createElement("div");

  controls.className =
    "desktop-page-controls";

  controls.setAttribute(
    "data-desktop-page-controls",
    ""
  );

  controls.setAttribute(
    "aria-label",
    "Bla mellom sidene"
  );


  const previousButton =
    document.createElement("button");

  previousButton.type = "button";

  previousButton.className =
    "desktop-page-control desktop-page-control-previous";

  previousButton.setAttribute(
    "aria-label",
    "Forrige side"
  );

  previousButton.innerHTML = `
    <span
      class="desktop-page-control-arrow"
      aria-hidden="true"
    >
      ←
    </span>

    <span class="desktop-page-control-label">
      Forrige
    </span>
  `;


  const nextButton =
    document.createElement("button");

  nextButton.type = "button";

  nextButton.className =
    "desktop-page-control desktop-page-control-next";

  nextButton.setAttribute(
    "aria-label",
    "Neste side"
  );

  nextButton.innerHTML = `
    <span class="desktop-page-control-label">
      Neste
    </span>

    <span
      class="desktop-page-control-arrow"
      aria-hidden="true"
    >
      →
    </span>
  `;


  controls.append(
    previousButton,
    nextButton
  );


  const getDesktopControlsHost = (
    pageId
  ) => {

    const page =
      getDesktopPage(pageId);

    if (!page) {
      return null;
    }

    if (pageId === "invitasjon") {

      return page.querySelector(
        ".invitation-interior"
      );

    }

    return page;

  };


  const mountDesktopControls = () => {

    if (!desktopPageMedia.matches) {
      return;
    }

    const host =
      getDesktopControlsHost(
        activeDesktopPageId
      );

    if (!host) {
      return;
    }

    if (controls.parentElement !== host) {

      host.appendChild(controls);

    }

  };


  const updateDesktopPageControls = () => {

    if (!desktopPageMedia.matches) {
      return;
    }

    mountDesktopControls();


    const currentIndex =
      getDesktopPageIndex(
        activeDesktopPageId
      );

    const hasPrevious =
      currentIndex > 0;

    const hasNext =
      currentIndex <
      desktopPageIds.length - 1;


    previousButton.disabled =
      !hasPrevious;

    nextButton.disabled =
      !hasNext;


    previousButton.setAttribute(
      "aria-hidden",
      String(!hasPrevious)
    );

    nextButton.setAttribute(
      "aria-hidden",
      String(!hasNext)
    );


    body.classList.remove(
      "desktop-page-hover-previous",
      "desktop-page-hover-next"
    );

  };


  const moveDesktopPage = (
    direction
  ) => {

    if (!desktopPageMedia.matches) {
      return;
    }

    const currentIndex =
      getDesktopPageIndex(
        activeDesktopPageId
      );

    const nextIndex =
      currentIndex + direction;


    if (
      nextIndex < 0 ||
      nextIndex >= desktopPageIds.length
    ) {
      return;
    }


    showDesktopPage(
      desktopPageIds[nextIndex]
    );


    window.requestAnimationFrame(
      updateDesktopPageControls
    );

  };


  previousButton.addEventListener(
    "click",
    (event) => {

      event.preventDefault();
      event.stopPropagation();

      moveDesktopPage(-1);

    }
  );


  nextButton.addEventListener(
    "click",
    (event) => {

      event.preventDefault();
      event.stopPropagation();

      moveDesktopPage(1);

    }
  );


  previousButton.addEventListener(
    "mouseenter",
    () => {

      if (previousButton.disabled) {
        return;
      }

      body.classList.add(
        "desktop-page-hover-previous"
      );

    }
  );


  previousButton.addEventListener(
    "mouseleave",
    () => {

      body.classList.remove(
        "desktop-page-hover-previous"
      );

    }
  );


  nextButton.addEventListener(
    "mouseenter",
    () => {

      if (nextButton.disabled) {
        return;
      }

      body.classList.add(
        "desktop-page-hover-next"
      );

    }
  );


  nextButton.addEventListener(
    "mouseleave",
    () => {

      body.classList.remove(
        "desktop-page-hover-next"
      );

    }
  );


  document.addEventListener(
    "keydown",
    (event) => {

      if (
        !desktopPageMedia.matches ||
        body.classList.contains(
          "modal-open"
        ) ||
        body.classList.contains(
          "menu-open"
        )
      ) {
        return;
      }


      if (event.key === "ArrowLeft") {

        event.preventDefault();

        moveDesktopPage(-1);

      }


      if (event.key === "ArrowRight") {

        event.preventDefault();

        moveDesktopPage(1);

      }

    }
  );


  const desktopPageObserver =
    new MutationObserver(
      updateDesktopPageControls
    );


  desktopPageIds.forEach(
    (pageId) => {

      const page =
        getDesktopPage(pageId);

      if (!page) {
        return;
      }

      desktopPageObserver.observe(
        page,
        {
          attributes: true,
          attributeFilter: [
            "class"
          ]
        }
      );

    }
  );


  desktopPageMedia.addEventListener(
    "change",
    () => {

      if (!desktopPageMedia.matches) {

        controls.remove();

        return;

      }

      updateDesktopPageControls();

    }
  );


  updateDesktopPageControls();

};


createDesktopPageControls();
/*
  ==================================================
  DESKTOP: BYTT SIDE MED MUSEHJULET
  ==================================================
*/

let desktopWheelAccumulator = 0;
let desktopWheelLocked = false;
let desktopWheelResetTimer = null;


const handleDesktopWheel = (event) => {

  if (
    !desktopPageMedia.matches ||
    !body.classList.contains(
      "desktop-page-mode"
    ) ||
    body.classList.contains(
      "invitation-closed"
    ) ||
    body.classList.contains(
      "modal-open"
    ) ||
    body.classList.contains(
      "menu-open"
    )
  ) {
    return;
  }


  const interactiveArea =
    event.target.closest(
      [
        ".modal-panel",
        "input",
        "textarea",
        "select"
      ].join(",")
    );


  if (interactiveArea) {
    return;
  }


  event.preventDefault();


  if (desktopWheelLocked) {
    return;
  }


  desktopWheelAccumulator +=
    event.deltaY;


  if (desktopWheelResetTimer) {

    window.clearTimeout(
      desktopWheelResetTimer
    );

  }


  desktopWheelResetTimer =
    window.setTimeout(
      () => {

        desktopWheelAccumulator = 0;

      },
      160
    );


  if (
    Math.abs(
      desktopWheelAccumulator
    ) < 55
  ) {
    return;
  }


  const currentIndex =
    getDesktopPageIndex(
      activeDesktopPageId
    );


  const direction =
    desktopWheelAccumulator > 0
      ? 1
      : -1;


  const nextIndex =
    Math.max(
      0,
      Math.min(
        desktopPageIds.length - 1,
        currentIndex + direction
      )
    );


  desktopWheelAccumulator = 0;


  if (nextIndex === currentIndex) {
    return;
  }


  desktopWheelLocked = true;


  showDesktopPage(
    desktopPageIds[nextIndex]
  );


  window.setTimeout(
    () => {

      desktopWheelLocked = false;

    },
    650
  );

};


document.addEventListener(
  "wheel",
  handleDesktopWheel,
  {
    passive: false
  }
);
/*
  ==================================================
  MOBIL: VERTIKALT BLA MELLOM INVITASJONSSIDENE
  Kun skjermer opptil 760 px.
  ==================================================
*/

const mobilePageMedia =
  window.matchMedia("(max-width: 760px)");

const mobilePageIds = [
  "invitasjon",
  "historien",
  "program",
  "praktisk",
  "gaveonsker",
  "rsvp"
];

let activeMobilePageId =
  "invitasjon";

let mobileSwipePointerId = null;

let mobileSwipeStartX = 0;
let mobileSwipeStartY = 0;
let mobileSwipeCurrentY = 0;
let mobileSwipeStartTime = 0;

let mobileSwipeDirectionLocked = false;
let mobileSwipeIsVertical = false;
let mobileSwipeIsDragging = false;

let mobileSwipeHeight =
  window.innerHeight;


/*
  HENT MOBILSIDE
*/

const getMobilePage = (
  pageId
) => {

  return document.getElementById(
    pageId
  );

};


const getMobilePageIndex = (
  pageId
) => {

  return mobilePageIds.indexOf(
    pageId
  );

};


const cleanMobilePageId = (
  hash
) => {

  const pageId =
    String(hash || "")
      .replace(/^#/, "");

  if (
    mobilePageIds.includes(pageId)
  ) {
    return pageId;
  }

  return "invitasjon";

};


/*
  PLASSERING AV MOBILSIDENE
*/

const setMobilePagePosition = (
  page,
  position,
  dragOffset = 0
) => {

  if (!page) {
    return;
  }

  page.style.setProperty(
    "--mobile-page-position",
    position
  );

  page.style.setProperty(
    "--mobile-drag-offset",
    `${dragOffset}px`
  );

};


const resetMobilePageInlineStyles = () => {

  mobilePageIds.forEach(
    (pageId) => {

      const page =
        getMobilePage(pageId);

      if (!page) {
        return;
      }

      page.style.removeProperty(
        "--mobile-page-position"
      );

      page.style.removeProperty(
        "--mobile-drag-offset"
      );

      page.classList.remove(
        "mobile-page-active",
        "mobile-page-before",
        "mobile-page-after",
        "mobile-page-dragging"
      );

      page.removeAttribute(
        "aria-hidden"
      );

    }
  );

};


const updateMobilePageClasses = (
  activePageId
) => {

  const activeIndex =
    getMobilePageIndex(
      activePageId
    );

  mobilePageIds.forEach(
    (pageId, pageIndex) => {

      const page =
        getMobilePage(pageId);

      if (!page) {
        return;
      }

      page.classList.remove(
        "mobile-page-active",
        "mobile-page-before",
        "mobile-page-after",
        "mobile-page-dragging"
      );

      page.style.removeProperty(
        "--mobile-drag-offset"
      );

      if (
        pageId === activePageId
      ) {

        page.classList.add(
          "mobile-page-active"
        );

        setMobilePagePosition(
          page,
          0
        );

        page.setAttribute(
          "aria-hidden",
          "false"
        );

      } else if (
        pageIndex < activeIndex
      ) {

        page.classList.add(
          "mobile-page-before"
        );

        setMobilePagePosition(
          page,
          -1
        );

        page.setAttribute(
          "aria-hidden",
          "true"
        );

      } else {

        page.classList.add(
          "mobile-page-after"
        );

        setMobilePagePosition(
          page,
          1
        );

        page.setAttribute(
          "aria-hidden",
          "true"
        );

      }

    }
  );

};


/*
  VIS VALGT MOBILSIDE
*/

const showMobilePage = (
  pageId,
  options = {}
) => {

  if (!mobilePageMedia.matches) {
    return;
  }

  const {
    updateHash = true,
    animate = true
  } = options;

  const nextPageId =
    cleanMobilePageId(pageId);

  const nextPage =
    getMobilePage(nextPageId);

  if (!nextPage) {
    return;
  }

  if (
    nextPageId !== "invitasjon" &&
    body.classList.contains(
      "invitation-closed"
    )
  ) {

    openInvitation();

  }

  if (!animate) {

    body.classList.add(
      "mobile-page-no-animation"
    );

  }

  activeMobilePageId =
    nextPageId;

  body.classList.add(
    "mobile-page-mode"
  );

  body.classList.remove(
    "mobile-page-dragging",
    "mobile-page-drag-up",
    "mobile-page-drag-down"
  );

  body.classList.toggle(
    "mobile-page-dark",
    nextPageId === "gaveonsker"
  );

  updateMobilePageClasses(
    activeMobilePageId
  );

  setActiveNavigation(
    activeMobilePageId
  );

  if (
    updateHash &&
    window.history &&
    window.history.replaceState
  ) {

    window.history.replaceState(
      null,
      "",
      `#${activeMobilePageId}`
    );

  }

  if (!animate) {

    window.requestAnimationFrame(
      () => {

        window.requestAnimationFrame(
          () => {

            body.classList.remove(
              "mobile-page-no-animation"
            );

          }
        );

      }
    );

  }

};


/*
  OPPSTART
*/

const initializeMobilePages = () => {

  if (!mobilePageMedia.matches) {

    body.classList.remove(
      "mobile-page-mode",
      "mobile-page-no-animation",
      "mobile-page-dragging",
      "mobile-page-drag-up",
      "mobile-page-drag-down",
      "mobile-page-dark"
    );

    resetMobilePageInlineStyles();

    return;
  }

  mobileSwipeHeight =
    window.innerHeight;

  const initialPageId =
    body.classList.contains(
      "invitation-closed"
    )
      ? "invitasjon"
      : cleanMobilePageId(
          window.location.hash
        );

  showMobilePage(
    initialPageId,
    {
      updateHash: false,
      animate: false
    }
  );

};


/*
  NABOSIDER
*/

const getMobileNeighbourPages = () => {

  const currentIndex =
    getMobilePageIndex(
      activeMobilePageId
    );

  return {
    current:
      getMobilePage(
        activeMobilePageId
      ),

    previous:
      currentIndex > 0
        ? getMobilePage(
            mobilePageIds[
              currentIndex - 1
            ]
          )
        : null,

    next:
      currentIndex <
      mobilePageIds.length - 1
        ? getMobilePage(
            mobilePageIds[
              currentIndex + 1
            ]
          )
        : null
  };

};


/*
  KORTET FØLGER FINGEREN VERTIKALT
*/

const updateMobileDrag = (
  dragOffset
) => {

  const {
    current,
    previous,
    next
  } = getMobileNeighbourPages();

  if (!current) {
    return;
  }

  const limitedOffset =
    Math.max(
      -mobileSwipeHeight,
      Math.min(
        mobileSwipeHeight,
        dragOffset
      )
    );

  current.classList.add(
    "mobile-page-dragging"
  );

  current.style.setProperty(
    "--mobile-drag-offset",
    `${limitedOffset}px`
  );

  if (
    limitedOffset < 0 &&
    next
  ) {

    next.classList.add(
      "mobile-page-dragging"
    );

    next.style.setProperty(
      "--mobile-drag-offset",
      `${limitedOffset}px`
    );

    body.classList.add(
      "mobile-page-drag-up"
    );

    body.classList.remove(
      "mobile-page-drag-down"
    );

  } else if (
    limitedOffset > 0 &&
    previous
  ) {

    previous.classList.add(
      "mobile-page-dragging"
    );

    previous.style.setProperty(
      "--mobile-drag-offset",
      `${limitedOffset}px`
    );

    body.classList.add(
      "mobile-page-drag-down"
    );

    body.classList.remove(
      "mobile-page-drag-up"
    );

  }

};


/*
  AVSLUTT VERTIKAL SVEIP
*/

const finishMobileSwipe = (
  dragOffset
) => {

  const currentIndex =
    getMobilePageIndex(
      activeMobilePageId
    );

  const elapsedTime =
    Math.max(
      performance.now() -
      mobileSwipeStartTime,
      1
    );

  const velocity =
    Math.abs(dragOffset) /
    elapsedTime;

  const distanceThreshold =
    Math.min(
      mobileSwipeHeight * .15,
      105
    );

  const fastSwipeDistance = 45;
  const fastSwipeVelocity = .55;

  const movedFarEnough =
    Math.abs(dragOffset) >=
    distanceThreshold;

  const movedFastEnough =
    Math.abs(dragOffset) >=
      fastSwipeDistance &&
    velocity >=
      fastSwipeVelocity;

  let targetIndex =
    currentIndex;

  if (
    movedFarEnough ||
    movedFastEnough
  ) {

    if (dragOffset < 0) {

      targetIndex =
        Math.min(
          currentIndex + 1,
          mobilePageIds.length - 1
        );

    } else if (
      dragOffset > 0
    ) {

      targetIndex =
        Math.max(
          currentIndex - 1,
          0
        );

    }

  }

  const changedPage =
    targetIndex !== currentIndex;

  body.classList.remove(
    "mobile-page-dragging",
    "mobile-page-drag-up",
    "mobile-page-drag-down"
  );

  mobilePageIds.forEach(
    (pageId) => {

      const page =
        getMobilePage(pageId);

      if (!page) {
        return;
      }

      page.classList.remove(
        "mobile-page-dragging"
      );

      page.style.removeProperty(
        "--mobile-drag-offset"
      );

    }
  );

  if (changedPage) {

    showMobilePage(
      mobilePageIds[targetIndex]
    );

  } else {

    updateMobilePageClasses(
      activeMobilePageId
    );

  }

};


/*
  START VERTIKAL SVEIP
*/

const startMobileSwipe = (
  event
) => {

  if (
    !mobilePageMedia.matches ||
    !body.classList.contains(
      "mobile-page-mode"
    ) ||
    body.classList.contains(
      "invitation-closed"
    ) ||
    body.classList.contains(
      "modal-open"
    ) ||
    body.classList.contains(
      "menu-open"
    )
  ) {
    return;
  }

  if (
    event.pointerType === "mouse" &&
    event.button !== 0
  ) {
    return;
  }

  const interactiveElement =
    event.target.closest(
      [
        "button",
        "a",
        "input",
        "textarea",
        "select",
        "label"
      ].join(",")
    );

  if (interactiveElement) {
    return;
  }

  mobileSwipePointerId =
    event.pointerId;

  mobileSwipeStartX =
    event.clientX;

  mobileSwipeStartY =
    event.clientY;

  mobileSwipeCurrentY =
    event.clientY;

  mobileSwipeStartTime =
    performance.now();

  mobileSwipeDirectionLocked =
    false;

  mobileSwipeIsVertical =
    false;

  mobileSwipeIsDragging =
    false;

};


/*
  FLYTT VERTIKAL SVEIP
*/

const moveMobileSwipe = (
  event
) => {

  if (
    event.pointerId !==
    mobileSwipePointerId
  ) {
    return;
  }

  const deltaX =
    event.clientX -
    mobileSwipeStartX;

  const deltaY =
    event.clientY -
    mobileSwipeStartY;

  mobileSwipeCurrentY =
    event.clientY;

  if (
    !mobileSwipeDirectionLocked
  ) {

    if (
      Math.abs(deltaX) < 10 &&
      Math.abs(deltaY) < 10
    ) {
      return;
    }

    mobileSwipeDirectionLocked =
      true;

    mobileSwipeIsVertical =
      Math.abs(deltaY) >
      Math.abs(deltaX) * 1.15;

  }

  if (!mobileSwipeIsVertical) {
    return;
  }

  const currentIndex =
    getMobilePageIndex(
      activeMobilePageId
    );

  const hasPrevious =
    currentIndex > 0;

  const hasNext =
    currentIndex <
    mobilePageIds.length - 1;

  let adjustedDeltaY =
    deltaY;

  if (
    deltaY > 0 &&
    !hasPrevious
  ) {

    adjustedDeltaY =
      deltaY * .16;

  }

  if (
    deltaY < 0 &&
    !hasNext
  ) {

    adjustedDeltaY =
      deltaY * .16;

  }

  mobileSwipeIsDragging =
    true;

  body.classList.add(
    "mobile-page-dragging"
  );

  event.preventDefault();

  updateMobileDrag(
    adjustedDeltaY
  );

};


/*
  SLIPP VERTIKAL SVEIP
*/

const endMobileSwipe = (
  event
) => {

  if (
    event.pointerId !==
    mobileSwipePointerId
  ) {
    return;
  }

  const dragOffset =
    mobileSwipeCurrentY -
    mobileSwipeStartY;

  if (
    mobileSwipeIsDragging &&
    mobileSwipeIsVertical
  ) {

    finishMobileSwipe(
      dragOffset
    );

  }

  mobileSwipePointerId = null;

  mobileSwipeDirectionLocked =
    false;

  mobileSwipeIsVertical =
    false;

  mobileSwipeIsDragging =
    false;

};


document.addEventListener(
  "pointerdown",
  startMobileSwipe,
  {
    passive: true
  }
);


document.addEventListener(
  "pointermove",
  moveMobileSwipe,
  {
    passive: false
  }
);


document.addEventListener(
  "pointerup",
  endMobileSwipe,
  {
    passive: true
  }
);


document.addEventListener(
  "pointercancel",
  endMobileSwipe,
  {
    passive: true
  }
);


/*
  TOPPIKONER, MENY OG «FORTSETT»-LENKER
*/

document.addEventListener(
  "click",
  (event) => {

    if (
      !mobilePageMedia.matches ||
      !body.classList.contains(
        "mobile-page-mode"
      )
    ) {
      return;
    }

    const link =
      event.target.closest(
        'a[href^="#"]'
      );

    if (!link) {
      return;
    }

    const href =
      link.getAttribute("href");

    const targetPageId =
      cleanMobilePageId(href);

    if (
      !mobilePageIds.includes(
        targetPageId
      )
    ) {
      return;
    }

    event.preventDefault();
    event.stopImmediatePropagation();

    closeMenu();

    showMobilePage(
      targetPageId
    );

  },
  true
);


/*
  ÅPNE INVITASJON
*/

if (openInvitationButton) {

  openInvitationButton.addEventListener(
    "click",
    () => {

      if (!mobilePageMedia.matches) {
        return;
      }

      window.setTimeout(
        () => {

          showMobilePage(
            "invitasjon",
            {
              updateHash: true,
              animate: false
            }
          );

        },
        40
      );

    }
  );

}


/*
  TILBAKE TIL SEGLET
*/

if (reopenInvitationButton) {

  reopenInvitationButton.addEventListener(
    "click",
    () => {

      if (!mobilePageMedia.matches) {
        return;
      }

      activeMobilePageId =
        "invitasjon";

      updateMobilePageClasses(
        "invitasjon"
      );

      body.classList.remove(
        "mobile-page-dark",
        "mobile-page-dragging",
        "mobile-page-drag-up",
        "mobile-page-drag-down"
      );

      if (
        window.history &&
        window.history.replaceState
      ) {

        window.history.replaceState(
          null,
          "",
          "#invitasjon"
        );

      }

    }
  );

}


/*
  HASH-ENDRINGER
*/

window.addEventListener(
  "hashchange",
  () => {

    if (
      !mobilePageMedia.matches ||
      !body.classList.contains(
        "mobile-page-mode"
      )
    ) {
      return;
    }

    showMobilePage(
      cleanMobilePageId(
        window.location.hash
      ),
      {
        updateHash: false
      }
    );

  }
);


window.addEventListener(
  "resize",
  () => {

    if (!mobilePageMedia.matches) {
      return;
    }

    mobileSwipeHeight =
      window.innerHeight;

  }
);


mobilePageMedia.addEventListener(
  "change",
  initializeMobilePages
);


initializeMobilePages();


/*
  SE INVITASJONEN FRA HAMBURGERMENYEN
*/

const mobileReopenInvitationButton =
  document.querySelector(
    "[data-mobile-reopen-invitation]"
  );


if (mobileReopenInvitationButton) {

  mobileReopenInvitationButton.addEventListener(
    "click",
    () => {

      if (!mobilePageMedia.matches) {
        return;
      }

      closeMenu();

      activeMobilePageId =
        "invitasjon";

      updateMobilePageClasses(
        "invitasjon"
      );

      body.classList.remove(
        "mobile-page-dark",
        "mobile-page-dragging",
        "mobile-page-drag-up",
        "mobile-page-drag-down"
      );

      closeInvitation();

      if (
        window.history &&
        window.history.replaceState
      ) {

        window.history.replaceState(
          null,
          "",
          "#invitasjon"
        );

      }

    }
  );

}
