const clockEl = document.getElementById('appointments__time-id');

function startTime() {
  const d = new Date();
  const amOrPm = (d.getHours() < 12) ? 'AM' : 'PM';
  const hour = (d.getHours() < 12) ? d.getHours() : d.getHours() - 12;

  clockEl.innerHTML = hour + ':' + d.getMinutes() + ' ' + amOrPm;
  clockEl.setAttribute('datetime', `${d.getFullYear()}-${ d.getMonth()}-${d.getDate()}`);
  setTimeout(startTime, 500);
}


startTime();
