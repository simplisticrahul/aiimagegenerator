
document.addEventListener("DOMContentLoaded", function () {
    // Function to create a new iframe
    function createNewIframe() {
        const iframe = document.createElement("iframe");
        iframe.frameBorder = 0;
        iframe.style.width = "100%";
        iframe.style.height = "100%"; // Ensure it takes full height of the viewport

        document.body.appendChild(iframe);
        return iframe;
    }

    // Function to open images in separate iframes and adjust iframe size
    function openImageInIframe(imageUrl, backgroundColor) {
        const imageFrame = createNewIframe();

        // Set the background color of the iframe
        imageFrame.style.backgroundColor = backgroundColor;

        // Create an image element to get the image size
        const img = new Image();
        img.src = imageUrl;

        img.onload = function () {
            // Load the image in the iframe, and make it responsive within iframe
            const iframeDoc = imageFrame.contentWindow.document;
            iframeDoc.body.style.margin = "0";
            iframeDoc.body.style.overflow = "hidden";
            iframeDoc.body.innerHTML = `<img src="${imageUrl}" style="width: 100%; height: 100%; object-fit: contain;">`;
        };

        img.onerror = function () {
            console.error(`Failed to load image from ${imageUrl}`);
        };
    }

    // Add event listener to the Split Sentences button
    document.getElementById("splitButton").addEventListener("click", function () {
        const inputText = document.getElementById("inputText").value;
        const sentences = inputText.split(/\s*[.!?]\s*/).filter(sentence => sentence.trim() !== "");
        const outputContainer = document.getElementById("outputContainer");

        outputContainer.innerHTML = ""; // Clear previous output

        sentences.forEach((sentence) => {
            const sentenceTextarea = document.createElement("textarea");
            sentenceTextarea.classList.add("output-box");
            sentenceTextarea.value = sentence;
            outputContainer.appendChild(sentenceTextarea);
        });
    });

    // Add event listener to the Apply Styles button
    document.getElementById("pasteTextButton").addEventListener("click", function () {
        const editableBox = document.getElementById("editableBox").value;
        const sentenceTextareas = document.querySelectorAll(".output-box");

        sentenceTextareas.forEach(sentenceTextarea => {
            sentenceTextarea.value += " " + editableBox; // Append text
        });
    });

    // Get the custom model input
    const customModelInput = document.getElementById("customModel");

    // Add event listener to the Fetch from Internet button
    document.getElementById("fetchButton").addEventListener("click", async function () {
        const sentences = document.querySelectorAll(".output-box");
        const selectedModels = document.querySelectorAll('input[name="model"]:checked');
        let models = [];

        // Add selected checkboxes
        selectedModels.forEach(model => {
            models.push(model.value);
        });

        // Add custom model if specified
        const customModel = customModelInput.value.trim();
        if (customModel) {
            models.push(customModel); // Add to models list
        }

        let seed = document.getElementById("seed").value;
        let width = document.getElementById("width").value;
        let height = document.getElementById("height").value;

        // Validate seed, width, and height values
        if (!seed) {
            seed = "1234";
            document.getElementById("seed").value = seed;
        }
        width = isNaN(width) || width <= 0 ? 1920 : width;
        height = isNaN(height) || height <= 0 ? 1080 : height;

        // Clear any existing iframes
        const existingIframes = document.querySelectorAll("iframe");
        existingIframes.forEach(iframe => document.body.removeChild(iframe));

        // Process models and sentences to generate images
        models.forEach(async (model) => {
            sentences.forEach(async (sentence) => {
                const prompt = encodeURIComponent(sentence.value);

                // Construct the URL with model, dimensions, and seed
                const url = `https://image.pollinations.ai/prompt/${prompt}?width=${width}&height=${height}&seed=${seed}&nologo=true&nofeed=yes&model=${model}&referrer=simplisticrahul.github.io`;

                console.log(`Model: ${model}`); // Debug: Log selected model
                console.log(`URL: ${url}`); // Debug: Log the full URL

                // Load image in an iframe
                openImageInIframe(url, "#2c3e50");
            });
        });
    });
});
