//we set visibility:hidden in the CSS to avoid an initial flash - make them visible now, but the from() tweens are going to essentially hide them anyway because their stroke position/length will be 0.
gsap.set(".gray-line, .green-line, .green-line-thin, .plugin-stroke", { visibility: "visible" });

var tl = gsap.timeline({ onUpdate: updateSlider }),
    $slider = $("#slider");

//animate the plugin text first, drawing to 100%
tl.from(".plugin-stroke", { duration: 4, drawSVG: 0, ease: "power1.inOut" })
    //now animate the logo strokes (note we use "102% as FireFox 34 miscalculates the length of a few strokes)
    .fromTo(".gray-line, .green-line, .green-line-thin", { drawSVG: 0 }, { duration: 2, drawSVG: "102%" }, "-=1")
    //fade in the real logo and the rest of the text
    .to("#Plugin, #ByGreenSock, #logo", 1, { autoAlpha: 1, ease: "none" })
    //hide the logo strokes that are now obscured by the real logo (just to improve rendering performance)
    .set("#lines", { visibility: "hidden" });

//--- SLIDER ---
$slider.slider({
    range: false,
    min: 0,
    max: 100,
    step: 0.02,
    value: 0,
    slide: function (event, ui) {
        tl.progress(ui.value / 100).pause();
    }
});
function updateSlider() {
    $slider.slider("value", tl.progress() * 100);
}
var $replayIcon = $("#replayIcon"),
    $replay = $("#replay").mouseenter(function () {
        gsap.to($replayIcon, { duration: 0.4, rotation: "+=360" });
        gsap.to($replay, { duration: 0.4, opacity: 1 });
    }).mouseleave(function () {
        gsap.to($replay, { duration: 0.4, opacity: 0.65 });
    }).click(function () {
        tl.restart();
    });

gsap.render(); //lazy rendering (a performance optimization) can cause the initial render to be delayed by 1 tick, causing the logo to be visible for a brief moment, so we force a render here immediately. Another option would be to set lazy:false on the tween(s), but this is easier/faster.