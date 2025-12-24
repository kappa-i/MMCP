console.clear();

gsap.registerPlugin(Flip);

const modal = document.querySelector(".modal");
const modalContent = modal.querySelector(".content");
const modalOverlay = modal.querySelector(".overlay");
const boxes = gsap.utils.toArray(".boxes-container .box");
const boxesContent = gsap.utils.toArray(".box-content");
let boxIndex = undefined;
let modalButton = null;

boxesContent.forEach((box, i) => {
  box.addEventListener("click", () => {
    if (boxIndex !== undefined) {
      const state = Flip.getState(box);
      boxes[boxIndex].appendChild(box);
      boxIndex = undefined;

      // Retirer le bouton lors de la fermeture
      if (modalButton) {
        modalButton.remove();
        modalButton = null;
      }

      gsap.to([modal, modalOverlay], {
        autoAlpha: 0,
        ease: "power1.inOut",
        duration: 0.35
      });
      Flip.from(state, {
        duration: 0.7,
        ease: "power1.inOut",
        absolute: true,
        onComplete: () => gsap.set(box, { zIndex: "auto" })
      });
      gsap.set(box, { zIndex: 1002 });
    } else {
      const state = Flip.getState(box);
      modalContent.appendChild(box);
      boxIndex = i;

      // Créer et ajouter le bouton "En voir plus"
      const eventPage = box.dataset.eventPage;
      if (eventPage && !modalButton) {
        modalButton = document.createElement('a');
        modalButton.href = eventPage;
        modalButton.className = 'modal-event-btn';
        modalButton.textContent = 'En voir plus';
        modalContent.appendChild(modalButton);

        // Empêcher le bouton de fermer la modal
        modalButton.addEventListener('click', (e) => {
          e.stopPropagation();
        });
      }

      gsap.set(modal, { autoAlpha: 1 });
      Flip.from(state, {
        duration: 0.7,
        ease: "power1.inOut"
      });
      gsap.to(modalOverlay, { autoAlpha: 0.65, duration: 0.35 });
    }
  });
});
