//優先課題
//コードの整理（見にくすぎる）
//

//【残り工程】
//【表示関係】
//今までの正解不正解の表示

//【システム】
//改行システム
//正解判定
//正解不正解のtrue記述？。012が良いかも。pushで　成否の配列results[]
//終了判定

//【その他】
//外部リンク貼るか
//終了後どうするか
//スマホの画面直したとき，画面のみ再リロードさせる。
//効果音
//BGM

//【チェック】
//問題の生成大丈夫？
//処理が重い。sTime？timerどちらか。


//canvas設定
const CANVAS = document.getElementById("canvas");
const CTX = CANVAS.getContext("2d");

//運用時のキャンバスの大きさ
CANVAS.width = window.innerWidth;
CANVAS.height = window.innerHeight;
//CANVAS.width = 1600;開発時の初期画面サイズ
//CANVAS.height = 900;開発時の初期画面サイズ
console.log(CANVAS.width);
console.log(CANVAS.height);

//画像
const CORRECT_IMG = new Image();
CORRECT_IMG.src = "img/correct.png";
const MISTAKE_IMG = new Image();
MISTAKE_IMG.src = "img/mistake.png";

//重要なパラメーター
const FPS = 10;
let protoQuestions = [
    ["アジアで初めてベートーヴェンの交響曲第九番が演奏された地域はどこ？", "鳴門市", "徳島市", "小松島市", "吉野川市"],
    ["次の有名人のうち，徳島出身でない人は誰？", "大塚愛さん", "アンジェラアキさん", "米津玄師さん", "板東英二さん"],
];

//その他
let nowTime = 0;
let TimerTime = 0;
let remainowTime = 0;
let s = 0;


//timerで仕様
let startTime = 0;
let gameRound = null;

const BODY = document.getElementById("body");//消してもいい

/**
 * レスポンシブ対応のクラス
 *
 * スマホ判定+横向き依頼
 * isSmartPhone()
 *
 * フォントサイズのレスポンシブ
 * timeFont()
 * answerCircleFont()
 *
 * コンストラクター【MOBILE】
 */
class mobile {
    //もしスマホなら横向きに直すようにお願いする（半強制）。
    isSmartPhone() {
        if (navigator.userAgent.match(/iPhone|Android.+Mobile/)) {
            if (window.innerHeight > window.innerWidth) {
                alert("このゲームは横向き対応です。横向きに変更した後，再度更新し直してください");
                CTX.fillStyle = "black";
                CTX.globalAlpha = 0.7;                                                          //画面暗くして強制的に促す。
                CTX.fillRect(0, 0, CANVAS.width, CANVAS.height);
            }
            return true;
        } else {
            console.log("PCかタブレット");
            return false;
        }
    }
    //解答番号の文字の大きさ
    answerCircleFont() {
        if (navigator.userAgent.match(/iPhone|Android.+Mobile/)) {
            CTX.font = "20px serif";
            return true;
        } else {
            CTX.font = "50px serif";
        }
    }
    //時間の文字の大きさ
    timeFont() {
        if (navigator.userAgent.match(/iPhone|Android.+Mobile/)) {
            CTX.font = "18px serif";
            return true;
        } else {
            CTX.font = "40px serif";
        }
    }
}
const MOBILE = new mobile();


/**
 * クリック判定
 */
//let clickJudge = false;

