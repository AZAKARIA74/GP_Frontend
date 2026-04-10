// const API_BASE = "http://127.0.0.1:5000";
const API_BASE = "https://web-production-994b6.up.railway.app";
//web-production-994b6.up.railway.app
// Navigation Logic
function showSection(sectionId) {
    document.querySelectorAll('section').forEach(s => s.classList.remove('active-section'));
    document.getElementById(`${sectionId}-section`).classList.add('active-section');
    
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    // Handle cases where function is called via button click
    if (event && event.target) {
        event.target.classList.add('active');
    }
}

// 1. Disease Detection Logic
const dropZone = document.getElementById('drop-zone');
const imageInput = document.getElementById('imageInput');
const preview = document.getElementById('preview');

dropZone.onclick = () => imageInput.click();

imageInput.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    preview.src = URL.createObjectURL(file);
    preview.style.display = 'block';
    document.querySelector('.upload-content p').style.display = 'none';

    const formData = new FormData();
    formData.append('file', file);

    const output = document.getElementById('disease-output');
    output.innerHTML = "Analyzing image...";

    try {
        const response = await fetch(`${API_BASE}/predict-disease`, {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        const diseaseName = data.disease || "Unknown"; 

        output.innerHTML = `
            <div style="font-size: 1.2rem; color: #2d6a4f;">
                <strong>Disease:</strong> ${diseaseName.replace(/___/g, ' ').replace(/_/g, ' ')}
            </div>
            <div style="margin-top: 10px;">
                Confidence: ${(data.confidence * 100).toFixed(2)}%
            </div>
        `;
    } catch (error) {
        output.innerHTML = "Error connecting to server.";
    }
};

// 2. Crop & Fertilizer Recommendation Logic
document.getElementById('soilForm').onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    const outputBanner = document.getElementById('soil-output');
    outputBanner.style.display = 'block';
    outputBanner.innerHTML = "Processing soil data...";

    try {
        const response = await fetch(`${API_BASE}/recommend-all`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();

        outputBanner.innerHTML = `
            Recommended Crop: <span style="color: #2d6a4f;">${result.recommended_crop}</span><br>
            Suggested Fertilizer: <span style="color: #2d6a4f;">${result.recommended_fertilizer}</span>
        `;
    } catch (error) {
        outputBanner.innerHTML = "Error fetching recommendations.";
    }
};

// 3. Targeted Fertilizer Recommendation Logic
document.getElementById('fertForm').onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    const outputBanner = document.getElementById('fert-output');
    outputBanner.style.display = 'block';
    outputBanner.innerHTML = "Calculating Fertilizer...";

    try {
        const response = await fetch(`${API_BASE}/recommend-fertilizer`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();

        if (result.recommended_fertilizer) {
            outputBanner.innerHTML = `Recommended Fertilizer: <span style="color: #2d6a4f;">${result.recommended_fertilizer}</span>`;
        } else {
            outputBanner.innerHTML = "No recommendation found for these parameters.";
        }
    } catch (error) {
        outputBanner.innerHTML = "Error connecting to server.";
    }
};