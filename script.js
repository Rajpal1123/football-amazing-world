/* ===========================================
   FOOTBALL AMAZING WORLD
   CLEAN SCRIPT.JS
   PART 1
=========================================== */

// ================= API KEYS =================

const FOOTBALL_API_KEY = "010a2d3719c5443792d8bf3b0a0768f8";

const BASE_URL = "https://api.football-data.org/v4";

const headers = {
    "X-Auth-Token": FOOTBALL_API_KEY
};

// ================= LIVE MATCHES =================

async function loadLiveMatches() {

  console.log("Live Function Started");

  const container = document.getElementById("live-score-container");

  if (!container) return;

  container.innerHTML = "<h3>Loading Live Matches...</h3>";

  try {

    console.log("Before Fetch");

    const res = await fetch(`${BASE_URL}/matches`, {
      headers
    });

    console.log("After Fetch");
    console.log("Status:", res.status);

    if (!res.ok) {
      console.log(await res.text());
      throw new Error("Live Match API Error");
    }

    const data = await res.json();

    console.log("Live API Data:", data);

    const matches = data.matches.filter(match =>
      match.status === "LIVE" ||
      match.status === "IN_PLAY" ||
      match.status === "PAUSED"
    );

    if (matches.length === 0) {
      container.innerHTML = "<h3>⚽ No Live Matches</h3>";
      return;
    }

    container.innerHTML = "";

    matches.forEach(match => {

      container.innerHTML += `
      <div class="live-card">
        <h3>${match.homeTeam.name} VS ${match.awayTeam.name}</h3>
        <h2>
          ${match.score.fullTime.home ?? 0}
          -
          ${match.score.fullTime.away ?? 0}
        </h2>
        <p>${match.status}</p>
      </div>
      `;

    });

  } catch (err) {

    console.error("FETCH ERROR:", err);

    container.innerHTML = "<h3>Unable To Load Live Matches</h3>";

  }

}

// ================= STANDINGS =================
console.log("Standings Function Started");

async function loadStandings(){

const table=document.getElementById("table-body");

if(!table) return;

table.innerHTML=

"<tr><td colspan='6'>Loading...</td></tr>";

try{

const res=await fetch(

`${BASE_URL}/competitions/PL/standings`,

{
headers
}

);

console.log("Standings Status:", res.status);

if (!res.ok) {
  console.log(await res.text());
  throw new Error("Standings API Error");
}

const data = await res.json();
console.log("Standings Data:", data);

table.innerHTML="";

data.standings[0].table.forEach(team=>{

table.innerHTML+=`

<tr>

<td>${team.team.name}</td>

<td>${team.playedGames}</td>

<td>${team.won}</td>

<td>${team.draw}</td>

<td>${team.lost}</td>

<td>${team.points}</td>

</tr>

`;

});

}catch(error){

console.error(error);

table.innerHTML=

"<tr><td colspan='6'>Unable To Load Table</td></tr>";

}

}
/* ===========================================
   SCRIPT.JS PART 2
   FIXTURES + TOP SCORERS + NEWS
=========================================== */

// ================= FIXTURES =================

async function loadFixtures() {

console.log("Fixtures Function Started");

const container = document.getElementById("fixtures-container");

if (!container) return;

container.innerHTML = "<h3>Loading Fixtures...</h3>";

try {

const res = await fetch(
`${BASE_URL}/competitions/PL/matches?status=SCHEDULED`,
{
headers
}
);

console.log("Fixtures Status:", res.status);

if (!res.ok) {

const errorText = await res.text();

console.log("Fixtures Error:", errorText);

container.innerHTML = `
<div style="color:red;padding:15px;">
<h3>Fixtures API Error</h3>
<p>Status : ${res.status}</p>
<pre>${errorText}</pre>
</div>
`;

return;

}

const data = await res.json();

console.log("Fixtures Data:", data);

container.innerHTML = "";

if (!data.matches || data.matches.length === 0) {

container.innerHTML = "<h3>No Upcoming Fixtures</h3>";

return;

}

data.matches.forEach(match => {

container.innerHTML += `

<div class="schedule-card">

<h3>${match.homeTeam.name} VS ${match.awayTeam.name}</h3>

<p>📅 ${new Date(match.utcDate).toLocaleDateString()}</p>

<p>🕒 ${new Date(match.utcDate).toLocaleTimeString()}</p>

</div>

`;

});

} catch (error) {

console.error(error);

container.innerHTML = "<h3>Unable To Load Fixtures</h3>";

}

}

