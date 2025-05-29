let bgUrl = null;
let changing = false;

function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

async function changeBG() {
  /** @type {HTMLAnchorElement} */
  const bgInfoA = document.getElementById('bg-info');
  /** @type {HTMLAnchorElement} */
  const changeElem = document.getElementById('change');

  const task = async () => {
    if (bgUrl) URL.revokeObjectURL(bgUrl);

    const [bgInfo, bg] = await fetchBG();
    bgUrl = URL.createObjectURL(bg);

    // animation
    const bgElement = document.getElementById('bg');
    bgElement.style.animation = `bg-fade-out 1s cubic-bezier(0, 0, 0.2, 1)`;

    // wait animation
    await new Promise((resolve) => {
      bgElement.addEventListener('animationend', resolve, { once: true });
    });

    bgElement.style.backgroundImage = `url("${bgUrl}")`;
    bgElement.style.animation = `bg-fade-in 1s cubic-bezier(0, 0, 0.2, 1)`;

    // show pic info
    bgInfoA.innerText = bgInfo.title;
    bgInfoA.href = `https://www.pixiv.net/artworks/${bgInfo.pid}`;
  };

  if (changing) return;
  changing = true;

  // eslint-disable-next-line no-script-url
  changeElem.href = 'javascript:void(0)';
  // bgInfoA.href = '#';
  bgInfoA.innerText = 'Loading~';

  try {
    await task();
  } catch (e) {
    console.log(e);
    await sleep(3 * 1000);
    await changeBG();
  }

  changing = false;
  // eslint-disable-next-line no-script-url
  changeElem.href = 'javascript:changeBG()';
}
