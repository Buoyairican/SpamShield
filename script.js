async function checkSpam() {
  const message = document.getElementById("message").value.toLowerCase();
  const resultBox = document.getElementById("resultBox");
  const resultText = document.getElementById("resultText");

  let scoreValue = 0;
  resultBox.classList.remove("result-green", "result-orange", "result-red");
  resultText.classList.remove("text-green", "text-orange", "text-red");

//summilate the spam score based on keywords


var { prediction: resultPrediction, probability: resultProbability } = await getPrediction(message);



  if (resultPrediction == 1) {
    resultText.textContent = "❌ Cet email est probablement un SPAM.";
    resultBox.classList.add("result-red");
    resultText.classList.add("text-red");

  // } else if (message.includes("urgent") || message.includes("offre") || message.length < 30) {
  //   scoreValue = 75;
  //   resultText.textContent = "⚠️ Ce message pourrait être un spam.";
  //   resultBox.classList.add("result-orange");
  //   resultText.classList.add("text-orange");

  } else {
    resultProbability = 1 - resultProbability;
    resultText.textContent = "✅ Cet email semble légitime.";
    resultBox.classList.add("result-green");
    resultText.classList.add("text-green");
  }

  updateProgress(resultProbability*100);
  resultBox.style.display = "flex";
}

function updateProgress(percent) {
  const circle = document.querySelector('.progress-ring__circle');
  const percentText = document.getElementById('percentText');

  const radius = 65;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  circle.style.strokeDashoffset = offset;
  percentText.textContent = percent + "%";

  circle.classList.remove("circle-green", "circle-red", "circle-orange");

  if (percent >= 90) {
    circle.classList.add("circle-green");
  } else if (percent >= 70) {
    circle.classList.add("circle-orange");
  } else {
    circle.classList.add("circle-red");
  }
}

async function getPrediction(text) {
  const url = "https://modelsvm-production.up.railway.app/predict";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text })
    });

    if (!response.ok) {
      throw new Error("API error: " + response.status);
    }

    const result = await response.json();
    
    
    return {
      prediction: result.prediction,        // 0 or 1
      probability: result.probability       // between 0 and 1
    };

  } catch (error) {
    console.error("Prediction error:", error);
    return {
      prediction: -1,
      probability: 0.0
    };
  }
}

