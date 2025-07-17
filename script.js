let page = localStorage.getItem("page") || 1;
let size = localStorage.getItem("size") || 10;
let sort = localStorage.getItem("sort") || '-published_at';

const apiUrl = "https://suitmedia-backend.suitdev.com/api/ideas";

function fetchPosts() {
  const url = `${apiUrl}?page[number]=${page}&page[size]=${size}&append[]=small_image&append[]=medium_image&sort=${sort}`;
  
  fetch(url, {
    headers: { 'Accept': 'application/json' }
  })
    .then(res => res.json())
    .then(data => {
      const posts = data.data;
      const meta = data.meta;
      renderPosts(posts);
      renderPagination(meta.pagination);
      document.getElementById("showing-count").innerText = posts.length;
      document.getElementById("total-count").innerText = meta.pagination.total;
    })
    .catch(error => {
      console.error("Gagal fetch data:", error);
    });
}

function renderPosts(posts) {
  const container = document.getElementById("posts-container");
  container.innerHTML = "";
  posts.forEach(post => {
    const imagePath = post.small_image || post.medium_image;
    const image = `https://suitmedia-backend.suitdev.com${imagePath}`;
    const date = formatDate(post.published_at);
    const title = truncateTitle(post.title);

    container.innerHTML += `
      <div class="card">
        <img src="${image}" alt="${post.title}" loading="lazy" />
        <div class="card-content">
          <small>${date}</small>
          <h3 class="title">${title}</h3>
        </div>
      </div>
    `;
  });
}

function renderPagination(pagination) {
  const container = document.getElementById("pagination");
  container.innerHTML = "";
  const totalPages = pagination.total_pages;

  for (let i = 1; i <= totalPages; i++) {
    container.innerHTML += `
      <button class="page-btn ${i == page ? "active" : ""}" onclick="changePage(${i})">${i}</button>
    `;
  }
}

function changePage(p) {
  page = p;
  localStorage.setItem("page", p);
  fetchPosts();
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return d.toLocaleDateString('id-ID', options);
}

function truncateTitle(title) {
  return title.length > 80 ? title.slice(0, 77) + "..." : title;
}

document.getElementById("per-page").addEventListener("change", function(e) {
  size = e.target.value;
  localStorage.setItem("size", size);
  page = 1;
  localStorage.setItem("page", page);
  fetchPosts();
});

document.getElementById("sort").addEventListener("change", function(e) {
  sort = e.target.value;
  localStorage.setItem("sort", sort);
  page = 1;
  localStorage.setItem("page", page);
  fetchPosts();
});

let lastScrollTop = 0;
const header = document.getElementById("site-header");

window.addEventListener("scroll", function () {
  let scrollTop = window.scrollY || document.documentElement.scrollTop;
  if (scrollTop > lastScrollTop) {
    header.style.top = "-100px"; 
  } else {
    header.style.top = "0"; 
    header.classList.add("transparent");
  }
  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

fetchPosts();
