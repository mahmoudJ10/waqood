const productList = document.querySelector(".product-list");
const slider = productList.querySelector(".slider");
const nextBtn = document.querySelector(".next-arrow");
const prevBtn = document.querySelector(".prev-arrow");

let productsLength = 0;
let index = 0;
let activeCard = null;
let productCardList = null;



/** card appearence work flow:
 *
 * - build product card element strucutre (the card skelton) ,then generate list of cards (skeltons) based on fetched products length
 * - after that populate data into thoose generated cards , so now you have list of full-filled cards , after that inject thoose cards into slider (container)
 */
const cardAppearance = {
  buildProductCardElement: () => {
    const card = document.createElement("div");
    const mask = document.createElement("div");
    const name = document.createElement("p");
    const imageContainer = document.createElement("div");
    const image = document.createElement("img");

    card.classList.add("product-card");
    mask.classList.add("mask-product-card");
    name.classList.add("product-card-name");
    imageContainer.classList.add("product-card-img");

    imageContainer.appendChild(image);
    card.appendChild(imageContainer);
    card.appendChild(name);
    card.appendChild(mask);

    return card;
  },
  generateProductCardList: (length) => {
    return Array.from({ length }, () =>
      cardAppearance.buildProductCardElement()
    );
  },
  populateCardsWithProductData: (data, cardList) => {
    data.forEach((item, i) => {
      const card = cardList[i];
      card.dataset.status = item.status;

      const name = card.querySelector("p");
      const img = card.querySelector("img");

      name.textContent = item.name;
      img.src = item.imgSrc;
      img.alt = item.name;
    });
    return cardList;
  },
  appendCardsToSlider: (cardList, container) => {
    cardList.forEach((card) => {
      if (card.dataset.status === "upcoming") {
        const tag = document.createElement("div");
        tag.classList.add("upcoming-product");
        tag.innerHTML = "Upcoming";
        card.querySelector(".mask-product-card").append(tag);
      }
      container.appendChild(card);
    });
  }
};
const cardClick = {
  setActiveProductCard: (card) => {
    if (!activeCard) {
      activeCard = card;
      activeCard.classList.add("active-product-card");
      return activeCard;
    }

    activeCard.classList.remove("active-product-card");

    if (activeCard === card) {
      activeCard.classList.remove("active-product-card");
      return null;
    }

    card.classList.add("active-product-card");
    return card;
  },
  handleProductListClick: (e) => {
    const element = e.target;
    const isMask = element.classList.contains("mask-product-card");
    if (!isMask) return;

    const card = element.closest(".product-card");
    activeCard = cardClick.setActiveProductCard(card, activeCard);
  }
};
const sliderArrows = {
  positionNextArrowButton: (marginRight = 25, nextBtn, productList) => {
    const rect = productList.getBoundingClientRect();

    const distanceFromPageStart = rect.left + window.scrollX;
    const distanceToEnd = distanceFromPageStart + rect.width;
    nextBtn.style.left = `${distanceToEnd - marginRight}px`;
  },
  positionPrevArrowButton: (marginRight = 25, prevBtn, productList) => {
    const rect = productList.getBoundingClientRect();
    const distanceFromPageStart = rect.left;
    prevBtn.style.left = `${distanceFromPageStart - marginRight}px`;
  },

  handleNextButtonClick: (nextBtn, prevBtn) => {
    index++;
    sliderHelper.updateArrowVisibility(nextBtn, prevBtn);
    if (index > productsLength - 1) index = 0;
    sliderHelper.moveSliderToCurrentIndex(slider);
  },
  handlePrevButtonClick: (nextBtn, prevBtn) => {
    index--;
    sliderHelper.updateArrowVisibility(nextBtn, prevBtn);
    if (index < 0) index = productsLength - 1;
    sliderHelper.moveSliderToCurrentIndex(slider);
  }
};
const sliderHelper = {
  getVisibleCardCount: (singleCardWith) => {
    const containerWidth = slider.parentElement.offsetWidth;
    const slideWidth = singleCardWith;
    return Math.floor(containerWidth / slideWidth);
  },
  getSingleCardWidth: (singleProduct) => {
    return singleProduct.offsetWidth;
  },
  updateNextButtonVisibility: (visibleCount, nextBtn, prevBtn) => {
    if (index + visibleCount >= productsLength) {
      nextBtn.classList.add("hidden");
    }
    prevBtn.classList.remove("hidden");
  },
  updatePrevButtonVisibility: (visibleCount, nextBtn, prevBtn) => {
    if (index < 1) prevBtn.classList.add("hidden");
    if (visibleCount + index < productsLength)
      nextBtn.classList.remove("hidden");
  },
  moveSliderToCurrentIndex: () => {
    const cardGap = sliderHelper.calculateCardGap(slider);

    slider.style.transform = `translateX(-${cardGap * index}px)`;
  },
  calculateCardGap: () => {
    const cards = [...slider.querySelectorAll(".product-card")];
    if (cards.length < 2) return;

    const first = cards[0].getBoundingClientRect();
    const second = cards[1].getBoundingClientRect();

    return (second.left - first.left).toFixed(2);
  },
  updateArrowVisibility: (nextBtn, prevBtn) => {
    const visibleCount = sliderHelper.getVisibleCardCount(
      sliderHelper.getSingleCardWidth(productCardList[0])
    );
    sliderHelper.updateNextButtonVisibility(visibleCount, nextBtn, prevBtn);
    sliderHelper.updatePrevButtonVisibility(visibleCount, nextBtn, prevBtn);
  }
};
function sliderJustifyPadding() {
  const sliderPos = slider.offsetWidth;
}
async function fetchData(url = "../data/data.json", key = "posts") {
  try {
    const result = await fetch(url);
    const data = await result.json();

    return data[key];
  } catch (err) {
    return [];
  }
}

