import images from "./images";
import ProgressBar from "progressbar.js";

let progressbar;

const renderProgressBar = (container) => {
  container.classList.add("converting");
  progressbar = new ProgressBar.SemiCircle(container, {
    strokeWidth: 3,
    color: "black",
    trailColor: "#eee",
    trailWidth: 1,
    svgStyle: null,
    color: "black",
    text: {
      value: "0%",
      alignToBottom: false
    },
  });
};

const setProgressBar = (progress) => {
  if (progressbar) {
    progressbar.set(progress);
    progressbar.setText(`${parseInt(progress*100)}%`);
  }
};

const getSubtitle = (index) => {
  let id;

  if (index >= 10 && index <= 15) id = "subtitle01";
  else if (index >= 31 && index <= 44) id = "subtitle02";
  else if (index >= 51 && index <= 72) id = "subtitle03";
  else if (index >= 72 && index <= 99) id = "subtitle04";
  else if (index >= 100 && index <= 115) id = "subtitle05";
  else if (index >= 116 && index <= 129) id = "subtitle06";
  else if (index >= 136 && index <= 162) id = "subtitle07";
  else if (index >= 180 && index <= 196) id = "subtitle08";
  else if (index >= 196 && index <= 208) id = "subtitle09";

  if (!!id) {
    const subtitle = document.getElementById(id);
    return subtitle.value || subtitle.placeholder;
  } else {
    return null;
  }
};

const fillSubtitle = (context, subtitle) => {
  if (!!subtitle) {
    context.font = "28px Arial";
    context.textAlign = "center";
    context.shadowColor = "black";
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    context.shadowBlur = 2;
    context.lineWidth = 3;
    context.fillStyle = "black";
    context.strokeText(subtitle, 285, 300);
    context.fillStyle = "#d4d4d4";
    context.shadowBlur = 0;
    context.fillText(subtitle, 285, 300);
  }
};

const convertGif = (encoder, container) => {
  
  const canvas = document.createElement("canvas");
  canvas.setAttribute("width", 570);
  canvas.setAttribute("height", 320);
  const context = canvas.getContext("2d");

  encoder.setRepeat(0);
  encoder.setDelay(100);
  encoder.setSize(570, 320);
  encoder.setQuality(20);
  encoder.start();

  let index = 0;

  const addFrame = (callback) => {
    const img = new Image();
    img.src = images[index++];
    img.onload = () => {
      setProgressBar(index/images.length);
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
      fillSubtitle(context, getSubtitle(index));
      encoder.addFrame(context);
      callback();
    };
  };

  const checkFinish = () => {
    if (index < images.length) {
      addFrame(checkFinish);
    } else {
      encoder.finish();

      const img = document.createElement("img");
      img.setAttribute("src", `data:image/gif;base64,${btoa(encoder.stream().getData())}`);
      container.classList.remove("converting");
      container.innerHTML = "";
      container.appendChild(img);
    }
  }

  addFrame(checkFinish);
};

document.addEventListener("DOMContentLoaded", (e) => {
  const container = document.getElementById("image-container");
  const btn = document.getElementById("render-button");
  btn.addEventListener("click", (e) => {
    renderProgressBar(container);
    convertGif(new GIFEncoder(), container);
  });
});
