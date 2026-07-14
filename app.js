/*
=========================================================
POPS PREDICTIONS NFL
app.js
=========================================================
*/

document.addEventListener("DOMContentLoaded", () => {

  initializeMenu();

  initializeFormulaButtons();

  initializeSmoothScroll();

});


/*
=========================================================
MOBILE MENU
=========================================================
*/

function initializeMenu() {

  const menuButton =
    document.querySelector(".menu-button");

  const navigation =
    document.querySelector(".main-navigation");

  if (!menuButton || !navigation) return;

  menuButton.addEventListener("click", () => {

    navigation.classList.toggle("open");

    menuButton.setAttribute(
      "aria-expanded",
      navigation.classList.contains("open")
    );

  });

}


/*
=========================================================
FORMULA BUTTONS
=========================================================
*/

function initializeFormulaButtons() {

  const buttons =
    document.querySelectorAll(".info-button");

  const modal =
    document.querySelector(".formula-modal");

  const backdrop =
    document.querySelector(".formula-modal-backdrop");

  const closeButton =
    document.querySelector(".modal-close-button");

  if (!modal) return;

  buttons.forEach(button => {

    button.addEventListener("click", () => {

      modal.classList.add("open");

      document.body.classList.add("modal-open");

    });

  });

  if (backdrop) {

    backdrop.addEventListener("click", closeModal);

  }

  if (closeButton) {

    closeButton.addEventListener("click", closeModal);

  }

  document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

      closeModal();

    }

  });

  function closeModal() {

    modal.classList.remove("open");

    document.body.classList.remove("modal-open");

  }

}


/*
=========================================================
SMOOTH SCROLL
=========================================================
*/

function initializeSmoothScroll() {

  document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", function (event) {

      const target =
        document.querySelector(
          this.getAttribute("href")
        );

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({

        behavior: "smooth"

      });

      document
        .querySelector(".main-navigation")
        ?.classList.remove("open");

    });

  });

}