document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('introVideo');
    const videoContainer = document.querySelector('.video-container');
    const playPauseBtn = document.querySelector('.play-pause-btn');
    const playPauseOverlay = document.querySelector('.play-pause-overlay');

    // 自动播放视频
    function playVideo() {
        video.play().catch(function(error) {
            console.log("视频自动播放失败:", error);
        });
    }

    // 更新播放/暂停按钮图标
    function updatePlayPauseIcon() {
        playPauseBtn.innerHTML = video.paused ? 
            '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="#333"/></svg>' :
            '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill="#333"/></svg>';
    }

    // 点击视频容器切换播放/暂停
    videoContainer.addEventListener('click', () => {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
        updatePlayPauseIcon();
    });

    // 视频播放状态改变时更新图标
    video.addEventListener('play', updatePlayPauseIcon);
    video.addEventListener('pause', updatePlayPauseIcon);

    // 页面加载完成后尝试自动播放
    playVideo();
});

// 点击附宝进入下一页
function enterWorld() {
    window.location.href = 'world-map.html';
} 