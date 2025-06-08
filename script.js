async function checkSpam() {
  const message = document.getElementById("message").value.toLowerCase();
  const resultBox = document.getElementById("resultBox");
  const resultText = document.getElementById("resultText");

  // Reset styles
  resultBox.classList.remove("result-green", "result-orange", "result-red");
  resultText.classList.remove("text-green", "text-orange", "text-red");

  // Get prediction from the API
  const { prediction: resultPrediction, probabilityHam: resultHam, probabilitySpam: resultSpam } = await getPrediction(message);

  if (resultPrediction === 1) {
    resultText.textContent = "Cet email est probablement un SPAM.";
    resultBox.classList.add("result-red");
    resultText.classList.add("text-red");
    updateProgress(resultSpam * 100,1); // % of being spam
  } else if (resultPrediction === 0) {
    resultText.textContent = "Cet email semble légitime.";
    resultBox.classList.add("result-green");
    resultText.classList.add("text-green");
    updateProgress(resultHam * 100,0); // % of being ham
  } else {
    resultText.textContent = "Erreur lors de la prédiction."+resultPrediction;
    resultBox.classList.add("result-orange");
    resultText.classList.add("text-orange");
    updateProgress(0);
  }

  resultBox.style.display = "flex";
}


function updateProgress(percent,resultPrediction) {
  const circle = document.querySelector('.progress-ring__circle');
  const percentText = document.getElementById('percentText');

  const radius = 65;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  circle.style.strokeDashoffset = offset;
  percentText.textContent = percent.toFixed(2) + "%";

  circle.classList.remove("circle-green", "circle-red","circle-blue");

  if (resultPrediction === 1) {
    circle.classList.add("circle-red"); 
  } else {
    circle.classList.add("circle-green"); 
  }
}

async function getPrediction(text) {
  const url = "https://selective-mirna-buoyairican-f199f93d.koyeb.app/predict";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text })  // sending { text: "..." }
    });

    if (!response.ok) {
      throw new Error("API error: " + response.status);
    }

    const result = await response.json();

    return {
      prediction: result.prediction,               // 0 or 1
      probabilityHam: result.probabilities.ham,    // e.g., 0.1234
      probabilitySpam: result.probabilities.spam   // e.g., 0.8766
    };

  } catch (error) {
    console.error("Prediction error:", error);
    return {
      prediction: -1,
      probabilityHam: 0.0,
      probabilitySpam: 0.0
    };
  }
}