let clickNumber = 0;
canvas.addEventListener("click", onClick, false);
function onClick(e) {
    let clickX = 0;
    let clickY = 0;

    //clientXブラウザの端から+キャンバスからのクリック位置-offsetLeft：キャンバスまでの長さ＝正確なクリック位置【ボツ】
    /*     clickX = e.clientX - CANVAS.offsetLeft;
        clickY = e.clientY - CANVAS.offsetTop; */

    //キャンバスのクリック位置
    let rect = e.currentTarget.getBoundingClientRect();
    clickX = e.clientX - rect.left;
    clickY = e.clientY - rect.top;

    console.log(clickX);
    console.log(clickY);

    //デバッグ用消す
    //CTX.fillStyle = "red";
    //CTX.fillRect(clickX, clickY, DRAW.answerWidth, DRAW.answerHeight);

    //１の問題をクリックしたとき
    if ((DRAW.answer1X <= clickX && clickX <= (DRAW.answer1X + DRAW.answerWidth)) && (DRAW.answer1Y <= clickY && (clickY <= (DRAW.answer1Y + DRAW.answerHeight)))) {
        //clickJudge = true;
        clickNumber = 1;
        console.log("1クリック");
        SYSTEM.judge();
    } else if ((DRAW.answer2X <= clickX && clickX <= (DRAW.answer2X + DRAW.answerWidth)) && (DRAW.answer2Y <= clickY && (clickY <= (DRAW.answer2Y + DRAW.answerHeight)))) {
        //clickJudge = true;
        clickNumber = 2;
        console.log("2クリック");
        SYSTEM.judge();
    } else if ((DRAW.answer3X <= clickX && clickX <= (DRAW.answer3X + DRAW.answerWidth)) && (DRAW.answer3Y <= clickY && (clickY <= (DRAW.answer3Y + DRAW.answerHeight)))) {
        //clickJudge = true;
        clickNumber = 3;
        console.log("3クリック");
        SYSTEM.judge();
    } else if ((DRAW.answer4X <= clickX && clickX <= (DRAW.answer4X + DRAW.answerWidth)) && (DRAW.answer4Y <= clickY && (clickY <= (DRAW.answer4Y + DRAW.answerHeight)))) {
        //clickJudge = true;
        clickNumber = 4;
        console.log("4クリック");
        SYSTEM.judge();
    }

}


/**
 * 描画関係
 *
 * いっぱいありすぎて説明略
 *
 * コンストラクター名【DRAW】
 */

let nowQuestionNumber = 0;
let totalQuestionNumber = 10;
let theQuestionNumber = [];

class draw {
    untilAnswerDraw() {
        //背景
        CTX.fillStyle = "yellow";
        CTX.fillRect(CANVAS.width * 0.15625, CANVAS.height * 0.02222, CANVAS.width * 0.65625, CANVAS.height * 0.06666);
    }
    //第〇問目
    theQuestionNumberDraw() {
        for (let i = 1; i < (totalQuestionNumber + 1); i++) {
            CTX.fillStyle = "red";
            MOBILE.timeFont();
            CTX.fillText("第" + (nowQuestionNumber + 1) + "問目", CANVAS.width * 0.43, CANVAS.height * 0.075,);
        }
    }

    //今までの解答の成否

    //問題文大枠
    questionFrameDraw() {
        CTX.strokeStyle = "orange";
        CTX.lineWidth = 5;
        CTX.strokeRect(CANVAS.width * 0.09375, CANVAS.height * 0.13333, CANVAS.width * 0.8125, CANVAS.height * 0.33333);
    }
    questionTextDraw() {
        CTX.fillStyle = "white";
        MOBILE.timeFont();
        CTX.fillText(questions[nowQuestionNumber][0], CANVAS.width * 0.16, CANVAS.height * 0.2);
    }

    //後で一番上にプロパティーとして上げる

    answerWidth = CANVAS.width * 0.375;
    answerHeight = CANVAS.height * 0.1;

    //解答枠
    answer1X = CANVAS.width * 0.09375;
    answer1Y = CANVAS.height * 0.6;
    answer2X = CANVAS.width * 0.5125;
    answer2Y = CANVAS.height * 0.6;
    answer3X = CANVAS.width * 0.09375;
    answer3Y = CANVAS.height * 0.7444;
    answer4X = CANVAS.width * 0.5125;
    answer4Y = CANVAS.height * 0.7444;;
    answerFrameDraw() {
        CTX.fillStyle = "white";
        CTX.fillRect(this.answer1X, this.answer1Y, this.answerWidth, this.answerHeight);
        CTX.fillRect(this.answer2X, this.answer2Y, this.answerWidth, this.answerHeight);
        CTX.fillRect(this.answer3X, this.answer3Y, this.answerWidth, this.answerHeight);
        CTX.fillRect(this.answer4X, this.answer4Y, this.answerWidth, this.answerHeight);
    }
    //時間表示
    drawTime() {
        CTX.fillStyle = "white";
        MOBILE.timeFont();
        CTX.fillText("Time", CANVAS.width * 0.45625, CANVAS.height * 0.52222);
        CTX.fillText(remainowTime, CANVAS.width * 0.45625, CANVAS.height * 0.5666);
    }

