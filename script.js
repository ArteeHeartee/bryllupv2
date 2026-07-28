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
