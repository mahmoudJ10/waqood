"use strict";

const postContainer = document.querySelector(".post-container");
const pagenationNav = document.querySelector("#post nav");

let postsPerPage = 6;
let pageIndex = 0;

const postHelper = {
  createElement: (tagName, classList = []) => {
    const element = document.createElement(tagName);
    element.classList.add(...classList);
    return element;
  },
  assignIDforPost: (id, post, postObj) => {
    post.dataset.id = postObj.id || id;
  },
  refreshPosts: (posts) => {
    postContainer.innerHTML = "";
    postAppearance.createPosts(posts, pageIndex);
  }
};
const pagenationHelper = {
  moveCSSClass: (from, to, className) => {
    from.classList.remove(className);
    to.classList.add(className);
  },
  pagenationButtons: (pages) => {
    const pagenationPrev = postHelper.createElement("button", []);
    pagenationPrev.innerHTML = "<";
    pagenationNav.append(pagenationPrev);

    for (let i = 0; i < pages; i++) {
      const button = postHelper.createElement("button", []);
      button.innerHTML = i + 1;
      button.dataset.value = i + 1;
      if (i == 0) button.classList.add("active-page");
      pagenationNav.append(button);
    }
    const pagenationNext = postHelper.createElement("button", []);
    pagenationNext.innerHTML = ">";
    pagenationNav.append(pagenationNext);
  },
  pagenation: (postsInPage, totalPosts) => {
    const pagesNumber = Math.ceil(totalPosts / postsInPage);
    return pagesNumber;
  },
  getClickedNavListInfo: (clicked) => {
    const info = {
      type: "",
      value: "",
      next: false,
      prev: false
    };
    const clickedValue = clicked.dataset?.value;
    const activePageValue = activePage.dataset.value;
    // first check the type --numbered or arrow
    if (clickedValue) {
      info.type = "numbered";
      info.value = Number(clickedValue);
    } else {
      info.type = "arrow";
      info.next = nextPageNavBtn === clicked;
      info.prev = prevPageNavBtn === clicked;
      info.value = Number(activePageValue);
    }

    return info;
  }
};
const postAppearance = {
  createPost: (postObj) => {
    // containers
    const post = postHelper.createElement("div", ["post-container-post"]);
    const imgContainer = postHelper.createElement("div", [
      "post-image-container"
    ]);
    const postData = postHelper.createElement("div", ["post-data"]);

    // childs
    /* --- */
    const img = postHelper.createElement("img", []);
    img.src = postObj.url;
    img.alt = postObj.title;

    const ancha = postHelper.createElement("a", ["post-overlay"]);
    // ancha.href = "/posts-and-news";
    ancha.innerHTML = "view more";
    ancha.href = postObj.href;
    // append to parent
    imgContainer.append(img, ancha);

    /* --- */
    const postDate = postHelper.createElement("p", ["post-date"]);
    postDate.innerHTML = postObj.date;

    const postTitle = postHelper.createElement("p", ["post-title"]);
    postTitle.innerHTML = postObj.title;

    const postDesc = postHelper.createElement("p", ["post-desc"]);
    postDesc.innerHTML = postObj.desc;

    // append to parent
    postData.append(postDate, postTitle, postDesc);

    /* ---- */
    postHelper.assignIDforPost("", post, postObj);
    post.append(imgContainer, postData);
    postContainer.append(post);
  },
  createPosts: (posts, pageIndex) => {
    // index is assigned as pages * currentpage

    // clear container elements then add new ones .
    postContainer.innerHTML = "";
    const staticStep = postsPerPage;
    const start = pageIndex;
    let counter = 0;
    // keep check the end of the list
    while (counter < staticStep) {
      if (!(start + counter >= totalPosts)) {
        postAppearance.createPost(posts[start + counter]);
      }
      counter++;
    }
  }
};
async function fetchPosts() {
  try {
    const result = await fetch("./data/data.json").then((res) => res);
    const posts = await result.json().then((res) => res.posts);

    return posts;
  } catch (err) {
    console.log(err);
  }
}
const postHandlers = {
  handlerNumberedBtnClick: (clickedInfo) => {
    pageIndex = clickedInfo.value * postsPerPage - postsPerPage;
    postHelper.refreshPosts(posts);
    pagenationHelper.moveCSSClass(
      activePage,
      pagenationButtonList[clickedInfo.value],
      "active-page"
    );
    activePage = pagenationButtonList[clickedInfo.value];
  },
  handlerNextArrowClick: (clickedInfo) => {
    pageIndex = (clickedInfo.value + 1) * postsPerPage - postsPerPage;
    postHelper.refreshPosts(posts);
    pagenationHelper.moveCSSClass(
      activePage,
      pagenationButtonList[clickedInfo.value + 1],
      "active-page"
    );
    activePage = pagenationButtonList[clickedInfo.value + 1];
  },
  handlerPrevArrowClick: (clickedInfo) => {
    pageIndex = (clickedInfo.value - 1) * postsPerPage - postsPerPage;
    postHelper.refreshPosts(posts);
    pagenationHelper.moveCSSClass(
      activePage,
      pagenationButtonList[clickedInfo.value - 1],
      "active-page"
    );
    activePage = pagenationButtonList[clickedInfo.value - 1];
  },
  handlePaginationClick: (clicked) => {
    const clickedInfo = pagenationHelper.getClickedNavListInfo(clicked);
    const navLen = pagenationButtonList.length;
    switch (true) {
      case !clickedInfo.next && !clickedInfo.prev:
        {
          postHandlers.handlerNumberedBtnClick(clickedInfo, navLen);
        }
        break;
      case clickedInfo.next && clickedInfo.value < navLen - 2:
        {
          postHandlers.handlerNextArrowClick(clickedInfo, navLen);
        }
        break;
      case clickedInfo.prev && clickedInfo.value > 1:
        {
          postHandlers.handlerPrevArrowClick(clickedInfo, navLen);
        }
        break;
      default: {
        console.log("Unknown case");
      }
    }
  }
};

const { data: posts, totalPosts } = await fetchPosts();
const pages = pagenationHelper.pagenation(postsPerPage, totalPosts);

pagenationHelper.pagenationButtons(pages);
postAppearance.createPosts(posts, pageIndex);
/* --- */

// based on pagenaton buttons , so must live here
const pagenationButtonList = [...pagenationNav.querySelectorAll("button")];
const [prevPageNavBtn, nextPageNavBtn] = [
  pagenationButtonList[0],
  pagenationButtonList[pagenationButtonList.length - 1]
];
let activePage = [...pagenationNav.querySelectorAll("button")][1];
pagenationNav.addEventListener("click", (e) => {
  postHandlers.handlePaginationClick(e.target);
});

/* --- */

// problem solved:
/**
 * - how to store post to be accessable from selected-post page ?
 * - ihave two ways: localstorage or send id as params and destructering it in target file .
 * - which to choose ? in my situation i want to integrate th =e front with
 *   some api later , so i will choose the second way becouse of its scaleability .
 *
 *  */