    //解答の枠と数字
    answerCircleSize = CANVAS.height * 0.0444;
    answerNumberDraw() {
        //1番目
        CTX.fillStyle = "red";
        CTX.beginPath();
        CTX.arc(CANVAS.width * 0.125, CANVAS.height * 0.65, this.answerCircleSize, 0, Math.PI * 2);
        CTX.fill();
        CTX.fillStyle = "white";
        MOBILE.answerCircleFont();
        CTX.fillText("1", CANVAS.width * 0.1175, CANVAS.height * 0.67222);


        //２番目
        CTX.beginPath();
        CTX.fillStyle = "blue";
        CTX.arc(CANVAS.width * 0.54375, CANVAS.height * 0.65, this.answerCircleSize, 0, Math.PI * 2);
        CTX.fill();
        CTX.fillStyle = "white";
        MOBILE.answerCircleFont();
        CTX.fillText("2", CANVAS.width * 0.535, CANVAS.height * 0.6722);

        //３番目
        CTX.beginPath();
        CTX.fillStyle = "gold";
        CTX.arc(CANVAS.width * 0.125, CANVAS.height * 0.7944, this.answerCircleSize, 0, Math.PI * 2);
        CTX.fill();
        CTX.fillStyle = "white";
        MOBILE.answerCircleFont();
        CTX.fillText("3", CANVAS.width * 0.1175, CANVAS.height * 0.8166);


        //４番目
        CTX.beginPath();
        CTX.fillStyle = "green";
        CTX.arc(CANVAS.width * 0.54375, CANVAS.height * 0.7944, this.answerCircleSize, 0, Math.PI * 2);
        CTX.fill();
        CTX.fillStyle = "white";
        MOBILE.answerCircleFont();
        CTX.fillText("4", CANVAS.width * 0.535, CANVAS.height * 0.8166)
    }
    answerTextDraw() {
        //1番目
        CTX.fillStyle = "black";
        MOBILE.timeFont();
        CTX.fillText(questions[nowQuestionNumber][1], CANVAS.width * 0.16, CANVAS.height * 0.67222);

        //２番目
        CTX.fillStyle = "black";
        MOBILE.timeFont();
        CTX.fillText(questions[nowQuestionNumber][2], CANVAS.width * 0.58, CANVAS.height * 0.67222);

        //３番目
        CTX.fillStyle = "black";
        MOBILE.timeFont();
        CTX.fillText(questions[nowQuestionNumber][3], CANVAS.width * 0.16, CANVAS.height * 0.8166);

        //４番目
        CTX.fillStyle = "black";
        MOBILE.timeFont();
        CTX.fillText(questions[nowQuestionNumber][4], CANVAS.width * 0.58, CANVAS.height * 0.8166);
    }

