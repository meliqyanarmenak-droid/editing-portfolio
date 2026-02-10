const wrapper = document.querySelector('.video-wrapper');
const items = Array.from(wrapper.querySelectorAll('.video-item'));
const videos = items.map(i => i.querySelector('video'));

const leftBtn = document.querySelector('.arrow.right');
const rightBtn = document.querySelector('.arrow.left');

if (!isMobileDevice()) {
  leftBtn.onclick = () => {
    if (centerIndex > MIN_CENTER) {
      centerIndex--;
      updateSlider();
    }
  };

  rightBtn.onclick = () => {
    if (centerIndex < MAX_CENTER) {
      centerIndex++;
      updateSlider();
    }
  };
} else {
  leftBtn.style.display = 'none';
  rightBtn.style.display = 'none';
  leftBtn.onclick = null;
  rightBtn.onclick = null;
}

const VIDEO_WIDTH = 340;
const MIN_CENTER = 0;
const MAX_CENTER = 5;
let centerIndex = 2;

function updateSlider() {
  const offset = (centerIndex - 2) * VIDEO_WIDTH;
  wrapper.style.transform = `translateX(${-offset}px)`;

  items.forEach((item, i) => {
    item.classList.remove('active', 'near');

    if (i === centerIndex) item.classList.add('active');
    else if (Math.abs(i - centerIndex) === 1) item.classList.add('near');
  });
}

rightBtn.onclick = () => {
  if (centerIndex > MIN_CENTER) {
    centerIndex--;
    updateSlider();
  }
};

leftBtn.onclick = () => {
  if (centerIndex < MAX_CENTER) {
    centerIndex++;
    updateSlider();
  }
};

function toggleVideo(video, item) {
  if (video.paused) {
    videos.forEach(v => {
      v.pause();
      v.currentTime = 0;
    });
    items.forEach(i => i.classList.remove('playing'));

    video.muted = false;
    video.playsInline = true;
    video.play();
    item.classList.add('playing');
  } else {
    video.pause();
    item.classList.remove('playing');
  }
}

items.forEach((item, index) => {
  const video = videos[index];

  item.addEventListener('click', () => {
    toggleVideo(video, item);
  });
});


const wide = document.querySelector('.wide-video-inner');
if (wide) {
  const video = wide.querySelector('video');

  wide.addEventListener('click', () => {
    if (video.paused) {
      video.muted = false;
      video.play();
      wide.classList.add('playing');
    } else {
      video.pause();
      wide.classList.remove('playing');
    }
  });
}

updateSlider();

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const targetId = link.getAttribute('href');
    const target = document.querySelector(targetId);

    if (!target) return;

    e.preventDefault();

    target.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  });
});

window.addEventListener('scroll', () => {
    const bg = document.querySelector('.bg-overlay');
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5; 
    
    bg.style.transform = `translate3d(0, ${rate}px, -1px) scale(1.2)`;
});

const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

if (isMobile) {
  const videoViewport = document.querySelector('.video-viewport');
  const videoWrapper = document.querySelector('.video-wrapper');
  
  let isDragging = false;
  let startX = 0;
  let scrollLeft = 0;
  
  document.querySelectorAll('.arrow').forEach(arrow => {
    arrow.style.display = 'none';
  });
  
  videoViewport.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].pageX - videoViewport.offsetLeft;
    scrollLeft = videoViewport.scrollLeft;
    videoViewport.style.cursor = 'grabbing';
  });
  
  videoViewport.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.touches[0].pageX - videoViewport.offsetLeft;
    const walk = (x - startX) * 2; // Скорость скролла
    videoViewport.scrollLeft = scrollLeft - walk;
  });
  
  videoViewport.addEventListener('touchend', () => {
    isDragging = false;
    videoViewport.style.cursor = 'grab';
  });
  
  let scrollTimeout;
  videoViewport.addEventListener('scroll', () => {
    videoWrapper.style.transition = 'none';
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      videoWrapper.style.transition = 'transform 0.6s ease';
    }, 100);
  });
  
  const hint = document.createElement('div');
  hint.className = 'mobile-scroll-hint';
  hint.innerHTML = 'Свайпайте для просмотра видео';
  document.querySelector('.video-section').appendChild(hint);
  
  videoViewport.addEventListener('scroll', updateActiveVideoOnScroll);
  
  function updateActiveVideoOnScroll() {
    const scrollCenter = videoViewport.scrollLeft + videoViewport.clientWidth / 2;
    const items = document.querySelectorAll('.video-item');
    
    items.forEach(item => {
      const itemCenter = item.offsetLeft + item.offsetWidth / 2;
      const distance = Math.abs(scrollCenter - itemCenter);
      
      item.classList.remove('active', 'near');
      
      if (distance < item.offsetWidth / 3) {
        item.classList.add('active');
      } else if (distance < item.offsetWidth) {
        item.classList.add('near');
      }
    });
  }
  
  updateActiveVideoOnScroll();
} else {
  document.querySelectorAll('.arrow').forEach(arrow => {
    arrow.style.display = 'block';
  });
}

function isMobileDevice() {
  return ('ontouchstart' in window || navigator.maxTouchPoints > 0) && window.innerWidth <= 768;
}



