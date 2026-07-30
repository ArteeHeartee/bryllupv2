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
  MOBIL V2: VERTIKAL SCROLLING
  ==================================================
*/

const mobileScrollMedia =
  window.matchMedia("(max-width: 760px)");

const mobileReopenInvitationButton =
  document.querySelector(
    "[data-mobile-reopen-invitation]"
  );


/*
  ÅPNE INVITASJONEN FRA HAMBURGERMENYEN
*/

if (mobileReopenInvitationButton) {

  mobileReopenInvitationButton.addEventListener(
    "click",
    () => {

      if (!mobileScrollMedia.matches) {
        return;
      }

      closeMenu();

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


/*
  RYDD OPP GAMLE MOBILKLASSER

  Dette sørger for at ingen rester fra
  sveipeløsningen påvirker scrollingen.
*/

const removeOldMobilePageClasses = () => {

  const pageIds = [
    "invitasjon",
    "historien",
    "program",
    "praktisk",
    "gaveonsker",
    "rsvp"
  ];

  body.classList.remove(
    "mobile-page-mode",
    "mobile-page-no-animation",
    "mobile-page-dragging",
    "mobile-page-drag-left",
    "mobile-page-drag-right",
    "mobile-page-dark",
    "mobile-first-page-turn"
  );

  pageIds.forEach((pageId) => {

    const page =
      document.getElementById(pageId);

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
      "--mobile-page-position"
    );

    page.style.removeProperty(
      "--mobile-drag-offset"
    );

    page.removeAttribute(
      "aria-hidden"
    );

  });

  const oldSwipeHint =
    document.querySelector(
      "[data-mobile-swipe-hint]"
    );

  if (oldSwipeHint) {
    oldSwipeHint.remove();
  }

};


removeOldMobilePageClasses();


mobileScrollMedia.addEventListener(
  "change",
  removeOldMobilePageClasses
);
