const clockEl = document.getElementById('appointments__time-id');

function startTime() {
  if (!clockEl) {
    console.log('Use "appointments__time-id" as ID to start clock');
    return;
  }

  const d = new Date();
  const amOrPm = (d.getHours() < 12) ? 'AM' : 'PM';
  const hour = (d.getHours() < 12) ? d.getHours() : d.getHours() - 12;

  clockEl.innerHTML = hour + ':' + d.getMinutes() + ' ' + amOrPm;
  clockEl.setAttribute('datetime', `${d.getFullYear()}-${ d.getMonth()}-${d.getDate()}`);
  setTimeout(startTime, 500);
}

startTime();
