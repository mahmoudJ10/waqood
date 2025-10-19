"use strict";
const navList = document.querySelector(".nav-list");
const menuBtn = document.querySelector("nav .menu-btn");

let menuBtnClicked = false;
let isInitalRender = true;

const navHandlers = {
  menuBtnClickHandler: () => {
    navList.classList.toggle("visible");
  },
  markCurrentActiveLink: () => {
    const currentPage = window.location.pathname.split("/").pop();
    let activeLink = [...navList.querySelectorAll("a")].filter((link) => {
      let isHaveAdditionLink = link.dataset.additionLink;
      if (isHaveAdditionLink) {
        if (
          link.getAttribute("href") === currentPage ||
          link.dataset.additionLink === currentPage
        ) {
          return link;
        }
      } else if (link.getAttribute("href") === currentPage) {
        return link;
      }
    });

    if (activeLink.length) activeLink[0].classList.add("active-nav-link");
    else
      navList.querySelector("a:nth-child(1)").classList.add("active-nav-link");
  }
};

// highlight active link.js
document.addEventListener(
  "DOMContentLoaded",
  navHandlers.markCurrentActiveLink
);
menuBtn.addEventListener("click", navHandlers.menuBtnClickHandler);
