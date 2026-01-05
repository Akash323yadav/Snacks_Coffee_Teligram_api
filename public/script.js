async function submitData() {
  try {
    const method = document.getElementById("method").value;
    const module = document.getElementById("module").value.trim();
    const category = document.getElementById("category").value.trim();
    const parameter = document.getElementById("parameter").value.trim();

    const titleEl = document.getElementById("title");
    const descriptionEl = document.getElementById("description");
    const stepsEl = document.getElementById("steps");
    const videoEl = document.getElementById("video");

    let url = `/api/content/${module}/${parameter}`;
    if (category) {
      url = `/api/content/${module}/${category}/${parameter}`;
    }

    let options = { method };

    // ✅ GET request me body nahi bhejte
    if (method !== "GET") {
      const formData = new FormData();

      formData.append("title", titleEl.value);
      formData.append("description", descriptionEl.value);

      const stepsArray = stepsEl.value
        .split(",")
        .map(s => s.trim())
        .filter(Boolean);

      formData.append("steps", JSON.stringify(stepsArray));

      if (videoEl.files && videoEl.files[0]) {
        formData.append("video", videoEl.files[0]);
      }

      options.body = formData;
    }

    const res = await fetch(url, options);

    if (!res.ok) {
      throw new Error(`HTTP Error: ${res.status}`);
    }

    const data = await res.json();

    document.getElementById("result").innerText =
      JSON.stringify(data, null, 2);

  } catch (err) {
    console.error(err);
    document.getElementById("result").innerText =
      " Error: " + err.message;
  }
}
