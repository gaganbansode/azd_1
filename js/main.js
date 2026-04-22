$(document).ready(function () {
  let current = 0;
  let slides = $(".slide");

  function showSlide(index) {
    slides.hide().eq(index).fadeIn();

    $("#error-msg").hide();

    $("#prev").toggle(index !== 0);

    if (index === slides.length - 1) {
      $("#next").hide();
      $("#result").show();
    } else {
      $("#next").show();
      $("#result").hide();
    }
  }

  $("#show-q").click(function () {
    $(".mobile-img").hide();

    $("input[type=radio]").prop("checked", false);
    $("#answer").text("00");
    $("#type").text("---------");
    $("#reward").text("---------");
    $("#ruppee").text("₹0");
    $("#error-msg").hide();

    current = 0;

    $("#first-text").hide();
    $("#qustions").fadeIn();

    showSlide(current);
  });

  $("#next").click(function () {
    let selected = slides.eq(current).find("input:checked").length;

    if (selected === 0) {
      $("#error-msg").text("Please select an option").fadeIn();
      return;
    }

    current++;
    showSlide(current);
  });

  $("#prev").click(function () {
    current--;
    showSlide(current);
  });

  $("input[type=radio]").change(function () {
    $("#error-msg").fadeOut();
  });

  $("#result").click(function () {
    let selected = slides.eq(current).find("input:checked").length;

    if (selected === 0) {
      $("#error-msg").text("Please select an option").fadeIn();
      return;
    }

    let total = 0;

    $("input[type=radio]:checked").each(function () {
      total += parseInt($(this).val());
    });

    $("#answer").text(total);

    let resultText = "---------";
    let rewardText = "---------";
    let amountText = "₹0";

    if (total >= 30 && total <= 49) {
      resultText = "Trend Chaser";
      rewardText =
        " You love what’s new and next. You move fast with trends, now imagine choosing pieces that stay just as relevant, wear after wear. ";
      amountText = "₹500";
    } else if (total >= 50 && total <= 64) {
      resultText = "Sale Printer";
      rewardText =
        "You rarely miss a good deal. But not every deal earns a second wear. The next step is choosing pieces that stay in your wardrobe, not just your cart.";
      amountText = "₹500";
    } else if (total >= 65 && total <= 79) {
      resultText = "Balanced Styler";
      rewardText =
        "You strike a balance between style and practicality. You already choose well, now it’s about choosing pieces that go even further.";
      amountText = "₹500";
    } else if (total >= 80 && total <= 100) {
      resultText = "Fair & Square Man";
      rewardText =
        "You choose consciously, valuing longevity and how your clothes are made. Style, with purpose, exactly how it should be.";
      amountText = "₹500";
    }

    $("#type").text(resultText);
    $("#reward").text(rewardText);
    $("#ruppee").text(amountText);

    $("html, body").animate(
      {
        scrollTop: $(".score").offset().top,
      },
      600,
    );

    setTimeout(function () {
      $("input[type=radio]").prop("checked", false);
      current = 0;

      $("#qustions").hide();
      $("#first-text").fadeIn();

      $("#next").show();
      $("#result").hide();
      $("#prev").hide();
    }, 2000);
    $(".banner").hide();
    $(".result-page").show();
  });

  if ($(window).width() > 1366) {
    $("#result").click(function () {
      $("html, body").animate(
        {
          scrollTop: $(".score").offset().top + 50,
        },
        600,
      );
    });
  }

  $("#share-instagram").click(function () {
    var btn = $(this);
    btn.text("Generating...").prop("disabled", true);

    html2canvas(document.querySelector(".card-div"), {
      useCORS: false,
      allowTaint: false,
      scale: 3,
      logging: false,
    })
      .then(function (capturedCanvas) {
        // Build a 4:5 Instagram-ready canvas (1080x1350)
        var igW = 1080;
        var igH = 1350;
        var igCanvas = document.createElement("canvas");
        igCanvas.width = igW;
        igCanvas.height = igH;
        var ctx = igCanvas.getContext("2d");

        // Fill background matching the score section gradient
        var grad = ctx.createLinearGradient(0, 0, igW, igH);
        grad.addColorStop(0, "#D8D1BF");
        grad.addColorStop(1, "#D6CBB5");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, igW, igH);

        // Scale captured card-div to fit centered with padding
        var padding = 80;
        var maxW = igW - padding * 2;
        var maxH = igH - padding * 2;
        var scale = Math.min(
          maxW / capturedCanvas.width,
          maxH / capturedCanvas.height,
        );
        var drawW = capturedCanvas.width * scale;
        var drawH = capturedCanvas.height * scale;
        var drawX = (igW - drawW) / 2;
        var drawY = (igH - drawH) / 2;
        ctx.drawImage(capturedCanvas, drawX, drawY, drawW, drawH);

        igCanvas.toBlob(function (blob) {
          if (!blob) {
            alert("Could not generate image. Please try again.");
            btn.text("SHARE ON INSTAGRAM").prop("disabled", false);
            return;
          }

          var file = new File([blob], "wardrobe-score.png", {
            type: "image/png",
          });

          // Detect mobile: touch support + narrow screen
          var isMobile =
            ("ontouchstart" in window || navigator.maxTouchPoints > 0) &&
            window.innerWidth <= 768;

          if (
            isMobile &&
            navigator.canShare &&
            navigator.canShare({ files: [file] })
          ) {
            // Mobile: native share sheet — user can pick Instagram directly
            navigator
              .share({
                files: [file],
                title: "My Wardrobe Score",
                text: "Check out my Wardrobe Score!",
              })
              .then(function () {
                btn.text("SHARE ON INSTAGRAM").prop("disabled", false);
              })
              .catch(function (err) {
                if (err.name !== "AbortError") {
                  alert("Sharing failed: " + err.message);
                }
                btn.text("SHARE ON INSTAGRAM").prop("disabled", false);
              });
          } else {
            // Desktop: alert + auto-download the image
            alert(
              "Please open this website on mobile to share directly on Instagram.\n\nThe image will now be downloaded — you can then share it on Instagram manually.",
            );
            var url = URL.createObjectURL(blob);
            var a = document.createElement("a");
            a.href = url;
            a.download = "wardrobe-score.png";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(function () {
              URL.revokeObjectURL(url);
            }, 1000);
            btn.text("SHARE ON INSTAGRAM").prop("disabled", false);
          }
        }, "image/png");
      })
      .catch(function (err) {
        alert(
          "Image generation failed: " + (err ? err.message : "Unknown error"),
        );
        btn.text("SHARE ON INSTAGRAM").prop("disabled", false);
      });
  });
});