    //残り時間の〇表示
    timeCircleSize = CANVAS.width * 0.03125;
    timeCircleDraw() {
        CTX.fillStyle = "skyblue";
        if (s > 24) {
            CTX.fillStyle = "red";
        } else if (s > 19) {
            CTX.fillStyle = "yellow";
        } else if (s > 9) {
            CTX.fillStyle = "green";
        }
        CTX.beginPath();
        if (s < 1) {
            CTX.arc(CANVAS.width * 0.68125, CANVAS.height * 0.53333, this.timeCircleSize, 0, Math.PI * 2);
        }
        if (s < 2) {
            CTX.arc(CANVAS.width * 0.74375, CANVAS.height * 0.53333, this.timeCircleSize, 0, Math.PI * 2);
        }
        if (s < 3) {
            CTX.arc(CANVAS.width * 0.80625, CANVAS.height * 0.53333, this.timeCircleSize, 0, Math.PI * 2);
        } if (s < 4) {
            CTX.arc(CANVAS.width * 0.86875, CANVAS.height * 0.53333, this.timeCircleSize, 0, Math.PI * 2);
        }
        if (s < 5) {
            CTX.arc(CANVAS.width * 0.93125, CANVAS.height * 0.53333, this.timeCircleSize, 0, Math.PI * 2);
            CTX.fill();
        }
        if (s < 6) {
            CTX.beginPath();
            CTX.arc(CANVAS.width * 0.93125, CANVAS.height * 0.66111, this.timeCircleSize, 0, Math.PI * 2);
        } if (s < 7) {
            CTX.arc(CANVAS.width * 0.93125, CANVAS.height * 0.78888, this.timeCircleSize, 0, Math.PI * 2);
        } if (s < 8) {
            CTX.arc(CANVAS.width * 0.93125, CANVAS.height * 0.91666, this.timeCircleSize, 0, Math.PI * 2);
            CTX.fill();
        }
        if (s < 9) {
            CTX.beginPath();
            CTX.arc(CANVAS.width * 0.86875, CANVAS.height * 0.91666, this.timeCircleSize, 0, Math.PI * 2);
        } if (s < 10) {
            CTX.arc(CANVAS.width * 0.80625, CANVAS.height * 0.91666, this.timeCircleSize, 0, Math.PI * 2);
        } if (s < 11) {
            CTX.arc(CANVAS.width * 0.74375, CANVAS.height * 0.91666, this.timeCircleSize, 0, Math.PI * 2);
        } if (s < 12) {
            CTX.arc(CANVAS.width * 0.68125, CANVAS.height * 0.91666, this.timeCircleSize, 0, Math.PI * 2);
        } if (s < 13) {
            CTX.arc(CANVAS.width * 0.61875, CANVAS.height * 0.91666, this.timeCircleSize, 0, Math.PI * 2);
        } if (s < 14) {
            CTX.arc(CANVAS.width * 0.55625, CANVAS.height * 0.91666, this.timeCircleSize, 0, Math.PI * 2);
        } if (s < 15) {
            CTX.arc(CANVAS.width * 0.49375, CANVAS.height * 0.91666, this.timeCircleSize, 0, Math.PI * 2);
        } if (s < 16) {
            CTX.arc(CANVAS.width * 0.43125, CANVAS.height * 0.91666, this.timeCircleSize, 0, Math.PI * 2);
        } if (s < 17) {
            CTX.arc(CANVAS.width * 0.36875, CANVAS.height * 0.91666, this.timeCircleSize, 0, Math.PI * 2);
        } if (s < 18) {
            CTX.arc(CANVAS.width * 0.30625, CANVAS.height * 0.91666, this.timeCircleSize, 0, Math.PI * 2);
        } if (s < 19) {
            CTX.arc(CANVAS.width * 0.24375, CANVAS.height * 0.91666, this.timeCircleSize, 0, Math.PI * 2);
        } if (s < 20) {
            CTX.arc(CANVAS.width * 0.18125, CANVAS.height * 0.91666, this.timeCircleSize, 0, Math.PI * 2);
        } if (s < 21) {
            CTX.arc(CANVAS.width * 0.11875, CANVAS.height * 0.91666, this.timeCircleSize, 0, Math.PI * 2);
        } if (s < 22) {
            CTX.arc(CANVAS.width * 0.05625, CANVAS.height * 0.91666, this.timeCircleSize, 0, Math.PI * 2);
            CTX.fill();
        }
        if (s < 23) {
            CTX.beginPath();
            CTX.arc(CANVAS.width * 0.05625, CANVAS.height * 0.78888, this.timeCircleSize, 0, Math.PI * 2);
        } if (s < 24) {
            CTX.arc(CANVAS.width * 0.05625, CANVAS.height * 0.66111, this.timeCircleSize, 0, Math.PI * 2);
        } if (s < 25) {
            CTX.arc(CANVAS.width * 0.05625, CANVAS.height * 0.53333, this.timeCircleSize, 0, Math.PI * 2);
            CTX.fill();

        } if (s < 26) {
            CTX.beginPath();
            CTX.arc(CANVAS.width * 0.11875, CANVAS.height * 0.53333, this.timeCircleSize, 0, Math.PI * 2);
        } if (s < 27) {
            CTX.arc(CANVAS.width * 0.18125, CANVAS.height * 0.53333, this.timeCircleSize, 0, Math.PI * 2);
        } if (s < 28) {
            CTX.arc(CANVAS.width * 0.24375, CANVAS.height * 0.53333, this.timeCircleSize, 0, Math.PI * 2);
        } if (s < 29) {
            CTX.arc(CANVAS.width * 0.30625, CANVAS.height * 0.53333, this.timeCircleSize, 0, Math.PI * 2);
            CTX.fill();
        }
    }