// ================= TOP SCORERS =================

async function loadTopScorers(){

console.log("Scorers Function Started");
const container=document.getElementById("scorers-container");

if(!container) return;

container.innerHTML="<h3>Loading Scorers...</h3>";

try {

const res = await fetch(
`${BASE_URL}/competitions/PL/scorers`,
{
headers
}
);

console.log("Scorers Status:", res.status);

if (!res.ok) {

const errorText = await res.text();

console.log("Scorers Error:", errorText);

container.innerHTML = `
<div style="color:red;padding:15px;">
<h3>Scorers API Error</h3>
<p>Status : ${res.status}</p>
<pre>${errorText}</pre>
</div>
`;

return;

}

const data = await res.json();

console.log("Scorers Data:", data);

container.innerHTML = "";

if (!data.scorers || data.scorers.length === 0) {

container.innerHTML = "<h3>No Top Scorers Found</h3>";

return;

}

data.scorers.slice(0,10).forEach(player=>{

container.innerHTML += `

<div class="scorer-card">

<h3>${player.player.name}</h3>

<p>${player.team.name}</p>

<h2>⚽ ${player.goals}</h2>

</div>

`;

});

} catch(error){

console.error(error);

container.innerHTML = "<h3>Unable To Load Scorers</h3>";

}

}

// ================= FOOTBALL NEWS =================

async function loadFootballNews() {

const container = document.getElementById("news-container");

if(!container) return;

container.innerHTML = "<h3>Loading Football News...</h3>";

try{

const res = await fetch("https://api.allorigins.win/raw?url=https://feeds.bbci.co.uk/sport/football/rss.xml");

const text = await res.text();

const parser = new DOMParser();

const xml = parser.parseFromString(text,"text/xml");

const items = xml.querySelectorAll("item");

container.innerHTML = "";

items.forEach((item,index)=>{

if(index>=8) return;

const title = item.querySelector("title")?.textContent;

const link = item.querySelector("link")?.textContent;

const description = item.querySelector("description")?.textContent;

container.innerHTML += `

<div class="news-card">

<h3>${title}</h3>

<p>${description}</p>

<a href="${link}" target="_blank">Read More →</a>

</div>

`;

});

}catch(error){

console.log(error);

container.innerHTML="<h3>Unable To Load News</h3>";

}

}
/* ===========================================
   SCRIPT.JS PART 3
   SEARCH + SLIDER + LOADER + AUTO REFRESH
=========================================== */

// =============== SEARCH =================

const searchBtn=document.getElementById("searchBtn");

if(searchBtn){

searchBtn.addEventListener("click",()=>{

const input=document
.getElementById("searchInput")
.value
.toLowerCase();

const cards=document.querySelectorAll(
".live-card,.schedule-card,.scorer-card,.news-card"
);

cards.forEach(card=>{

if(card.innerText.toLowerCase().includes(input)){

card.style.display="block";

}else{

card.style.display="none";

}

});

});

}

// =============== IMAGE SLIDER =================

const slider=document.getElementById("slider");

const images=[

"messi.jpg",

"ronaldo.jpg",

"mbappe.jpg",

"yamal.jpg",

"worldcup.jpg"

];

let current=0;

if(slider){

setInterval(()=>{

current++;

if(current>=images.length){

current=0;

}

slider.src=images[current];

},4000);

}

// =============== BACK TO TOP =================

const topBtn=document.getElementById("topBtn");

window.addEventListener("scroll",()=>{

if(!topBtn) return;

if(window.scrollY>300){

topBtn.style.display="block";

}else{

topBtn.style.display="none";

}

});

function topFunction(){

window.scrollTo({

top:0,

behavior:"smooth"

});

}

// =============== LOADER =================

window.addEventListener("load",()=>{

const loader=document.getElementById("loader");

if(loader){

setTimeout(()=>{

loader.style.display="none";

},1000);

}

initializeWebsite();

});

// =============== INITIALIZE =================

function initializeWebsite(){

console.log("⚽ Initializing Website...");

loadLiveMatches();

loadStandings();

loadFixtures();

loadTopScorers();

loadFootballNews();

}

// =============== AUTO REFRESH =================

setInterval(()=>{

console.log("🔄 Auto Refresh");

initializeWebsite();

},120000);

// =============== FOOTER YEAR =================

const year=document.getElementById("year");

if(year){

year.textContent=new Date().getFullYear();

}

console.log("✅ Football Amazing World Loaded Successfully");