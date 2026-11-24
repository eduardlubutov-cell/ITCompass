(() => {
const questions=window.IT_COMPASS_QUESTIONS, maps=window.IT_COMPASS_SCORE_MAP, profiles=window.IT_COMPASS_PROFILES;
const codes=["FE","BE","DA","DS","QA","UX","CY","DO","BA","MD"];
const labels=codes.map(c=>profiles[c][0]);
let current=0, answers=Array(questions.length).fill(null);
const qPanel=document.getElementById("quiz-panel"),rPanel=document.getElementById("result-panel");
const qCount=document.getElementById("question-count"),progressPercent=document.getElementById("progress-percent"),progressFill=document.getElementById("progress-fill"),progressTrack=document.getElementById("progress-track"),qText=document.getElementById("question-text"),answerBox=document.getElementById("answers"),prev=document.getElementById("prev-button"),next=document.getElementById("next-button");
function render(){
const q=questions[current];qCount.textContent=`Вопрос ${current+1} из ${questions.length}`;progressPercent.textContent=`${Math.round((current+1)/questions.length*100)}%`;progressFill.style.width=`${(current+1)/questions.length*100}%`;progressTrack.setAttribute("aria-valuenow",current+1);qText.textContent=q[0];answerBox.innerHTML="";
q[1].forEach((label,i)=>{const b=document.createElement("button");b.type="button";b.className="answer"+(answers[current]===i?" selected":"");b.setAttribute("aria-pressed",answers[current]===i?"true":"false");b.innerHTML=`<span class="answer-letter">${String.fromCharCode(65+i)}</span><span class="answer-text"></span>`;b.querySelector(".answer-text").textContent=label;b.addEventListener("click",()=>{answers[current]=i;render();});answerBox.appendChild(b);});
prev.disabled=current===0;next.disabled=answers[current]===null;next.textContent=current===questions.length-1?"Узнать результат →":"Далее →";
}
prev.addEventListener("click",()=>{if(current>0){current--;render();}});
next.addEventListener("click",()=>{if(answers[current]===null)return;if(current<questions.length-1){current++;render();}else showResult();});
function showResult(){
const score=Object.fromEntries(codes.map(c=>[c,0]));
answers.forEach((choice,qi)=>{const chosen=maps[qi][choice];chosen.forEach(c=>score[c]+=1);});
const sum=Object.values(score).reduce((a,b)=>a+b,0);
const sorted=codes.map(c=>({code:c,name:profiles[c][0],score:score[c],pct:sum?score[c]/sum*100:0})).sort((a,b)=>b.score-a.score||codes.indexOf(a.code)-codes.indexOf(b.code));
const floors=sorted.map(item=>Math.floor(item.pct));let remainder=100-floors.reduce((a,b)=>a+b,0);
sorted.map((item,i)=>({i,frac:item.pct-floors[i]})).sort((a,b)=>b.frac-a.frac||a.i-b.i).slice(0,remainder).forEach(x=>floors[x.i]++);
sorted.forEach((item,i)=>item.displayPct=floors[i]);
const best=profiles[sorted[0].code];
qPanel.hidden=true;rPanel.hidden=false;
rPanel.innerHTML="";
const header=document.createElement("div");header.className="result-hero";
const iconMap={FE:"✦",BE:"⌘",DA:"◉",DS:"✧",QA:"✓",UX:"◇",CY:"⛨",DO:"↗",BA:"⌁",MD:"▣"};
header.innerHTML=`<div class="result-hero-orbit"><span class="result-hero-icon">${iconMap[sorted[0].code]||"✦"}</span><span class="orbit-dot dot-one"></span><span class="orbit-dot dot-two"></span></div><div class="result-hero-copy"><div class="result-kicker">ТВОЙ IT-ОРИЕНТИР</div><h1 class="result-title"></h1><p class="result-subtitle">Кажется, здесь твои интересы встречаются с возможностями IT. Изучи направление и посмотри, какие ещё роли тебе близки.</p><div class="result-hero-chips"><span>✦ Твой главный мэтч</span><span>10 направлений в карте</span></div></div>`;header.querySelector("h1").textContent=best[0];rPanel.appendChild(header);
const prof=document.createElement("div");prof.className="result-profile result-feature";
const tagline=document.createElement("div");tagline.className="profile-tag";tagline.textContent="ТВОЁ ВЕДУЩЕЕ НАПРАВЛЕНИЕ";prof.appendChild(tagline);
const lead=document.createElement("p");lead.className="profile-lead";lead.textContent=best[1];prof.appendChild(lead);
const desc=document.createElement("p");desc.className="profile-description";desc.textContent=best[2];prof.appendChild(desc);
const grid=document.createElement("div");grid.className="profile-grid";
const details=[["Чем занимается",best[3]],["Тебе может подойти, если",best[4]],["Что изучать",best[5]],["Средний ориентир зарплаты в России",best[6]],["Где учиться в Перми",best[7]]];
details.forEach(([title,text],i)=>{const kinds=["work","fit","learn","salary","study"];const d=document.createElement("details");d.className="profile-detail profile-detail-fold detail-card detail-card-"+kinds[i];d.dataset.kind=kinds[i];d.open=true;const h=document.createElement("summary");h.innerHTML=`<span class="detail-icon" aria-hidden="true"></span><span class="detail-heading"><span class="detail-eyebrow"></span><span class="detail-title"></span></span><span class="detail-chevron" aria-hidden="true">⌃</span>`;h.querySelector(".detail-title").textContent=title;h.querySelector(".detail-eyebrow").textContent=["О РАБОТЕ","ТВОЙ ПРОФИЛЬ","ПЕРВЫЕ ШАГИ","ВОЗНАГРАЖДЕНИЕ","ОБРАЗОВАНИЕ"][i];const p=document.createElement("p");p.textContent=text;if(i===3)p.className="salary";const body=document.createElement("div");body.className="detail-body";body.appendChild(p);d.append(h,body);grid.appendChild(d);});
prof.appendChild(grid);rPanel.appendChild(prof);
const section=document.createElement("section");section.className="percent-section";const sectionIntro=document.createElement("div");sectionIntro.className="result-section-intro";sectionIntro.innerHTML=`<span class="result-section-kicker">ТВОЯ КАРТА ВОЗМОЖНОСТЕЙ</span><h2>Какие IT-направления тебе близки</h2><p>Это не рейтинг способностей, а подсказка, какие роли стоит исследовать. Выбирай направление — ниже появится больше информации о нём.</p>`;section.append(sectionIntro);
const list=document.createElement("div");list.className="percent-list";
const insight=document.createElement("div");insight.className="percent-insight";insight.innerHTML=`<div class="insight-icon">✧</div><div class="insight-body"><span class="insight-kicker">О ПРОФЕССИИ</span><h3 class="insight-title"></h3><p class="insight-copy"></p><div class="insight-more"><p><strong>Чем занимается:</strong> <span class="insight-work"></span></p><p><strong>Что изучать:</strong> <span class="insight-study"></span></p><p><strong>Подойдёт, если:</strong> <span class="insight-fit"></span></p></div></div>`;
function setInsight(item){const profile=profiles[item.code];insight.querySelector(".insight-title").textContent=item.name;insight.querySelector(".insight-copy").textContent=profile[1]+" "+profile[2];insight.querySelector(".insight-work").textContent=profile[3];insight.querySelector(".insight-study").textContent=profile[5];insight.querySelector(".insight-fit").textContent=profile[4];}
sorted.forEach((item,index)=>{const row=document.createElement("button");row.type="button";row.className="percent-row percent-row-button"+(index===0?" is-active":"");row.setAttribute("aria-pressed",index===0?"true":"false");const name=document.createElement("div");name.className="percent-name";name.textContent=item.name;const track=document.createElement("div");track.className="percent-track";track.setAttribute("aria-hidden","true");const bar=document.createElement("div");bar.className="percent-bar";bar.style.width=item.pct+"%";track.appendChild(bar);const value=document.createElement("div");value.className="percent-value";value.textContent="";value.setAttribute("aria-hidden","true");row.append(name,track,value);row.addEventListener("click",()=>{list.querySelectorAll(".percent-row").forEach(el=>{el.classList.remove("is-active");el.setAttribute("aria-pressed","false")});row.classList.add("is-active");row.setAttribute("aria-pressed","true");setInsight(item);});list.appendChild(row);});setInsight(sorted[0]);section.appendChild(insight);
section.appendChild(list);rPanel.appendChild(section);
const disclaimer=document.createElement("p");disclaimer.className="salary-disclaimer";disclaimer.textContent="Зарплата указана как ориентир для специалиста с опытом, а не обещание дохода начинающему. Реальные значения зависят от региона, навыков и работодателя. Перечень учебных программ и условия поступления могут изменяться — проверяй информацию на официальных сайтах. Профориентационный результат не является диагнозом или гарантией профессионального успеха.";rPanel.appendChild(disclaimer);
const actions=document.createElement("div");actions.className="result-actions";const home=document.createElement("a");home.className="button button-secondary";home.href="index.html";home.textContent="← На главную";const restart=document.createElement("button");restart.className="button button-primary";restart.type="button";restart.textContent="Пройти тест заново ↻";restart.addEventListener("click",()=>{answers=Array(questions.length).fill(null);current=0;rPanel.hidden=true;qPanel.hidden=false;render();window.scrollTo({top:0,behavior:"smooth"});});actions.append(home,restart);rPanel.appendChild(actions);rPanel.scrollIntoView({behavior:"smooth",block:"start"});
}
render();
})();