    judgeDraw() {
        if (results[nowQuestionNumber] == true) {
            CTX.drawImage(CORRECT_IMG, CANVAS.width * 0.32, CANVAS.height * 0.12, CANVAS.width * 0.35, CANVAS.height * 0.53);
        } else {
            CTX.drawImage(MISTAKE_IMG, CANVAS.width * 0.32, CANVAS.height * 0.12, CANVAS.width * 0.35, CANVAS.height * 0.53);
        }
    }

}
const DRAW = new draw();

let results = [];
class system {


    //改行システム

    //正解判定
    //答えと解答の文字列を比較して正解。配列の中身取り出す関数必要
    //正解だったら，画面に〇の画像を表示する+nowQuestion...++する。
    //timeをクリアーする。次のタイマー作動させる。
    //正解不正解のtrue記述。pushで　成否の配列results[]

    //今までの正解不正解表示
    //終了判定
    timeLimitJudge() {
        if (s > 29) {
            results.push(false);
            console.log("時間切れ");
            clearInterval(gameRound);
            //表示andリンク？クリック後or５秒後次始める

            setTimeout(function () {
                nowQuestionNumber++;
                let sTime = new Date();
                startTime = sTime.getTime();
                gameRound = setInterval(gameCycle, FPS)
            }, 2000);
        }
    }
    judge() {
        if (protoQuestions[[setQuestionNumbers[nowQuestionNumber]]][1] == questions[nowQuestionNumber][clickNumber]) {
            results.push(true);
            console.log("正解")
            clearInterval(gameRound);
            DRAW.judgeDraw();

            setTimeout(function () {
                nowQuestionNumber++;
                let sTime = new Date();
                startTime = sTime.getTime();
                gameRound = setInterval(gameCycle, FPS)
            }, 2000);

        }
        else {
            results.push(false);
            console.log("不正解");
            clearInterval(gameRound);
            DRAW.judgeDraw();

            setTimeout(function () {
                nowQuestionNumber++;
                let sTime = new Date();
                startTime = sTime.getTime();
                gameRound = setInterval(gameCycle, FPS)
            }, 3000);
        }
        //デバッグ用
        console.log("クリックしたのは" + questions[nowQuestionNumber][clickNumber]);
    }
    //現在時刻
    nowTime() {
        let ntime = new Date();
        nowTime = ntime.getTime();//1000分の1秒
    }
    //残り時間計算
    remainowTimeCalc(startTime) {
        TimerTime = Math.floor((nowTime - startTime) / 10);//100分の1秒でタイマー
        s = Math.floor(TimerTime / 100);
    }
    //残り時間表示用
    timerWrite() {
        let mst = TimerTime % 100;//ミリ秒
        //ゼロパディング
        //slice(-2)で末尾の２個目まで表示001→01になる。Math.floor(TimerTime / 100)で１秒 【%60】60で割れたら0に戻る。
        let writeMs = ("00" + Math.floor(100 - mst)).slice(-2);
        //slice(-2)で末尾の２個目まで表示001→01になる。Math.floor(TimerTime / 100)で１秒 【%60】60で割れたら0に戻る。
        let writeS = ("00" + Math.floor(29 - s)).slice(-2);
        //表示整形
        remainowTime = writeS + ":" + writeMs;
    }
}
const SYSTEM = new system();
let setQuestions = [];                      //出題の問題
let questions = [[]];                       //クイズと解答の配列
let setQuestionNumbers = [];                //出題の番号順



