class App {
    /* 가장 처음 시작되는 함수 */
    constructor() {
        this.canvas = document.createElement('canvas'); /* canvas 생성 */
        this.ctx = this.canvas.getContext('2d'); /* 2차원 렌더링 */
        document.body.appendChild(this.canvas); /* body에 canvas 추가 */

        this.waveGroup = new WaveGroup(); /* WaveGroup 클래스 선언 */

        window.addEventListener(
            'resize',
            this.resize.bind(this),
            false
        ); /* 화면 크기 재조정 감지 시 resize 실행 */
        this.resize(); /* resize 실행 */

        requestAnimationFrame(this.animate.bind(this)); /* animate 실행 */
    }

    /* 크기 조절 함수 */
    resize() {
        this.stageWidth = document.body.clientWidth; /* 너비 : 사용자 창 너비 */
        this.stageHeight = document.body.clientHeight; /* 높이 : 사용자 창 높이 */

        this.canvas.width = this.stageWidth * 2; /* canvas 너비 : 화면 너비 * 2 */
        this.canvas.height = this.stageHeight * 2; /* canvas 높이 : 화면 높이 * 2 */
        this.ctx.scale(2, 2); /* canvas 확대 */

        this.waveGroup.resize(
            this.stageWidth,
            this.stageHeight
        ); /* WaveGroup에 resize 실행 */
    }

    /* 애니메이션 함수 */
    animate(t) {
        this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight); /* canvas 지움 */

        this.waveGroup.draw(this.ctx); /* WaveGroup에 draw 실행 */

        requestAnimationFrame(
            this.animate.bind(this)
        ); /* animate 실행 (animate를 계속해서 반복) */
    }
}

class WaveGroup {
    /* 가장 처음 시작되는 함수 */
    constructor() {
        this.totalWaves = 3; /* 파도 개수 3개 */
        this.totalPoints = 6; /* 움직일 기준 점 6개 */

        /* this.color = ['rgba(255,0,0,0.4)', 'rgba(255,255,0,0.4)', 'rgba(0,255,255,0.4)']; */ /* 색 설정 */
        this.color = ['rgba(0,199,235,0.4)', 'rgba(0,146,199,0.4)', 'rgba(0,87,158,0.4)'];

        this.waves = []; /* 파도를 모아놓을 array */

        /* 파도 수 만큼 Wave클래스 실행 */
        for (let i = 0; i < this.totalWaves; i++) {
            const wave = new Wave(
                i,
                this.totalPoints,
                this.color[i]
            ); /* 몇 번째 파도인지, 기준점의 수, 색 전달 */
            this.waves[i] = wave; /* waves array에 Wave클래스 선언 */
        }
    }

    /* 크기 조절 함수 */
    resize(stageWidth, stageHeight) {
        /* 파도 수 만큼 조절 */
        for (let i = 0; i < this.totalWaves; i++) {
            const wave = this.waves[i]; /* 각 파도의 Wave클래스를 불러옴 */
            wave.resize(stageWidth, stageHeight); /* Wave클래스의 resize함수 실행 */
        }
    }

    /* 그리기 함수 */
    draw(ctx) {
        /* 파도 수 만큼 그림 */
        for (let i = 0; i < this.totalWaves; i++) {
            const wave = this.waves[i]; /* 각 파도의 Wave클래스를 불러옴 */
            wave.draw(ctx); /* Wave클래시의 draw함수 실행 */
        }
    }
}

class Wave {
    /* 가장 처음 시작되는 함수 */
    constructor(index, totalPoints, color) {
        this.index = index; /* 전달 받은 파도 번호 */
        this.totalPoints = totalPoints; /* 전달 받은 기준점 개수 */
        this.color = color; /* 전달 받은 색 */
        this.points = []; /* 기준점 array */
    }

    /* 크기 조절 함수 */
    resize(stageWidth, stageHeight) {
        this.stageWidth = stageWidth; /* 화면 너비 */
        this.stageHeight = stageHeight; /* 화면 높이 */

        this.centerX = stageWidth / 2; /* 화면 너비의 중앙 */
        this.centerY = stageHeight / 2; /* 화면 높이의 중앙 */

        this.pointGap = this.stageWidth / (this.totalPoints - 1); /* 점과의 거리 */

        this.init(); /* init 실행 */
    }

    /* 기준점 조절하기 함수 */
    init() {
        this.points = []; /* array 비움 */

        /* 점 수 만큼 움직임 */
        for (let i = 0; i < this.totalPoints; i++) {
            const point = new Point(
                this.index + i,
                this.pointGap * i,
                this.centerY
            ); /* 각 점의 Point클래스 불러옴 */
            this.points[i] = point; /* points array에 Point클래스 선언 */
        }
    }

    /* 그리기 함수 */
    draw(ctx) {
        ctx.beginPath(); /* 경로 시작 */
        ctx.fillStyle = this.color; /* 색 설정 */

        let prevX = this.points[0].x; /* 첫 이전 x값 = 첫 기준점 x값 */
        let prevY = this.points[0].y; /* 첫 이전 y값 = 첫 기준점 y값 */

        ctx.moveTo(prevX, prevY); /* prevX, prevY에서 시작 */

        /* 2번째 기준점 부터 그림 */
        for (let i = 1; i < this.totalPoints; i++) {
            if (i < this.totalPoints - 1) {
                this.points[
                    i
                ].update(); /* 첫 번째 기준점이나 마지막 기준점이 아니면 Point클래스에 update 실행 */
            }

            const cx = (prevX + this.points[i].x) / 2; /* cx는 이전 x값과 기준점의 중점 */
            const cy = (prevY + this.points[i].y) / 2; /* cy는 이전 y값과 기준점의 중점 */

            ctx.quadraticCurveTo(prevX, prevY, cx, cy); /* 곡선 그림 */

            prevX = this.points[i].x; /* 다음 이전 x값 = 현재 x값 */
            prevY = this.points[i].y; /* 다음 이전 y값 = 현재 y값 */
        }

        ctx.lineTo(prevX, prevY); /* 마지막 점까지 선 긋기 */
        ctx.lineTo(this.stageWidth, this.stageHeight); /* 화면 우측 하단으로 선 긋기 */
        ctx.lineTo(this.points[0].x, this.stageHeight); /* 화면 좌측 하단으로 선 긋기 */
        ctx.fill(); /* 선이 그어진 곳 칠하기 */
        ctx.closePath(); /* 경로 종료 */
    }
}

class Point {
    /* 가장 처음 시작되는 함수 */
    constructor(index, x, y) {
        this.x = x; /* 기준점의 x값 */
        this.y = y; /* 기준점의 y값 */
        this.fixedY = y; /* 기준 y값 (화면 높이의 중앙 값) */
        this.speed = 0.1; /* 속도 */
        this.cur = index; /* 파도 번호 + 파도의 기준점 번호 */
        this.max = Math.random() * 100 + 150; /* 최댓값 = 난수 * 100 + 150 */
    }

    /* 기준점 위치 업데이트 함수 */
    update() {
        this.cur += this.speed; /* cur 증가 */
        this.y =
            this.fixedY +
            Math.sin(this.cur) *
                this
                    .max; /* cur이 증가함에 따라 사인함수의 y값이 최댓값까지 파도의 형태로 이루어지고 기준 y값에서 위 아래로 움직임 */
    }
}

/* window에 App클래스 실행 */
window.onload = () => {
    new App();
};
