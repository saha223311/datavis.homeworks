const checkbox = document.getElementById('checkbox_id')
const label = document.getElementById('label_id')
const path = document.getElementById("path_id")

checkbox.addEventListener('change', (event) => {
  if (event.target.checked) {
    label.innerHTML = "Happy"
    path.setAttribute("d", "M 150 200 Q 225 300 300 200");
  } else {
    label.innerHTML = "Sad"
    path.setAttribute("d", "M 150 250 Q 225 150 300 250");
  }
})