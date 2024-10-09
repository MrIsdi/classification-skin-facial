const video = document.getElementById("video");
const startVideo = document.getElementById("startVideo");
const stopVideo = document.getElementById("stopVideo");
const tipe = document.getElementById("tipe");
const score = document.getElementById("score");
const loading = document.getElementById("loading");

let cam, img;

startVideo.addEventListener("click", async () => {
  loading.classList.replace("hidden", "grid");
  cam = await tf.data.webcam(video, { facingMode: "environment" });
  main(cam);
});

stopVideo.addEventListener("click", () => {
  cam.stop();
});

async function main(cam) {
  try {
    const img = await cam.capture();
    const MODEL_URL = "../best_web_model/model.json";
    const model = await tf.loadGraphModel(MODEL_URL);

    const timeStart = Date.now();
    const data = tf.image.resizeBilinear(img, [224, 224]).div(255.0);
    const input = tf.expandDims(data).toFloat();
    const outputs = model.execute(input);

    tipe.innerText = name;
    score.innerText = (tf.max(outputs.dataSync()).dataSync() * 100).toFixed(2);
    console.log(className[tf.argMax(outputs.dataSync()).dataSync()]);
    console.log(tf.max(outputs.dataSync()).dataSync() * 100);
    const timeStop = Date.now();
    const delay = timeStop - timeStart;
    loading.classList.replace("grid", "hidden");

    setTimeout(() => {
      main(cam);
    }, delay);
  } catch (err) {
    console.log(err);
  }
}

// File image upload start
let btnFileImage = document.getElementById("btn-file-image"),
  fileImage = document.getElementById("file-image"),
  btnShowImage = document.getElementById("btn-show-image"),
  isSuhuPhone = false,
  image_url;

btnFileImage.onclick = () => {
  fileImage.click();
};

fileImage.onchange = () => {
  let file = fileImage.files[0];
  let reader = new FileReader();
  reader.onload = (e) => {
    let img = document.getElementById("image");
    image_url = e.target.result;
    img.src = e.target.result;
    img.classList.add("block");
    img.classList.remove("hidden");
  };
  reader.readAsDataURL(file);
  console.log("image loaded");
};

btnShowImage.onclick = async () => {
  loading.classList.replace("hidden", "grid");
  let img = document.getElementById("image");
  const MODEL_URL = "../best_web_model/model.json";
  const model = await tf.loadGraphModel(MODEL_URL);
  let data = tf.browser.fromPixels(img);
  let input = tf.image.resizeBilinear(data, [224, 224]).div(255.0).expandDims();
  const outputs = model.execute(input);
  console.log(outputs);

  const name = className[tf.argMax(outputs.dataSync()).dataSync()];
  tipe.innerText = name;
  score.innerText = (tf.max(outputs.dataSync()).dataSync() * 100).toFixed(2);
  console.log(className[tf.argMax(outputs.dataSync()).dataSync()]);
  console.log(tf.max(outputs.dataSync()).dataSync() * 100);

  try {
    const response = await axios.post("/chat", {
      skin: name,
    });
    const md = markdownit();
    const result = md.render(response.data);
    bot.innerHTML = result;
  } catch (error) {
    console.log(error);
  } finally {
    loading.classList.replace("grid", "hidden");
  }
};
// File image upload end

const className = ["Berminyak", "Kering", "Normal", "Tidak terdeteksi"];

const bot = document.getElementById("bot");

const buttonVideo = document.getElementById("buttonVideo");
const buttonImage = document.getElementById("buttonImage");
const containerVideo = document.getElementById("containerVideo");
const containerImage = document.getElementById("containerImage");

buttonVideo.addEventListener("click", () => {
  containerVideo.classList.replace("hidden", "flex");
  containerImage.classList.replace("flex", "hidden");
});
buttonImage.addEventListener("click", () => {
  containerImage.classList.replace("hidden", "flex");
  containerVideo.classList.replace("flex", "hidden");
});