/**
 * クイズの問題関係
 *
 * createQuestion()出題問題決定+問題シャッフル
 * createAnswer()で解答をシャッフルしている。
 * 取り出し方
 * 問題文【questions[setQuestionNumbers[i]][0]】
 * 解答【questions[setQuestionNumbers[i]][1～4]】
 * 答えは，【protoQuestions[setQuestionNumbers[i]][1]?】
 *
 * コンストラクター名【QUIZ】
 */
class quiz {
    //出題する問題を決定+シャッフルする（protoQuestions.lengthを5問か10問に変更する）
    createQuestion() {
        //配列の深いコピー【使わないから削除する】
        questions = JSON.parse(JSON.stringify(protoQuestions));
        //questions = protoQuestions;
        for (let i = 0; i < protoQuestions.length; i++) {
            while (true) {
                let tempQuestionNumber = Math.floor(Math.random() * protoQuestions.length);
                if (!setQuestionNumbers.includes(tempQuestionNumber)) {
                    setQuestionNumbers.push(tempQuestionNumber);

                    break;                              //while(true)で永久に繰り返すのでbreakさせる。
                }
            }
        }
        return questions;
    }
    //createQuestionで並び変えた順番で，答えの中身もシャッフルする
    createAnswer() {
        for (let i = 0; i < setQuestionNumbers.length; i++) {
            for (let j = 3; j > 0; j--) {
                let answerRand = Math.floor(Math.random() * j);
                let tmpArray = questions[setQuestionNumbers[i]][j + 1];
                questions[setQuestionNumbers[i]][j + 1] = questions[setQuestionNumbers[i]][answerRand + 1];
                questions[setQuestionNumbers[i]][answerRand + 1] = tmpArray;
            }
        }
        for (let k = 0; k < setQuestionNumbers.length; k++) {
            for (let l = 0; l < 5; l++) {
                questions[k][l] = questions[setQuestionNumbers[k]][l];
            }
        }
    }
}
const QUIZ = new quiz();


//起動時
window.addEventListener("load", function () {
    QUIZ.createQuestion();
    QUIZ.createAnswer();

    console.log(questions);
    //答えを表示するときは下記
    console.log(questions[1][0]);//2番目の問題
    //console.log(questions[0][1]);//1番目の1の解答

    DRAW.untilAnswerDraw();
    DRAW.theQuestionNumberDraw();
    DRAW.questionFrameDraw();
    DRAW.answerFrameDraw();
    DRAW.drawTime("30:00");
    DRAW.answerNumberDraw();
    DRAW.timeCircleDraw();
    DRAW.questionTextDraw();//デバッグ用消す
    DRAW.answerTextDraw();//デバッグ用消す
    MOBILE.isSmartPhone();
})

//ゲームサイクル
function gameCycle() {
    CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);
    DRAW.untilAnswerDraw();
    DRAW.theQuestionNumberDraw();
    DRAW.questionFrameDraw();
    DRAW.answerFrameDraw();
    DRAW.answerNumberDraw();
    SYSTEM.nowTime();
    SYSTEM.remainowTimeCalc(startTime);
    SYSTEM.timerWrite();
    DRAW.drawTime();
    DRAW.timeCircleDraw();
    DRAW.questionTextDraw();
    DRAW.answerTextDraw();
    //デバッグ用
    console.log("正解は" + protoQuestions[[setQuestionNumbers[nowQuestionNumber]]][1]);
    SYSTEM.timeLimitJudge();
}
//スタートボタン
const START_BUTTON = document.getElementById("startButton");
START_BUTTON.addEventListener("click", function () {

    //スタートボタンを押した時間を保管
    let sTime = new Date();
    startTime = sTime.getTime();
    gameRound = setInterval(gameCycle, FPS)

}, { once: true });
