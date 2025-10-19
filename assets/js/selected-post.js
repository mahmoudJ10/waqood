"use strict";

const suggestedPostsContainer = document.querySelector(".suggested-posts");
const selectedPostContainer = document.querySelector(
  ".selected-post-container"
);

// get url parameters object
const params = new URLSearchParams(window.location.search);
const clickedPostID = params.get("id") || 0;
const { data: posts } = await fetchPosts();
const [post] = posts.filter((post) => post.id === clickedPostID);
const suggestedPosts = [];
// supposed to come from backend / each post has its own , but for just mockup i consider it static .
const content =
  "<br><br><p class='post-desc'>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, </p><p class='post-desc'>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text</p><p class='post-desc'>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text</p><br><div class='gallery'><img src='./assets/images/posts/post1/img1.png' /><img src='./assets/images/posts/post1/img2.png'/></div> <br><p class='post-title'>There are many variations of passages of Lorem Ipsum available, but the majority have suffered </p><p class='post-desc'>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text</p>";

const postAppearance = {
  createSelectedPost: (postObj) => {
    // containers
    const post = postHelper.createElement("div", ["selected-post"]);
    const imgContainer = postHelper.createElement("div", [
      "selected-post-image-container"
    ]);
    const postData = postHelper.createElement("div", ["post-data"]);

    // childs
    /* --- */
    const img = postHelper.createElement("img", []);
    img.src = postObj.url;
    img.alt = postObj.title;

    // imgContainer.querySelector("img").append(prevPostBtn, nextPostBtn);

    const ancha = postHelper.createElement("a", ["post-overlay"]);
    ancha.href = "/posts-and-news";

    ancha.innerHTML = "view more";
    // append to parent
    imgContainer.append(img);

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
    post.append(imgContainer, postData);
    selectedPostContainer.append(post);

    imgContainer.append(nextPostBtn, prevPostBtn);
  },
  createSuggestedPost: (postObj) => {
    // containers
    const post = postHelper.createElement("div", ["suggested-posts-post"]);
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
    ancha.href = postObj.href;
    ancha.innerHTML = "view more";
    // append to parent
    imgContainer.append(img, ancha);

    /* --- */
    const postDate = postHelper.createElement("p", ["post-date"]);
    postDate.innerHTML = postObj.date;

    const postTitle = postHelper.createElement("p", ["post-title"]);
    postTitle.innerHTML = postObj.title;

    // append to parent
    postData.append(postDate, postTitle);

    /* ---- */
    post.append(imgContainer, postData);
    suggestedPosts.push(post);
  },
  initializer: () => {
    postAppearance.createSelectedPost(post);
    const element = selectedPostContainer.querySelector(".post-data");

    element.insertAdjacentHTML("beforeend", content);

    postHelper.createSuggestedPostsList([posts[2], posts[3]]);
    suggestedPostsContainer.append(...suggestedPosts);

    postHelper.easeTraverseAdjust(Number(clickedPostID));
  }
};
const postHelper = {
  easeTraverseAdjust: (clickedPostID) => {
    if (!(clickedPostID === posts.length)) {
      nextPostBtn.href = `selected-post.html?id=${clickedPostID + 1}`;
    } else if (!(clickedPostID - 1 === 0)) {
      prevPostBtn.href = `selected-post.html?id=${clickedPostID - 1}`;
    }
  },
  createElement: (tagName, classList = [], content) => {
    const element = document.createElement(tagName);
    element.classList.add(...classList);
    if (content) element.innerHTML = content;
    return element;
  },
  createSuggestedPostsList: (suggestedPosts) => {
    suggestedPosts.forEach((post) => {
      postAppearance.createSuggestedPost(post);
    });
  }
};

const nextPostBtn = postHelper.createElement("a", ["next-post-btn"], ">");
const prevPostBtn = postHelper.createElement("a", ["prev-post-btn"], "<");

async function fetchPosts() {
  try {
    const result = await fetch("./data/data.json").then((res) => res);
    const posts = await result.json().then((res) => res.posts);

    return posts;
  } catch (err) {
    console.log(err);
  }
}
if (post) postAppearance.initializer();
