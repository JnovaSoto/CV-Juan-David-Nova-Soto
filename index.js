window.addEventListener("load", () => {
    console.log("Página completamente cargada");

    const splash = document.getElementById("splash");
    const mainContent = document.getElementById("main-content");

    // Asegurarse de que el main content empieza oculto
    mainContent.style.display = "none";

    // Mostrar splash 3 segundos
    setTimeout(() => {
        splash.style.opacity = 0; // fade out
        // Esperar 1s para que termine la transición
        setTimeout(() => {
        splash.style.display = "none"; // ocultar completamente
        mainContent.style.display = "block"; // mostrar contenido
        }, 800);
    }, 1000);

    // --- Smooth scroll y highlight ---
    document.querySelectorAll("a.func").forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();

            const target = document.querySelector(this.getAttribute("href"));

            target.scrollIntoView({ behavior: "smooth", block: "start" });

            target.classList.add("highlight");

            // Quitar el resaltado después de 0.8 segundos
            setTimeout(() => {
                target.classList.remove("highlight");
            }, 800);
        });
    });
    const textElement = document.getElementById('animated-text');
    const text = textElement.textContent;
    let index = 0;
    let deleting = false;

    textElement.textContent = '';

    function type() {
      if (!deleting) {
        textElement.textContent += text[index];
        index++;
        if (index === text.length) {
          deleting = true;
          setTimeout(type, 1000); 
          return;
        }
      } else {
        textElement.textContent = textElement.textContent.slice(0, -1);
        if (textElement.textContent.length === 0) {
          deleting = false;
          index = 0;
        }
      }
      setTimeout(type, deleting ? 50 : 150); 
    }

    type();
});