async function initializer(productsData, length) {
  productsLength = length;
  sliderArrows.positionNextArrowButton(undefined, nextBtn, productList);
  sliderArrows.positionPrevArrowButton(undefined, prevBtn, productList);

  // returns list of  product-cards (skeltons)
  productCardList = cardAppearance.generateProductCardList(length);
  const fullfilledCards = cardAppearance.populateCardsWithProductData(
    productsData,
    productCardList
  );
  cardAppearance.appendCardsToSlider(fullfilledCards, slider);

  sliderHelper.updateArrowVisibility(nextBtn, prevBtn);
}

/**Event Listners */

productList.addEventListener("click", cardClick.handleProductListClick);
nextBtn.addEventListener("click", () => {
  sliderArrows.handleNextButtonClick(nextBtn, prevBtn);
});
prevBtn.addEventListener("click", () => {
  sliderArrows.handlePrevButtonClick(nextBtn, prevBtn);
});
window.addEventListener("resize", () => {
  sliderArrows.positionNextArrowButton(undefined, nextBtn, productList);
  sliderArrows.positionPrevArrowButton(undefined, prevBtn, productList);
  sliderArrows.handleNextButtonClick(nextBtn, prevBtn);
  sliderArrows.handlePrevButtonClick(nextBtn, prevBtn);
});
/*********** */

export { fetchData, initializer };
/**
 * Problem Description:
 *
 * How can we avoid having two separate files that contain almost identical logic,
 * differing only by one or a few functions?
 *
 * Why This Is a Problem:
 *
 * - Code duplication leads to redundant data.
 * - Redundant code increases file size and memory usage.
 * - Maintaining duplicate logic is error-prone — updating one file but not the other
 *   can cause inconsistent behavior.
 * - Overall, it negatively impacts performance and maintainability.
 *
 * Proposed Solution:
 *
 * - Create a single shared (parent) module that contains the common, reusable logic.
 * - Allow other files (the "child" scripts that import the parent module)
 *   to customize or extend only the specific functions they need to change.
 **/


