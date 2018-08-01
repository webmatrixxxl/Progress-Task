const clockEl = document.getElementById('appointments__time-id');

function startTime() {
  if (!clockEl) {
    console.log('Use "appointments__time-id" as ID to start clock');
    return;
  }

  const today = new Date();
  const amOrPm = (today.getHours() < 12) ? 'AM' : 'PM';
  const h = today.getHours();
  let m = today.getMinutes();
  let s = today.getSeconds();
  m = checkTime(m);
  s = checkTime(s);

  clockEl.innerHTML = h + ':' + m + ' ' + amOrPm;
  clockEl.setAttribute('datetime', `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`);
  setTimeout(startTime, 500);
}

function checkTime(i) {
  if (i < 10) {i = '0' + i};
  return i;
}

startTime();
