/**
 * Global declarations
 */

const API_URL = "https://chupacabra-api.herokuapp.com/api";

let CURRENT_ID, VIDEOS_IDS;

let thumbnail;


function setCurrentId(id) {
  CURRENT_ID = id;
}

function setVideoIds(ids) {
  VIDEOS_IDS = ids;
}

function getVideosIds() {
  const elements = document.querySelectorAll("#contents #dismissible #thumbnail")
  const videosIds = [];
  elements.forEach(element => {
    const url = new URL(element.href)
    const params = new URLSearchParams(url.search)
    if (params.has("v"))
      videosIds.push(params.get("v"))
  })
  const requestBody = videosIds.join(',')

  const API_URL = "https://chupacabra-api.herokuapp.com/api";

  fetch(API_URL + "/videos", {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      videoIDs: requestBody
    })
  }).then(res =>
    res.json()
  ).then(data => {

    console.log(elements);
    elements.forEach((element, index) => {
      element.parentElement.parentElement.style.position = 'relative';

      const card = document.createElement("div");
      card.className = "ext-card";
      card.style.textAlign = 'center';
      card.style.backgroundColor = 'white';
      card.style.padding = '8px';
      card.style.position = 'absolute';
      card.style.right = '0';
      card.style.top = '0';
      card.style.cursor = 'pointer';
      card.style.zIndex = '1000';
      card.style.width = 'fit-content';


      if (data[index].class === 'Positive')
        card.innerHTML = "People <span style='color: #33d9b2;'>like</span> this video"
      else if (data[index].class === 'Negative')
        card.innerHTML = "People <span style='color: #e91e63ab;'>Hate</span> this video"
      else
        card.innerHTML = "People are <span style='color: #18dcff;'>Neutral</span> to this video"
      const stats = document.createElement("div");
      stats.className = "stats";

      // likes
      const like = document.createElement("div");
      // const likeimg = document.createElement("img");
      // likeimg.src = "images/like.png";
      const likespan = document.createElement("span");
      likespan.innerHTML = `${data[index].positive}% <span style='color: #33d9b2;'>like</span>`;

      // like.appendChild(likeimg)
      like.appendChild(likespan)

      stats.appendChild(like);

      // dislikes
      const dislike = document.createElement("div");
      // const dislikeimg = document.createElement("img");
      // dislikeimg.src = "images/like.png";
      const dislikespan = document.createElement("span");
      dislikespan.innerHTML = `${data[index].negative}% <span style='color: #e91e63ab;'>dislike</span>`;


      // dislike.appendChild(dislikeimg)
      dislike.appendChild(dislikespan)

      stats.appendChild(dislike);

      // Neutral
      const neutral = document.createElement("div");
      // const neutralimg = document.createElement("img");
      // neutralimg.src = "images/neutral.png";
      const neutralspan = document.createElement("span");
      neutralspan.innerHTML = `${data[index].neutral}% <span style='color: #18dcff;'>neutral</span>`;


      // neutral.appendChild(neutralimg)
      neutral.appendChild(neutralspan)

      stats.appendChild(neutral);
      stats.style.display = "flex";
      stats.style.justifyContent = "center";
      stats.style.gap = "4px";
      stats.style.marginTop = "8px"

      card.appendChild(stats)

      card.addEventListener('click', (e) => {
        card.style.display = 'none';
      })

      element.parentElement.parentElement.appendChild(card)
    });
  }).catch(e => console.error(e));

  return videosIds;
}

function getCurrentVideoId() {
  const params = new URLSearchParams(window.location.search);
  if (params.has("v"))
    return params.get("v");
  else return null;
}

function getTumbnail() {
  const element = {};
  const url = document.querySelector("link[itemprop=thumbnailUrl]");
  element.image = url.href
  const title = document.querySelector("h1.title.style-scope.ytd-video-primary-info-renderer");
  element.title = title.textContent;
  const views = document.querySelector("span.view-count.style-scope.ytd-video-view-count-renderer");
  element.views = views.textContent;
  const channelImage = document.querySelector(".yt-simple-endpoint.style-scope.ytd-video-owner-renderer img");
  element.channelImage = channelImage.src;
  const channelName = document.querySelector(".style-scope.ytd-channel-name a.yt-simple-endpoint.style-scope.yt-formatted-string");
  element.channelName = channelName.textContent;
  const description = document.querySelector("#description .content.style-scope.ytd-video-secondary-info-renderer");
  if (description.textContent.length < 100)
    element.description = description.textContent;
  else
    element.description = description.textContent.substring(0, 100) + "...";

  return element;
}

