
document.addEventListener("DOMContentLoaded", () => {

    const card = document.querySelector(".schedule-card");

    if (!card) return;

    const meetingTime = card.querySelector(".meeting-time");
    const participants = card.querySelectorAll(".participant");
    const footer = card.querySelector(".card-footer");
    const aiIcon = card.querySelector(".ai-icon");
    const smallLabel = card.querySelector(".small-label");

    // Start hidden
    meetingTime.style.opacity = "0";
    meetingTime.style.transform = "translateY(10px)";

    participants.forEach((participant) => {
        participant.style.opacity = "0";
        participant.style.transform = "translateX(-15px)";
    });

    footer.style.opacity = "0";

    // AI icon animation
    aiIcon.style.transition = "transform 0.8s ease";

    // Step 1: AI starts working
    setTimeout(() => {

        smallLabel.textContent = "AI IS FINDING...";

        aiIcon.style.transform = "rotate(180deg) scale(1.15)";

    }, 800);


    // Step 2: Show meeting time
    setTimeout(() => {

        smallLabel.textContent = "AI SUGGESTION";

        meetingTime.style.transition =
            "opacity 0.6s ease, transform 0.6s ease";

        meetingTime.style.opacity = "1";
        meetingTime.style.transform = "translateY(0)";

        aiIcon.style.transform = "rotate(360deg) scale(1)";

    }, 1800);


    // Step 3: Show participants one by one
    participants.forEach((participant, index) => {

        setTimeout(() => {

            participant.style.transition =
                "opacity 0.5s ease, transform 0.5s ease";

            participant.style.opacity = "1";
            participant.style.transform = "translateX(0)";

        }, 2400 + index * 500);

    });


    // Step 4: Show final result
    setTimeout(() => {

        footer.style.transition = "opacity 0.6s ease";
        footer.style.opacity = "1";

    }, 4100);


    // Repeat animation
    setInterval(() => {

        // Hide everything
        meetingTime.style.opacity = "0";
        meetingTime.style.transform = "translateY(10px)";

        participants.forEach((participant) => {
            participant.style.opacity = "0";
            participant.style.transform = "translateX(-15px)";
        });

        footer.style.opacity = "0";

        smallLabel.textContent = "AI IS FINDING...";

        aiIcon.style.transform = "rotate(180deg) scale(1.15)";


        // Show meeting time again
        setTimeout(() => {

            smallLabel.textContent = "AI SUGGESTION";

            meetingTime.style.opacity = "1";
            meetingTime.style.transform = "translateY(0)";

            aiIcon.style.transform = "rotate(360deg) scale(1)";

        }, 1000);


        // Show participants again
        participants.forEach((participant, index) => {

            setTimeout(() => {

                participant.style.opacity = "1";
                participant.style.transform = "translateX(0)";

            }, 1600 + index * 400);

        });


        // Show footer
        setTimeout(() => {

            footer.style.opacity = "1";

        }, 3000);

    }, 8000);

});

