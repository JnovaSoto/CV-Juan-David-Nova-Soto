window.onload =  function() {

    console.log("Página cargada correctamente");

    document.querySelectorAll("a.func").forEach(link => {
        link.addEventListener("click", function (e) {
        e.preventDefault();

        const target = document.querySelector(this.getAttribute("href"));

        target.scrollIntoView({ behavior: "smooth", block: "start" });

        target.classList.add("highlight");

        // Quitar el resaltado después de 2 segundos
        setTimeout(() => {
        target.classList.remove("highlight");
        }, 800);

        });
    });

    

}