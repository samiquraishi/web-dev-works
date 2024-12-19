// DOM Elements
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");
const themeToggler = document.getElementById("theme-toggler");
const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");
const recommendationsList = document.getElementById("recommendations-list");
const refreshRecommendationsBtn = document.getElementById("refresh-recommendations");

// Simulate User Authentication
loginBtn.addEventListener("click", () => {
  alert("Login functionality is under development!");
});

signupBtn.addEventListener("click", () => {
  alert("Signup functionality is under development!");
});

// Theme Toggle
themeToggler.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
  themeToggler.textContent = document.body.classList.contains("dark-theme") ? "Dark" : "Light";
});

// Wikipedia API Search
async function searchWikipedia(query) {
    const encodedQuery = encodeURIComponent(query);
    const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=${encodedQuery}`; // Increased limit to 20
  
    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error("Failed to fetch search results from Wikipedia API.");
      }
  
      const data = await response.json();
      return data.query.search;
    } catch (error) {
      console.error(error);
      searchResults.innerHTML = "<p>An error occurred while fetching search results.</p>";
    }
  }
  
// Display Search Results
function displayResults(results) {
    searchResults.innerHTML = ""; // Clear previous results
  
    if (!results || results.length === 0) {
      searchResults.innerHTML = "<p>No results found.</p>";
      return;
    }
  
    results.forEach((result) => {
      const url = `https://en.wikipedia.org/?curid=${result.pageid}`;
      const resultItem = document.createElement("div");
      resultItem.className = "result-item";
      resultItem.innerHTML = `
        <h3><a href="${url}" target="_blank">${result.title}</a></h3>
        <p>${result.snippet}.....</p>
      `;
      searchResults.appendChild(resultItem);
    });
  }
  

// Handle Form Submission
searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();

  if (!query) {
    searchResults.innerHTML = "<p>Please enter a valid search term.</p>";
    return;
  }

  searchResults.innerHTML = "<div class='spinner'>Loading...</div>";

  const results = await searchWikipedia(query);
  if (results && results.length > 0) {
    displayResults(results);
  } else {
    searchResults.innerHTML = "<p>No results found.</p>";
  }
});

// Fetch Random Topics for Recommendations
async function fetchRecommendations() {
  const endpoint = "https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&list=random&rnnamespace=0&rnlimit=10";

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error("Failed to fetch recommendations.");
    }

    const data = await response.json();
    return data.query.random;
  } catch (error) {
    console.error(error);
    recommendationsList.innerHTML = "<p>An error occurred while fetching recommendations.</p>";
  }
}

// Display Recommendations
async function displayRecommendations() {
  recommendationsList.innerHTML = "<p>Loading recommendations...</p>";

  const recommendations = await fetchRecommendations();
  if (!recommendations) return;

  recommendationsList.innerHTML = "";
  recommendations.forEach((topic) => {
    const item = document.createElement("div");
    item.className = "recommendation-item";
    item.innerHTML = `
      <a href="https://en.wikipedia.org/?curid=${topic.id}" target="_blank">${topic.title}</a>
    `;
    recommendationsList.appendChild(item);
  });
}

// Event Listener for Refresh Button
refreshRecommendationsBtn.addEventListener("click", displayRecommendations);

// Load Recommendations on Page Load
window.addEventListener("DOMContentLoaded", displayRecommendations);
