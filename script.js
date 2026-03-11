document.addEventListener('DOMContentLoaded', () => {

    // 🌟 전역 마우스 좌표 (모든 하이엔드 모션이 공유)
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // =========================================================
    // --- 0. Cinematic Loader Logic ---
    // =========================================================
    const loader = document.getElementById('loader');
    const progressBar = document.querySelector('.progress-bar');
    const loadingStatus = document.querySelector('.loading-status');

    let progress = 0;
    const duration = 1500; // 1.5초
    const intervalTime = 15;
    const increment = 100 / (duration / intervalTime);

    const loadingInterval = setInterval(() => {
        progress += increment;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);
            setTimeout(() => {
                loader.classList.add('loaded');
                setTimeout(() => { loader.style.display = 'none'; }, 1200);
            }, 300);
        }
        progressBar.style.width = `${progress}%`;
        loadingStatus.innerText = `${Math.floor(progress)}%`;
    }, intervalTime);


    // =========================================================
    // --- 1. Custom Cursor ---
    // =========================================================
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    let cursorX = mouseX, cursorY = mouseY;
    let followerX = mouseX, followerY = mouseY;

    function renderCursor() {
        cursorX += (mouseX - cursorX) * 0.5;
        cursorY += (mouseY - cursorY) * 0.5;
        followerX += (mouseX - followerX) * 0.15;
        followerY += (mouseY - followerY) * 0.15;

        cursor.style.transform = `translate(calc(${cursorX}px - 50%), calc(${cursorY}px - 50%))`;
        follower.style.transform = `translate(calc(${followerX}px - 50%), calc(${followerY}px - 50%))`;
        requestAnimationFrame(renderCursor);
    }
    renderCursor();

    const hoverElements = document.querySelectorAll('.nav-item, .trigger-glitch, .chat-btn');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });


    // =========================================================
    // --- 2. Tab Navigation & 핏빛 Page Transition ---
    // =========================================================
    const navItems = document.querySelectorAll('.nav-item');
    const panels = document.querySelectorAll('.panel');
    const transitionLayer = document.querySelector('.transition-layer');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (item.classList.contains('active')) return;

            transitionLayer.classList.remove('is-leaving');
            transitionLayer.classList.add('is-active');

            setTimeout(() => {
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');

                const targetId = item.getAttribute('data-target');
                panels.forEach(panel => {
                    if (panel.id === targetId) {
                        panel.classList.add('active');
                    } else {
                        panel.classList.remove('active');
                    }
                });

                transitionLayer.classList.remove('is-active');
                transitionLayer.classList.add('is-leaving');
            }, 600);
        });
    });


    // =========================================================
    // --- 3. 3D Tilt Image Effect ---
    // =========================================================
    const imgCols = document.querySelectorAll('.img-col');
    imgCols.forEach(col => {
        const img = col.querySelector('.parallax-img');
        if (!img) return;

        col.addEventListener('mousemove', (e) => {
            const rect = col.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;
            img.style.transform = `scale(1.05) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        col.addEventListener('mouseleave', () => {
            img.style.transform = `scale(1.05) rotateX(0deg) rotateY(0deg)`;
            img.style.transition = "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)";
        });

        col.addEventListener('mouseenter', () => {
            img.style.transition = "none";
        });
    });


    // =========================================================
    // --- 4. Character Section: Typing Easter Egg ---
    // =========================================================
    const triggerGlitch = document.querySelector('.trigger-glitch');
    const typingText = document.getElementById('typing-text');
    const profileBox = document.querySelector('.profile-box');
    const profileOverlay = document.querySelector('.profile-overlay');

    let typingTimeout;
    let isTyping = false;

    if (triggerGlitch) {
        triggerGlitch.addEventListener('mouseenter', () => {
            if (isTyping) return;
            isTyping = true;

            typingText.classList.remove('is-active');
            typingText.style.opacity = '1';
            typingText.innerText = '';
            typingText.setAttribute('data-text', '');
            if (profileOverlay) profileOverlay.style.background = 'rgba(139,0,0,0.6)';

            const strFake = "{{user}}는 나의 가장 친한 친구다.";
            const strTrue = "네 세상엔 나만 있으면 되잖아.";

            let i = 0;
            function typeFake() {
                if (i < strFake.length) {
                    typingText.innerText += strFake.charAt(i);
                    i++;
                    typingTimeout = setTimeout(typeFake, 60);
                } else {
                    typingTimeout = setTimeout(deleteFake, 600);
                }
            }

            function deleteFake() {
                if (i > 0) {
                    typingText.innerText = strFake.substring(0, i - 1);
                    i--;
                    typingTimeout = setTimeout(deleteFake, 30);
                } else {
                    if (profileBox) profileBox.classList.add('is-glitching');
                    typingTimeout = setTimeout(typeTrue, 300);
                }
            }

            let j = 0;
            function typeTrue() {
                if (j < strTrue.length) {
                    typingText.innerText += strTrue.charAt(j);
                    j++;
                    typingTimeout = setTimeout(typeTrue, 60);
                } else {
                    typingText.setAttribute('data-text', strTrue);
                    typingText.classList.add('is-active');
                    isTyping = false;
                }
            }
            typeFake();
        });

        triggerGlitch.addEventListener('mouseleave', () => {
            clearTimeout(typingTimeout);
            isTyping = false;
            typingText.classList.remove('is-active');
            typingText.style.opacity = '0';
            typingText.innerText = '';
            if (profileBox) profileBox.classList.remove('is-glitching');
            if (profileOverlay) profileOverlay.style.background = 'rgba(139,0,0,0)';
        });
    }


    // =========================================================
    // --- 5. BGM Player Logic ---
    // =========================================================
    const bgmAudio = document.getElementById('bgm-audio');
    const bgmToggle = document.getElementById('bgm-toggle');
    const volumeSlider = document.getElementById('bgm-volume');
    const bgmStatusText = document.querySelector('.bgm-status-text');

    bgmAudio.volume = 0.5;
    let isBgmAutoPlayed = false;

    const updateBgmUI = (isPlaying) => {
        if (isPlaying) {
            bgmToggle.classList.add('is-playing');
            bgmStatusText.innerText = 'SOUND ON';
        } else {
            bgmToggle.classList.remove('is-playing');
            bgmStatusText.innerText = 'SOUND OFF';
        }
    };

    bgmToggle.addEventListener('click', () => {
        if (bgmAudio.paused) {
            bgmAudio.play();
            updateBgmUI(true);
        } else {
            bgmAudio.pause();
            updateBgmUI(false);
        }
    });

    const tryAutoPlay = () => {
        if (!isBgmAutoPlayed && bgmAudio.paused) {
            bgmAudio.play().then(() => {
                isBgmAutoPlayed = true;
                updateBgmUI(true);
            }).catch(() => console.log("Auto-play prevented by browser."));
        }
    };

    window.addEventListener('mousemove', tryAutoPlay, { once: true });
    window.addEventListener('scroll', tryAutoPlay, { once: true });
    window.addEventListener('click', tryAutoPlay, { once: true });

    volumeSlider.addEventListener('input', (e) => {
        bgmAudio.volume = e.target.value;
    });

    const bgmHoverElements = document.querySelectorAll('.bgm-toggle, .volume-slider');
    bgmHoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });


    // =========================================================
    // --- 6. Text Split Animation ---
    // =========================================================
    document.querySelectorAll('.reveal-text h2, .reveal-text h3').forEach(el => {
        const text = el.innerText;
        el.innerHTML = '';
        text.split('').forEach((char, i) => {
            const span = document.createElement('span');
            span.innerText = char;
            span.className = char === ' ' ? 'split-char space' : 'split-char';
            span.style.transitionDelay = `${i * 0.04}s`;
            el.appendChild(span);
        });
    });


    // =========================================================
    // --- 7. Magnetic UI ---
    // =========================================================
    const magnetics = document.querySelectorAll('.nav-item, .chat-btn, .bgm-toggle');
    magnetics.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
            const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
            btn.style.transform = `translate(${x}px, ${y}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0px, 0px)`;
        });
    });


    // =========================================================
    // --- 8. Image Reveal Observer ---
    // =========================================================
    const imgColsObs = document.querySelectorAll('.img-col');
    const imgObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const wrapper = entry.target.querySelector('.image-wrapper');
            if (entry.isIntersecting) {
                if (wrapper) wrapper.classList.add('is-revealed');
            } else {
                if (wrapper) wrapper.classList.remove('is-revealed');
            }
        });
    }, { threshold: 0.15 });
    imgColsObs.forEach(col => imgObserver.observe(col));


    // =========================================================
    // --- 9. Blood Cursor Trail ---
    // =========================================================
    const canvas = document.getElementById('blood-trail');
    const ctx = canvas.getContext('2d');
    let trails = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    document.addEventListener('mousemove', (e) => {
        trails.push({ x: e.clientX, y: e.clientY, alpha: 0.8, size: Math.random() * 2 + 1.5 });
    });

    function drawTrail() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < trails.length; i++) {
            const p = trails[i];
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(139, 0, 0, ${p.alpha})`;
            ctx.fill();

            p.alpha -= 0.015;
            p.size += 0.05;
        }
        trails = trails.filter(p => p.alpha > 0);
        requestAnimationFrame(drawTrail);
    }
    drawTrail();


    // =========================================================
    // --- 10. Circular Scroll Progress ---
    // =========================================================
    const progressRing = document.querySelector('.progress-ring-circle');
    const scrollProgressContainer = document.querySelector('.scroll-progress');
    const circumference = 2 * Math.PI * 24;

    document.querySelectorAll('.panel').forEach(panel => {
        panel.addEventListener('scroll', () => {
            if (!panel.classList.contains('active')) return;

            const scrollTop = panel.scrollTop;
            const scrollHeight = panel.scrollHeight - panel.clientHeight;

            if (scrollHeight > 50) {
                scrollProgressContainer.style.opacity = '1';
                const scrollPercent = scrollTop / scrollHeight;
                const offset = circumference - (scrollPercent * circumference);
                progressRing.style.strokeDashoffset = offset;
            } else {
                scrollProgressContainer.style.opacity = '0';
            }
        });
    });


    // =========================================================
    // --- 11. Liquid Scroll Skew ---
    // =========================================================
    let currentScrollY = 0;
    let targetScrollY = 0;
    const prologuePanel = document.getElementById('prologue');
    const skewContainer = document.querySelector('.webtoon-long-container');

    prologuePanel.addEventListener('scroll', () => {
        targetScrollY = prologuePanel.scrollTop;
    });

    function renderSkew() {
        currentScrollY += (targetScrollY - currentScrollY) * 0.1;
        let delta = targetScrollY - currentScrollY;
        let skew = delta * -0.05;
        skew = Math.max(-4, Math.min(4, skew));

        if (skewContainer && prologuePanel.classList.contains('active')) {
            skewContainer.style.transform = `skewY(${skew}deg)`;
        }
        requestAnimationFrame(renderSkew);
    }
    renderSkew();


    // =========================================================
    // --- 12. Crimson Click Ripple ---
    // =========================================================
    document.addEventListener('click', (e) => {
        const ripple = document.createElement('div');
        ripple.className = 'blood-ripple';
        ripple.style.left = `${e.clientX}px`;
        ripple.style.top = `${e.clientY}px`;

        const size = Math.random() * 50 + 60;
        ripple.style.width = `${size}px`;
        ripple.style.height = `${size}px`;

        document.body.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });


    // =========================================================
    // --- 13. Floating Ashes (재 파티클 복구 완료!) ---
    // =========================================================
    const ashCanvas = document.getElementById('ashes-canvas');
    const ashCtx = ashCanvas.getContext('2d');
    let ashes = [];

    function resizeAshCanvas() {
        ashCanvas.width = window.innerWidth;
        ashCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeAshCanvas);
    resizeAshCanvas();

    for (let i = 0; i < 70; i++) {
        ashes.push({
            x: Math.random() * ashCanvas.width,
            y: Math.random() * ashCanvas.height,
            r: Math.random() * 2 + 0.5,
            vx: (Math.random() - 0.5) * 0.5,
            vy: Math.random() * 1.5 + 0.5,
            alpha: Math.random() * 0.5 + 0.1
        });
    }

    function drawAshes() {
        ashCtx.clearRect(0, 0, ashCanvas.width, ashCanvas.height);

        ashes.forEach(ash => {
            ash.x += ash.vx;
            ash.y += ash.vy;

            // 이제 전역 mouseX, mouseY 값을 정상적으로 가져와 모세의 기적 효과 발동!
            const dx = mouseX - ash.x;
            const dy = mouseY - ash.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 120) {
                ash.x -= dx * 0.03;
                ash.y -= dy * 0.03;
            }

            if (ash.y > ashCanvas.height) ash.y = -10;
            if (ash.x > ashCanvas.width) ash.x = -10;
            if (ash.x < -10) ash.x = ashCanvas.width;

            ashCtx.beginPath();
            ashCtx.arc(ash.x, ash.y, ash.r, 0, Math.PI * 2);
            ashCtx.fillStyle = `rgba(180, 20, 20, ${ash.alpha})`;
            ashCtx.fill();
        });

        requestAnimationFrame(drawAshes);
    }
    drawAshes();


    // =========================================================
    // --- 14. Text Magnetic Spotlight ---
    // =========================================================
    const titleTexts = document.querySelectorAll('.panel-subtitle, .panel-title');

    document.addEventListener('mousemove', (e) => {
        titleTexts.forEach(text => {
            const rect = text.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const distanceX = e.clientX - centerX;
            const distanceY = e.clientY - centerY;
            const dist = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

            if (dist < 400) {
                const shadowX = -distanceX * 0.05;
                const shadowY = -distanceY * 0.05;
                text.style.textShadow = `${shadowX}px ${shadowY}px 10px rgba(139, 0, 0, 0.7), ${shadowX * 1.5}px ${shadowY * 1.5}px 25px rgba(255, 0, 0, 0.3)`;
            } else {
                text.style.textShadow = 'none';
            }
        });
    });

    // =========================================================
    // 🌟 HIGHI-END DETAILS PHASE 4 (심리적 압박) 🌟
    // =========================================================

    // --- 15. Don't Leave Me & Welcome Back Flash (탭 이탈 및 복귀 점프스케어) ---
    const originalTitle = document.title;
    const creepyTitles = ["어디 가?", "나만 보라고 했잖아", "돌아와...", "네 세상엔 나만 있으면 돼"];
    const jumpscare = document.getElementById('jumpscare');

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            const randomTitle = creepyTitles[Math.floor(Math.random() * creepyTitles.length)];
            document.title = randomTitle;
        } else {
            document.title = originalTitle;
            // 탭으로 돌아오는 즉시 점프스케어 애니메이션 강제 실행
            if (jumpscare) {
                jumpscare.classList.remove('is-flashing');
                void jumpscare.offsetWidth; // 브라우저 렌더링 리셋 (애니메이션 재시작용)
                jumpscare.classList.add('is-flashing');
            }
        }
    });

    // --- 16. Idle Anxiety (방치 감지: 핏빛 심장박동) ---
    let idleTimer;
    const resetIdleTimer = () => {
        document.body.classList.remove('is-idle');
        clearTimeout(idleTimer);
        // 5초 동안 마우스 움직임이나 스크롤이 없으면 발동
        idleTimer = setTimeout(() => {
            document.body.classList.add('is-idle');
        }, 5000);
    };

    // 사용자의 모든 행동 감지
    window.addEventListener('mousemove', resetIdleTimer);
    window.addEventListener('click', resetIdleTimer);
    window.addEventListener('keydown', resetIdleTimer);
    document.querySelectorAll('.panel').forEach(panel => {
        panel.addEventListener('scroll', resetIdleTimer, { passive: true });
    });
    resetIdleTimer(); // 초기 실행


    // --- 17. Chromatic Aberration on Scroll (스크롤 색수차 왜곡) ---
    let scrollTimeout;
    const triggerScrollDistortion = () => {
        document.body.classList.add('is-scrolling');
        clearTimeout(scrollTimeout);
        // 스크롤이 멈추고 0.15초 뒤에 원상복구
        scrollTimeout = setTimeout(() => {
            document.body.classList.remove('is-scrolling');
        }, 150);
    };

    window.addEventListener('scroll', triggerScrollDistortion, { passive: true });
    document.querySelectorAll('.panel').forEach(panel => {
        panel.addEventListener('scroll', triggerScrollDistortion, { passive: true });
    });


    // --- 18. Cursed Chat Button + Fake Push + BGM Drop + Gateway Glitch ---
    const chatBtn = document.querySelector('.chat-btn');
    const chatBtnText = chatBtn ? chatBtn.querySelector('.btn-text') : null;
    const fakePush = document.getElementById('fake-push');
    const gatewayTerminal = document.getElementById('gateway-terminal');
    const terminalContent = document.getElementById('terminal-content');

    // BGM 요소를 가져옵니다 (Phase 7 BGM 텐션 드롭용)
    const bgmAudioRef = document.getElementById('bgm-audio');
    const volumeSliderRef = document.getElementById('bgm-volume');
    let cursedTimer;

    if (chatBtn && chatBtnText) {

        // [호버 이벤트] 2초 대기 시 저주 발동
        chatBtn.addEventListener('mouseenter', () => {
            cursedTimer = setTimeout(() => {
                chatBtn.classList.add('is-cursed');
                chatBtnText.innerText = "나만 봐";
                if (fakePush) fakePush.classList.add('is-visible');

                // 🌟 Phase 7: BGM Tension Drop (숨멎 연출: 볼륨을 10%로 확 줄임)
                if (bgmAudioRef) bgmAudioRef.volume = 0.1;
            }, 2000);
        });

        // [리브 이벤트] 마우스 떼면 원상 복구
        chatBtn.addEventListener('mouseleave', () => {
            clearTimeout(cursedTimer);
            chatBtn.classList.remove('is-cursed');
            chatBtnText.innerText = "채팅 바로가기";
            if (fakePush) fakePush.classList.remove('is-visible');

            // 🌟 Phase 7: BGM 볼륨 원래대로 복구 (슬라이더에 맞춰서)
            if (bgmAudioRef) bgmAudioRef.volume = volumeSliderRef ? volumeSliderRef.value : 0.5;
        });

        // 🌟 Phase 7: [클릭 이벤트] The Gateway Glitch (해킹 연출 후 이동)
        chatBtn.addEventListener('click', (e) => {
            e.preventDefault(); // 기본 링크 이동을 잠시 막음
            const targetUrl = chatBtn.getAttribute('href');

            if (gatewayTerminal) {
                // 터미널 창 띄우기
                gatewayTerminal.classList.add('is-active');
                if (bgmAudioRef) bgmAudioRef.pause(); // 해킹될 때 음악 뚝 끊기게 (옵션)

                // 쏟아질 해킹 텍스트들
                const lines = [
                    "> Connecting to Crack AI Chatting Server...",
                    "> Target: 이다비 (DABI LEE)",
                    "> Bypass security protocol: SUCCESS",
                    "> Loading memory logs...",
                    "> ERROR: Memory corrupted.",
                    "> WARNING: 통제권 상실. 그녀가 당신을 발견했습니다.",
                    "> System redirecting..."
                ];

                terminalContent.innerHTML = '';
                let lineIndex = 0;

                // 타이핑 대신 한 줄씩 탁, 탁, 탁 띄우는 함수
                const printLine = () => {
                    if (lineIndex < lines.length) {
                        const p = document.createElement('p');
                        p.className = 'terminal-line';
                        if (lines[lineIndex].includes('WARNING')) {
                            p.classList.add('warning'); // 경고 문구는 핏빛으로
                        }
                        p.innerText = lines[lineIndex];
                        terminalContent.appendChild(p);
                        lineIndex++;

                        // 다음 줄이 나오는 간격을 랜덤하게(0.1초~0.3초) 주어 진짜 시스템 같게 연출
                        const nextDelay = Math.random() * 200 + 100;
                        setTimeout(printLine, nextDelay);
                    } else {
                        // 텍스트 출력이 다 끝나면 0.5초 뒤에 실제 크랙 채팅방으로 새 창 열기
                        setTimeout(() => {
                            window.open(targetUrl, '_blank');

                            // 새 창이 열린 뒤, 현재 페이지는 원래대로 리셋 (다시 돌아왔을 때를 대비)
                            gatewayTerminal.classList.remove('is-active');
                            terminalContent.innerHTML = '';
                            if (bgmAudioRef) bgmAudioRef.play();
                        }, 500);
                    }
                };
                printLine(); // 해킹 연출 시작!
            } else {
                // 만약 터미널 태그가 없다면 그냥 정상적으로 열기
                window.open(targetUrl, '_blank');
            }
        });
    }

    // --- 19. Keyboard Easter Egg (타이핑 감지) ---
    let keyBuffer = '';
    const blackoutScreen = document.getElementById('blackout-screen');

    window.addEventListener('keydown', (e) => {
        // 입력된 키를 소문자로 버퍼에 누적
        keyBuffer += e.key.toLowerCase();

        // 최근 4글자만 유지
        if (keyBuffer.length > 4) {
            keyBuffer = keyBuffer.slice(-4);
        }

        // 유저가 'dabi' 라고 치면 발동
        if (keyBuffer === 'dabi') {
            if (blackoutScreen) {
                blackoutScreen.classList.add('is-active');
                // 2초 뒤에 핏빛 화면 다시 걷힘
                setTimeout(() => {
                    blackoutScreen.classList.remove('is-active');
                }, 2000);
            }
            keyBuffer = ''; // 버퍼 초기화
        }
    });

    // =========================================================
    // 🌟 HIGHI-END DETAILS PHASE 6 (심연의 기믹) 🌟
    // =========================================================

    // --- 20. The Stalker's Eye (감시자의 눈동자) ---
    const stalkerEye = document.getElementById('stalker-eye');
    let eyeX = window.innerWidth / 2;
    let eyeY = window.innerHeight / 2;

    function renderStalkerEye() {
        // 커서(0.5)나 파티클보다 훨씬 느리고 묵직한 속도(0.02)로 유저를 따라감
        eyeX += (mouseX - eyeX) * 0.015;
        eyeY += (mouseY - eyeY) * 0.015;

        if (stalkerEye) {
            stalkerEye.style.transform = `translate(calc(${eyeX}px - 50%), calc(${eyeY}px - 50%))`;
        }
        requestAnimationFrame(renderStalkerEye);
    }
    renderStalkerEye();


    // --- 21. The Shatter (분노의 화면 붕괴) ---
    const logo = document.querySelector('.nav-logo');
    let logoClickCount = 0;
    let logoClickTimer;

    if (logo) {
        logo.addEventListener('click', () => {
            logoClickCount++;
            clearTimeout(logoClickTimer);

            // 3번 연속 클릭 시 발동!
            if (logoClickCount >= 3) {
                // 1. 화면 전체 붕괴 애니메이션
                document.body.classList.add('is-shattered');

                // 2. 로고가 영원히 핏빛으로 변함
                logo.classList.add('is-bloody');

                // 0.4초 뒤에 화면 찢어짐 효과는 종료 (화면은 정상으로, 로고는 핏빛으로 유지)
                setTimeout(() => {
                    document.body.classList.remove('is-shattered');
                }, 400);

                logoClickCount = 0; // 초기화
            } else {
                // 1초 안에 연속으로 3번을 누르지 않으면 카운트 리셋
                logoClickTimer = setTimeout(() => {
                    logoClickCount = 0;
                }, 1000);
            }
        });
    }

}); // DOMContentLoaded 닫기