function setTumbnail(thumbnailResult) {
  thumbnail = thumbnailResult;
  const image = document.querySelector(".video-desc .thumbnail img");
  image.src = thumbnail.image;

  const title = document.querySelector(".info h3");
  title.textContent = thumbnail.title;

  const stats = document.querySelector(".info .stats span");
  stats.textContent = thumbnail.views;

  const channelImage = document.querySelector(".channel img");
  channelImage.src = thumbnail.channelImage;

  const channelName = document.querySelector(".channel h4");
  channelName.textContent = thumbnail.channelName;

  const desc = document.querySelector(".info p");
  desc.textContent = thumbnail.description;
}

function createComment({ comment, Negative, Neutral: neutralStat, Positive }) {
  const commentElement = document.createElement("div");
  commentElement.className = "comment"
  commentElement.appendChild(document.createTextNode(comment));

  const stats = document.createElement("div");
  stats.className = "stats";

  // likes
  const like = document.createElement("div");
  const likeimg = document.createElement("img");
  likeimg.src = "images/like.png";
  const likespan = document.createElement("span");
  likespan.textContent = Positive;

  like.appendChild(likeimg)
  like.appendChild(likespan)

  stats.appendChild(like);

  // dislikes
  const dislike = document.createElement("div");
  const dislikeimg = document.createElement("img");
  dislikeimg.src = "images/like.png";
  const dislikespan = document.createElement("span");
  dislikespan.textContent = Negative;


  dislike.appendChild(dislikeimg)
  dislike.appendChild(dislikespan)

  stats.appendChild(dislike);

  // Neutral
  const neutral = document.createElement("div");
  const neutralimg = document.createElement("img");
  neutralimg.src = "images/neutral.png";
  const neutralspan = document.createElement("span");
  neutralspan.textContent = neutralStat;


  neutral.appendChild(neutralimg)
  neutral.appendChild(neutralspan)

  stats.appendChild(neutral);

  commentElement.appendChild(stats)

  return commentElement;
}

async function setup() {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: () => {
      document.querySelectorAll(".ext-card").forEach(
        element => element.remove()
      )
    },
  }, (ids) => {
    setVideoIds(ids[0].result);
  });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: getCurrentVideoId,
  }, (id) => {
    setCurrentId(id[0].result);
    fetch(API_URL + "/video", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        videoID: CURRENT_ID
      })
    }).then(res =>
      res.json()
    ).then(data => {
      document.getElementById("loading").style.display = 'none';
      document.querySelector(".charts").style.display = 'flex';
      document.querySelector(".charts-section .progress").style.display = 'flex';

      const topComments = document.querySelector(".top-comments .content .best");
      data.top_comments.forEach(comment => {
        topComments.appendChild(createComment(comment));
      });

      const worstComments = document.querySelector(".top-comments .content .worst");
      data.worse_comments.forEach(comment => {
        worstComments.appendChild(createComment(comment));
      });

      let total = 0;
      data.donut_chart_data.forEach(num => total += num);
      // create progress
      const positive = document.querySelector(".progress .positive");
      positive.style.width = data.donut_chart_data[0] + "px";
      positive.textContent = Math.floor(((data.donut_chart_data[0] * 100) / total)) + "% Positive";

      const neutral = document.querySelector(".progress .neutral");
      neutral.style.width = data.donut_chart_data[1] + "px";
      neutral.textContent = Math.floor((data.donut_chart_data[1] * 100) / total) + "% Neutral";

      const negative = document.querySelector(".progress .negative");
      negative.style.width = data.donut_chart_data[2] + "px";
      negative.textContent = Math.floor((data.donut_chart_data[2] * 100) / total) + "% Negative";

      // create pie chart
      const ctx = document.getElementById("myChart").getContext("2d");
      const myChart = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: [
            "Positive Comment",
            "Neutral Comment",
            "Negative Comment",
          ],
          datasets: [
            {
              data: data.donut_chart_data,
              backgroundColor: [
                "#32ff7e",
                "#18dcff",
                "#e91e63ab",
              ],
              borderWidth: 8,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }).catch(e => console.log(e));
  });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: getVideosIds,
  }, (ids) => {
    setVideoIds(ids[0].result);
  });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: getTumbnail,
  }, (thumbnailResult) => {
    setTumbnail(thumbnailResult[0].result);
  })
}

setup()